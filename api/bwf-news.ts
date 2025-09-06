import type { VercelRequest, VercelResponse } from '@vercel/node'

let cache: { timestamp: number; data: any[] } | null = null
const TTL_MS = 10 * 60 * 1000

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
  const mediaMatch = content.match(/<media:content[^>]+url=["']([^"']+)["']/i)
  if (mediaMatch && mediaMatch[1]) return mediaMatch[1]
  return undefined
}

async function fetchText(url: string): Promise<string> {
  const r = await fetch(url, {
    cache: 'no-store',
    headers: {
      'Accept': 'application/rss+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.5',
      'User-Agent': 'Mozilla/5.0 (compatible; AltiusSiteBot/1.0; +https://badm-land-main.vercel.app)'
    }
  })
  return r.text()
}

function parseRssItems(xml: string): Array<{ title: string; href: string; img?: string; preview?: string; date?: string }> {
  const list: Array<{ title: string; href: string; img?: string; preview?: string; date?: string }> = []
  const blocks = xml.split(/<item>/i).slice(1)
  for (const raw of blocks) {
    const block = raw.split(/<\/item>/i)[0]
    const pick = (tag: string) => {
      const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i'))
      return m ? m[1].trim() : ''
    }
    const pickCdata = (tag: string) => {
      const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i'))
      if (!m) return ''
      const val = m[1]
      const cdata = val.match(/<!\[CDATA\[([\s\S]*?)\]\]>/)
      return (cdata ? cdata[1] : val).trim()
    }

    const rawTitle = pickCdata('title') || pick('title')
    const title = decodeHtml(stripTags(rawTitle))
    const link = decodeHtml(stripTags(pick('link')))
    const pubDate = decodeHtml(stripTags(pick('pubDate')))
    const description = pickCdata('description')
    const content = pickCdata('content:encoded') || description
    const enclosure = block.match(/<enclosure[^>]+url=["']([^"']+)["']/i)?.[1]
    const media = block.match(/<media:content[^>]+url=["']([^"']+)["']/i)?.[1]
    const img = enclosure || media || extractFirstImageFromContent(content)

    if (title && link) {
      const clean = decodeHtml(stripTags(description)).replace(/\s+/g, ' ').trim()
      list.push({ title, href: link, img, preview: clean.slice(0, 220), date: pubDate })
    }
  }
  return list
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const bypass = req.query?.refresh === '1'
    const forceGoogle = req.query?.google === '1' || req.query?.source === 'google'
    if (!bypass && !forceGoogle && cache && Date.now() - cache.timestamp < TTL_MS) {
      return res.status(200).json({ cached: true, items: cache.data })
    }

    // Primary: Google News RSS
    const gUrl = 'https://news.google.com/rss/search?q=' + encodeURIComponent('site:bwfbadminton.com') + '&hl=ru&gl=RU&ceid=RU:ru'
    const gXml = await fetchText(gUrl)
    if (req.query?.debug === '1' && forceGoogle) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      return res.status(200).send(gXml.slice(0, 20000))
    }
    let items = parseRssItems(gXml)

    // Fallback: BWF RSS if Google empty
    if (items.length === 0 || forceGoogle === false) {
      const bwfXml = await fetchText('https://bwfbadminton.com/feed/')
      if (req.query?.debug === '1' && !forceGoogle) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        return res.status(200).send(bwfXml.slice(0, 20000))
      }
      if (bwfXml && (bwfXml.includes('<rss') || bwfXml.includes('<feed') || bwfXml.includes('<channel>'))) {
        const bwfItems = parseRssItems(bwfXml)
        if (bwfItems.length > 0) items = bwfItems
      }
    }

    const dedupSeen = new Set<string>()
    const dedup = items.filter(it => {
      if (dedupSeen.has(it.href)) return false
      dedupSeen.add(it.href)
      return true
    }).slice(0, 24)

    if (dedup.length > 0) {
      cache = { timestamp: Date.now(), data: dedup }
    }

    res.status(200).json({ cached: false, items: dedup })
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'failed to fetch rss' })
  }
}
