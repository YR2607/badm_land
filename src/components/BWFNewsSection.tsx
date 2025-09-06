import React from 'react'

type Item = { title: string; href: string; img?: string; preview?: string; date?: string }

const BWFNewsSection: React.FC = () => {
  const [items, setItems] = React.useState<Item[] | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let alive = true
    const run = async () => {
      try {
        const r = await fetch('/api/bwf-news')
        const data = await r.json()
        if (!alive) return
        setItems((data?.items || []) as Item[])
      } catch (e: any) {
        if (!alive) return
        setError(e?.message || 'Ошибка загрузки')
      }
    }
    run()
    return () => { alive = false }
  }, [])

  if (error) return <div className="text-center text-red-500 py-6">{error}</div>
  if (!items) return <div className="text-center text-gray-500 py-6">Загрузка новостей BWF...</div>
  if (items.length === 0) return <div className="text-center text-gray-500 py-6">Нет материалов</div>

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">BWF — Мировые новости</h2>
          <p className="text-gray-600">Автоматически собранные новости с bwfbadminton.com</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((it) => (
            <a key={it.href} href={it.href} target="_blank" rel="noreferrer" className="group rounded-2xl bg-white overflow-hidden border border-gray-100 hover:shadow-md transition-all">
              <div className="h-48 bg-gray-100 overflow-hidden">
                {it.img ? (
                  <img src={it.img} alt={it.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-blue to-primary-orange" />
                )}
              </div>
              <div className="p-5">
                <div className="text-xs text-gray-500 mb-2">{it.date || ''}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{it.title}</h3>
                {it.preview && <p className="text-sm text-gray-600 line-clamp-3">{it.preview}</p>}
                <div className="mt-4 text-primary-blue text-sm font-medium">Читать на bwfbadminton.com →</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BWFNewsSection
