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


def parse_article(url: str) -> dict | None:
    try:
        html = fetch(url)
    except Exception:
        return None
    soup = BeautifulSoup(html, 'lxml')
    title = (soup.select_one('meta[property="og:title"][content]') or {}).get('content') or (soup.title.string if soup.title else '')
    title = (title or '').strip()
    if not title:
        return None
    img = (soup.select_one('meta[property="og:image"][content]') or {}).get('content')
    if not img:
        first_img = soup.select_one('img[src]')
        if first_img:
            img = first_img.get('src')
    img = to_abs_url(url, img or '') if img else ''
    desc = (soup.select_one('meta[name="description"][content]') or {}).get('content')
    if not desc:
        p = soup.select_one('p')
        if p:
            desc = p.get_text(' ', strip=True)
    date = ''
    t = soup.select_one('time[datetime]')
    if t:
        date = t.get('datetime', '').strip()
    return {
        'title': title,
        'href': url,
        'img': img,
        'preview': (desc or '')[:220],
        'date': date,
    }


def parse_championships_overview(page_url: str, limit: int = 40) -> list[dict]:
    """Parse items inside .news-overview-wrap on BWF World Championships site.
    Works on both the news overview page and a news-single page that contains the wrap.
    """
    try:
        html = fetch(page_url)
    except Exception:
        return []
    soup = BeautifulSoup(html, 'lxml')
    wrap = soup.select_one('.news-overview-wrap')
    if wrap is None:
        return []
    items: list[dict] = []
    seen = set()
    base_for_abs = page_url

    for a in wrap.select('a[href]'):
        href = a.get('href') or ''
        if '/news' not in href:
            continue
        href_abs = to_abs_url(base_for_abs, href)
        try:
            u = urlparse(href_abs)
            if not (u.scheme and is_official_host((u.hostname or '').lower())):
                continue
        except Exception:
            continue
        if href_abs in seen:
            continue
        seen.add(href_abs)

        # Try to find context card
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
        if len(items) >= limit:
            break

    return items


def scrape() -> dict:
    # Try championships site news-overview-wrap first
    champ_items = []
    champ_pages = [
        'https://bwfworldchampionships.bwfbadminton.com/news/',
        'https://bwfworldchampionships.bwfbadminton.com/news-single/2025/08/14/pressure-and-paris-inside-my-championship-mindset/',
    ]
    for url in champ_pages:
        part = parse_championships_overview(url, limit=40)
        if part:
            champ_items.extend(part)
        if len(champ_items) >= 20:
            break

    items: list[dict] = []
    # Deduplicate by href preserve order
    seen = set()
    for it in champ_items:
        h = it.get('href')
        if not h or h in seen:
            continue
        seen.add(h)
        items.append(it)
        if len(items) >= 20:
            break

    # If nothing found on championships, fallback to main site's LATEST NEWS
    if not items:
        base = 'https://bwfbadminton.com'
        items = parse_listing_latest(base, limit=60)[:20]

    return {
        'scraped_at': datetime.now(timezone.utc).isoformat(),
        'items': items[:20],
    }


def main():
    data = scrape()
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f'wrote {len(data.get("items", []))} items to {OUT_PATH}')


if __name__ == '__main__':
    sys.exit(main())
