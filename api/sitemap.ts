import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@sanity/client'

const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID
const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || 'production'
const apiVersion = process.env.VITE_SANITY_API_VERSION || process.env.SANITY_API_VERSION || '2024-01-01'

const client = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : null

const STATIC_PAGES = [
  { loc: 'https://altius.md/', priority: '1.0', changefreq: 'daily' },
  { loc: 'https://altius.md/about', priority: '0.9', changefreq: 'monthly' },
  { loc: 'https://altius.md/services', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://altius.md/gyms', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://altius.md/gyms/malaya-malian-24', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://altius.md/gyms/31-avgusta-1989', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://altius.md/gyms/ion-creanga-1', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://altius.md/gallery', priority: '0.7', changefreq: 'weekly' },
  { loc: 'https://altius.md/blog', priority: '0.8', changefreq: 'daily' },
  { loc: 'https://altius.md/contact', priority: '0.8', changefreq: 'monthly' },
]

const HREFLANGS = ['ru', 'en', 'ro', 'x-default']

function urlEntry(loc: string, priority: string, changefreq: string, lastmod?: string): string {
  const hreflangs = HREFLANGS.map(h =>
    `    <xhtml:link rel="alternate" hreflang="${h}" href="${loc}"/>`
  ).join('\n')

  return `  <url>
    <loc>${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${hreflangs}
  </url>`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')

  const today = new Date().toISOString().split('T')[0]

  let blogEntries = ''

  if (client) {
    try {
      const posts = await client.fetch(`
        *[_type == "post" && defined(slug.current)] | order(coalesce(date, _createdAt) desc) {
          "slug": slug.current,
          "date": coalesce(date, _createdAt)
        }
      `)

      blogEntries = (posts as any[])
        .map(p => urlEntry(
          `https://altius.md/blog/${p.slug}`,
          '0.7',
          'weekly',
          p.date ? new Date(p.date).toISOString().split('T')[0] : today
        ))
        .join('\n')
    } catch {
      // If Sanity fails, just skip blog entries
    }
  }

  const staticEntries = STATIC_PAGES.map(p =>
    urlEntry(p.loc, p.priority, p.changefreq, today)
  ).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

${staticEntries}
${blogEntries}
</urlset>`

  res.status(200).send(xml)
}
