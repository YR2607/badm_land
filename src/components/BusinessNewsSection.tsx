import React from 'react';
import { Calendar, ArrowRight, Globe, Clock, ExternalLink, Newspaper, Award } from 'lucide-react';
import { NewsItem } from '../types';
import { mockNews } from '../data/mockData';
import { isCmsEnabled, fetchPosts, CmsPost } from '../lib/cms';

const BusinessNewsSection: React.FC = () => {
  const [posts, setPosts] = React.useState<CmsPost[] | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      if (isCmsEnabled) {
        try {
          const p = await fetchPosts();
          if (mounted) setPosts(p);
        } catch {}
      }
    })();
    return () => { mounted = false };
  }, []);

  const source = posts && posts.length > 0
    ? posts.map((p) => ({
        id: p.id,
        title: p.title,
        content: '',
        excerpt: p.excerpt || '',
        image: p.image,
        date: p.date,
        category: p.category,
        author: p.author,
        featured: p.featured,
      })) as NewsItem[]
    : mockNews;

  const clubNews = source.filter(news => news.category === 'news');
  const worldNews = source.filter(news => news.category === 'world');
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

    const getHeightClass = (i: number) => {
      const heights = ['h-72', 'h-56', 'h-80', 'h-64'];
      return heights[i % heights.length];
    };

    const heightClass = getHeightClass(index);

    return (
      <article className="group cursor-pointer mb-8 break-inside-avoid">
        <div className="bg-white rounded-2xl transition-all duration-500 overflow-hidden">
          <div className={`${heightClass} bg-gradient-to-br ${getCategoryGradient(category)} flex items-center justify-center text-white relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-16 h-16 rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full"></div>
            </div>
            <div className="relative z-10 opacity-90">
              {getCategoryIcon(category)}
            </div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg:white/30 transition-colors">
                <ExternalLink className="w-5 h-5 text:white" />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          </div>
          <div className="p-7">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-gray-500">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {formatDate(news.date)}
                </span>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white ${
                category === 'news' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                category === 'world' ? 'bg-gradient-to-r from-orange-500 to-red-500' : 
                'bg-gradient-to-r from-yellow-500 to-orange-500'
              }`}>
                {category === 'news' ? '🏢 Клуб' : category === 'world' ? '🌍 Мир' : '🎉 Событие'}
              </div>
            </div>
            <h3 className="font-bold text-xl text-gray-900 leading-tight mb-4 line-clamp-2">
              {news.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">
              {news.excerpt}
            </p>
            <div className="flex items-center justify-between pt-4">
              {news.author && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-600">
                      {news.author.charAt(0)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {news.author}
                  </span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-primary-blue transition-all duration-300 cursor-pointer">
                <span className="text-sm font-semibold">Читать далее</span>
                <div className="w-6 h-6 bg-primary-blue/10 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  };

  const SectionHeader: React.FC<{ 
    title: string; 
    icon: React.ReactNode; 
    gradient: string;
  }> = ({ title, icon, gradient }) => (
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

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-24">
          <SectionHeader
            title="Новости клуба"
            icon={<Newspaper className="w-8 h-8 stroke-1" />}
            gradient="from-blue-500 to-blue-600"
          />
          <div className="columns-1 md:columns-2 lg:columns-3">
            {clubNews.slice(0, 6).map((news, index) => (
              <NewsCard key={(news as any).id ?? index} news={news} index={index} category="news" />
            ))}
          </div>
        </section>
        <section className="mb-24">
          <SectionHeader
            title="Мировые новости"
            icon={<Globe className="w-8 h-8 stroke-1" />}
            gradient="from-orange-500 to-red-500"
          />
          <div className="columns-1 md:columns-2 lg:columns-3">
            {worldNews.slice(0, 6).map((news, index) => (
              <NewsCard key={(news as any).id ?? index} news={news} index={index} category="world" />
            ))}
          </div>
        </section>
        <section className="mb-24">
          <SectionHeader
            title="События"
            icon={<Award className="w-8 h-8 stroke-1" />}
            gradient="from-yellow-500 to-orange-500"
          />
          <div className="columns-1 md:columns-2 lg:columns-3">
            {events.slice(0, 6).map((event, index) => (
              <NewsCard key={(event as any).id ?? index} news={event} index={index} category="event" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BusinessNewsSection;
