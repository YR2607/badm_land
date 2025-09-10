import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Search, Filter, ArrowRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { fetchClubEmbeds } from '../lib/cms';

type BwfItem = { title: string; href: string; img?: string; preview?: string; date?: string };

// We rely only on automated feeds on this page

const Blog: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(18);
  const listTopRef = useRef<HTMLDivElement | null>(null)
  const filtersRef = useRef<HTMLElement | null>(null)
  const [loading, setLoading] = useState<boolean>(true);
  const [bwf, setBwf] = useState<BwfItem[] | null>(null);
  const [embeds, setEmbeds] = useState<any[]>([]);
  // FB feeds disabled for clean slate

  // We now include manual embeds from CMS

  useEffect(() => {
    // Switch category by URL hash (e.g., /blog#world-news)
    const hash = (location.hash || '').replace('#', '');
    const map: Record<string, string> = {
      'world-news': 'world',
      'club-news': 'news',
      'event-news': 'event',
      'all-news': 'all',
    };
    if (map[hash]) {
      setSelectedCategory(map[hash]);
      // slight delay to allow layout before scroll into view
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }, [location.hash]);

  // Loading indicator controlled by BWF and CMS loaders

  // FB feeds removed for now

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const [r1, cmsList] = await Promise.all([
          fetch('/data/bwf_news.json?t=' + Date.now(), { cache: 'no-store' }),
          fetchClubEmbeds().catch(() => [] as any[]),
        ]);
        if (r1.ok) {
          const j = await r1.json();
          const items: BwfItem[] = (j?.items || []) as BwfItem[];
          if (alive) setBwf(items);
        } else {
          if (alive) setBwf([]);
        }
        if (alive) setEmbeds(Array.isArray(cmsList) ? cmsList : []);
      } catch {
        if (alive) {
          setBwf([]);
          setEmbeds([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    
    // Добавляем интервал для периодического обновления CMS данных
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        load();
      }
    }, 30000); // Обновляем каждые 30 секунд
    
    const onFocus = () => load();
    const onVisibility = () => { if (document.visibilityState === 'visible') load(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      alive = false;
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  // No manual embeds: we rely only on automated FB/BWF feeds

  const categories = [
    { value: 'all', label: 'Все', icon: <Filter className="w-4 h-4" /> },
    { value: 'world', label: 'Мировые новости', icon: <Globe className="w-4 h-4" /> },
    { value: 'news', label: 'Новости клуба', icon: <Filter className="w-4 h-4" /> },
    { value: 'event', label: 'События', icon: <Filter className="w-4 h-4" /> },
  ];

  const merged = useMemo(() => {
    const world = (bwf || []).map((it, idx) => ({
      id: `bwf-${idx}`,
      title: it.title,
      excerpt: '',
      image: it.img,
      date: it.date || new Date().toISOString(),
      category: 'world' as const,
      author: undefined,
      featured: false,
      _external: true as const,
      _href: it.href,
    }))
    const fromCms = (embeds || []).map((i: any, idx: number) => {
      const raw = (i?.url || '').trim()
      const isIframe = /<\s*iframe[\s\S]*?>/i.test(raw)
      // Extract external URL from iframe src href param if present
      let external = undefined as string | undefined
      if (isIframe) {
        try {
          const m = raw.match(/<iframe[^>]*\s+src=["']([^"']+)["'][^>]*>/i)
          const src = m?.[1]
          if (src) {
            const u = new URL(src, window.location.origin)
            const hrefParam = u.searchParams.get('href')
            external = hrefParam ? decodeURIComponent(hrefParam) : src
          }
        } catch { /* noop */ }
      }
      return {
        id: `cms-${idx}-${i?.publishedAt || ''}`,
        title: i?.title || '',
        excerpt: i?.description || '',
        image: i?.cover || undefined,
        date: i?.publishedAt || new Date().toISOString(),
        category: (i?.kind === 'event' ? 'event' : 'news') as 'news' | 'event',
        author: undefined,
        featured: false,
        _external: true,
        _href: isIframe ? external : raw,
      }
    })
    return [...world, ...fromCms]
  }, [bwf, embeds])

  const filteredNews = useMemo(() => {
    const list = merged
      .slice()
      .sort((a: any, b: any) => {
        const da = new Date(a?.date || 0).getTime();
        const db = new Date(b?.date || 0).getTime();
        return db - da;
      })
    return list.filter(n => {
      const matchesCategory = selectedCategory === 'all' || n.category === selectedCategory
      const inTitle = (n.title || '').toLowerCase().includes(searchTerm.toLowerCase())
      const inExcerpt = (n.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && (inTitle || inExcerpt)
    })
  }, [merged, selectedCategory, searchTerm])

  // Reset to page 1 when filters/search change
  useEffect(() => { setPage(1) }, [selectedCategory, searchTerm])

  // Scroll to filters section when page changes
  useEffect(() => {
    const el = filtersRef.current || listTopRef.current
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [page])

  const totalPages = Math.max(1, Math.ceil(filteredNews.length / pageSize))
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredNews.slice(start, start + pageSize)
  }, [filteredNews, page, pageSize])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'news': return 'bg-primary-blue';
      case 'world': return 'bg-primary-orange';
      case 'event': return 'bg-primary-yellow';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'news': return 'Новости клуба';
      case 'world': return 'Мировые новости';
      case 'event': return 'События';
      default: return category;
    }
  };

  const Empty: FC<{ text: string }> = ({ text }) => (
    <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <div className="text-6xl mb-4">🗞️</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{text}</h3>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-primary-blue to-primary-orange text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">Новости и События</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">Следите за последними новостями нашего клуба и мировыми событиями в бадминтоне</p>
          </motion.div>
        </div>
      </section>

      <section ref={filtersRef as any} className="py-8 bg-white scroll-mt-28 md:scroll-mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <motion.div className="relative flex-grow max-w-md" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Поиск новостей..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent" />
            </motion.div>
            <motion.div className="flex flex-wrap gap-2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              {categories.map((category) => (
                <button key={category.value} onClick={() => setSelectedCategory(category.value)} className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category.value ? 'bg-primary-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {category.icon}
                  <span>{category.label}</span>
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Anchors for deep links */}
          <div ref={listTopRef} className="sr-only" id="all-news" />
          <div className="sr-only" id="world-news" />
          <div className="sr-only" id="club-news" />
          <div className="sr-only" id="event-news" />
          {loading && merged.length === 0 ? (
            <Empty text="Загрузка..." />
          ) : filteredNews.length === 0 ? (
            <Empty text="Пока нет материалов" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pageItems.map((news, index) => {
                const isExternal = (news as any)._external
                const href = (news as any)._href
                const Card = (
                  <motion.article key={(news as any).id || index} className="bg-white rounded-3xl p-6 group transition-transform duration-300" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.05 }}>
                    <div className="h-48 rounded-lg mb-4 overflow-hidden bg-gray-100">
                      {news.image ? (
                        <img src={news.image} alt={news.title} className="w-full h-full object-cover object-top" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-blue to-primary-orange" />
                      )}
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor((news as any).category)}`}>{getCategoryLabel((news as any).category)}</span>
                      <span className="text-sm text-gray-500">{formatDate((news as any).date)}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-blue transition-colors break-words whitespace-normal leading-snug">{news.title}</h3>
                    <p className="text-gray-600 mb-4">{(news as any).excerpt}</p>
                    <div className="flex items-center justify-between">
                      {(news as any).author && (<span className="text-sm text-gray-500">{(news as any).author}</span>)}
                      <span className="flex items-center text-primary-blue group-hover:translate-x-2 transition-transform">
                        <span className="mr-2 text-sm font-medium">Читать</span>
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </motion.article>
                )
                return isExternal ? (
                  <a key={(news as any).id || index} href={href} target="_blank" rel="noreferrer">{Card}</a>
                ) : (
                  <div key={(news as any).id || index}>{Card}</div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Pagination Controls */}
      {filteredNews.length > pageSize && (
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <button
                className={`px-4 py-2 rounded-lg border text-sm font-medium ${page > 1 ? 'bg-white hover:bg-gray-50 border-gray-300 text-gray-900' : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'}`}
                onClick={() => page > 1 && setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                ← Предыдущая
              </button>
              <div className="text-sm text-gray-600">
                Страница {page} из {totalPages} • Показано {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredNews.length)} из {filteredNews.length}
              </div>
              <button
                className={`px-4 py-2 rounded-lg border text-sm font-medium ${page < totalPages ? 'bg-white hover:bg-gray-50 border-gray-300 text-gray-900' : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'}`}
                onClick={() => page < totalPages && setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Следующая →
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Blog;
