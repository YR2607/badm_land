import type { VercelRequest, VercelResponse } from '@vercel/node'
import { load, CheerioAPI } from 'cheerio'

const SCRAPERAPI_KEY = process.env.SCRAPERAPI_KEY
const SCRAPINGBEE_KEY = process.env.SCRAPINGBEE_KEY

function buildProxyUrl(targetUrl: string): string {
  if (SCRAPERAPI_KEY) {
    return `https://api.scraperapi.com?api_key=${encodeURIComponent(SCRAPERAPI_KEY)}&url=${encodeURIComponent(targetUrl)}&country=de&keep_headers=true`
  }
  if (SCRAPINGBEE_KEY) {
    return `https://app.scrapingbee.com/api/v1/?api_key=${encodeURIComponent(SCRAPINGBEE_KEY)}&url=${encodeURIComponent(targetUrl)}&render_js=false&block_resources=false&country_code=de`
  }
  const encoded = targetUrl.replace(/^https?:\/\//, '')
  return `https://r.jina.ai/http://${encoded}`
}

async function fetchHtml(url: string): Promise<string> {
  const r = await fetch(buildProxyUrl(url), {
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Cache-Control': 'no-cache',
    },
    cache: 'no-store',
    redirect: 'follow',
  })
  if (!r.ok) throw new Error(`status_${r.status}`)
  return await r.text()
}

function absolutize(base: string, url?: string | null) {
  if (!url) return ''
  try { return new URL(url, base).toString() } catch { return url }
}

function pickOgImage($: CheerioAPI): string | null {
  const candidates = [
    $('meta[property="og:image"]').attr('content'),
    $('meta[property="og:image:url"]').attr('content'),
    $('meta[name="twitter:image"]').attr('content'),
    $('meta[name="twitter:image:src"]').attr('content'),
    $('link[rel="apple-touch-icon"]').attr('href'),
    $('link[rel="icon"]').attr('href'),
  ].filter(Boolean) as string[]
  return candidates[0] || null
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const url = String(req.query.url || '')
    if (!url) return res.status(400).json({ error: 'url required' })

    // 1) Try original URL (may work if proxy allowed)
    try {
      const html = await fetchHtml(url)
      const $ = load(html)
      const img = pickOgImage($)
      if (img) return res.status(200).json({ url, image: absolutize(url, img), source: 'og' })
    } catch {}

    // 2) Try mobile and basic versions
    const mobiles = [
      url.replace('://www.facebook.com', '://m.facebook.com'),
      url.replace('://www.facebook.com', '://mbasic.facebook.com'),
    ]
    for (const u of mobiles) {
      try {
        const html2 = await fetchHtml(u)
        const $2 = load(html2)
        const img2 = pickOgImage($2) || $2('img').first().attr('src') || ''
        if (img2) return res.status(200).json({ url, image: absolutize(u, img2), source: 'mobile' })
      } catch {}
    }

    return res.status(200).json({ url, image: null })
  } catch (e: any) {
    return res.status(200).json({ url: req.query.url || '', image: null })
  }
}
