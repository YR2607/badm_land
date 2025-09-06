import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as cheerio from 'cheerio'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'dev-bwf-api',
      configureServer(server) {
        server.middlewares.use('/api/bwf-news', async (req, res) => {
          try {
            const url = 'https://bwfbadminton.com/news/'
            const html = await fetch(url).then(r => r.text())
            const $ = cheerio.load(html)
            const items = []

            $('article, .news-card, .post, .c-article').each((_, el) => {
              const root = $(el)
              const linkEl = root.find('a').first()
              const href = linkEl.attr('href') || ''
              const title = root.find('h2, h3').first().text().trim() || linkEl.attr('title') || ''
              const img = root.find('img').first().attr('src') || root.find('img').first().attr('data-src') || ''
              const preview = root.find('p').first().text().trim()
              const date = root.find('time').first().attr('datetime') || root.find('.date, .c-article__meta').first().text().trim()
              if (href && title) items.push({ title, href: href.startsWith('http') ? href : new URL(href, url).href, img, preview, date })
            })

            if (items.length < 5) {
              $('.c-article-list a').each((_, a) => {
                const href = $(a).attr('href') || ''
                const title = $(a).find('h3, h2').text().trim() || $(a).attr('title') || ''
                const img = $(a).find('img').attr('src') || ''
                if (href && title) items.push({ title, href: href.startsWith('http') ? href : new URL(href, url).href, img })
              })
            }

            const seen = new Set()
            const dedup = items.filter(it => {
              if (seen.has(it.href)) return false
              seen.add(it.href)
              return true
            }).slice(0, 24)

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ cached: false, items: dedup }))
          } catch (e) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: e?.message || 'failed' }))
          }
        })
      }
    }
  ],
  server: {
    port: 3000,
    open: true
  }
})
