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
    <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <div className="text-6xl mb-4">🗞️</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{text}</h3>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={`Altius — ${t('navigation.news')}`}
        description={t('news.hero.subtitle')}
        image="https://altius.md/og-blog.jpg"
      />
      <Breadcrumbs
        items={[
          { label: t('navigation.home'), path: '/' },
          { label: t('navigation.news') }
        ]}
      />
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-primary-blue via-primary-blue/95 to-indigo-700">
        {/* Enhanced Badminton Court Background */}
        <div className="absolute inset-0">
          {/* Dynamic Court with Lighting Effects */}
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 1200 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
              <defs>
                {/* Gradient for court surface */}
                <radialGradient id="courtGradient" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.15)"/>
                  <stop offset="50%" stopColor="rgba(255,255,255,0.08)"/>
                  <stop offset="100%" stopColor="rgba(255,255,255,0.03)"/>
                </radialGradient>
                
                {/* Glow effect for lines */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                
                {/* Shadow filter */}
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                </filter>
              </defs>
              
              {/* Court Surface with gradient */}
              <rect width="1200" height="600" fill="url(#courtGradient)"/>
              
              {/* Court Lines with glow effect */}
              <g stroke="rgba(255,255,255,0.6)" strokeWidth="3" fill="none" filter="url(#glow)">
                {/* Outer boundaries */}
                <rect x="200" y="100" width="800" height="400" strokeWidth="4"/>
                
                {/* Center line */}
                <line x1="600" y1="100" x2="600" y2="500" strokeWidth="3"/>
                
                {/* Service lines */}
                <line x1="200" y1="240" x2="1000" y2="240"/>
                <line x1="200" y1="360" x2="1000" y2="360"/>
                
                {/* Short service lines */}
                <line x1="320" y1="100" x2="320" y2="500"/>
                <line x1="880" y1="100" x2="880" y2="500"/>
                
                {/* Center service lines */}
                <line x1="600" y1="240" x2="600" y2="360"/>
              </g>
              
              {/* Enhanced Net with 3D effect */}
              <g filter="url(#shadow)">
                <line x1="600" y1="100" x2="600" y2="500" stroke="rgba(255,255,255,0.7)" strokeWidth="6"/>
                <rect x="596" y="280" width="8" height="40" fill="rgba(255,255,255,0.8)" rx="2"/>
                
                {/* Net mesh pattern */}
                <g stroke="rgba(255,255,255,0.3)" strokeWidth="1">
                  <line x1="590" y1="120" x2="610" y2="120"/>
                  <line x1="590" y1="140" x2="610" y2="140"/>
                  <line x1="590" y1="160" x2="610" y2="160"/>
                  <line x1="590" y1="180" x2="610" y2="180"/>
                  <line x1="590" y1="200" x2="610" y2="200"/>
                  <line x1="590" y1="220" x2="610" y2="220"/>
                  <line x1="590" y1="240" x2="610" y2="240"/>
                  <line x1="590" y1="260" x2="610" y2="260"/>
                </g>
              </g>
              
              {/* Spotlight effects */}
              <g opacity="0.1">
                <ellipse cx="400" cy="200" rx="150" ry="80" fill="rgba(255,255,255,0.3)"/>
                <ellipse cx="800" cy="400" rx="150" ry="80" fill="rgba(255,255,255,0.3)"/>
              </g>
            </svg>
          </div>
          
          {/* News & Media Elements */}
          <div className="absolute top-16 left-8 md:top-20 md:left-16 w-14 h-14 md:w-18 md:h-18 opacity-30 animate-pulse">
            <svg viewBox="0 0 80 80" className="w-full h-full">
              <defs>
                <linearGradient id="newsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.8)"/>
                  <stop offset="100%" stopColor="rgba(255,255,255,0.4)"/>
                </linearGradient>
              </defs>
              
              {/* Newspaper/Magazine */}
              <rect x="15" y="20" width="50" height="40" fill="url(#newsGradient)" rx="3"/>
              <rect x="20" y="25" width="20" height="3" fill="rgba(255,255,255,0.6)" rx="1"/>
              <rect x="20" y="30" width="35" height="2" fill="rgba(255,255,255,0.4)" rx="1"/>
              <rect x="20" y="34" width="30" height="2" fill="rgba(255,255,255,0.4)" rx="1"/>
              <rect x="20" y="38" width="25" height="2" fill="rgba(255,255,255,0.4)" rx="1"/>
              
              {/* Badminton racket on newspaper */}
              <ellipse cx="50" cy="45" rx="8" ry="10" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
              <rect x="47" y="55" width="6" height="8" fill="rgba(255,255,255,0.6)" rx="2"/>
            </svg>
          </div>
          
          {/* Flying Shuttlecock with Trail */}
          <div className="absolute top-24 right-12 md:top-28 md:right-20 w-10 h-10 md:w-14 md:h-14 opacity-40">
            <svg viewBox="0 0 50 50" className="w-full h-full animate-bounce" style={{animationDuration: '2.5s'}}>
              <defs>
                <radialGradient id="shuttleBlogGrad" cx="50%" cy="30%" r="60%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.9)"/>
                  <stop offset="100%" stopColor="rgba(255,255,255,0.3)"/>
                </radialGradient>
              </defs>
              
              {/* Motion trail */}
              <g opacity="0.3">
                <circle cx="22" cy="35" r="2" fill="rgba(255,255,255,0.4)"/>
                <circle cx="18" cy="32" r="1.5" fill="rgba(255,255,255,0.3)"/>
                <circle cx="14" cy="29" r="1" fill="rgba(255,255,255,0.2)"/>
              </g>
              
              {/* Shuttlecock */}
              <circle cx="25" cy="38" r="4" fill="url(#shuttleBlogGrad)"/>
              <g fill="rgba(255,255,255,0.6)">
                <path d="M25 34 L22 16 L25 20 L28 16 Z"/>
                <path d="M21 35 L15 20 L21 23 L24 21 Z"/>
                <path d="M29 35 L35 20 L29 23 L26 21 Z"/>
                <path d="M19 37 L12 25 L19 28 L23 26 Z"/>
                <path d="M31 37 L38 25 L31 28 L27 26 Z"/>
              </g>
            </svg>
          </div>
          
          {/* Camera/Media Icon */}
          <div className="absolute bottom-20 left-12 md:bottom-24 md:left-20 w-12 h-12 md:w-16 md:h-16 opacity-25 transform rotate-12 animate-pulse">
            <svg viewBox="0 0 60 60" className="w-full h-full">
              <defs>
                <linearGradient id="cameraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.7)"/>
                  <stop offset="100%" stopColor="rgba(255,255,255,0.3)"/>
                </linearGradient>
              </defs>
              
              {/* Camera Body */}
              <rect x="10" y="20" width="40" height="25" fill="url(#cameraGradient)" rx="5"/>
              <rect x="15" y="15" width="15" height="8" fill="url(#cameraGradient)" rx="2"/>
              
              {/* Lens */}
              <circle cx="30" cy="32" r="8" fill="none" stroke="url(#cameraGradient)" strokeWidth="2"/>
              <circle cx="30" cy="32" r="5" fill="rgba(255,255,255,0.2)"/>
              
              {/* Flash */}
              <rect x="40" y="18" width="6" height="4" fill="url(#cameraGradient)" rx="1"/>
              
              {/* Badminton scene reflection in lens */}
              <g opacity="0.4">
                <ellipse cx="28" cy="30" rx="3" ry="4" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5"/>
                <line x1="28" y1="34" x2="28" y2="36" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5"/>
              </g>
            </svg>
          </div>
          
          {/* Tournament Trophy */}
          <div className="absolute bottom-16 right-16 md:bottom-20 md:right-24 w-10 h-10 md:w-14 md:h-14 opacity-20 animate-pulse" style={{animationDelay: '1s'}}>
            <svg viewBox="0 0 50 50" className="w-full h-full">
              <defs>
                <linearGradient id="trophyBlogGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,215,0,0.8)"/>
                  <stop offset="100%" stopColor="rgba(255,165,0,0.5)"/>
                </linearGradient>
              </defs>
              
              {/* Trophy */}
              <path d="M12 15 Q12 12 15 12 L35 12 Q38 12 38 15 L38 25 Q38 30 33 30 L17 30 Q12 30 12 25 Z" fill="url(#trophyBlogGrad)"/>
              <path d="M8 18 Q5 18 5 21 Q5 24 8 24" fill="none" stroke="url(#trophyBlogGrad)" strokeWidth="2"/>
              <path d="M42 18 Q45 18 45 21 Q45 24 42 24" fill="none" stroke="url(#trophyBlogGrad)" strokeWidth="2"/>
              <rect x="17" y="30" width="16" height="5" fill="url(#trophyBlogGrad)" rx="1"/>
              <rect x="20" y="35" width="10" height="8" fill="url(#trophyBlogGrad)" rx="1"/>
              
              {/* News symbol on trophy */}
              <text x="25" y="22" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="8" fontFamily="serif">📰</text>
            </svg>
          </div>
          
          {/* Floating News Particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/3 left-1/5 w-1.5 h-1.5 bg-yellow-300/40 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
            <div className="absolute top-1/2 right-1/5 w-1 h-1 bg-white/50 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
            <div className="absolute bottom-1/3 left-2/5 w-2 h-2 bg-blue-300/30 rounded-full animate-ping" style={{animationDelay: '2.5s'}}></div>
            <div className="absolute top-2/3 right-2/5 w-1 h-1 bg-yellow-200/50 rounded-full animate-ping" style={{animationDelay: '0.8s'}}></div>
          </div>
          
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-blue/20 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <span className="text-lg">📰</span>
                <span className="text-sm font-medium">{t('news.hero.badge')}</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold font-display mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                {t('news.hero.title')}
              </h1>
              
              <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90 leading-relaxed mb-8">
                {t('news.hero.subtitle')}
              </p>
              
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="text-4xl font-bold text-yellow-300 mb-2">50+</div>
                  <div className="text-blue-100">{t('news.hero.stats.articles')}</div>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="text-4xl font-bold text-yellow-300 mb-2">20+</div>
                  <div className="text-blue-100">{t('news.hero.stats.events')}</div>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="text-4xl font-bold text-yellow-300 mb-2">5</div>
                  <div className="text-blue-100">{t('news.hero.stats.categories')}</div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={filtersRef as any} className="py-8 bg-white scroll-mt-28 md:scroll-mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <motion.div className="relative flex-grow max-w-md" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder={t('news.searchPlaceholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <NewsCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredNews.length === 0 ? (
            <Empty text={t('news.noNews')} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pageItems.map((news, index) => {
                const isExternal = (news as any)._external
                const href = (news as any)._href
                const Card = (
                  <motion.article key={(news as any).id || index} className="bg-white rounded-3xl p-6 group transition-transform duration-300" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.05 }}>
                    <div className="h-48 rounded-lg mb-4 overflow-hidden bg-gray-100">
                      {news.image ? (
                        <img 
                          src={proxied(news.image)} 
                          alt={news.title} 
                          className="w-full h-full object-cover object-center transform transition-transform duration-300 group-hover:scale-[1.02]"
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
                      <div className="fallback-bg w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" style={{ display: news.image ? 'none' : 'block' }} />
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
                        <span className="mr-2 text-sm font-medium">{t('news.readMore')}</span>
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
                ← {t('common.previous')}
              </button>
              <div className="text-sm text-gray-600">
                {t('common.page')} {page} {t('common.of')} {totalPages} • {t('common.showing')} {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredNews.length)} {t('common.of')} {filteredNews.length}
              </div>
              <button
                className={`px-4 py-2 rounded-lg border text-sm font-medium ${page < totalPages ? 'bg-white hover:bg-gray-50 border-gray-300 text-gray-900' : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'}`}
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
