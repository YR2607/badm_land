import type { VercelRequest, VercelResponse } from '@vercel/node'

// Env:
// FB_PAGE_ID: Facebook Page ID (numeric or name)
// FB_ACCESS_TOKEN: Long-lived Page access token

let cache: { ts: number; data: any[] } | null = null
const TTL_MS = 15 * 60 * 1000 // 15 minutes

function normalizePost(p: any) {
  return {
    id: p.id,
    title: (p.message || p.story || '').slice(0, 180),
    excerpt: (p.message || p.story || '').slice(0, 300),
    image: p.full_picture || '',
    date: p.created_time,
    url: p.permalink_url,
    category: 'news'
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const pageId = process.env.FB_PAGE_ID
    const token = process.env.FB_ACCESS_TOKEN
    if (!pageId || !token) {
      return res.status(200).json({ items: [] })
    }
    if (cache && Date.now() - cache.ts < TTL_MS && !req.query.refresh) {
      return res.status(200).json({ cached: true, items: cache.data })
    }
    const fields = [
      'id',
      'message',
      'story',
      'created_time',
      'permalink_url',
      'full_picture'
    ].join(',')
    const limit = Number(req.query.limit || 10)
    const url = `https://graph.facebook.com/v18.0/${encodeURIComponent(pageId)}/posts?fields=${fields}&limit=${limit}&access_token=${encodeURIComponent(token)}`
    const r = await fetch(url, { cache: 'no-store' })
    if (!r.ok) {
      return res.status(200).json({ items: [] })
    }
    const j = await r.json()
    const data = Array.isArray(j?.data) ? j.data.map(normalizePost) : []
    cache = { ts: Date.now(), data }
    res.status(200).json({ cached: false, items: data })
  } catch (e: any) {
    res.status(200).json({ items: [] })
  }
}


