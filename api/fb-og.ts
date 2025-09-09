import type { VercelRequest, VercelResponse } from '@vercel/node'

// Attempts to resolve a thumbnail image for a given Facebook permalink using Graph oEmbed endpoints.
// Requires FB_ACCESS_TOKEN (app or page token). If missing or call fails, returns { image: null }.

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const url = String(req.query.url || '')
    if (!url) return res.status(400).json({ error: 'url is required' })

    const token = process.env.FB_ACCESS_TOKEN
    if (!token) return res.status(200).json({ url, image: null, reason: 'no_token' })

    const isVideo = /\/videos\//i.test(url)
    const endpoint = isVideo ? 'oembed_video' : 'oembed_post'
    const api = `https://graph.facebook.com/v18.0/${endpoint}?url=${encodeURIComponent(url)}&access_token=${encodeURIComponent(token)}`

    const r = await fetch(api, { cache: 'no-store' })
    if (!r.ok) {
      return res.status(200).json({ url, image: null, reason: `status_${r.status}` })
    }
    const j = await r.json()
    // FB oembed may return thumbnail_url for videos; for posts it's inconsistent
    const img: string | undefined = j?.thumbnail_url || j?.author_photo || null
    return res.status(200).json({ url, image: img || null })
  } catch (e: any) {
    return res.status(200).json({ url: req.query.url || '', image: null })
  }
}
