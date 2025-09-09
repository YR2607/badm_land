import type { VercelRequest, VercelResponse } from '@vercel/node'
import { load, CheerioAPI } from 'cheerio'

let cache: Record<string, { ts: number; image?: string | null }> = {}
const TTL_MS = 60 * 60 * 1000 // 1 hour

const pickImage = ($: CheerioAPI) => {
  const candidates: string[] = []
  const meta = (name: string, attr = 'content') => $(`meta[${name}]`).attr(attr) || ''
  const push = (v?: string) => { if (v) candidates.push(v) }
  // og / twitter images
  push($('meta[property="og:image"]').attr('content'))
  push($('meta[property="og:image:url"]').attr('content'))
  push($('meta[name="twitter:image"]').attr('content'))
  push($('meta[name="twitter:image:src"]').attr('content'))
  // apple touch icon / icon
  push($('link[rel="apple-touch-icon"]').attr('href'))
  push($('link[rel="icon"]').attr('href'))
  // first image on page as last resort
  push($('img').first().attr('src'))
  return candidates.find(Boolean) || null
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const url = String(req.query.url || '')
    if (!url) return res.status(400).json({ error: 'url is required' })

    const cached = cache[url]
    if (cached && Date.now() - cached.ts < TTL_MS && !req.query.refresh) {
      return res.status(200).json({ url, image: cached.image || null, cached: true })
    }

    const r = await fetch(url, {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; AltiusBot/1.0; +https://example.com)'
      },
      cache: 'no-store',
      redirect: 'follow',
    })
    if (!r.ok) {
      cache[url] = { ts: Date.now(), image: null }
      return res.status(200).json({ url, image: null })
    }
    const html = await r.text()
    const $ = load(html)
    let img = pickImage($)

    // Resolve relative URLs
    if (img) {
      try {
        const u = new URL(img, url)
        img = u.toString()
      } catch {
        // ignore
      }
    }

    cache[url] = { ts: Date.now(), image: img || null }
    return res.status(200).json({ url, image: img || null })
  } catch (e: any) {
    return res.status(200).json({ url: req.query.url || '', image: null })
  }
}
