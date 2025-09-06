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
  const isBwf = /(\.|^)bwfbadminton\.com$/i.test(host)
  if (isBwf && (SCRAPERAPI_KEY || SCRAPINGBEE_KEY)) {
    return fetchViaProxy(url)
  }
  return fetchDirect(url)
}

async function scrapeFromBases(): Promise<Array<{ title: string; href: string; img?: string; preview?: string; date?: string }>> {
  const bases = [
    'https://bwfbadminton.com',
    'https://corporate.bwfbadminton.com',
    'https://bwfworldtour.bwfbadminton.com'
  ]
  const allTargets: string[] = []
  for (const base of bases) {
    try {
      const html = (SCRAPERAPI_KEY || SCRAPINGBEE_KEY) ? await fetchText(`${base}/news/`) : await fetchViaJina(`${base}/news/`)
      const $ = cheerio.load(html)
      $('a').each((_, a) => {
        const href = $(a).attr('href') || ''
        const abs = href.startsWith('http') ? href : new URL(href, base).href
        if (/\/news\//.test(abs) && !/\/news\/$/.test(abs)) allTargets.push(abs)
      })
    } catch {
      // ignore
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
        const page = (SCRAPERAPI_KEY || SCRAPINGBEE_KEY) ? await fetchText(url) : await fetchViaJina(url)
        if (!/bwfbadminton\.com/i.test(url)) continue
        if (page.startsWith('Title:')) {
          const title = (page.match(/^Title:\s*(.*)$/m)?.[1] || '').trim()
          const img = page.match(/https?:[^\s')"]+\.(?:jpg|jpeg|png|webp)/i)?.[0]
          const preview = (page.match(/\n\n([^\n].{40,200})/s)?.[1] || '').replace(/\s+/g, ' ').trim()
          const date = ''
          if (title) results.push({ title, href: url, img, preview, date })
        } else {
          const $p = cheerio.load(page)
          const title = ($p('meta[property="og:title"]').attr('content') || $p('title').text() || '').trim()
          const img = $p('meta[property="og:image"]').attr('content') || $p('img').first().attr('src')
          const date = $p('time').first().attr('datetime') || ''
          const preview = ($p('meta[name="description"]').attr('content') || $p('p').first().text() || '').trim()
          if (title) results.push({ title, href: url, img, preview, date })
        }
      } catch {
        // ignore
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }).map(() => worker()))
  return results
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const bypass = req.query?.refresh === '1'
    if (!bypass && cache && Date.now() - cache.timestamp < TTL_MS) {
      return res.status(200).json({ cached: true, items: cache.data })
    }

    const items = await scrapeFromBases()

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
