import { FC, useEffect, useMemo, useState } from 'react'
import { fetchClubEmbeds } from '../lib/cms'

// Normalize date to nice RU format
const formatDate = (dateString?: string | null) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

type EmbedItem = {
  id: string
  title: string
  description?: string
  kind: 'news' | 'event'
  publishedAt?: string | null
  url?: string
  iframeHtml?: string | null
  externalUrl?: string
  cover?: string
  coverUrl?: string
}

const parseEmbedField = (rawUrlOrHtml?: string): { url?: string; iframeHtml?: string | null } => {
  const val = (rawUrlOrHtml || '').trim()
  if (!val) return {}
  // If contains an iframe tag, treat as embed HTML
  if (/<\s*iframe[\s\S]*?>[\s\S]*?<\s*\/\s*iframe\s*>/i.test(val) || /<\s*iframe[\s\S]*?>/i.test(val)) {
    return { iframeHtml: val }
  }
  return { url: val }
}

// Extract the real post URL for Facebook embeds. If the iframe src contains a `href=...` query parameter,
// decode and return it; otherwise return src itself. If plain URL was provided, just return it.
const extractExternalUrl = (url?: string, iframeHtml?: string | null): string | undefined => {
  if (url && !iframeHtml) return url
  if (!iframeHtml) return url
  try {
    // naive iframe src extraction
    const m = iframeHtml.match(/<iframe[^>]*\s+src=["']([^"']+)["'][^>]*>/i)
    const src = m?.[1]
    if (!src) return undefined
    const u = new URL(src, window.location.origin)
    const hrefParam = u.searchParams.get('href')
    if (hrefParam) {
      try { return decodeURIComponent(hrefParam) } catch { return hrefParam }
    }
    return src
  } catch {
    return undefined
  }
}

const badgeClass = (kind: 'news' | 'event') => {
  switch (kind) {
    case 'event':
      return 'bg-gradient-to-r from-purple-500 to-fuchsia-500'
    case 'news':
    default:
      return 'bg-gradient-to-r from-blue-500 to-cyan-500'
  }
}

const imageFallbackClass = (kind: 'news' | 'event') => {
  switch (kind) {
    case 'event':
      return 'bg-gradient-to-br from-purple-500 to-fuchsia-500'
    case 'news':
    default:
      return 'bg-gradient-to-br from-blue-500 to-cyan-500'
  }
}

const CmsEmbedsSection: FC = () => {
  const [items, setItems] = useState<EmbedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  // no modal: we link out directly to the post url
  const [ogImages, setOgImages] = useState<Record<string, string>>({})

  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        const list = await fetchClubEmbeds()
        if (!alive) return
        const mapped: EmbedItem[] = (list || []).map((i: any, idx: number) => {
          const p = parseEmbedField(i?.url)
          return {
            id: `${i?.publishedAt || ''}-${idx}`,
            title: i?.title || '',
            description: i?.description || '',
            kind: (i?.kind === 'event' ? 'event' : 'news') as 'news' | 'event',
            publishedAt: i?.publishedAt || null,
            url: p.url,
            iframeHtml: p.iframeHtml || null,
            externalUrl: extractExternalUrl(p.url, p.iframeHtml || null),
            cover: i?.cover || undefined,
            coverUrl: i?.coverUrl || undefined,
          }
        })
        .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())
        setItems(mapped)
      } catch (e: any) {
        if (!alive) return
        setError(e?.message || 'Ошибка загрузки материалов CMS')
      } finally {
        if (alive) setLoading(false)
      }
    }
    load()
    const onFocus = () => load()
    const onVis = () => { if (document.visibilityState === 'visible') load() }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      alive = false
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  const limited = useMemo(() => items.slice(0, 5), [items])

  // Fetch Open Graph preview images for items that have an external URL but no image
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      const targets = limited.filter(it => it.externalUrl)
      await Promise.all(targets.map(async (it) => {
        if (!it.externalUrl) return
        if (ogImages[it.id]) return
        try {
          const r = await fetch(`/api/og?url=${encodeURIComponent(it.externalUrl)}&t=${Date.now()}`, { cache: 'no-store' })
          const j = await r.json()
          let img = j?.image as string | undefined
          if (!img) {
            // Fallback via Facebook oEmbed if available (requires FB_ACCESS_TOKEN on server)
            try {
              const rr = await fetch(`/api/fb-og?url=${encodeURIComponent(it.externalUrl)}&t=${Date.now()}`, { cache: 'no-store' })
              const jj = await rr.json()
              img = jj?.image as string | undefined
            } catch { /* ignore */ }
          }
          if (!img) {
            // Last resort: tokenless proxy scraping of mobile/basic versions
            try {
              const rr2 = await fetch(`/api/fb-preview?url=${encodeURIComponent(it.externalUrl)}&t=${Date.now()}`, { cache: 'no-store' })
              const jj2 = await rr2.json()
              img = jj2?.image as string | undefined
            } catch { /* ignore */ }
          }
          if (!cancelled && img) setOgImages(prev => ({ ...prev, [it.id]: img }))
        } catch { /* ignore */ }
      }))
    }
    run()
    return () => { cancelled = true }
  }, [limited])

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Новости клуба и события</h2>
        </div>

        {loading && (<div className="text-center text-gray-500 py-8">Загрузка…</div>)}
        {!loading && error && (<div className="text-center text-red-500 py-8">{error}</div>)}
        {!loading && !error && limited.length === 0 && (<div className="text-center text-gray-500 py-8">Нет материалов</div>)}

        {!loading && !error && limited.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:auto-rows-[1fr]">
            {limited.map((it, index) => {
              const badge = it.kind === 'event' ? '🎫 Событие' : '🏸 Клуб'
              const card = (
                <article className="group cursor-pointer h-full">
                  <div className="bg-white rounded-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                    <div className={`${index === 1 ? 'h-64 md:h-80 lg:h-96' : 'h-48 md:h-56'} relative overflow-hidden bg-gray-100`}>
                      {it.coverUrl ? (
                        <img 
                          src={it.coverUrl} 
                          alt={it.title} 
                          referrerPolicy="no-referrer" 
                          className="absolute inset-0 w-full h-full object-cover object-center transform transition-transform duration-300 group-hover:scale-[1.02]"
                          style={{
                            aspectRatio: '16/9',
                            objectFit: 'cover',
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.objectFit = 'contain';
                          }}
                        />
                      ) : it.cover ? (
                        <img 
                          src={it.cover} 
                          alt={it.title} 
                          className="absolute inset-0 w-full h-full object-cover object-center transform transition-transform duration-300 group-hover:scale-[1.02]"
                          style={{
                            aspectRatio: '16/9',
                            objectFit: 'cover',
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.objectFit = 'contain';
                          }}
                        />
                      ) : ogImages[it.id] ? (
                        <img 
                          src={ogImages[it.id]} 
                          alt={it.title} 
                          referrerPolicy="no-referrer" 
                          className="absolute inset-0 w-full h-full object-cover object-center transform transition-transform duration-300 group-hover:scale-[1.02]"
                          style={{
                            aspectRatio: '16/9',
                            objectFit: 'cover',
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.objectFit = 'contain';
                          }}
                        />
                      ) : (
                        <>
                          <div className={`absolute inset-0 ${imageFallbackClass(it.kind)}`} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                        </>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 0 0 2-2v-8H3v8a2 2 0 0 0 2 2Z" />
                          </svg>
                          <span className="text-xs md:text-sm font-medium">{formatDate(it.publishedAt || undefined)}</span>
                        </div>
                        <div className={`px-2.5 py-1 rounded-full text-[10px] md:text-xs font-semibold text-white ${badgeClass(it.kind)}`}>{badge}</div>
                      </div>
                      <h3 className={`font-bold text-gray-900 leading-snug mb-2 break-words whitespace-normal ${index === 1 ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>{it.title}</h3>
                      {it.description && (
                        <p className={`text-gray-600 ${index === 1 ? 'text-base md:text-lg line-clamp-4' : 'text-sm line-clamp-3'}`}>{it.description}</p>
                      )}
                      <div className="mt-4 flex items-center space-x-2 text-primary-blue transition-all duration-300">
                        <span className="text-sm font-semibold">Читать далее</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </article>
              )

              const href = it.externalUrl || it.url || '#'
              return (
                <a key={it.id} href={href} target="_blank" rel="noreferrer" className={`group ${index === 1 ? 'lg:row-span-2' : ''}`}>
                  {card}
                </a>
              )
            })}
          </div>
        )}
        
        {/* Show all news button */}
        <div className="text-center mt-12">
          <a 
            href="/blog#club-news" 
            className="inline-flex items-center px-6 py-3 bg-primary-blue text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            <span>Показать все новости</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

export default CmsEmbedsSection
