import type { VercelRequest, VercelResponse } from '@vercel/node'
import * as cheerio from 'cheerio'

let cache: { ts: number; data: any[] } | null = null
const TTL_MS = 10 * 60 * 1000

const SCRAPERAPI_KEY = process.env.SCRAPERAPI_KEY
const SCRAPINGBEE_KEY = process.env.SCRAPINGBEE_KEY

function normalizeItem(p: any) {
  return {
    id: p.id || p.url,
    title: (p.title || p.message || p.story || '').slice(0, 180),
    excerpt: (p.excerpt || p.message || p.story || '').slice(0, 300),
    image: p.image || p.full_picture || '',
    date: p.date || p.created_time,
    url: p.url || p.permalink_url,
    category: 'news',
  }
}

function toAbs(base: string, src?: string) {
  if (!src) return ''
  try { return new URL(src, base).href } catch { return '' }
}

function normalizeImg(url?: string) {
  if (!url) return ''
  return url.replace(/-\d+x\d+\.(jpg|jpeg|png|webp)$/i, '.$1')
}

async function fetchDirect(url: string): Promise<string> {
  const r = await fetch(url, { cache: 'no-store', headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AltiusSiteBot/1.0; +https://badm-land-main.vercel.app)' } })
  return r.text()
}

async function fetchViaProxy(url: string, render = false): Promise<string> {
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
  const u = new URL(url)
  return fetchDirect(`https://r.jina.ai/http://${u.host}${u.pathname}${u.search}`)
}

async function fetchGraph(pageId: string, limit: number): Promise<any[]> {
  const token = process.env.FB_ACCESS_TOKEN
  if (!token) return []
  const fields = ['id','message','story','created_time','permalink_url','full_picture'].join(',')
  const url = `https://graph.facebook.com/v18.0/${encodeURIComponent(pageId)}/posts?fields=${fields}&limit=${limit}&access_token=${encodeURIComponent(token)}`
  try {
    const r = await fetch(url, { cache: 'no-store' })
    if (!r.ok) return []
    const j = await r.json()
    const arr = Array.isArray(j?.data) ? j.data : []
    return arr.map((p: any) => normalizeItem(p))
  } catch { return [] }
}

function absolutize(url: string): string { if (!url) return ''; if (url.startsWith('http')) return url; return `https://m.facebook.com${url.startsWith('/') ? '' : '/'}${url}` }

function normText(text: string) { return (text || '').replace(/\s+/g, ' ').replace(/See more|Показать полностью|Подробнее/gi,' ').trim() }

function toIso(dateText: string) { const d = new Date(dateText); return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString() }

async function scrapeMobile(pageId: string, limit: number): Promise<any[]> {
  const candidates = [
    `https://m.facebook.com/profile.php?id=${encodeURIComponent(pageId)}&v=timeline`,
    `https://m.facebook.com/${encodeURIComponent(pageId)}/posts`,
    `https://mbasic.facebook.com/profile.php?id=${encodeURIComponent(pageId)}&v=timeline`,
  ]
  let html = ''
  for (const u of candidates) {
    try { html = await fetchViaProxy(u, false); break } catch { continue }
  }
  if (!html) return []

  const out: any[] = []
  const seen = new Set<string>()
  for (let page = 0; page < 12 && out.length < limit; page++) {
    const $ = cheerio.load(html)
    $('a[href]').each((_, a) => {
      const hrefRaw = ($(a).attr('href') || '').trim()
      if (!/(story\.php|permalink\.php|\/posts\/)/.test(hrefRaw)) return
      const url = absolutize(hrefRaw)
      if (!url || seen.has(url)) return
      seen.add(url)
      const container = $(a).closest('article, div')
      const text = normText(container.text())
      const img = (container.find('img').first().attr('src') as string) || ''
      const dateText = (container.find('abbr, time').first().text() || '').trim()
      out.push(normalizeItem({
        id: url,
        title: text.slice(0, 140),
        excerpt: text.slice(0, 220),
        image: normalizeImg(toAbs(url, img)),
        date: toIso(dateText),
        permalink_url: url,
      }))
    })
    if (out.length >= limit) break
    const next = $('a:contains("See more"), a:contains("See More Posts"), a:contains("Показать"), a:contains("Показать ещё")').first().attr('href') as string
    if (!next) break
    try { html = await fetchViaProxy(absolutize(next), false) } catch { break }
  }
  return out.slice(0, limit)
}

async function fetchRssApp(limit: number): Promise<any[]> {
  const FEED_URL = process.env.RSS_APP_FEED_URL || 'https://rss.app/feeds/v1.1/yneQwQdZWmbASmAF.json'
  try {
    const r = await fetch(FEED_URL, { cache: 'no-store' })
    if (!r.ok) return []
    const j = await r.json()
    return (j?.items || []).slice(0, limit).map((it: any) => normalizeItem({
      id: it.id || it.url,
      title: it.title,
      excerpt: (it.content_text || '').slice(0, 220),
      image: it.image,
      date: it.date_published,
      permalink_url: it.url,
    }))
  } catch { return [] }
}

function isEventLike(text: string): boolean {
  const t = (text || '').toLowerCase()
  const keys = [
    'турнир','турнір','соревнован','чемпионат','чемпіонат','кубок','лига','ліга','матч','расписан','регистрац','запис',
    'тур','open','cup','championship','league','match','schedule','registration','event','tournament','start at','starts','даты','календарь'
  ]
  return keys.some(k => t.includes(k))
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const pageId = process.env.FB_PAGE_ID || '61562124174747'
    const limit = Math.max(1, Math.min(50, Number(req.query.limit || 12)))
    const wantEvents = String(req.query.type || '').toLowerCase() === 'events'
    const bypass = req.query.refresh === '1'

    if (!bypass && cache && Date.now() - cache.ts < TTL_MS) {
      let data = cache.data.slice()
      if (wantEvents) data = data.filter((it: any) => isEventLike(`${it.title} ${it.excerpt}`))
      data = data.sort((a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()).slice(0, limit)
      return res.status(200).json({ cached: true, items: data })
    }

    let items: any[] = []
    try { items = await fetchGraph(pageId, limit * 2) } catch {}
    if (items.length < limit) {
      try {
        const rss = await fetchRssApp(limit * 2)
        const seen = new Set(items.map(i => i.url))
        for (const it of rss) { if (!seen.has(it.url)) { items.push(it); seen.add(it.url) } }
      } catch {}
      if (items.length < limit) {
        try {
          const mob = await scrapeMobile(pageId, limit * 2)
          const seen = new Set(items.map(i => i.url))
          for (const it of mob) { if (!seen.has(it.url)) { items.push(it); seen.add(it.url) } }
        } catch {}
      }
    }

    items = items.filter(it => it && it.url).sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
    cache = { ts: Date.now(), data: items.slice(0, 100) }

    let out = items.slice()
    if (wantEvents) out = out.filter(it => isEventLike(`${it.title} ${it.excerpt}`))
    out = out.slice(0, limit)

    res.status(200).json({ cached: false, items: out })
  } catch (e: any) {
    res.status(200).json({ items: [] })
  }
}
