import type { VercelRequest, VercelResponse } from '@vercel/node'

// Fetch club news from an external JSON feed (rss.app JSON)
// Env (optional): RSS_APP_FEED_URL

let cache: { ts: number; data: any[] } | null = null
const TTL_MS = 15 * 60 * 1000 // 15 minutes

type FeedItem = {
  id?: string
  url?: string
  title?: string
  image?: string
  date_published?: string
  content_text?: string // Add content_text for full post content
}

function normalize(items: FeedItem[]) {
  return (items || []).map((it) => ({
    id: it.id || it.url || Math.random().toString(36).slice(2),
    // Use content_text for title, or fallback to original title
    title: (it.content_text ? it.content_text.split('\n')[0].trim() : it.title || '').trim(),
    // Use content_text for excerpt, truncating if necessary
    excerpt: (it.content_text || '').substring(0, 220).trim() + ((it.content_text || '').length > 220 ? '...' : ''),
    image: it.image || '',
    date: it.date_published || new Date().toISOString(),
    url: it.url || '#',
    category: 'news',
  }))
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const limit = Number(req.query.limit || 10)
    if (cache && Date.now() - cache.ts < TTL_MS && !req.query.refresh) {
      return res.status(200).json({ cached: true, items: cache.data.slice(0, limit) })
    }

    const FEED_URL = process.env.RSS_APP_FEED_URL || 'https://rss.app/feeds/v1.1/yneQwQdZWmbASmAF.json'
    const r = await fetch(FEED_URL, { cache: 'no-store' })
    if (!r.ok) {
        // If fetching from rss.app fails, attempt to fallback to fb-posts.ts
        // This means we still need api/fb-posts to exist as a fallback
        const fbFallback = await fetch('/api/fb-posts?limit=10', { cache: 'no-store' });
        if (fbFallback.ok) {
            const j = await fbFallback.json();
            const data = (j?.items || []).map((it: any) => ({
                id: it.id,
                title: it.title,
                excerpt: it.excerpt,
                image: it.image,
                date: it.date,
                url: it.url,
                category: 'news',
            }));
            cache = { ts: Date.now(), data };
            return res.status(200).json({ cached: false, items: data.slice(0, limit) });
        }
        return res.status(200).json({ items: [] })
    }
    const j = await r.json()
    const data = normalize((j?.items || []) as FeedItem[])
    cache = { ts: Date.now(), data }
    res.status(200).json({ cached: false, items: data.slice(0, limit) })
  } catch (e) {
    res.status(200).json({ items: [] })
  }
}
