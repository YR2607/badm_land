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
  const isBwf = /(^|\.)bwfbadminton\.com$/i.test(new URL(url).hostname)
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
    const link = decodeHtml(stripTags(pickTag(block, 'link')))
    const pubDate = decodeHtml(stripTags(pickTag(block, 'pubDate')))
    const description = pickCdata(block, 'description')
    const content = pickCdata(block, 'content:encoded') || description

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

async function scrapeNewsList(): Promise<Array<{ title: string; href: string; img?: string; preview?: string; date?: string }>> {
  const base = 'https://bwfbadminton.com'
  const html = (SCRAPERAPI_KEY || SCRAPINGBEE_KEY)
    ? await fetchText(`${base}/news/`)
    : await fetchViaJina(`${base}/news/`)
  const $ = cheerio.load(html)
  const links: string[] = []

  $('article a, .c-article a, .news-card a, a').each((_, a) => {
    const href = $(a).attr('href') || ''
    const abs = href.startsWith('http') ? href : new URL(href, base).href
    if (abs.includes('/news/')) links.push(abs)
  })

  const seen = new Set<string>()
  const targets = links.filter(h => {
    if (seen.has(h)) return false
    seen.add(h)
    return true
  }).slice(0, 24)

  const concurrency = 4
  let idx = 0
  const results: any[] = []
  async function worker() {
    while (idx < targets.length) {
      const i = idx++
      const url = targets[i]
      try {
        const page = (SCRAPERAPI_KEY || SCRAPINGBEE_KEY) ? await fetchText(url) : await fetchViaJina(url)
        if (url.includes('bwfbadminton.com')) {
          if (page.startsWith('Title:')) {
            const title = (page.match(/^Title:\s*(.*)$/m)?.[1] || '').trim()
            const img = page.match(/https?:[^\s')"]+\.(?:jpg|jpeg|png|webp)/i)?.[0]
            const preview = (page.match(/\n\n([^\n].{40,200})/s)?.[1] || '').replace(/\s+/g, ' ').trim()
            if (title) results.push({ title, href: url, img, preview, date: '' })
          } else {
            const $p = cheerio.load(page)
            const title = ($p('meta[property="og:title"]').attr('content') || $p('title').text() || '').trim()
            const img = $p('meta[property="og:image"]').attr('content') || $p('img').first().attr('src')
            const date = $p('time').first().attr('datetime') || ''
            const preview = ($p('meta[name="description"]').attr('content') || $p('p').first().text() || '').trim()
            if (title) results.push({ title, href: url, img, preview, date })
          }
        }
      } catch {
        // ignore
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }).map(() => worker()))
  return results
}

async function fetchNitterTweets(): Promise<Array<{ title: string; href: string; img?: string; preview?: string; date?: string }>> {
  const hosts = [
    'https://nitter.net',
    'https://nitter.fdn.fr',
    'https://nitter.poast.org',
    'https://ntrqq.com'
  ]
  for (const host of hosts) {
    try {
      const xml = await fetchDirect(`${host}/bwfmedia/rss`)
      if (!xml || (!xml.includes('<rss') && !xml.includes('<channel>'))) continue
      const items = parseRssItems(xml).map(it => {
        const xLink = it.href.replace(/^https?:\/\/[^/]+/i, 'https://x.com')
        return { ...it, href: xLink }
      })
      if (items.length > 0) return items
    } catch {
      continue
    }
  }
  return []
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const bypass = req.query?.refresh === '1'
    const forceGoogle = req.query?.google === '1' || req.query?.source === 'google'
    const debug = req.query?.debug === '1'

    if (!bypass && !forceGoogle && cache && Date.now() - cache.timestamp < TTL_MS) {
      return res.status(200).json({ cached: true, items: cache.data })
    }

    // Primary: BWF News feed
    const bwfNewsUrl = 'https://bwfbadminton.com/news/feed/'
    const bwfXml = await fetchText(bwfNewsUrl)
    if (debug && !forceGoogle) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      return res.status(200).send(bwfXml.slice(0, 20000))
    }
    let items: any[] = []
    if (bwfXml && (bwfXml.includes('<rss') || bwfXml.includes('<channel>'))) {
      items = parseRssItems(bwfXml)
    }

    // Fallbacks: root feed, Google (recent), HTML scraping, X via Nitter
    if (items.length === 0) {
      const rootXml = await fetchText('https://bwfbadminton.com/feed/')
      if (rootXml && (rootXml.includes('<rss') || rootXml.includes('<channel>'))) {
        items = parseRssItems(rootXml)
      }
    }
    if (items.length === 0 || forceGoogle) {
      const query = 'site:bwfbadminton.com/news when:180d -site:shuttletime.bwfbadminton.com'
      const gUrl = 'https://news.google.com/rss/search?q=' + encodeURIComponent(query) + '&hl=ru&gl=RU&ceid=RU:ru'
      const gXml = await fetchDirect(gUrl)
      const gItems = parseRssItems(gXml)
      if (gItems.length > 0) items = gItems
    }
    if (items.length === 0) {
      try {
        const scraped = await scrapeNewsList()
        if (scraped.length > 0) items = scraped
      } catch {
        // ignore
      }
    }
    if (items.length === 0) {
      // Finally: X via Nitter (no keys)
      const tweets = await fetchNitterTweets()
      if (tweets.length > 0) items = tweets
    }

    const dedupSeen = new Set<string>()
    const dedup = items.filter(it => {
      if (dedupSeen.has(it.href)) return false
      dedupSeen.add(it.href)
      return true
    }).slice(0, 20)

    if (dedup.length > 0) {
      cache = { timestamp: Date.now(), data: dedup }
    }

    res.status(200).json({ cached: false, items: dedup })
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'failed to fetch' })
  }
}
