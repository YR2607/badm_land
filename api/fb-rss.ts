import type { VercelRequest, VercelResponse } from '@vercel/node'
import * as cheerio from 'cheerio'

// Tokenless Facebook page scraper using m.facebook/mbasic + optional proxy
// Env (optional): FB_PAGE_ID, RSS_APP_FEED_URL, SCRAPERAPI_KEY, SCRAPINGBEE_KEY
// Query: limit (default 10), refresh=1, source=scrape|rss (default: mixed strategy)

let cache: { ts: number; data: any[] } | null = null
const TTL_MS = 15 * 60 * 1000 // 15 minutes

const SCRAPERAPI_KEY = process.env.SCRAPERAPI_KEY
const SCRAPINGBEE_KEY = process.env.SCRAPINGBEE_KEY

function absolutize(url: string): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `https://m.facebook.com${url.startsWith('/') ? '' : '/'}${url}`
}

function buildProxyUrl(targetUrl: string): string {
  if (SCRAPERAPI_KEY) {
    return `https://api.scraperapi.com?api_key=${encodeURIComponent(SCRAPERAPI_KEY)}&url=${encodeURIComponent(targetUrl)}&country=de&keep_headers=true`
  }
  if (SCRAPINGBEE_KEY) {
    return `https://app.scrapingbee.com/api/v1/?api_key=${encodeURIComponent(SCRAPINGBEE_KEY)}&url=${encodeURIComponent(targetUrl)}&render_js=false&block_resources=false&country_code=de`
  }
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
  const title = base.slice(0, 140)
  const excerpt = clean.length > 220 ? clean.slice(0, 220) + '...' : clean
  return { title: title.trim(), excerpt }
}

async function fetchHtmlRaw(url: string): Promise<string> {
  const proxyUrl = buildProxyUrl(url)
  const r = await fetch(proxyUrl, {
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
  if (!next) next = $('a[href*="sectionLoadingID"], a[href*="cursor="], a[href*="__tn__"], a[href*="/?refid="]').first().attr('href') as string
  return next ? absolutize(next) : ''
}

async function scrape(pageId: string, limit: number) {
  let html = await fetchHtmlForPage(pageId)
  const collected: any[] = []
  const seen = new Set<string>()

  for (let page = 0; page < 10 && collected.length < limit; page++) {
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
    const source = String(req.query.source || '').toLowerCase() // 'scrape' | 'rss' | ''

    if (!bypass && cache && Date.now() - cache.ts < TTL_MS && (cache.data?.length || 0) > 0) {
      return res.status(200).json({ cached: true, items: cache.data.slice(0, limit) })
    }

    let data: any[] = []

    if (source === 'rss') {
      data = await fetchRssApp()
    } else if (source === 'scrape') {
      const PAGE_ID = process.env.FB_PAGE_ID || '61562124174747'
      try { data = await scrape(PAGE_ID, limit * 2) } catch {}
      if (data.length < limit) {
        try {
          const extra = await fetchRssApp()
          const seen = new Set(data.map(d => d.url))
          for (const it of extra) {
            if (seen.has(it.url)) continue
            data.push(it)
            seen.add(it.url)
            if (data.length >= limit) break
          }
        } catch {}
      }
    } else {
      // mixed strategy: rss first, then add scraped items to reach limit
      try { data = (await fetchRssApp()).slice(0, limit) } catch {}
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
    }

    if (data.length > 0) {
      cache = { ts: Date.now(), data }
      return res.status(200).json({ cached: false, items: data.slice(0, limit) })
    }

    res.status(200).json({ items: [] })
  } catch (e: any) {
    console.error('fb-rss error', e?.message || e)
    res.status(200).json({ items: [] })
  }
}
