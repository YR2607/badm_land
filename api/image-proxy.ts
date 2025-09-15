import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url } = req.query

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required' })
  }

  try {
    // Проверяем что это Facebook изображение
    if (!url.includes('fbcdn.net') && !url.includes('facebook.com')) {
      return res.status(400).json({ error: 'Only Facebook images are allowed' })
    }

    // Пробуем несколько стратегий для загрузки изображения
    const strategies = [
      // Стратегия 1: Прямой запрос с минимальными заголовками
      {
        headers: {
          'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        } as Record<string, string>
      },
      // Стратегия 2: Имитация браузера
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/*,*/*;q=0.8',
          'Referer': 'https://m.facebook.com/',
        } as Record<string, string>
      },
      // Стратегия 3: Использование внешнего прокси
      {
        url: `https://images.weserv.nl/?url=${encodeURIComponent(url)}&output=jpg&q=85`,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ImageProxy/1.0)',
        } as Record<string, string>
      }
    ]

    let lastError: any = null

    for (const strategy of strategies) {
      try {
        const fetchUrl = strategy.url || url
        const response = await fetch(fetchUrl, {
          headers: strategy.headers,
          signal: AbortSignal.timeout(10000), // 10 секунд таймаут
        })

        if (response.ok) {
          const contentType = response.headers.get('content-type') || 'image/jpeg'
          const buffer = await response.arrayBuffer()

          // Устанавливаем заголовки для кэширования
          res.setHeader('Content-Type', contentType)
          res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600')
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Methods', 'GET')
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

          return res.send(Buffer.from(buffer))
        }
      } catch (error) {
        lastError = error
        continue
      }
    }

    // Если все стратегии не сработали, возвращаем ошибку
    console.error('All image proxy strategies failed:', lastError)
    return res.status(404).json({ error: 'Image not accessible' })

  } catch (error) {
    console.error('Image proxy error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
