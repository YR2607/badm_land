#!/usr/bin/env python3
import json
import os
import re
import sys
import time
from datetime import datetime, timezone
from urllib.parse import urlencode, urlparse, unquote

import requests
from bs4 import BeautifulSoup
import concurrent.futures
from dateutil import parser as date_parser

try:
    import cloudscraper  # optional
except Exception:  # pragma: no cover
    cloudscraper = None

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_PATH = os.path.join(ROOT, 'public', 'data', 'bwf_news.json')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (compatible; AltiusSiteBot/1.0; +https://badm-land-main.vercel.app)'
}

SCRAPERAPI_KEY = os.getenv('SCRAPERAPI_KEY')
SCRAPINGBEE_KEY = os.getenv('SCRAPINGBEE_KEY')


def is_official_host(host: str) -> bool:
    return host == 'bwfbadminton.com' or host.endswith('.bwfbadminton.com')


_MONTH_RE = r"(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)"

def remove_date_from_title(title: str) -> str:
    """Strip trailing inline dates like '05 Sep', '7 September 2025' from listing titles."""
    if not title:
        return title
    s = title.strip()
    patterns = [
        rf"\b\d{{1,2}}\s+{_MONTH_RE}\s+\d{{4}}$",
        rf"\b\d{{1,2}}\s+{_MONTH_RE}$",
    ]
    for pat in patterns:
        s = re.sub(pat, "", s, flags=re.IGNORECASE).rstrip(" -|,–—").strip()
    return s


def fetch_via_proxy(url: str) -> str:
    if SCRAPERAPI_KEY:
        proxy = f"https://api.scraperapi.com?api_key={SCRAPERAPI_KEY}&url={requests.utils.quote(url, safe='')}&country=de&render=true"
        r = requests.get(proxy, headers=HEADERS, timeout=60)
        r.raise_for_status()
        return r.text
    if SCRAPINGBEE_KEY:
        proxy = f"https://app.scrapingbee.com/api/v1/?api_key={SCRAPINGBEE_KEY}&url={requests.utils.quote(url, safe='')}&render_js=true"
        r = requests.get(proxy, headers=HEADERS, timeout=60)
        r.raise_for_status()
        return r.text
    raise RuntimeError('no proxy key')


def fetch(url: str, use_cloud: bool = True) -> str:
    host = (urlparse(url).hostname or '').lower()
    # Championships site: fetch directly (no proxy/JS render needed)
    if host.endswith('bwfworldchampionships.bwfbadminton.com'):
        r = requests.get(url, headers=HEADERS, timeout=40)
        r.raise_for_status()
        return r.text
    if is_official_host(host):
        if SCRAPERAPI_KEY or SCRAPINGBEE_KEY:
            return fetch_via_proxy(url)
        if use_cloud and cloudscraper is not None:
            scraper = cloudscraper.create_scraper()
            r = scraper.get(url, headers=HEADERS, timeout=60)
            r.raise_for_status()
            return r.text
    r = requests.get(url, headers=HEADERS, timeout=60)
    r.raise_for_status()
    return r.text

# Helper to normalize potentially relative URLs to absolute based on base_url
# Works with protocol-relative and path-relative inputs
# Example: to_abs_url('https://bwfbadminton.com/news/', '/img.jpg') -> 'https://bwfbadminton.com/img.jpg'
def to_abs_url(base_url: str, possibly_relative: str) -> str:
    s = (possibly_relative or '').strip()
    if not s:
        return s
    if s.startswith('http://') or s.startswith('https://'):
        return s
    if s.startswith('//'):
        return 'https:' + s
    bu = urlparse(base_url)
    origin = f'{bu.scheme}://{bu.hostname}'
    if not s.startswith('/'):
        s = '/' + s
    return origin + s


def discover_from_official_lists(limit: int = 40) -> list[str]:
    base = 'https://bwfbadminton.com'
    links: list[str] = []
    try:
        html = fetch(f'{base}/news/')
    except Exception:
        return []
    soup = BeautifulSoup(html, 'lxml')
    for a in soup.select('a[href]'):
        href = a.get('href') or ''
        abs_url = to_abs_url(base, href)
        try:
            u = urlparse(abs_url)
            if is_official_host((u.hostname or '').lower()) and re.search(r'/news/[^/].+', u.path):
                links.append(u.geturl())
        except Exception:
            continue
        if len(links) >= limit:
            break
    # unique preserve order
    seen = set()
    uniq = []
    for h in links:
        if h in seen:
            continue
        seen.add(h)
        uniq.append(h)
    return uniq[:limit]


def discover_links_via_google(limit: int = 30) -> list[str]:
    params = {
        'q': 'site:bwfbadminton.com when:365d',
        'hl': 'en-US',
        'gl': 'US',
        'ceid': 'US:en',
    }
    url = f'https://news.google.com/rss/search?{urlencode(params)}'
    try:
        xml = fetch(url, use_cloud=False)
    except Exception:
        return []
    links: list[str] = []
    for m in re.finditer(r'<item>([\s\S]*?)</item>', xml, re.I):
        item = m.group(1)
        link = ''
        link_m = re.search(r'<link>([\s\S]*?)</link>', item, re.I)
        if link_m:
            link = link_m.group(1).strip()
        desc_m = re.search(r'<description>([\s\S]*?)</description>', item, re.I)
        if 'news.google.com' in (link or '') and desc_m:
            m2 = re.search(r'href=\"(https?://[^\"]+?)\"', desc_m.group(1), re.I)
            if m2:
                link = unquote(m2.group(1))
        try:
            u = urlparse(link)
            if u.scheme and is_official_host((u.hostname or '').lower()):
                links.append(link)
        except Exception:
            pass
        if len(links) >= limit:
            break
    seen = set()
    uniq = []
    for h in links:
        if h in seen:
            continue
        seen.add(h)
        uniq.append(h)
    return uniq


def resolve_google(link: str) -> str:
    # Follow redirect to publisher URL
    try:
        r = requests.get(link, headers=HEADERS, allow_redirects=True, timeout=40)
        final_url = r.url
        return final_url
    except Exception:
        # Try extract from description style encoded (fallback)
        return link


def parse_listing(base: str, limit: int = 40) -> list[dict]:
    try:
        html = fetch(f'{base}/news/')
    except Exception:
        return []
    soup = BeautifulSoup(html, 'lxml')
    items: list[dict] = []
    seen = set()
    # Grab anchors first, then enrich from nearby context
    for a in soup.select('a[href*="/news/"]'):
        href = a.get('href') or ''
        href_abs = to_abs_url(base, href)
        try:
            u = urlparse(href_abs)
            if not (u.scheme and is_official_host((u.hostname or '').lower()) and re.search(r'/news/[^/].+', u.path)):
                continue
        except Exception:
            continue
        if href_abs in seen:
            continue
        seen.add(href_abs)
        # determine a card context: up to two parent levels
        card = a
        if card.parent:
            card = card.parent
        if card and card.parent:
            card = card.parent
        title = (a.get('title') or a.get_text(' ', strip=True) or '').strip()
        img = None
        img_el = None
        # look for image nearby
        img_el = card.select_one('img[src]') if hasattr(card, 'select_one') else None
        if not img_el and hasattr(card, 'select_one'):
            img_el = card.select_one('img[data-src]')
        if img_el:
            img = img_el.get('src') or img_el.get('data-src')
        if not img:
            meta = card.select_one('meta[property="og:image"][content]') if hasattr(card, 'select_one') else None
            if meta:
                img = meta.get('content')
        img_abs = to_abs_url(href_abs, img or '') if img else ''
        # preview and date heuristics
        preview = ''
        p = card.select_one('p') if hasattr(card, 'select_one') else None
        if p:
            preview = p.get_text(' ', strip=True)
        date = ''
        t = card.select_one('time[datetime]') if hasattr(card, 'select_one') else None
        if t:
            date = (t.get('datetime') or t.get_text(' ', strip=True) or '').strip()
        if title:
            items.append({
                'title': title,
                'href': href_abs,
                'img': img_abs,
                'preview': (preview or '')[:220],
                'date': date,
            })
        if len(items) >= limit:
            break
    return items


def parse_listing_latest(base: str, limit: int = 40) -> list[dict]:
    """Parse only the 'LATEST NEWS' section on the BWF news page."""
    try:
        html = fetch(f'{base}/news/')
    except Exception:
        return []
    soup = BeautifulSoup(html, 'lxml')

    def is_latest_news_heading(text: str) -> bool:
        t = (text or '').strip().lower()
        return ('latest' in t) and ('news' in t)

    heading = None
    for tag in ['h1', 'h2', 'h3', 'h4', 'h5']:
        for h in soup.find_all(tag):
            if is_latest_news_heading(h.get_text(' ', strip=True)):
                heading = h
                break
        if heading:
            break

    container = None
    # Try by class/id heuristics first
    candidates = soup.select('[id*="latest" i], [class*="latest" i]')
    for c in candidates:
        anchors = c.find_all('a', href=True)
        news_links = [a for a in anchors if '/news/' in (a.get('href') or '')]
        if len(news_links) >= 6:
            container = c
            break

    # If still not found, try ancestors around heading
    if container is None and heading is not None:
        node = heading
        for _ in range(6):
            parent = node.parent if node else None
            if not parent:
                break
            anchors = parent.find_all('a', href=True)
            news_links = [a for a in anchors if '/news/' in (a.get('href') or '')]
            if len(news_links) >= 6:
                container = parent
                break
            node = parent

    items: list[dict] = []
    seen = set()

    def push_anchor(a):
        nonlocal items
        href = a.get('href') or ''
        href_abs = to_abs_url(base, href)
        try:
            u = urlparse(href_abs)
            if not (u.scheme and is_official_host((u.hostname or '').lower()) and re.search(r'/news/[^/].+', u.path)):
                return
        except Exception:
            return
        if href_abs in seen:
            return
        # Build card context
        card = a
        if card.parent:
            card = card.parent
        if card and card.parent:
            card = card.parent
        title = (a.get('title') or a.get_text(' ', strip=True) or '').strip()
        img = None
        img_el = card.select_one('img[src]') if hasattr(card, 'select_one') else None
        if not img_el and hasattr(card, 'select_one'):
            img_el = card.select_one('img[data-src]')
        if img_el:
            img = img_el.get('src') or img_el.get('data-src')
        if not img and hasattr(card, 'select_one'):
            meta = card.select_one('meta[property="og:image"][content]')
            if meta:
                img = meta.get('content')
        img_abs = to_abs_url(href_abs, img or '') if img else ''
        preview = ''
        p = card.select_one('p') if hasattr(card, 'select_one') else None
        if p:
            preview = p.get_text(' ', strip=True)
        date = ''
        t = card.select_one('time[datetime]') if hasattr(card, 'select_one') else None
        if t:
            date = (t.get('datetime') or t.get_text(' ', strip=True) or '').strip()
        if title:
            items.append({
                'title': title,
                'href': href_abs,
                'img': img_abs,
                'preview': (preview or '')[:220],
                'date': date,
            })

    if container is not None:
        for a in container.select('a[href*="/news/"]'):
            push_anchor(a)
            if len(items) >= limit:
                break
    else:
        # Traverse from heading forward and collect anchors until next heading or limit
        start = heading if heading is not None else soup.body or soup
        count = 0
        for el in start.next_elements:
            if hasattr(el, 'name') and el.name in ('h1', 'h2', 'h3', 'h4', 'h5') and el is not start:
                # stop at the next section heading
                break
            if getattr(el, 'name', '') == 'a' and el.has_attr('href') and '/news/' in (el.get('href') or ''):
                push_anchor(el)
                count += 1
                if len(items) >= limit:
                    break

    # Deduplicate and cap
    uniq_items = []
    seen_hrefs = set()
    for it in items:
        href = it.get('href')
        if not href or href in seen_hrefs:
            continue
        seen_hrefs.add(href)
        uniq_items.append(it)
    return uniq_items[:limit]


def normalize_date_iso(s: str) -> str:
    try:
        dt = date_parser.parse(s)
        return dt.replace(tzinfo=timezone.utc).isoformat()
    except Exception:
        return s.strip() if s else ''


def parse_article(url: str) -> dict | None:
    try:
        html = fetch(url)
    except Exception as e1:
        # Retry via proxy on CI where direct requests may be blocked
        try:
            html = fetch_via_proxy(url)
            print(f"Fetched article via proxy: {url}")
        except Exception as e2:
            # Give up if both attempts fail
            print(f"Failed to fetch article {url}: {e1} / {e2}")
            return None
    soup = BeautifulSoup(html, 'lxml')
    # Title
    title = (soup.select_one('meta[property="og:title"][content]') or {}).get('content') or (soup.title.string if soup.title else '')
    title = (title or '').strip()
    if not title:
        # try h1 fallback
        h1 = soup.select_one('h1')
        if h1:
            title = h1.get_text(' ', strip=True)
    if not title:
        return None
    # Image: prefer content images inside article (to avoid generic header), then fallback to og:image
    def normalize_img(u: str) -> str:
        if not u:
            return u
        u = to_abs_url(url, u)
        # Remove size parameters from URL but keep the file extension
        u = re.sub(r'(-\d+x\d+)(\.(?:jpg|jpeg|png|webp))$', r'\2', u, flags=re.IGNORECASE)
        # Remove any query parameters
        return u.split('?')[0]

    # Keywords that indicate generic/non-article images
    bad_keywords = ('logo', 'favicon', 'default', 'placeholder', 'sprite', 'icon', 'avatar', 'thumbnail')
    generic_image_terms = ('wc25', 'fi-', 'pablo-abian', 'momota', 'header', 'banner', 'featured')
    
    # Ordered list of selectors to try for finding article images
    content_selectors = [
        'article .wp-block-image img[src]',
        'article figure img[src]',
        'article .entry-content img[src]',
        '.news-single .entry-content img[src]',
        '.single-post__content img[src]',
        '.post-content img[src]',
        '.article-content img[src]',
        'article img[src]',
        '.featured-image img[src]',
        '.post-thumbnail img[src]',
        'img[src]'  # Last resort
    ]
    
    # Collect all candidate images with their priority
    candidates = []
    
    # Check for Open Graph image first
    og_img = (soup.select_one('meta[property="og:image"][content]') or {}).get('content') or \
             (soup.select_one('meta[property="og:image:secure_url"][content]') or {}).get('content')
    if og_img:
        og_img = normalize_img(og_img)
        if og_img.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            # Give OG image high priority but we'll still check others
            candidates.append((og_img, 90))  # High priority
    
    # Check for Twitter card image
    twitter_img = (soup.select_one('meta[name="twitter:image"][content]') or {}).get('content')
    if twitter_img:
        twitter_img = normalize_img(twitter_img)
        if twitter_img.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')) and twitter_img not in [c[0] for c in candidates]:
            candidates.append((twitter_img, 85))  # High priority but lower than OG
    
    # Scan the article for images
    for sel in content_selectors:
        for i, node in enumerate(soup.select(sel)):
            src = (node.get('src') or '').strip()
            if not src or src.lower().endswith(('.svg', '.gif')):
                continue
                
            abs_src = normalize_img(src)
            if not abs_src or abs_src in [c[0] for c in candidates]:
                continue
                
            # Skip if it's a data URL or base64 image
            if src.startswith(('data:', 'http')) and not src.startswith(('http://', 'https://')):
                continue
                
            # Skip generic images
            low = abs_src.lower()
            if any(k in low for k in bad_keywords) or any(term in low for term in generic_image_terms):
                continue
                
            # Check if the image is likely to be content
            parent_classes = ' '.join(node.find_parents(class_=True)[0].get('class', [])) if node.find_parents(class_=True) else ''
            parent_classes = parent_classes.lower()
            
            # Skip if in a header, footer, or sidebar
            if any(x in parent_classes for x in ('header', 'footer', 'sidebar', 'widget', 'nav', 'menu')):
                continue
                
            # Calculate priority (earlier in DOM is better, larger images are better)
            priority = 80 - i  # Base priority based on selector order
            
            # Check image dimensions if available
            width = None
            height = None
            if node.get('width') and node['width'].isdigit():
                width = int(node['width'])
            if node.get('height') and node['height'].isdigit():
                height = int(node['height'])
                
            # Adjust priority based on size (larger images are better)
            if width and height:
                area = width * height
                if area > 500 * 500:  # Large images get higher priority
                    priority += 10
                elif area < 100 * 100:  # Very small images get lower priority
                    priority -= 10
                    
            # Check if image is above the fold (in first 5 images)
            if i < 5:
                priority += 5
                
            candidates.append((abs_src, priority))
    
    # Sort candidates by priority (highest first)
    candidates.sort(key=lambda x: -x[1])
    
    # Return the best candidate, or None if no good candidates found
    img = candidates[0][0] if candidates else None
    # Description/Preview
    desc = (soup.select_one('meta[name="description"][content]') or {}).get('content')
    if not desc:
        p = soup.select_one('article p, .entry-content p, p')
        if p:
            desc = p.get_text(' ', strip=True)
    # Date
    date_raw = ''
    m = soup.select_one('meta[property="article:published_time"][content]')
    if m:
        date_raw = (m.get('content') or '').strip()
    if not date_raw:
        m = soup.select_one('meta[name="article:published_time"][content]')
        if m:
            date_raw = (m.get('content') or '').strip()
    if not date_raw:
        t = soup.select_one('time[datetime]')
        if t:
            date_raw = (t.get('datetime') or t.get_text(' ', strip=True) or '').strip()
    if not date_raw:
        # JSON-LD
        for s in soup.select('script[type="application/ld+json"]'):
            try:
                data = json.loads(s.get_text("\n", strip=True))
            except Exception:
                continue
            def find_date(obj):
                if isinstance(obj, dict):
                    for k in ['datePublished', 'dateCreated', 'uploadDate']:
                        if k in obj and isinstance(obj[k], str) and obj[k].strip():
                            return obj[k].strip()
                    for v in obj.values():
                        d = find_date(v)
                        if d:
                            return d
                elif isinstance(obj, list):
                    for it in obj:
                        d = find_date(it)
                        if d:
                            return d
                return ''
            d = find_date(data)
            if d:
                date_raw = d
                break
    if not date_raw:
        # Try to extract date from URL path like /2025/09/07/
        url_date_match = re.search(r'/(\d{4})/(\d{1,2})/(\d{1,2})/', url)
        if url_date_match:
            year, month, day = url_date_match.groups()
            date_raw = f"{year}-{month.zfill(2)}-{day.zfill(2)}"
    if not date_raw:
        # Fallback: parse from visible text like 'Friday, September 5, 2025'
        text_blocks = [
            (soup.select_one('article') or soup.select_one('.entry-content') or soup).get_text(' ', strip=True),
            desc or ''
        ]
        dow = '(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)'
        pattern = re.compile(rf'{dow},?\s+[A-Za-z]+\s+\d{{1,2}},\s+\d{{4}}')
        for txt in text_blocks:
            m = pattern.search(txt)
            if m:
                date_raw = m.group(0)
                break
    date_iso = normalize_date_iso(date_raw)
    return {
        'title': remove_date_from_title(title),
        'href': url,
        'img': img,
        'preview': (desc or '')[:220],
        'date': date_iso,
    }


def parse_championships_overview(page_url: str, limit: int = 40) -> list[dict]:
    """Parse items inside .news-overview-wrap on BWF World Championships site.
    Works on both the news overview page and a news-single page that contains the wrap.
    This now enriches each item by fetching the article page for accurate image and date.
    """
    # Try direct fetch first; if it fails (e.g., on GitHub runners), retry via proxy
    try:
        html = fetch(page_url)
    except Exception as e1:
        try:
            html = fetch_via_proxy(page_url)
            print(f"Fetched via proxy: {page_url}")
        except Exception as e2:
            print(f"Failed to fetch {page_url}: {e1} / {e2}")
            return []
    soup = BeautifulSoup(html, 'lxml')
    wrap = soup.select_one('.news-overview-wrap')
    if wrap is None:
        return []

    # Collect targets (href, fallback title, fallback img, fallback preview)
    targets = []
    seen = set()
    for a in wrap.select('a[href]'):
        href = a.get('href') or ''
        if '/news' not in href:
            continue
        href_abs = to_abs_url(page_url, href)
        try:
            u = urlparse(href_abs)
            if not (u.scheme and is_official_host((u.hostname or '').lower())):
                continue
        except Exception:
            continue
        if href_abs in seen:
            continue
        seen.add(href_abs)
        card = a
        if card.parent:
            card = card.parent
        if card and card.parent:
            card = card.parent
        title_fb = remove_date_from_title((a.get('title') or a.get_text(' ', strip=True) or '').strip())
        img_fb = None
        img_el = card.select_one('img[src]') if hasattr(card, 'select_one') else None
        if not img_el and hasattr(card, 'select_one'):
            img_el = card.select_one('img[data-src]')
        if img_el:
            img_fb = img_el.get('src') or img_el.get('data-src')
        if not img_fb and hasattr(card, 'select_one'):
            meta = card.select_one('meta[property="og:image"][content]')
            if meta:
                img_fb = meta.get('content')
        img_fb = to_abs_url(href_abs, img_fb or '') if img_fb else ''
        if img_fb:
            img_fb = re.sub(r'-\d+x\d+\.(jpg|jpeg|png|webp)$', r'.\1', img_fb, flags=re.IGNORECASE)
        preview_fb = ''
        p = card.select_one('p') if hasattr(card, 'select_one') else None
        if p:
            preview_fb = p.get_text(' ', strip=True)
        targets.append((href_abs, title_fb, img_fb, preview_fb))
        if len(targets) >= limit:
            break

    # Enrich by fetching each article page
    items: list[dict] = []
    def enrich(entry):
        href_abs, title_fb, img_fb, preview_fb = entry
        art = parse_article(href_abs)
        if art:
            if not art.get('img'):
                art['img'] = img_fb
            if not art.get('preview'):
                art['preview'] = (preview_fb or '')[:220]
            if not art.get('title'):
                art['title'] = remove_date_from_title(title_fb)
            return art
        else:
            return {
                'title': title_fb or href_abs,
                'href': href_abs,
                'img': img_fb,
                'preview': (preview_fb or '')[:220],
                'date': '',
            }

    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
        for art in executor.map(enrich, targets[:limit]):
            if art:
                items.append(art)
                if len(items) >= 20:
                    break

    return items


def scrape() -> dict:
    # Championships site - check both news page and main page
    champ_items = []
    default_pages = [
        'https://bwfworldchampionships.bwfbadminton.com/',  # Main page first (has latest)
        'https://bwfworldchampionships.bwfbadminton.com/news/',  # News page second
    ]
    # Allow overriding/adding pages via env var (comma-separated)
    extra = os.environ.get('BWF_CHAMP_URLS', '').strip()
    extra_pages = [u.strip() for u in extra.split(',') if u.strip()] if extra else []
    only = os.environ.get('BWF_CHAMP_ONLY', '').strip().lower() in ('1', 'true', 'yes')
    # Deduplicate while preserving order. If ONLY is set and extras provided -> use only extras.
    seen_pages = set()
    champ_pages: list[str] = []
    source_pages = (extra_pages if (only and extra_pages) else (extra_pages + default_pages))
    for u in source_pages:
        if u and (u not in seen_pages):
            champ_pages.append(u)
            seen_pages.add(u)

    # Parse all pages first, then deduplicate
    for url in champ_pages:
        part = parse_championships_overview(url, limit=40)
        if part:
            champ_items.extend(part)
            print(f"Found {len(part)} items from {url}")
        else:
            print(f"No items found from {url}")

    print(f"Total items before deduplication: {len(champ_items)}")

    # Deduplicate by href
    seen = set()
    unique_items = []
    for it in champ_items:
        h = it.get('href')
        if not h or h in seen:
            continue
        seen.add(h)
        unique_items.append(it)
    
    print(f"Unique items after deduplication: {len(unique_items)}")
    
    # Sort by date (newest first) and take top 20
    def get_date(item):
        date_str = item.get('date', '')
        try:
            from dateutil import parser
            return parser.parse(date_str) if date_str else datetime.min.replace(tzinfo=timezone.utc)
        except:
            return datetime.min.replace(tzinfo=timezone.utc)
    
    items = sorted(unique_items, key=get_date, reverse=True)[:20]

    print(f"Final result: {len(items)} items from championships site (news page + main page)")
    
    return {
        'scraped_at': datetime.now(timezone.utc).isoformat(),
        'items': items,
    }


def main():
    new_data = scrape()
    new_items = list(new_data.get('items', []))

    # Load previous items if exist
    old_items = []
    if os.path.exists(OUT_PATH):
        try:
            with open(OUT_PATH, 'r', encoding='utf-8') as f:
                prev = json.load(f)
                old_items = list(prev.get('items', []))
        except Exception:
            old_items = []

    # If scrape failed (no items), keep previous content to avoid empty site
    if len(new_items) == 0 and len(old_items) > 0:
        data_out = {
            'scraped_at': datetime.now(timezone.utc).isoformat(),
            'items': old_items,
        }
    else:
        # Merge new first, then old; dedupe by href
        merged: list[dict] = []
        seen = set()
        def push_list(lst):
            for it in lst:
                href = it.get('href')
                if not href or href in seen:
                    continue
                seen.add(href)
                merged.append(it)
        push_list(new_items)
        push_list(old_items)

        # Sort by date desc when possible, else keep insertion order
        def date_key(it: dict):
            d = it.get('date') or ''
            try:
                dt = date_parser.parse(d)
                return dt
            except Exception:
                return datetime.min.replace(tzinfo=timezone.utc)
        merged_sorted = sorted(merged, key=date_key, reverse=True)

        data_out = {
            'scraped_at': datetime.now(timezone.utc).isoformat(),
            'items': merged_sorted[:20],
        }

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(data_out, f, ensure_ascii=False, indent=2)
    print(f'wrote {len(data_out.get("items", []))} items to {OUT_PATH}')


if __name__ == '__main__':
    sys.exit(main())
