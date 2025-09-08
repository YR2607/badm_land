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

function extractFirstImageFromContent(content: string): string | undefined {
  if (!content) return undefined
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i)
  if (imgMatch && imgMatch[1]) return imgMatch[1]
  const metaOg = content.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
  if (metaOg && metaOg[1]) return metaOg[1]
  const urlMatch = content.match(/https?:[^\s"')]+\.(?:jpg|jpeg|png|webp)/i)
  if (urlMatch && urlMatch[0]) return urlMatch[0]
  return undefined
}

const SCRAPERAPI_KEY = process.env.SCRAPERAPI_KEY
const SCRAPINGBEE_KEY = process.env.SCRAPINGBEE_KEY

function toAbs(base: string, src?: string): string | undefined {
  if (!src) return undefined
  try {
    const u = new URL(src, base)
    return u.href
  } catch {
    return undefined
  }
}

function normalizeImg(url?: string): string | undefined {
  if (!url) return undefined
  // remove size suffix like -613x290.jpg
  return url.replace(/-\d+x\d+\.(jpg|jpeg|png|webp)$/i, '.$1')
}

function isBadImage(url?: string): boolean {
  if (!url) return true
  const u = url.toLowerCase()
  if (u.endsWith('.svg')) return true
  // common placeholders/logos
  if (u.includes('/logo') || u.includes('logo-') || u.includes('/favicon')) return true
  if (u.includes('bwfbadminton.com/wp-content/uploads/2019/02/bwf-logo')) return true
  return false
}

async function fetchDirect(url: string): Promise<string> {
  const r = await fetch(url, {
    cache: 'no-store',
    headers: {
      'Accept': 'text/html,application/rss+xml,application/xml;q=0.9, text/xml;q=0.8, */*;q=0.5',
      'User-Agent': 'Mozilla/5.0 (compatible; AltiusSiteBot/1.0; +https://badm-land-main.vercel.app)'
    }
  })
  return r.text()
}

async function fetchViaProxy(url: string, opts?: { render?: boolean }): Promise<string> {
  const render = opts?.render === undefined ? true : !!opts?.render
  if (SCRAPERAPI_KEY) {
    const proxyUrl = `https://api.scraperapi.com?api_key=${encodeURIComponent(SCRAPERAPI_KEY)}&url=${encodeURIComponent(url)}${render ? '&render=true' : ''}&country=de`
    const r = await fetch(proxyUrl, { cache: 'no-store' })
    return r.text()
  }
  if (SCRAPINGBEE_KEY) {
    const proxyUrl = `https://app.scrapingbee.com/api/v1/?api_key=${encodeURIComponent(SCRAPINGBEE_KEY)}&url=${encodeURIComponent(url)}${render ? '&render_js=true' : '&render_js=false'}`
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
  const isBwf = /(\.|^)bwfbadminton\.com$/i.test(host)
  if (isBwf && (SCRAPERAPI_KEY || SCRAPINGBEE_KEY)) {
    return fetchViaProxy(url, { render: true })
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

function selectBestImage($p: cheerio.CheerioAPI, pageUrl: string): string | undefined {
  const base = pageUrl
  let img = $p('meta[property="og:image"]').attr('content') || ''
  img = normalizeImg(toAbs(base, img)) || ''
  if (!img || isBadImage(img)) {
    const candidates: string[] = []
    const selectors = [
      'article .entry-content img[src]',
      'article img[src]',
      '.news-single img[src]',
      '.wp-block-image img[src]',
      'img[src]'
    ]
    for (const sel of selectors) {
      $p(sel).each((_, el) => {
        const s = $p(el).attr('src') || ''
        const abs = normalizeImg(toAbs(base, s))
        if (abs && !isBadImage(abs)) candidates.push(abs)
      })
      if (candidates.length > 0) break
    }
    if (candidates.length > 0) img = candidates[0]
  }
  return img || undefined
}

function selectPreview($p: cheerio.CheerioAPI): string {
  const meta = ($p('meta[name="description"]').attr('content') || '').trim()
  if (meta) return meta
  const p = ($p('article p').first().text() || $p('p').first().text() || '').trim()
  return p
}

function selectDate($p: cheerio.CheerioAPI): string {
  const dt = ($p('time').first().attr('datetime') || '').trim()
  return dt
}

function selectTitle($p: cheerio.CheerioAPI): string {
  return ($p('meta[property="og:title"]').attr('content') || $p('title').text() || '').trim()
}

function mapArticle($p: cheerio.CheerioAPI, url: string) {
  const title = selectTitle($p)
  const img = selectBestImage($p, url)
  const date = selectDate($p)
  const preview = selectPreview($p)
  return { title, href: url, img, preview, date }
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
    const content = pickCdata(block, 'content:encoded') || description

    if (/news\.google\.com\//i.test(link)) {
      const hrefInDesc = description.match(/href=\"(https?:[^\"]+)\"/i)?.[1]
      if (hrefInDesc) link = decodeURIComponent(hrefInDesc)
    }

    const enclosure = block.match(/<enclosure[^>]+url=["']([^"']+)["']/i)?.[1]
    const mediaContent = block.match(/<media:content[^>]+url=["']([^"']+)["']/i)?.[1]
    const mediaThumb = block.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i)?.[1]
    const mediaGroup = block.match(/<media:group>[\s\S]*?<media:content[^>]+url=["']([^"']+)["']/i)?.[1]
    const img = enclosure || mediaThumb || mediaContent || mediaGroup || extractFirstImageFromContent(content)

    if (title && link) {
      const clean = decodeHtml(stripTags(description)).replace(/\s+/g, ' ').trim()
      list.push({ title, href: link, img, preview: clean.slice(0, 220), date: pubDate })
    }
  }
  return list
}

async function scrapeFromBases(): Promise<Array<{ title: string; href: string; img?: string; preview?: string; date?: string }>> {
  const bases = [
    'https://bwfbadminton.com',
  ]
  const allTargets: string[] = []
  for (const base of bases) {
    try {
      const html = (SCRAPERAPI_KEY || SCRAPINGBEE_KEY) ? await fetchViaProxy(`${base}/news/`, { render: true }) : await fetchViaJina(`${base}/news/`)
      const $ = cheerio.load(html)
      $('a').each((_, a) => {
        const href = $(a).attr('href') || ''
        const abs = href.startsWith('http') ? href : new URL(href, base).href
        if (/\/news\//.test(abs) && !/\/news\/$/.test(abs)) allTargets.push(abs)
      })
    } catch {
      // ignore this base
    }
  }
  const seen = new Set<string>()
  const targets = allTargets.filter(h => {
    if (seen.has(h)) return false
    seen.add(h)
    return true
  }).slice(0, 24)

  const concurrency = 5
  let idx = 0
  const results: any[] = []
  async function worker() {
    while (idx < targets.length) {
      const i = idx++
      const url = targets[i]
      try {
        const page = (SCRAPERAPI_KEY || SCRAPINGBEE_KEY) ? await fetchViaProxy(url, { render: true }) : await fetchViaJina(url)
        if (url.includes('bwfbadminton.com')) {
          const $p = cheerio.load(page)
          const mapped = mapArticle($p, url)
          if (mapped.title) results.push(mapped)
        }
      } catch {
        // ignore this target
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }).map(() => worker()))
  return results
}

async function fetchGoogleNewsUS(): Promise<Array<{ title: string; href: string; img?: string; preview?: string; date?: string }>> {
  const query = 'site:bwfbadminton.com/news when:365d'
  const gUrl = 'https://news.google.com/rss/search?q=' + encodeURIComponent(query) + '&hl=en-US&gl=US&ceid=US:en'
  const gXml = await fetchDirect(gUrl)
  if (!gXml || !gXml.includes('<rss')) return []
  return parseRssItems(gXml)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const bypass = req.query?.refresh === '1'
    if (!bypass && cache && Date.now() - cache.timestamp < TTL_MS) {
      return res.status(200).json({ cached: true, items: cache.data })
    }

    let items: any[] = []

    // 1) Web-scraping official BWF site with JS render
    items = await scrapeFromBases()

    // 2) If still empty, discover via Google (only official links), then scrape
    if (items.length === 0) {
      const gItems = await fetchGoogleNewsUS()
      const links = gItems.map(i => i.href).filter(h => {
        try { const u = new URL(h); return /(^|\.)bwfbadminton\.com$/i.test(u.hostname) } catch { return false }
      }).slice(0, 20)
      for (const link of links) {
        try {
          const page = (SCRAPERAPI_KEY || SCRAPINGBEE_KEY) ? await fetchViaProxy(link, { render: true }) : await fetchViaJina(link)
          const $p = cheerio.load(page)
          const mapped = mapArticle($p, link)
          if (mapped.title) items.push(mapped)
        } catch {}
      }
    }

    const dedupSeen = new Set<string>()
    const dedup = items.filter(it => {
      if (dedupSeen.has(it.href)) return false
      dedupSeen.add(it.href)
      return true
    }).slice(0, 20)

    cache = { timestamp: Date.now(), data: dedup }
    res.status(200).json({ cached: false, items: dedup })
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'failed to fetch' })
  }
}
