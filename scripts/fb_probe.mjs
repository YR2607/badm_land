#!/usr/bin/env node
// Quick probe: fetch Club News from Facebook mobile site using proxy keys and report counts
// Usage: node scripts/fb_probe.mjs --page 61562124174747 --limit 100 --depth 25

import * as cheerio from 'cheerio'

const args = Object.fromEntries(process.argv.slice(2).map(a => {
  const m = a.match(/^--([^=]+)=(.*)$/)
  if (m) return [m[1], m[2]]
  if (a.startsWith('--')) return [a.replace(/^--/, ''), true]
  return [a, true]
}))

const PAGE_ID = args.page || process.env.FB_PAGE_ID || '61562124174747'
const LIMIT = Math.max(1, Math.min(500, Number(args.limit || 100)))
const DEPTH = Math.max(1, Math.min(50, Number(args.depth || 25)))
const SCRAPERAPI_KEY = process.env.SCRAPERAPI_KEY || ''
const SCRAPINGBEE_KEY = process.env.SCRAPINGBEE_KEY || ''

function normText(t) { return (t || '').replace(/\s+/g, ' ').trim() }
function absolutize(url) { if (!url) return ''; if (url.startsWith('http')) return url; return `https://m.facebook.com${url.startsWith('/') ? '' : '/'}${url}` }
function normalizeImg(url='') { return url.replace(/-\d+x\d+\.(jpg|jpeg|png|webp)$/i, '.$1') }
function toAbs(base, src) { if (!src) return ''; try { return new URL(src, base).href } catch { return '' } }

async function fetchDirect(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AltiusProbe/1.0)' } })
  return await r.text()
}

async function fetchViaProxy(url, render=false) {
  if (SCRAPERAPI_KEY) {
    const proxyUrl = `https://api.scraperapi.com?api_key=${encodeURIComponent(SCRAPERAPI_KEY)}&url=${encodeURIComponent(url)}${render ? '&render=true' : ''}&country=de`
    const r = await fetch(proxyUrl)
    return await r.text()
  }
  if (SCRAPINGBEE_KEY) {
    const proxyUrl = `https://app.scrapingbee.com/api/v1/?api_key=${encodeURIComponent(SCRAPINGBEE_KEY)}&url=${encodeURIComponent(url)}${render ? '&render_js=true' : '&render_js=false'}`
    const r = await fetch(proxyUrl)
    return await r.text()
  }
  // Try direct last
  return await fetchDirect(url)
}

function isEventLike(text) {
  const t = (text || '').toLowerCase()
  const keys = ['турнир','турнір','соревнован','чемпионат','чемпіонат','кубок','лига','ліга','матч','open','cup','championship','league','match','event','tournament']
  return keys.some(k => t.includes(k))
}

async function scrapeMobile(pageId, limit, depth) {
  const candidates = [
    `https://m.facebook.com/profile.php?id=${encodeURIComponent(pageId)}&v=timeline`,
    `https://m.facebook.com/${encodeURIComponent(pageId)}/posts`,
    `https://mbasic.facebook.com/profile.php?id=${encodeURIComponent(pageId)}&v=timeline`,
  ]
  let html = ''
  for (const u of candidates) {
    try { html = await fetchViaProxy(u, false); if (html) break } catch {}
  }
  if (!html) return []

  const out = []
  const seen = new Set()
  for (let page = 0; page < depth && out.length < limit; page++) {
    const $ = cheerio.load(html)
    $('a[href]').each((_, a) => {
      const hrefRaw = ($(a).attr('href') || '').trim()
      if (!/(story\.php|permalink\.php|\/posts\/)/.test(hrefRaw)) return
      const url = absolutize(hrefRaw)
      if (!url || seen.has(url)) return
      seen.add(url)
      const container = $(a).closest('article, div')
      const text = normText(container.text())
      const img = (container.find('img').first().attr('src') || '')
      const dateText = (container.find('abbr, time').first().text() || '').trim()
      out.push({
        title: text.slice(0, 160),
        url,
        image: normalizeImg(toAbs(url, img)),
        date: dateText,
        excerpt: text.slice(0, 220),
      })
    })
    if (out.length >= limit) break
    const next = $('a:contains("See more"), a:contains("See More Posts"), a:contains("Показать"), a:contains("Показать ещё")').first().attr('href')
    if (!next) break
    try { html = await fetchViaProxy(absolutize(next), false) } catch { break }
  }
  return out.slice(0, limit)
}

const items = await scrapeMobile(PAGE_ID, LIMIT, DEPTH)
const events = items.filter(i => isEventLike(`${i.title} ${i.excerpt}`))
const news = items.filter(i => !events.includes(i))

console.log('Probe results:')
console.log('Total fetched:', items.length)
console.log('Club news (heuristic):', news.length)
console.log('Events (heuristic):', events.length)
console.log('\nSample:')
for (const it of items.slice(0, 5)) console.log('-', it.title.slice(0,120))
