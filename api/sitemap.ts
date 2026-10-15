import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@sanity/client'

const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID
const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || 'production'
const apiVersion = process.env.VITE_SANITY_API_VERSION || process.env.SANITY_API_VERSION || '2024-01-01'

const client = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : null

const STATIC_PAGES = [
  { path: '', priority: '1.0', changefreq: 'daily', video: true },
  { path: '/about', priority: '0.9', changefreq: 'monthly' },
  { path: '/services', priority: '0.9', changefreq: 'weekly' },
  { path: '/gyms', priority: '0.9', changefreq: 'weekly' },
  { path: '/gyms/malaya-malian-24', priority: '0.8', changefreq: 'weekly' },
  { path: '/gyms/31-avgusta-1989', priority: '0.8', changefreq: 'weekly' },
  { path: '/gyms/ion-creanga-1', priority: '0.8', changefreq: 'weekly' },
  { path: '/gallery', priority: '0.7', changefreq: 'weekly' },
  { path: '/blog', priority: '0.8', changefreq: 'daily' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
]

const HREFLANGS = ['ro', 'ru', 'en']
const DEFAULT_LANG = 'ro'
const BASE_URL = 'https://altius.md'

// Hero video metadata for the <video:video> sitemap block on homepages.
// Helps Google index jump.MP4 (GSC: "video is not the main content" fix).
const VIDEO_META: Record<string, { title: string; desc: string }> = {
  ro: {
    title: 'Antrenament de badminton — clubul Altius',
    desc: 'Video: antrenament de badminton în sala clubului Altius din Chișinău.',
  },
  ru: {
    title: 'Тренировка по бадминтону — клуб Altius',
    desc: 'Видео: тренировка по бадминтону в зале клуба Altius в Кишиневе.',
  },
  en: {
    title: 'Badminton training at Altius club',
    desc: 'Video: badminton training session at the Altius club gym in Chisinau.',
  },
}

function videoEntry(lang: string): string {
  const v = VIDEO_META[lang] || VIDEO_META.en
  return `    <video:video>
      <video:thumbnail_loc>${BASE_URL}/jump-poster.jpg</video:thumbnail_loc>
      <video:title>${v.title}</video:title>
      <video:description>${v.desc}</video:description>
      <video:content_loc>${BASE_URL}/jump.MP4</video:content_loc>
      <video:duration>2</video:duration>
      <video:publication_date>2026-09-04</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
    </video:video>`
}

function urlEntry(path: string, priority: string, changefreq: string, lastmod?: string, video = false): string {
  // Generate one <url> per language with xhtml:link hreflang alternates
  const langEntries = HREFLANGS.map(lang => {
    const loc = `${BASE_URL}/${lang}${path}`
    const alternates = HREFLANGS
      .map(l => `      <xhtml:link rel="alternate" hreflang="${l}" href="${BASE_URL}/${l}${path}" />`)
      .join('\n')
    const xDefault = `      <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/${DEFAULT_LANG}${path}" />`
    return `  <url>
    <loc>${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${video ? `${videoEntry(lang)}\n` : ''}${alternates}
${xDefault}
  </url>`
  })
  return langEntries.join('\n')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')

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
          `/blog/${p.slug}`,
          '0.7',
          'weekly',
          p.date ? new Date(p.date).toISOString().split('T')[0] : undefined
        ))
        .join('\n')
    } catch {
      // If Sanity fails, just skip blog entries
    }
  }

  // No lastmod for static pages: a fabricated "today" date makes Google
  // distrust the whole sitemap. Only real post dates are emitted above.
  const staticEntries = STATIC_PAGES.map(p =>
    urlEntry(p.path, p.priority, p.changefreq, undefined, 'video' in p && p.video)
  ).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">

${staticEntries}
${blogEntries}
</urlset>`

  res.status(200).send(xml)
}
