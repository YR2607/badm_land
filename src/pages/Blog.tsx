import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Search, Filter, ArrowRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { fetchClubEmbeds } from '../lib/cms';
import { proxied } from '../utils/blockFacebookImages';
import { useTranslation } from 'react-i18next';
import Breadcrumbs from '../components/Breadcrumbs';
import SEO from '../components/SEO';
import { NewsCardSkeleton } from '../components/Skeletons';

type BwfItem = { title: string; href: string; img?: string; preview?: string; date?: string };

// We rely only on automated feeds on this page

const Blog: FC = () => {
  const { t } = useTranslation();
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

    // Add interval for periodic CMS data updates
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        load();
      }
    }, 30000); // Update every 30 seconds

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
    { value: 'all', label: t('news.categories.all'), icon: <Filter className="w-4 h-4" /> },
    { value: 'world', label: t('news.categories.world'), icon: <Globe className="w-4 h-4" /> },
    { value: 'news', label: t('news.categories.club'), icon: <Filter className="w-4 h-4" /> },
    { value: 'event', label: t('news.categories.events'), icon: <Filter className="w-4 h-4" /> },
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
        image: proxied(i?.cover || i?.coverUrl),
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
      case 'news': return t('news.categories.club');
      case 'world': return t('news.categories.world');
      case 'event': return t('news.categories.events');
      default: return category;
    }
  };

  const Empty: FC<{ text: string }> = ({ text }) => (
    <motion.div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <div className="text-8xl mb-6">🗞️</div>
      <h3 className="text-2xl font-black text-zenith-black mb-2 uppercase tracking-tight">{text}</h3>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-zenith-white">
      <SEO
        title={`Altius — ${t('navigation.news')}`}
        description={t('news.hero.subtitle')}
        image="https://altius.md/og-blog.jpg"
      />
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-20">
        <Breadcrumbs
          items={[
            { label: t('navigation.home'), path: '/' },
            { label: t('navigation.news') }
          ]}
        />
      </div>
      <section className="relative overflow-hidden py-24 bg-zenith-black">
        {/* Enhanced Badminton Court Background */}
        <div className="absolute inset-0">
          {/* Dynamic Court with Lighting Effects */}
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 1200 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
              <defs>
                <radialGradient id="courtGradient" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="rgba(220,38,38,0.15)" />
                  <stop offset="50%" stopColor="rgba(220,38,38,0.05)" />
                  <stop offset="100%" stopColor="rgba(220,38,38,0.01)" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <rect width="1200" height="600" fill="url(#courtGradient)" />
              <g stroke="rgba(255,255,255,0.4)" strokeWidth="3" fill="none" filter="url(#glow)">
                <rect x="200" y="100" width="800" height="400" strokeWidth="4" />
                <line x1="600" y1="100" x2="600" y2="500" strokeWidth="3" />
                <line x1="200" y1="240" x2="1000" y2="240" />
                <line x1="200" y1="360" x2="1000" y2="360" />
              </g>
            </svg>
          </div>

          {/* News & Media Elements */}
          <div className="absolute top-16 left-8 md:top-20 md:left-16 w-14 h-14 md:w-18 md:h-18 opacity-20">
            <svg viewBox="0 0 80 80" className="w-full h-full">
              <rect x="15" y="20" width="50" height="40" fill="rgba(255,255,255,0.8)" rx="3" />
              <rect x="20" y="25" width="20" height="3" fill="rgba(255,255,255,0.6)" rx="1" />
            </svg>
          </div>

          {/* Tournament Trophy */}
          <div className="absolute bottom-16 right-16 md:bottom-20 md:right-24 w-10 h-10 md:w-14 md:h-14 opacity-15">
            <svg viewBox="0 0 50 50" className="w-full h-full">
              <path d="M12 15 Q12 12 15 12 L35 12 Q38 12 38 15 L38 25 Q38 30 33 30 L17 30 Q12 30 12 25 Z" fill="rgba(220,38,38,0.5)" />
            </svg>
          </div>
        </div>

        <div className="relative z-10">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-zenith-crimson/20 bg-zenith-crimson/10 text-zenith-crimson uppercase tracking-widest text-xs font-bold mb-8">
                <Globe className="w-4 h-4" />
                <span>{t('news.hero.badge')}</span>
              </div>

              <h1 className="text-6xl md:text-[6.5rem] lg:text-[10rem] font-black font-display text-white mb-8 uppercase tracking-tighter leading-[0.8] drop-shadow-[0_10px_30px_rgba(220,38,38,0.3)]">
                {t('news.hero.title')}
              </h1>

              <p className="text-xl md:text-3xl max-w-4xl mx-auto text-gray-400 font-medium leading-tight mb-16 uppercase tracking-tight">
                {t('news.hero.subtitle')}
              </p>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 bg-white/5 backdrop-blur-md rounded-[3rem] p-10 border border-white/10 max-w-5xl mx-auto">
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="text-5xl md:text-7xl font-black font-display text-zenith-crimson mb-2 tracking-tighter">50+</div>
                  <div className="text-white/80 uppercase tracking-widest text-sm font-bold">{t('news.hero.stats.articles')}</div>
                </motion.div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="text-5xl md:text-7xl font-black font-display text-zenith-crimson mb-2 tracking-tighter">20+</div>
                  <div className="text-white/80 uppercase tracking-widest text-sm font-bold">{t('news.hero.stats.events')}</div>
                </motion.div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="text-5xl md:text-7xl font-black font-display text-zenith-crimson mb-2 tracking-tighter">5</div>
                  <div className="text-white/80 uppercase tracking-widest text-sm font-bold">{t('news.hero.stats.categories')}</div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={filtersRef as any} className="py-12 bg-zenith-white scroll-mt-28 md:scroll-mt-32">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between bg-white p-6 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-100">
            <motion.div className="relative flex-grow max-w-xl w-full" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('news.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-zenith-crimson/20 transition-all font-bold text-zenith-black placeholder:text-gray-400"
              />
            </motion.div>
            <motion.div className="flex flex-wrap gap-2 justify-center" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 ${selectedCategory === category.value ? 'bg-zenith-black text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                  <span className={selectedCategory === category.value ? 'text-zenith-crimson' : ''}>{category.icon}</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 pb-24">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Anchors for deep links */}
          <div ref={listTopRef} className="sr-only" id="all-news" />
          <div className="sr-only" id="world-news" />
          <div className="sr-only" id="club-news" />
          <div className="sr-only" id="event-news" />
          {loading && merged.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <NewsCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredNews.length === 0 ? (
            <Empty text={t('news.noNews')} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {pageItems.map((news, index) => {
                const isExternal = (news as any)._external
                const href = (news as any)._href
                const Card = (
                  <motion.article
                    key={(news as any).id || index}
                    className="bg-white rounded-[2.5rem] p-8 group transition-all duration-500 border border-gray-100 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:border-zenith-crimson/20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    whileHover={{ y: -10 }}
                  >
                    <div className="h-64 rounded-[2rem] mb-8 overflow-hidden bg-gray-100 relative shadow-inner">
                      {news.image ? (
                        <img
                          src={proxied(news.image)}
                          alt={news.title}
                          className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-110"
                          style={{
                            filter: 'brightness(0.9) contrast(1.1)',
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.parentElement?.querySelector('.fallback-bg') as HTMLElement;
                            if (fallback) fallback.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <div className="fallback-bg w-full h-full bg-zenith-black flex items-center justify-center" style={{ display: news.image ? 'none' : 'block' }}>
                        <Globe className="w-12 h-12 text-white/20" />
                      </div>

                      <div className="absolute top-4 left-4">
                        <span className="bg-zenith-black/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                          {getCategoryLabel((news as any).category)}
                        </span>
                      </div>
                    </div>

                    <div className="mb-6 flex items-center justify-between border-b border-gray-50 pb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-zenith-crimson animate-pulse" />
                        <span className="text-xs font-black text-zenith-black/40 uppercase tracking-widest">{formatDate((news as any).date)}</span>
                      </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-zenith-black mb-4 group-hover:text-zenith-crimson transition-colors break-words whitespace-normal leading-[1.1] font-display uppercase tracking-tight">
                      {news.title}
                    </h3>

                    <p className="text-gray-500 mb-8 line-clamp-2 font-medium leading-relaxed">{(news as any).excerpt}</p>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      {(news as any).author ? (
                        <span className="text-[10px] font-black text-zenith-black/30 uppercase tracking-[0.2em]">{(news as any).author}</span>
                      ) : <div />}
                      <span className="flex items-center gap-2 text-zenith-black group-hover:text-zenith-crimson transition-all font-black text-xs uppercase tracking-widest">
                        <span>{t('news.readMore')}</span>
                        <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                      </span>
                    </div>
                  </motion.article>
                )
                return isExternal ? (
                  <a key={(news as any).id || index} href={href} target="_blank" rel="noreferrer" className="block h-full">{Card}</a>
                ) : (
                  <div key={(news as any).id || index} className="h-full">{Card}</div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Pagination Controls */}
      {filteredNews.length > pageSize && (
        <section className="pb-24">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-8 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
              <button
                className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${page > 1 ? 'bg-zenith-black text-white hover:bg-zenith-crimson' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
                onClick={() => page > 1 && setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                ← {t('common.previous')}
              </button>
              <div className="text-[10px] font-black text-zenith-black/40 uppercase tracking-[0.2em] hidden md:block">
                {t('common.page')} {page} {t('common.of')} {totalPages} • {t('common.showing')} {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredNews.length)} {t('common.of')} {filteredNews.length}
              </div>
              <button
                className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${page < totalPages ? 'bg-zenith-black text-white hover:bg-zenith-crimson' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
                onClick={() => page < totalPages && setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                {t('common.next')} →
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Blog;
