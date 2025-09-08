import type { VercelRequest, VercelResponse } from '@vercel/node'
import * as cheerio from 'cheerio'

// Tokenless Facebook page scraper using mbasic + keyless proxy (r.jina.ai)
// Env (optional): FB_PAGE_ID
// Query: limit (default 10), refresh=1 to bypass cache

let cache: { ts: number; data: any[] } | null = null
const TTL_MS = 15 * 60 * 1000 // 15 minutes

function absolutize(url: string): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `https://mbasic.facebook.com${url.startsWith('/') ? '' : '/'}${url}`
}

function proxyUrl(targetUrl: string): string {
  // Use r.jina.ai to fetch HTML without JS and avoid bot blocks
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

async function fetchHtml(url: string): Promise<string> {
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

function parseList(html: string) {
  const $ = cheerio.load(html)
  const items: { href: string; text: string; image?: string; date?: string }[] = []

  // mbasic timeline posts often contain anchors like story.php?story_fbid=...
  $('a[href*="story.php?story_fbid="]').each((_, a) => {
    const href = absolutize($(a).attr('href') || '')
    if (!href) return

    // Find nearest text container
    const container = $(a).closest('article, div')
    const text = container.text().replace(/See more|Показать полностью|Подробнее/gi, ' ').trim()

    // Try find an image within the same container
    let img = ''
    const imgNode = container.find('img').first()
    if (imgNode && imgNode.attr('src')) img = imgNode.attr('src') as string

    // Try date text from abbr/time
    let dateText = container.find('abbr, time').first().text().trim()

    items.push({ href, text, image: img, date: dateText })
  })

  // Deduplicate by href
  const seen = new Set<string>()
  const dedup = items.filter((it) => {
    if (seen.has(it.href)) return false
    seen.add(it.href)
    return true
  })
  return dedup
}

async function scrape(pageId: string, limit: number) {
  const url = `https://mbasic.facebook.com/profile.php?id=${encodeURIComponent(pageId)}&v=timeline`
  const html = await fetchHtml(url)
  const list = parseList(html)

  const normalized = list.slice(0, Math.max(5, limit * 2)).map((it) => {
    const { title, excerpt } = normalizeTitleAndExcerpt(it.text || '')
    return {
      id: it.href,
      title: title || 'Пост Facebook',
      excerpt,
      image: it.image || '',
      date: toIso(it.date || ''),
      url: it.href,
      category: 'news',
    }
  })

  // Keep top unique by URL
  const unique: any[] = []
  const seen = new Set<string>()
  for (const n of normalized) {
    if (seen.has(n.url)) continue
    seen.add(n.url)
    unique.push(n)
    if (unique.length >= limit) break
  }
  return unique
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const limit = Number(req.query.limit || 10)
    if (cache && Date.now() - cache.ts < TTL_MS && !req.query.refresh) {
      return res.status(200).json({ cached: true, items: cache.data.slice(0, limit) })
    }

    const PAGE_ID = process.env.FB_PAGE_ID || '61562124174747'
    const data = await scrape(PAGE_ID, limit)

    cache = { ts: Date.now(), data }
    res.status(200).json({ cached: false, items: data.slice(0, limit) })
  } catch (e: any) {
    console.error('fb-rss error', e?.message || e)
    res.status(200).json({ items: [] })
  }
}
