import React from 'react';
import { Calendar, ArrowRight, Globe, Clock, ExternalLink, Newspaper, Award } from 'lucide-react';
import { NewsItem } from '../types';
import { isCmsEnabled, fetchPosts, CmsPost } from '../lib/cms';

const BusinessNewsSection: React.FC = () => {
  const [posts, setPosts] = React.useState<CmsPost[] | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [bwf, setBwf] = React.useState<NewsItem[]>([]);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      if (isCmsEnabled) {
        try {
          const p = await fetchPosts();
          if (mounted) setPosts(p);
        } catch {
          if (mounted) setPosts([]);
        } finally {
          if (mounted) setLoading(false);
        }
      } else {
        if (mounted) {
          setPosts([]);
          setLoading(false);
        }
      }
    })();
    return () => { mounted = false };
  }, []);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      // GitHub Raw removed due to CORS issues
      // 1) Local static JSON
      try {
        const r1 = await fetch('/data/bwf_news.json?t=' + Date.now(), { cache: 'no-store' });
        if (r1.ok) {
          const j = await r1.json();
          const items: any[] = j?.items || [];
          if (items.length > 0) {
            const mapped = items.map((it) => ({
              id: it.href,
              title: it.title,
              content: '',
              // Hide BWF subdescription on cards
              excerpt: '',
              image: it.img,
              date: it.date || new Date().toISOString(),
              category: 'world',
              url: it.href,
            })) as NewsItem[];
            if (alive) setBwf(mapped);
            return;
          }
        }
      } catch {}
      // 2) API fallback
      try {
        const r2 = await fetch('/api/bwf-news?t=' + Date.now(), { cache: 'no-store' });
        const data = await r2.json();
        const items = (data?.items || []).map((it: any): NewsItem => ({
          id: it.href,
          title: it.title,
          content: '',
          excerpt: it.preview || '',
          image: it.img,
          date: it.date || new Date().toISOString(),
          category: 'world',
          url: it.href,
        }));
        if (alive) setBwf(items);
      } catch {}
    })();
    return () => { alive = false };
  }, []);

  const source: NewsItem[] = (posts || []).map((p) => ({
    id: p.id,
    title: p.title,
    content: '',
    excerpt: p.excerpt || '',
    image: p.image,
    date: p.date,
    category: p.category,
    author: p.author,
    featured: p.featured,
  }));

  const clubNews = source.filter(news => news.category === 'news');
  const worldDisplay = bwf.length > 0 ? bwf : source.filter(news => news.category === 'world');
  const events = source.filter(news => news.category === 'event');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const NewsCard: React.FC<{ news: NewsItem; index: number; category: string }> = ({ news, index, category }) => {
    const getCategoryGradient = (cat: string) => {
      switch (cat) {
        case 'news':
          return 'from-blue-500 to-blue-600';
        case 'world':
          return 'from-orange-500 to-red-500';
        case 'event':
          return 'from-yellow-500 to-orange-500';
        default:
          return 'from-gray-500 to-gray-600';
      }
    };

    const getCategoryIcon = (cat: string) => {
      switch (cat) {
        case 'news':
          return <Newspaper className="w-12 h-12 stroke-1" />;
        case 'world':
          return <Globe className="w-12 h-12 stroke-1" />;
        case 'event':
          return <Award className="w-12 h-12 stroke-1" />;
        default:
          return <Calendar className="w-12 h-12 stroke-1" />;
      }
    };

    const heightClass = ['h-72', 'h-56', 'h-80', 'h-64'][index % 4];

    const Card = (
      <article className="group cursor-pointer mb-8 break-inside-avoid">
        <div className="bg-white rounded-2xl transition-all duration-500 overflow-hidden">
          <div className={`${heightClass} relative overflow-hidden`}>
            {news.image ? (
              <img src={news.image} alt={news.title} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(category)}`} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          </div>
          <div className="p-7">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-gray-500">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{formatDate(news.date)}</span>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white ${
                category === 'news' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                category === 'world' ? 'bg-gradient-to-r from-orange-500 to-red-500' : 
                'bg-gradient-to-r from-yellow-500 to-orange-500'
              }`}>
                {category === 'news' ? '🏢 Клуб' : category === 'world' ? '🌍 Мир' : '🎉 Событие'}
              </div>
            </div>
            <h3 className="font-bold text-2xl text-gray-900 leading-snug mb-4 break-words whitespace-normal">{news.title}</h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">{news.excerpt}</p>
            <div className="flex items-center space-x-2 text-primary-blue transition-all duration-300 cursor-pointer">
              <span className="text-sm font-semibold">Читать далее</span>
              <div className="w-6 h-6 bg-primary-blue/10 rounded-full flex items-center justify-center">
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </article>
    );

    return (news as any).url ? (
      <a href={(news as any).url} target="_blank" rel="noreferrer">{Card}</a>
    ) : (
      Card
    );
  };

  const SectionHeader: React.FC<{ title: string; icon: React.ReactNode; gradient: string; }> = ({ title, icon, gradient }) => (
    <div className="text-center mb-16">
      <div className="inline-flex items-center space-x-6 mb-8">
        <div className={`w-20 h-20 bg-gradient-to-r ${gradient} rounded-3xl flex items-center justify-center text-white`}>
          {icon}
        </div>
        <div className="text-left">
          <h2 className="text-4xl font-bold text-gray-900">{title}</h2>
        </div>
      </div>
    </div>
  );

  const EmptyBlock: React.FC<{ text: string }> = ({ text }) => (
    <div className="text-center text-gray-500 py-8">{text}</div>
  );

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-24">
          <SectionHeader title="Новости клуба" icon={<Newspaper className="w-8 h-8 stroke-1" />} gradient="from-blue-500 to-blue-600" />
          {loading ? (
            <EmptyBlock text="Загрузка..." />
          ) : clubNews.length === 0 ? (
            <EmptyBlock text={isCmsEnabled ? 'Нет материалов' : 'CMS не настроена'} />
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3">
              {clubNews.slice(0, 6).map((news, index) => (
                <NewsCard key={(news as any).id ?? index} news={news} index={index} category="news" />
              ))}
            </div>
          )}
        </section>
        <section className="mb-24">
          <SectionHeader title="Мировые новости" icon={<Globe className="w-8 h-8 stroke-1" />} gradient="from-orange-500 to-red-500" />
          {bwf.length === 0 ? (
            <EmptyBlock text="Нет материалов" />
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3">
              {bwf.slice(0, 6).map((news, index) => (
                <NewsCard key={(news as any).id ?? index} news={news} index={index} category="world" />
              ))}
            </div>
          )}
        </section>
        <section className="mb-24">
          <SectionHeader title="События" icon={<Award className="w-8 h-8 stroke-1" />} gradient="from-yellow-500 to-orange-500" />
          {loading ? (
            <EmptyBlock text="Загрузка..." />
          ) : events.length === 0 ? (
            <EmptyBlock text={isCmsEnabled ? 'Нет материалов' : 'CMS не настроена'} />
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3">
              {events.slice(0, 6).map((event, index) => (
                <NewsCard key={(event as any).id ?? index} news={event} index={index} category="event" />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default BusinessNewsSection;
