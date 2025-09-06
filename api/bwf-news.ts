import type { VercelRequest, VercelResponse } from '@vercel/node'

let cache: { timestamp: number; data: any[] } | null = null
const TTL_MS = 10 * 60 * 1000

function extractFirstImageFromContent(content: string): string | undefined {
  if (!content) return undefined
  // Try <img src="...">
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i)
  if (imgMatch && imgMatch[1]) return imgMatch[1]
  // Try og:image or media:content
  const mediaMatch = content.match(/<media:content[^>]+url=["']([^"']+)["']/i)
  if (mediaMatch && mediaMatch[1]) return mediaMatch[1]
  return undefined
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (cache && Date.now() - cache.timestamp < TTL_MS) {
      return res.status(200).json({ cached: true, items: cache.data })
    }

    const feedUrl = 'https://bwfbadminton.com/feed/'
    const xml = await fetch(feedUrl, { headers: { 'Accept': 'application/rss+xml, application/xml;q=0.9' } }).then(r => r.text())

    // Basic RSS parse without extra deps
    const items: any[] = []
    const itemBlocks = xml.split('<item>').slice(1)
    for (const raw of itemBlocks) {
      const block = raw.split('</item>')[0]
      const pick = (tag: string) => {
        const m = block.match(new RegExp(`<${tag}>([\s\S]*?)</${tag}>`, 'i'))
        return m ? m[1].trim() : ''
      }
      const pickCdata = (tag: string) => {
        const m = block.match(new RegExp(`<${tag}>([\s\S]*?)</${tag}>`, 'i'))
        if (!m) return ''
        const val = m[1]
        const cdata = val.match(/<!\[CDATA\[([\s\S]*?)\]\]>/)
        return (cdata ? cdata[1] : val).trim()
      }

      const title = pickCdata('title') || pick('title')
      const link = pick('link')
      const pubDate = pick('pubDate')
      const description = pickCdata('description')
      const content = pickCdata('content:encoded') || description
      const enclosure = block.match(/<enclosure[^>]+url=["']([^"']+)["']/i)?.[1]
      const media = block.match(/<media:content[^>]+url=["']([^"']+)["']/i)?.[1]
      const img = enclosure || media || extractFirstImageFromContent(content)

      if (title && link) {
        items.push({ title, href: link, img, preview: description.replace(/<[^>]*>/g, '').slice(0, 240), date: pubDate })
      }
    }

    const dedupSeen = new Set<string>()
    const dedup = items.filter(it => {
      if (dedupSeen.has(it.href)) return false
      dedupSeen.add(it.href)
      return true
    }).slice(0, 24)

    cache = { timestamp: Date.now(), data: dedup }
    res.status(200).json({ cached: false, items: dedup })
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'failed to fetch rss' })
  }
}
