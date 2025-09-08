const cheerio = require('cheerio')

const PAGE_ID = process.env.FB_PAGE_ID || '61562124174747'
const LIMIT = Number(process.env.LIMIT || 10)

function absolutize(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `https://m.facebook.com${url.startsWith('/') ? '' : '/'}${url}`
}

function proxyUrl(targetUrl) {
  const encoded = targetUrl.replace(/^https?:\/\//, '')
  return `https://r.jina.ai/http://${encoded}`
}

function toIso(dateText) {
  const d = new Date(dateText)
  if (!isNaN(d.getTime())) return d.toISOString()
  return new Date().toISOString()
}

function normalizeTitleAndExcerpt(text) {
  const clean = (text || '').replace(/\s+/g, ' ').trim()
  if (!clean) return { title: '', excerpt: '' }
  const firstSentence = clean.split('. ')[0] || clean
  const firstLine = clean.split('\n')[0] || clean
  const base = (firstSentence.length >= 10 ? firstSentence : firstLine) || clean
  const title = base.slice(0, 120)
  const excerpt = clean.length > 220 ? clean.slice(0, 220) + '...' : clean
  return { title: title.trim(), excerpt }
}

async function fetchHtmlRaw(url) {
  const r = await fetch(proxyUrl(url), {
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Cache-Control': 'no-cache',
    },
    cache: 'no-store',
  })
  if (!r.ok) throw new Error(`Failed to fetch ${url}: ${r.status}`)
  return await r.text()
}

async function fetchHtmlForPage(pageId) {
  const candidates = [
    `https://m.facebook.com/profile.php?id=${encodeURIComponent(pageId)}&v=timeline`,
    `https://m.facebook.com/${encodeURIComponent(pageId)}/posts`,
    `https://mbasic.facebook.com/profile.php?id=${encodeURIComponent(pageId)}&v=timeline`,
  ]
  let lastErr = null
  for (const u of candidates) {
    try {
      return await fetchHtmlRaw(u)
    } catch (e) {
      lastErr = e
      continue
    }
  }
  throw lastErr || new Error('failed to fetch facebook page')
}

function parseList(html) {
  const $ = cheerio.load(html)
  const items = []
  $('a[href]').each((_, a) => {
    const hrefRaw = ($(a).attr('href') || '').trim()
    if (!/(story\.php|permalink\.php|\/posts\/)/.test(hrefRaw)) return
    const href = absolutize(hrefRaw)
    if (!href) return
    const container = $(a).closest('article, div')
    const text = container.text().replace(/See more|Показать полностью|Подробнее/gi, ' ').trim()
    let img = ''
    const imgNode = container.find('img').first()
    if (imgNode && imgNode.attr('src')) img = imgNode.attr('src')
    const dateText = container.find('abbr, time').first().text().trim()
    items.push({ href, text, image: img, date: dateText })
  })
  const seen = new Set()
  return items.filter(it => { if (seen.has(it.href)) return false; seen.add(it.href); return true })
}

;(async () => {
  try {
    const html = await fetchHtmlForPage(PAGE_ID)
    const list = parseList(html)
    const normalized = list.slice(0, Math.max(5, LIMIT * 2)).map((it) => {
      const { title, excerpt } = normalizeTitleAndExcerpt(it.text || '')
      return {
        id: it.href,
        title: title || 'Пост Facebook',
        excerpt,
        image: it.image || '',
        date: toIso(it.date || ''),
        url: it.href,
      }
    })
    const unique = []
    const seen = new Set()
    for (const n of normalized) {
      if (seen.has(n.url)) continue
      seen.add(n.url)
      unique.push(n)
      if (unique.length >= LIMIT) break
    }
    console.log(JSON.stringify({ count: unique.length, items: unique.slice(0, 3) }, null, 2))
  } catch (e) {
    console.error('TEST_FB_RSS_ERROR:', e.message || e)
    process.exit(1)
  }
})();
