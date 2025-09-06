import type { VercelRequest, VercelResponse } from '@vercel/node'
import * as cheerio from 'cheerio'

let cache: { timestamp: number; data: any[] } | null = null
const TTL_MS = 24 * 60 * 60 * 1000

function decodeHtml(input: string): string {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function stripTags(input: string): string {
  return input.replace(/<[^>]*>/g, '')
}

const SCRAPERAPI_KEY = process.env.SCRAPERAPI_KEY
const SCRAPINGBEE_KEY = process.env.SCRAPINGBEE_KEY

async function fetchDirect(url: string): Promise<string> {
  const r = await fetch(url, {
    cache: 'no-store',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'User-Agent': 'Mozilla/5.0 (compatible; AltiusSiteBot/1.0; +https://badm-land-main.vercel.app)'
    }
  })
  return r.text()
}

async function fetchViaProxy(url: string): Promise<string> {
  if (SCRAPERAPI_KEY) {
    const proxyUrl = `https://api.scraperapi.com?api_key=${encodeURIComponent(SCRAPERAPI_KEY)}&url=${encodeURIComponent(url)}&country=de`
    const r = await fetch(proxyUrl, { cache: 'no-store' })
    return r.text()
  }
  if (SCRAPINGBEE_KEY) {
    const proxyUrl = `https://app.scrapingbee.com/api/v1/?api_key=${encodeURIComponent(SCRAPINGBEE_KEY)}&url=${encodeURIComponent(url)}&render_js=false`
    const r = await fetch(proxyUrl, { cache: 'no-store' })
    return r.text()
  }
  return fetchDirect(url)
}

async function fetchViaJina(url: string): Promise<string> {
  const u = new URL(url)
  const jinaUrl = `https://r.jina.ai/http://${u.host}${u.pathname}${u.search}`
  return fetchDirect(jinaUrl)
}

async function fetchText(url: string): Promise<string> {
  const host = new URL(url).hostname
  const isBwf = host === 'bwfbadminton.com'
  if (isBwf && (SCRAPERAPI_KEY || SCRAPINGBEE_KEY)) {
    return fetchViaProxy(url)
  }
  return fetchDirect(url)
}

function pickTag(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i'))
  return m ? m[1].trim() : ''
}

function pickCdata(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i'))
  if (!m) return ''
  const val = m[1]
  const cdata = val.match(/<!\[CDATA\[([\s\S]*?)\]\]>/)
  return (cdata ? cdata[1] : val).trim()
}

function parseRssItems(xml: string): Array<{ title: string; href: string; img?: string; preview?: string; date?: string }> {
  const list: Array<{ title: string; href: string; img?: string; preview?: string; date?: string }> = []
  const blocks = xml.split(/<item>/i).slice(1)
  for (const raw of blocks) {
    const block = raw.split(/<\/item>/i)[0]

    const rawTitle = pickCdata(block, 'title') || pickTag(block, 'title')
    const title = decodeHtml(stripTags(rawTitle))
    let link = decodeHtml(stripTags(pickTag(block, 'link')))
    const pubDate = decodeHtml(stripTags(pickTag(block, 'pubDate')))
    const description = pickCdata(block, 'description')

    if (/news\.google\.com\//i.test(link)) {
      const hrefInDesc = description.match(/href=\"(https?:[^\"]+)\"/i)?.[1]
      if (hrefInDesc) link = decodeURIComponent(hrefInDesc)
    }

    if (title && link) {
      list.push({ title, href: link, date: pubDate })
    }
  }
  return list
}

async function scrapeArticle(url: string) {
  const page = (SCRAPERAPI_KEY || SCRAPINGBEE_KEY) ? await fetchText(url) : await fetchViaJina(url)
  if (page.startsWith('Title:')) {
    const title = (page.match(/^Title:\s*(.*)$/m)?.[1] || '').trim()
    const img = page.match(/https?:[^\s')"]+\.(?:jpg|jpeg|png|webp)/i)?.[0]
    const preview = (page.match(/\n\n([^\n].{40,200})/s)?.[1] || '').replace(/\s+/g, ' ').trim()
    const date = ''
    return title ? { title, href: url, img, preview, date } : null
  } else {
    const $p = cheerio.load(page)
    const title = ($p('meta[property="og:title"]').attr('content') || $p('title').text() || '').trim()
    const img = $p('meta[property="og:image"]').attr('content') || $p('img').first().attr('src')
    const date = $p('time').first().attr('datetime') || ''
    const preview = ($p('meta[name="description"]').attr('content') || $p('p').first().text() || '').trim()
    return title ? { title, href: url, img, preview, date } : null
  }
}

async function scrapeFromList(): Promise<Array<{ title: string; href: string; img?: string; preview?: string; date?: string }>> {
  const base = 'https://bwfbadminton.com'
  const html = (SCRAPERAPI_KEY || SCRAPINGBEE_KEY) ? await fetchText(`${base}/news/`) : await fetchViaJina(`${base}/news/`)
  const $ = cheerio.load(html)
  const links: string[] = []
  $('a').each((_, a) => {
    const href = $(a).attr('href') || ''
    const abs = href.startsWith('http') ? href : new URL(href, base).href
    try {
      const u = new URL(abs)
      if (u.hostname === 'bwfbadminton.com' && /\/news\//.test(u.pathname) && !/\/news\/$/.test(u.pathname)) links.push(u.href)
    } catch {}
  })
  const seen = new Set<string>()
  const targets = links.filter(h => { if (seen.has(h)) return false; seen.add(h); return true }).slice(0, 24)
  const results: any[] = []
  const concurrency = 5
  let idx = 0
  async function worker() {
    while (idx < targets.length) {
      const i = idx++
      const url = targets[i]
      try {
        const art = await scrapeArticle(url)
        if (art) results.push(art)
      } catch {}
    }
  }
  await Promise.all(Array.from({ length: concurrency }).map(() => worker()))
  return results
}

async function discoverViaGoogleAndScrape(): Promise<Array<{ title: string; href: string; img?: string; preview?: string; date?: string }>> {
  // Используем только для обнаружения ссылок. Контент берём с официального сайта.
  const query = 'site:bwfbadminton.com/news when:365d'
  const gUrl = 'https://news.google.com/rss/search?q=' + encodeURIComponent(query) + '&hl=en-US&gl=US&ceid=US:en'
  const xml = await fetchDirect(gUrl)
  if (!xml || !xml.includes('<rss')) return []
  const items = parseRssItems(xml)
  const links = items.map(i => i.href).filter(h => {
    try {
      const u = new URL(h)
      return u.hostname === 'bwfbadminton.com' && /\/news\//.test(u.pathname)
    } catch { return false }
  }).slice(0, 24)
  const seen = new Set<string>()
  const uniq = links.filter(h => { if (seen.has(h)) return false; seen.add(h); return true })
  const out: any[] = []
  const concurrency = 5
  let idx = 0
  async function worker() {
    while (idx < uniq.length) {
      const i = idx++
      const url = uniq[i]
      try {
        const art = await scrapeArticle(url)
        if (art) out.push(art)
      } catch {}
    }
  }
  await Promise.all(Array.from({ length: concurrency }).map(() => worker()))
  return out
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const bypass = req.query?.refresh === '1'
    if (!bypass && cache && Date.now() - cache.timestamp < TTL_MS) {
      return res.status(200).json({ cached: true, items: cache.data })
    }

    // 1) Сначала пытаемся со списка /news/
    let items = await scrapeFromList()

    // 2) Если пусто — ищем ссылки через Google News (только ссылки), затем парсим страницы с bwfbadminton.com
    if (items.length === 0) {
      const viaGoogle = await discoverViaGoogleAndScrape()
      if (viaGoogle.length > 0) items = viaGoogle
    }

    // Дедупликация и ограничение
    const seen = new Set<string>()
    const dedup = items.filter(it => {
      if (seen.has(it.href)) return false
      seen.add(it.href)
      return true
    }).slice(0, 20)

    cache = { timestamp: Date.now(), data: dedup }
    res.status(200).json({ cached: false, items: dedup })
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'failed to fetch' })
  }
}
