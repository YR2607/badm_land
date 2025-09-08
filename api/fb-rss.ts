import type { VercelRequest, VercelResponse } from '@vercel/node'
import * as cheerio from 'cheerio'

// Tokenless Facebook page scraper using m.facebook/mbasic + keyless proxy (r.jina.ai)
// Env (optional): FB_PAGE_ID, RSS_APP_FEED_URL
// Query: limit (default 10), refresh=1 to bypass cache

let cache: { ts: number; data: any[] } | null = null
const TTL_MS = 15 * 60 * 1000 // 15 minutes

function absolutize(url: string): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `https://m.facebook.com${url.startsWith('/') ? '' : '/'}${url}`
}

function proxyUrl(targetUrl: string): string {
  const encoded = targetUrl.replace(/^https?:\/\//, '')
  return `https://r.jina.ai/http://${encoded}`
}

function toIso(dateText: string): string {
  const d = new Date(dateText)
  if (!isNaN(d.getTime())) return d.toISOString()
  return new Date().toISOString()
}

function normalizeTitleAndExcerpt(text: string) {
  const clean = (text || '').replace(/\s+/g, ' ').trim()
  if (!clean) return { title: '', excerpt: '' }
  const firstSentence = clean.split('. ')[0] || clean
  const firstLine = clean.split('\n')[0] || clean
  const base = (firstSentence.length >= 10 ? firstSentence : firstLine) || clean
  const title = base.slice(0, 120)
  const excerpt = clean.length > 220 ? clean.slice(0, 220) + '...' : clean
  return { title: title.trim(), excerpt }
}

async function fetchHtmlRaw(url: string): Promise<string> {
  const r = await fetch(proxyUrl(url), {
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Cache-Control': 'no-cache',
    },
    cache: 'no-store',
  })
  if (!r.ok) throw new Error(`Failed to fetch ${url}: ${r.status}`)
  return await r.text()
}

async function fetchHtmlForPage(pageId: string): Promise<string> {
  const candidates = [
    `https://m.facebook.com/profile.php?id=${encodeURIComponent(pageId)}&v=timeline`,
    `https://m.facebook.com/${encodeURIComponent(pageId)}/posts`,
    `https://mbasic.facebook.com/profile.php?id=${encodeURIComponent(pageId)}&v=timeline`,
  ]
  let lastErr: any = null
  for (const u of candidates) {
    try {
      return await fetchHtmlRaw(u)
    } catch (e) {
      lastErr = e
      continue
    }
  }
  throw lastErr || new Error('failed to fetch facebook page')
}

function parseList(html: string) {
  const $ = cheerio.load(html)
  const items: { href: string; text: string; image?: string; date?: string }[] = []

  $('a[href]').each((_, a) => {
    const hrefRaw = ($(a).attr('href') || '').trim()
    if (!/(story\.php|permalink\.php|\/posts\/)/.test(hrefRaw)) return
    const href = absolutize(hrefRaw)
    if (!href) return

    const container = $(a).closest('article, div')
    const text = container.text().replace(/See more|Показать полностью|Подробнее/gi, ' ').trim()

    let img = ''
    const imgNode = container.find('img').first()
    if (imgNode && imgNode.attr('src')) img = imgNode.attr('src') as string

    const dateText = container.find('abbr, time').first().text().trim()

    items.push({ href, text, image: img, date: dateText })
  })

  const seen = new Set<string>()
  const dedup = items.filter((it) => {
    if (seen.has(it.href)) return false
    seen.add(it.href)
    return true
  })
  return { $, items: dedup }
}

function findNextUrl($: cheerio.CheerioAPI): string {
  let next = $('a:contains("See more")').attr('href')
  if (!next) next = $('a:contains("See More Posts")').attr('href') as string
  if (!next) next = $('a:contains("Показать")').attr('href') as string
  if (!next) next = $('a:contains("Показать ещё")').attr('href') as string
  if (!next) next = $('a[href*="sectionLoadingID"], a[href*="cursor="], a[href*="__tn__"]').first().attr('href') as string
  return next ? absolutize(next) : ''
}

async function scrape(pageId: string, limit: number) {
  let html = await fetchHtmlForPage(pageId)
  const collected: any[] = []
  const seen = new Set<string>()

  for (let page = 0; page < 5 && collected.length < limit; page++) {
    const { $, items } = parseList(html)
    for (const it of items) {
      if (seen.has(it.href)) continue
      seen.add(it.href)
      const { title, excerpt } = normalizeTitleAndExcerpt(it.text || '')
      collected.push({
        id: it.href,
        title: title || 'Пост Facebook',
        excerpt,
        image: it.image || '',
        date: toIso(it.date || ''),
        url: it.href,
        category: 'news',
      })
      if (collected.length >= limit) break
    }
    if (collected.length >= limit) break
    const nextUrl = findNextUrl($)
    if (!nextUrl) break
    try {
      html = await fetchHtmlRaw(nextUrl)
    } catch {
      break
    }
  }

  return collected.slice(0, limit)
}

async function fetchRssApp() {
  const FEED_URL = process.env.RSS_APP_FEED_URL || 'https://rss.app/feeds/v1.1/yneQwQdZWmbASmAF.json'
  const r = await fetch(FEED_URL, { cache: 'no-store' })
  if (!r.ok) return []
  const j = await r.json()
  return (j?.items || []).map((it: any) => ({
    id: it.id || it.url,
    title: (it.title || '').trim(),
    excerpt: (it.content_text || '').substring(0, 220) + ((it.content_text || '').length > 220 ? '...' : ''),
    image: it.image || '',
    date: it.date_published || new Date().toISOString(),
    url: it.url || '#',
    category: 'news',
  }))
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const limit = Number(req.query.limit || 10)
    const bypass = req.query.refresh === '1'
    if (!bypass && cache && Date.now() - cache.ts < TTL_MS && (cache.data?.length || 0) > 0) {
      return res.status(200).json({ cached: true, items: cache.data.slice(0, limit) })
    }

    // Primary: rss.app to guarantee up to `limit` items
    let data: any[] = []
    try {
      const feed = await fetchRssApp()
      data = feed.slice(0, limit)
    } catch {}

    // Secondary: augment with scrape if fewer than limit
    if (data.length < limit) {
      try {
        const PAGE_ID = process.env.FB_PAGE_ID || '61562124174747'
        const scraped = await scrape(PAGE_ID, limit * 2)
        const seen = new Set(data.map(d => d.url))
        for (const it of scraped) {
          if (seen.has(it.url)) continue
          data.push(it)
          seen.add(it.url)
          if (data.length >= limit) break
        }
      } catch {}
    }

    if (data.length > 0) {
      cache = { ts: Date.now(), data }
      return res.status(200).json({ cached: false, items: data.slice(0, limit) })
    }

    // Final fallback: internal /api/rss-club
    const host = (req.headers['x-forwarded-host'] as string) || (req.headers.host as string) || ''
    const base = host ? `https://${host}` : ''
    try {
      const r = await fetch(`${base}/api/rss-club?limit=${limit}&refresh=1`, { cache: 'no-store' })
      if (r.ok) {
        const j = await r.json()
        const items = (j?.items || [])
        if (items.length > 0) {
          return res.status(200).json({ cached: false, items })
        }
      }
    } catch {}

    res.status(200).json({ items: [] })
  } catch (e: any) {
    console.error('fb-rss error', e?.message || e)
    res.status(200).json({ items: [] })
  }
}
