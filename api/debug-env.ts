import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const hasScraper = Boolean(process.env.SCRAPERAPI_KEY)
  const hasBee = Boolean(process.env.SCRAPINGBEE_KEY)
  const pageId = process.env.FB_PAGE_ID || ''
  res.status(200).json({ hasScraper, hasBee, pageIdLength: pageId.length })
}
