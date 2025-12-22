import { FC, useEffect, useState } from 'react'
import { proxied } from '../utils/blockFacebookImages'
import { useTranslation } from 'react-i18next'

type EventItem = { title: string; url: string; image?: string; date?: string; excerpt?: string }

const formatDate = (dateString?: string, locale: string = 'ru') => {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''
  const map: Record<string, string> = { ru: 'ru-RU', en: 'en-US', ro: 'ro-RO' }
  const loc = map[locale] || 'ru-RU'
  return date.toLocaleDateString(loc, { day: 'numeric', month: 'long', year: 'numeric' })
}

const EventsSection: FC = () => {
  const { t, i18n } = useTranslation()
  const [items, setItems] = useState<EventItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        let arr: any[] = []
        try {
          const r = await fetch('/api/fb-feed?type=events&limit=10&refresh=1', { cache: 'no-store' })
          const j = await r.json()
          arr = (j?.items || []) as any[]
        } catch {
          // Fallback to RSS App JSON (client-side) then filter event-like
          const FEED_URL = (import.meta as any).env?.VITE_RSS_APP_FEED_URL || 'https://rss.app/feeds/v1.1/yneQwQdZWmbASmAF.json'
          const r2 = await fetch(FEED_URL, { cache: 'no-store' })
          const j2 = await r2.json()
          const raw = ((j2?.items || []) as any[]).map((it: any) => ({
            title: it.title,
            url: it.url,
            image: it.image,
            date: it.date_published,
            excerpt: (it.content_text || '').slice(0, 220)
          }))
          const isEventLike = (txt: string) => {
            const t = (txt || '').toLowerCase()
            return ['турнир','соревнован','чемпионат','cup','open','league','match','event','турнір','чемпіонат','кубок'].some(k => t.includes(k))
          }
          arr = raw.filter((it: any) => isEventLike(`${it.title} ${it.excerpt}`))
        }
        const mapped: EventItem[] = arr
          .map(p => ({
            title: p.title || '',
            url: p.url,
            image: p.image,
            date: p.date,
            excerpt: p.excerpt || ''
          }))
          .filter(it => it.url)
          .sort((a, b) => new Date(b?.date || 0).getTime() - new Date(a?.date || 0).getTime())
          .slice(0, 5)
        if (!alive) return
        setItems(mapped)
      } catch (e: any) {
        if (!alive) return
        setError(e?.message || t('common.error'))
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

  return (
    <section id="events" className="py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-6 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-2xl flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 7h18v10H3z" />
                <path d="M7 3v4M17 3v4" />
              </svg>
            </div>
            <div className="text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t('home.events.title')}</h2>
            </div>
          </div>
        </div>

        {loading && (<div className="text-center text-gray-500 py-8">{t('common.loading')}</div>)}
        {!loading && error && (<div className="text-center text-red-500 py-8">{error}</div>)}
        {!loading && !error && items.length === 0 && (<div className="text-center text-gray-500 py-8">{t('home.events.noItems')}</div>)}

        {!loading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:auto-rows-[1fr]">
            {items.map((news, index) => (
              <a key={news.url} href={news.url} target="_blank" rel="noreferrer" className={`group ${index === 1 ? 'lg:row-span-2' : ''}`}>
                <article className="group cursor-pointer h-full">
                  <div className="bg-white rounded-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                    <div className={`${index === 1 ? 'h-56 md:h-72 lg:h-[28rem]' : 'h-56'} relative overflow-hidden`}>
                      {news.image ? (
                        <img 
                          src={proxied(news.image)} 
                          alt={news.title} 
                          className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-[1.02]"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.parentElement?.querySelector('.fallback-bg') as HTMLElement;
                            if (fallback) fallback.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <div 
                        className="fallback-bg absolute inset-0 bg-gradient-to-br from-purple-500 to-fuchsia-500"
                        style={{ display: news.image ? 'none' : 'block' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 0 0 2-2v-8H3v8a2 2 0 0 0 2 2Z" />
                          </svg>
                          <span className="text-xs md:text-sm font-medium">{formatDate(news.date, i18n.language)}</span>
                        </div>
                        <div className="px-2.5 py-1 rounded-full text-[10px] md:text-xs font-semibold text-white bg-gradient-to-r from-purple-500 to-fuchsia-500">{t('home.events.badge', '🎫 Event')}</div>
                      </div>
                      <h3 className={`font-bold text-gray-900 leading-snug mb-2 break-words whitespace-normal ${index === 1 ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>{news.title}</h3>
                      {news.excerpt && (
                        <p className={`text-gray-600 leading-relaxed ${index === 1 ? 'text-base md:text-lg line-clamp-4' : 'text-sm line-clamp-3'}`}>{news.excerpt}</p>
                      )}
                      <div className="mt-4 flex items-center space-x-2 text-primary-blue transition-all duration-300">
                        <span className="text-sm font-semibold">{t('common.readMore')}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </article>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default EventsSection
