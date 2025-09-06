import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Globe, Zap, Search, Filter, ArrowRight } from 'lucide-react';
import { isCmsEnabled, fetchPosts, CmsPost } from '../lib/cms';
import { Link } from 'react-router-dom';

type BwfItem = { title: string; href: string; img?: string; preview?: string; date?: string };

const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [posts, setPosts] = useState<CmsPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [bwf, setBwf] = useState<BwfItem[] | null>(null);

  useEffect(() => {
    (async () => {
      if (!isCmsEnabled) { setPosts([]); setLoading(false); return; }
      try {
        const data = await fetchPosts();
        setPosts(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch('/api/bwf-news');
        const data = await r.json();
        if (!alive) return;
        setBwf((data?.items || []) as BwfItem[]);
      } catch {
        if (!alive) return;
        setBwf([]);
      }
    })();
    return () => { alive = false };
  }, []);

  const categories = [
    { value: 'all', label: 'Все', icon: <Filter className="w-4 h-4" /> },
    { value: 'news', label: 'Новости клуба', icon: <Zap className="w-4 h-4" /> },
    { value: 'event', label: 'События', icon: <Calendar className="w-4 h-4" /> },
    { value: 'world', label: 'Мировые новости', icon: <Globe className="w-4 h-4" /> }
  ];

  const merged = useMemo(() => {
    const cms = posts.map(p => ({
      id: p.id,
      title: p.title,
      excerpt: p.excerpt,
      image: p.image,
      date: p.date,
      category: p.category,
      author: p.author,
      featured: p.featured,
      _external: false as const,
      _href: ''
    }))
    const world = (bwf || []).map((it, idx) => ({
      id: `bwf-${idx}`,
      title: it.title,
      excerpt: it.preview || '',
      image: it.img,
      date: it.date || new Date().toISOString(),
      category: 'world' as const,
      author: undefined,
      featured: false,
      _external: true as const,
      _href: it.href
    }))
    return [...cms, ...world]
  }, [posts, bwf])

  const filteredNews = useMemo(() => {
    const list = merged
    return list.filter(n => {
      const matchesCategory = selectedCategory === 'all' || n.category === selectedCategory
      const inTitle = (n.title || '').toLowerCase().includes(searchTerm.toLowerCase())
      const inExcerpt = (n.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && (inTitle || inExcerpt)
    })
  }, [merged, selectedCategory, searchTerm])

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

  const Empty: React.FC<{ text: string }> = ({ text }) => (
    <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <div className="text-6xl mb-4">🗞️</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{text}</h3>
      {!isCmsEnabled && <p className="text-gray-600">CMS не настроена</p>}
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

      <section className="py-8 bg-white">
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
          {loading && merged.length === 0 ? (
            <Empty text="Загрузка..." />
          ) : filteredNews.length === 0 ? (
            <Empty text="Пока нет материалов" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((news, index) => {
                const isExternal = (news as any)._external
                const href = (news as any)._href
                const Card = (
                  <motion.article key={(news as any).id || index} className="bg-white rounded-3xl p-6 group transition-transform duration-300" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.05 }}>
                    <div className="h-48 rounded-lg mb-4 overflow-hidden bg-gray-100">
                      {news.image ? (
                        <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-blue to-primary-orange" />
                      )}
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor((news as any).category)}`}>{getCategoryLabel((news as any).category)}</span>
                      <span className="text-sm text-gray-500">{formatDate((news as any).date)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-blue transition-colors">{news.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{(news as any).excerpt}</p>
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
                  <Link key={(news as any).id || index} to={`/blog/${(news as any).id}`}>{Card}</Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
