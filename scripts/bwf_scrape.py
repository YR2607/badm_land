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
OVERRIDES_PATH = os.path.join(ROOT, 'scripts', 'image_overrides.json')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (compatible; AltiusSiteBot/1.0; +https://badm-land-main.vercel.app)'
}

SCRAPERAPI_KEY = os.getenv('SCRAPERAPI_KEY')
SCRAPINGBEE_KEY = os.getenv('SCRAPINGBEE_KEY')
BWF_FORCE_PROXY = os.getenv('BWF_FORCE_PROXY', '').strip().lower() in ('1', 'true', 'yes')


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


def load_image_overrides() -> dict:
    try:
        if os.path.exists(OVERRIDES_PATH):
            with open(OVERRIDES_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
                # structure:
                # {
                #   "by_href": { "<article_url>": "<image_url>" },
                #   "by_title_substr": { "Week in Quotes": "<image_url>" }
                # }
                return data or {}
    except Exception:
        pass
    return {}


def fetch(url: str, use_cloud: bool = True) -> str:
    host = (urlparse(url).hostname or '').lower()
    # Championships site: fetch directly unless forced via proxy
    if host.endswith('bwfworldchampionships.bwfbadminton.com') and not BWF_FORCE_PROXY:
        r = requests.get(url, headers=HEADERS, timeout=40)
        r.raise_for_status()
        return r.text
    if host.endswith('bwfworldchampionships.bwfbadminton.com') and BWF_FORCE_PROXY:
        if SCRAPERAPI_KEY or SCRAPINGBEE_KEY:
            return fetch_via_proxy(url)
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
        # Restrict search to the anchor itself to avoid picking unrelated page assets
        card = a
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
        if not date and hasattr(card, 'get_text'):
            # try to find textual date like 'Friday, September 5, 2025'
            txt = card.get_text(' ', strip=True)
            mdate = re.search(r"(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+[A-Za-z]+\s+\d{1,2},\s+\d{4}", txt)
            if not mdate:
                mdate = re.search(r"[A-Za-z]+\s+\d{1,2},\s+\d{4}", txt)
            if mdate:
                date = mdate.group(0)
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
    def load_html(use_proxy_first: bool = False) -> str | None:
        if use_proxy_first:
            try:
                return fetch_via_proxy(url)
            except Exception:
                pass
        try:
            return fetch(url)
        except Exception:
            try:
                return fetch_via_proxy(url)
            except Exception:
                return None

    html = load_html(False)
    if html is None:
        return None
    soup = BeautifulSoup(html, 'lxml')
    # Detect consent/cookie pages; if detected, retry via proxy explicitly once
    page_text = soup.get_text(" ", strip=True).lower()
    consent_bad_signals = (
        'we do not use cookies of this type',
        'cookie',
        'consent',
        'privacy',
        'gdpr'
    )
    if sum(1 for s in consent_bad_signals if s in page_text) >= 2:
        html2 = load_html(True)
        if not html2:
            return None
        soup = BeautifulSoup(html2, 'lxml')
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
        '.post-thumbnail img[src]'
    ]
    
    # Collect all candidate images with their priority
    candidates = []
    
    # We prefer in-article content images FIRST; OG/Twitter later as fallback
    
    # Scan the article for images
    for sel in content_selectors:
        for i, node in enumerate(soup.select(sel)):
            src = (node.get('src') or '').strip()
            if not src or src.lower().endswith(('.svg', '.gif')):
                continue
                
            abs_src = normalize_img(src)
            if not abs_src or abs_src in [c[0] for c in candidates]:
                continue
            low_src = abs_src.lower()
            # Accept only media from wp-content/uploads to avoid unrelated assets
            if '/wp-content/uploads/' not in low_src:
                continue
            if any(k in low_src for k in bad_keywords) or any(term in low_src for term in generic_image_terms):
                continue
            # Priority: earliest content images are highest
            priority = 100
            if i == 0:
                priority += 0
            elif i == 1:
                priority -= 10
            elif i == 2:
                priority -= 15
            
            # Some heuristic boosts
            if any(word in low_src for word in ['action', 'match', 'court', 'celebration', 'win', 'champ']):
                priority += 5
            if any(word in low_src for word in ['headshot', 'profile', 'logo', 'banner', 'featured']):
                priority -= 25
            # Prefer larger images by filename suffix (e.g., '-2048x1365')
            m = re.search(r'(\d{3,4})x(\d{3,4})', abs_src)
            if m:
                w, h = int(m.group(1)), int(m.group(2))
                if w >= 1600 and h >= 900:
                    priority += 5
                elif w >= 1200 and h >= 800:
                    priority += 3
                else:
                    priority -= 5
            # Earlier images inside article tend to be more representative
            if i < 5:
                priority += 0
                
            candidates.append((abs_src, priority))

    # Fallback OG/Twitter after content images
    og_img = (soup.select_one('meta[property="og:image"][content]') or {}).get('content') or \
             (soup.select_one('meta[property="og:image:secure_url"][content]') or {}).get('content')
    if og_img:
        og_img = normalize_img(og_img)
        low_og = (og_img or '').lower()
        if low_og.endswith(('.jpg', '.jpeg', '.png', '.webp')) and not (any(k in low_og for k in bad_keywords) or any(term in low_og for term in generic_image_terms)):
            candidates.append((og_img, 80))

    twitter_img = (soup.select_one('meta[name="twitter:image"][content]') or {}).get('content')
    if twitter_img:
        twitter_img = normalize_img(twitter_img)
        low_tw = (twitter_img or '').lower()
        if low_tw.endswith(('.jpg', '.jpeg', '.png', '.webp')) and twitter_img not in [c[0] for c in candidates]:
            if not (any(k in low_tw for k in bad_keywords) or any(term in low_tw for term in generic_image_terms)):
                candidates.append((twitter_img, 75))
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
    img_candidates = [u for (u, _) in candidates]
    # Description/Preview (avoid cookie/consent text)
    def is_bad_preview(t: str) -> bool:
        t_low = (t or '').strip().lower()
        if not t_low:
            return True
        bad_words = ('cookie', 'privacy', 'consent', 'we do not use cookies')
        return any(b in t_low for b in bad_words) or len(t_low) < 12

    desc = (soup.select_one('meta[name="description"][content]') or {}).get('content')
    if is_bad_preview(desc or ''):
        # Prefer lines that look like BWF byline/date
        paras = []
        for sel in ['article p', '.entry-content p', '.single-post__content p', 'p']:
            for node in soup.select(sel):
                txt = node.get_text(' ', strip=True)
                if txt:
                    paras.append(txt)
            if paras:
                break
        # Heuristics: pick first that contains 'TEXT BY' or a month name
        month_re = re.compile(r"\b(January|February|March|April|May|June|July|August|September|October|November|December)\b", re.I)
        candidates = [t for t in paras if 'text by' in t.lower() or month_re.search(t)] or paras
        for t in candidates:
            if not is_bad_preview(t):
                desc = t
                break
        if is_bad_preview(desc or ''):
            desc = ''
    # Date
    date_raw = ''
    m = soup.select_one('meta[property="article:published_time"][content]')
    if m:
        date_raw = m.get('content') or ''
    if not date_raw:
        # Try time tag or date text in article header/meta
        t = soup.select_one('time[datetime]')
        if t and t.get('datetime'):
            date_raw = t.get('datetime')
    if not date_raw:
        # Try to extract date-like string from typical byline text
        body_txt = soup.get_text(' ', strip=True)
        m2 = re.search(r"(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+([A-Za-z]+)\s+\d{1,2},\s+\d{4}", body_txt)
        if not m2:
            m2 = re.search(r"([A-Za-z]+)\s+\d{1,2},\s+\d{4}", body_txt)
        if m2:
            date_raw = m2.group(0)
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
        'img_candidates': img_candidates,
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

    # Collect targets (href, fallback title, fallback img, fallback preview, fallback date)
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
        def pick_from_srcset(srcset: str) -> str:
            # take first url in srcset
            parts = [p.strip() for p in (srcset or '').split(',') if p.strip()]
            if parts:
                first = parts[0].split()[0]
                return first
            return ''

        img_fb = ''
        img_el = card.select_one('img[src], img[data-src], img[srcset], img[data-srcset]') if hasattr(card, 'select_one') else None
        if img_el:
            img_fb = img_el.get('src') or img_el.get('data-src') or ''
            if not img_fb:
                img_fb = pick_from_srcset(img_el.get('srcset') or img_el.get('data-srcset') or '')
        if not img_fb and hasattr(card, 'select_one'):
            # picture > source srcset
            src_el = card.select_one('picture source[srcset], source[srcset]')
            if src_el and src_el.get('srcset'):
                img_fb = pick_from_srcset(src_el.get('srcset'))
        if not img_fb and hasattr(card, 'get'):
            # background-image in style
            style_attr = card.get('style') or ''
            m = re.search(r"background-image\s*:\s*url\((['\"]?)(.+?)\1\)", style_attr, re.I)
            if m:
                img_fb = m.group(2)
        if not img_fb and hasattr(card, 'select_one'):
            meta = card.select_one('meta[property="og:image"][content]')
            if meta:
                img_fb = meta.get('content')
        img_fb = to_abs_url(href_abs, img_fb or '') if img_fb else ''
        if img_fb:
            img_fb = re.sub(r'-\d+x\d+\.(jpg|jpeg|png|webp)$', r'.\1', img_fb, flags=re.IGNORECASE)
            low_fb = img_fb.lower()
            # Drop generic/featured images from card if we can find better from article later
            if any(k in low_fb for k in ('logo','favicon','default','placeholder','sprite','icon','avatar','thumbnail')) or any(term in low_fb for term in ('fi-','header','banner','featured','momota')):
                img_fb = ''
        preview_fb = ''
        p = card.select_one('p') if hasattr(card, 'select_one') else None
        if p:
            preview_fb = p.get_text(' ', strip=True)
        # fallback date from card (date_fb)
        date_fb = ''
        t = card.select_one('time[datetime]') if hasattr(card, 'select_one') else None
        if t:
            date_fb = (t.get('datetime') or t.get_text(' ', strip=True) or '').strip()
        if not date_fb and hasattr(card, 'get_text'):
            txt = card.get_text(' ', strip=True)
            mdate = re.search(r"(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+[A-Za-z]+\s+\d{1,2},\s+\d{4}", txt)
            if not mdate:
                mdate = re.search(r"[A-Za-z]+\s+\d{1,2},\s+\d{4}", txt)
            if mdate:
                date_fb = mdate.group(0)
        targets.append((href_abs, title_fb, img_fb, preview_fb, date_fb))
        if len(targets) >= limit:
            break

    # Enrich by fetching each article page
    items: list[dict] = []
    overrides = load_image_overrides()
    by_href = (overrides.get('by_href') or {}) if isinstance(overrides, dict) else {}
    by_title_substr = (overrides.get('by_title_substr') or {}) if isinstance(overrides, dict) else {}
    def enrich(entry):
        href_abs, title_fb, img_fb, preview_fb, date_fb = entry
        art = parse_article(href_abs)
        if art:
            # Apply overrides by href or title substring first
            ov_img = by_href.get(href_abs) or next((v for k, v in (by_title_substr.items()) if k and k.lower() in (art.get('title') or '').lower()), None)
            if ov_img:
                art['img'] = ov_img
            # choose best non-duplicate image among candidates
            if not art.get('img'):
                art['img'] = img_fb
            if not art.get('preview'):
                art['preview'] = (preview_fb or '')[:220]
            if not art.get('title'):
                art['title'] = remove_date_from_title(title_fb)
            if not art.get('date'):
                art['date'] = normalize_date_iso(date_fb or '')
            # If override set, use it as final and skip further selection
            if ov_img:
                if 'img_candidates' in art:
                    del art['img_candidates']
                return art
            # Choose best per-article image (no global de-dup to avoid mismatches)
            candidates: list[str] = []
            # article-reported best
            if art.get('img'):
                candidates.append(art['img'])
            # article candidates list
            if isinstance(art.get('img_candidates'), list):
                candidates.extend([c for c in art['img_candidates'] if isinstance(c, str)])
            # fallback from card
            if img_fb:
                candidates.append(img_fb)
            def is_generic(u: str) -> bool:
                lu = (u or '').lower()
                return any(k in lu for k in ('logo','favicon','default','placeholder','sprite','icon','avatar','thumbnail')) or any(term in lu for term in ('header','banner','featured'))
            # pick first non-generic, else first available
            non_generic = [c for c in candidates if c and not is_generic(c)]
            art['img'] = (non_generic[0] if non_generic else next((c for c in candidates if c), art.get('img') or img_fb))
            # clean up helper key
            if 'img_candidates' in art:
                del art['img_candidates']
            return art
        else:
            # Extract date from URL as fallback when parse_article fails
            url_date = ''
            url_date_match = re.search(r'/(\d{4})/(\d{1,2})/(\d{1,2})/', href_abs)
            if url_date_match:
                year, month, day = url_date_match.groups()
                url_date = f"{year}-{month.zfill(2)}-{day.zfill(2)}T00:00:00+00:00"
            
            # apply overrides even on fallback path
            ov_img = by_href.get(href_abs) or next((v for k, v in (by_title_substr.items()) if k and k.lower() in (title_fb or '').lower()), None)
            return {
                'title': title_fb or href_abs,
                'href': href_abs,
                'img': ov_img or img_fb,
                'preview': (preview_fb or '')[:220],
                'date': url_date or normalize_date_iso(date_fb or ''),
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
