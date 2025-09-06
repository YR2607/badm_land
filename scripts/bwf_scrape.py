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


def discover_from_official_lists(limit: int = 40) -> list[str]:
    bases = [
        'https://bwfbadminton.com',
        'https://corporate.bwfbadminton.com',
        'https://bwfworldtour.bwfbadminton.com',
        'https://bwfworldchampionships.bwfbadminton.com',
        'https://bwfworldtourfinals.bwfbadminton.com'
    ]
    links: list[str] = []
    for base in bases:
        try:
            html = fetch(f'{base}/news/')
        except Exception:
            continue
        soup = BeautifulSoup(html, 'lxml')
        for a in soup.select('a[href]'):
            href = a.get('href') or ''
            abs_url = href if href.startswith('http') else f'{base}{href if href.startswith('/') else "/"+href}'
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
        'img': img or '',
        'preview': (desc or '')[:220],
        'date': date,
    }


def scrape() -> dict:
    links = discover_from_official_lists(limit=40)
    if not links:
        links = discover_links_via_google(limit=40)
    items: list[dict] = []
    for link in links:
        u = urlparse(link)
        if not (u.scheme and is_official_host((u.hostname or '').lower())):
            continue
        art = parse_article(link)
        if art:
            items.append(art)
        if len(items) >= 20:
            break
        time.sleep(0.4)
    return {
        'scraped_at': datetime.now(timezone.utc).isoformat(),
        'items': items,
    }


def main():
    data = scrape()
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f'wrote {len(data.get("items", []))} items to {OUT_PATH}')


if __name__ == '__main__':
    sys.exit(main())
