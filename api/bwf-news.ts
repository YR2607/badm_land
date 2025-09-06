import type { VercelRequest, VercelResponse } from '@vercel/node'
import * as cheerio from 'cheerio'

let cache: { timestamp: number; data: any[] } | null = null
const TTL_MS = 10 * 60 * 1000

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (cache && Date.now() - cache.timestamp < TTL_MS) {
      return res.status(200).json({ cached: true, items: cache.data })
    }

    const url = 'https://bwfbadminton.com/news/'
    const html = await fetch(url).then(r => r.text())
    const $ = cheerio.load(html)

    const items: any[] = []

    // Подстраховка под возможные разметки
    $('article, .news-card, .post, .c-article').each((_, el) => {
      const root = $(el)
      const linkEl = root.find('a').first()
      const href = linkEl.attr('href') || ''
      const title = root.find('h2, h3').first().text().trim() || linkEl.attr('title') || ''
      const img = root.find('img').first().attr('src') || root.find('img').first().attr('data-src') || ''
      const preview = root.find('p').first().text().trim()
      const date = root.find('time').first().attr('datetime') || root.find('.date, .c-article__meta').first().text().trim()

      if (href && title) {
        items.push({ title, href: href.startsWith('http') ? href : new URL(href, url).href, img, preview, date })
      }
    })

    // Фолбэк: если статей мало, ищем альтернативные карточки
    if (items.length < 5) {
      $('.c-article-list a').each((_, a) => {
        const href = $(a).attr('href') || ''
        const title = $(a).find('h3, h2').text().trim() || $(a).attr('title') || ''
        const img = $(a).find('img').attr('src') || ''
        if (href && title) items.push({ title, href: href.startsWith('http') ? href : new URL(href, url).href, img })
      })
    }

    // Дедупликация по ссылке
    const seen = new Set<string>()
    const dedup = items.filter(it => {
      if (seen.has(it.href)) return false
      seen.add(it.href)
      return true
    }).slice(0, 24)

    cache = { timestamp: Date.now(), data: dedup }
    res.status(200).json({ cached: false, items: dedup })
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'failed to parse' })
  }
}
