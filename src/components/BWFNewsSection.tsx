import { FC, useEffect, useState } from 'react'
import { proxied } from '../utils/blockFacebookImages'
import { useTranslation } from 'react-i18next'

type Item = { title: string; href: string; img?: string; preview?: string; date?: string }

const BWFNewsSection: FC = () => {
  const { t, i18n } = useTranslation()
  const [items, setItems] = useState<Item[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    const run = async () => {
      try {
        // Prioritize static JSON file (updated by GitHub Actions) over unreliable API
        let data
        let dataSource = 'unknown'
        
        try {
          // Try static JSON file first (updated by GitHub Actions every 4 hours)
          const r = await fetch('/data/bwf_news.json', { 
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
          })
          if (r.ok) {
            data = await r.json()
            dataSource = 'static'
          }
        } catch (staticError) {
          console.warn('Failed to load static BWF news:', staticError)
        }
        
        // Fallback to API endpoint if static file fails
        if (!data || !data.items || data.items.length === 0) {
          try {
            const r = await fetch('/api/bwf-news?refresh=1', { cache: 'no-store' })
            if (r.ok) {
              data = await r.json()
              dataSource = 'api'
            }
          } catch (apiError) {
            console.warn('Failed to load BWF news from API:', apiError)
          }
        }
        
        if (!alive) return
        
        if (!data || !data.items) {
          throw new Error(t('home.bwf.noData', 'Нет данных о новостях BWF'))
        }
        
        const arr: Item[] = (data.items || []) as Item[]
        const sorted = arr
          .slice()
          .sort((a: any, b: any) => {
            const da = new Date(a?.date || 0).getTime()
            const db = new Date(b?.date || 0).getTime()
            return db - da
          })
        
        console.log(`BWF news loaded from ${dataSource}, ${sorted.length} articles`)
        setItems(sorted)
      } catch (e: any) {
        if (!alive) return
        console.error('BWF news loading error:', e)
        setError(e?.message || t('home.bwf.error', 'Ошибка загрузки новостей BWF'))
      }
    }
    run()
    const onFocus = () => run()
    const onVis = () => { if (document.visibilityState === 'visible') run() }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVis)
    return () => { 
      alive = false 
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  if (error) return <div className="text-center text-red-500 py-6">{error}</div>
  if (!items) return <div className="text-center text-gray-500 py-6">{t('home.bwf.loading', 'Загрузка новостей BWF...')}</div>
  if (items.length === 0) return <div className="text-center text-gray-500 py-6">{t('home.bwf.noMaterials', 'Нет материалов')}</div>

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">{t('home.bwf.title', 'BWF — Мировые новости')}</h2>
          <p className="text-gray-600">{t('home.bwf.subtitle', 'Автоматически собранные новости с bwfbadminton.com')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((it: Item) => (
            <a key={it.href} href={it.href} target="_blank" rel="noreferrer" className="group rounded-2xl bg-white overflow-hidden border border-gray-100 hover:shadow-md transition-all">
              <div className="h-48 bg-gray-100 overflow-hidden">
                {it.img ? (
                  <img 
                    src={proxied(it.img)} 
                    alt={it.title} 
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
                  className={`fallback-bg w-full h-full bg-gradient-to-br from-primary-blue to-primary-orange ${it.img ? 'hidden' : 'block'}`}
                  style={{ display: it.img ? 'none' : 'block' }}
                />
              </div>
              <div className="p-5">
                <div className="text-xs text-gray-500 mb-2">{new Date(it.date || '').toLocaleDateString((({ru:'ru-RU',en:'en-US',ro:'ro-RO'}) as any)[i18n.language] || 'ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{it.title}</h3>
                {it.preview && <p className="text-sm text-gray-600 line-clamp-3">{it.preview}</p>}
                <div className="mt-4 text-primary-blue text-sm font-medium">{t('home.bwf.readOn', 'Читать на bwfbadminton.com →')}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BWFNewsSection
