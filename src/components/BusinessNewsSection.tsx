import React from 'react';
import { Calendar, ArrowRight, Globe, Clock, ExternalLink, Newspaper, Award } from 'lucide-react';
import { NewsItem } from '../types';
import { isCmsEnabled, fetchPosts, CmsPost, fetchClubEmbeds } from '../lib/cms';

type ClubEmbed = { title: string; url: string; description?: string };
type ClubEmbedKind = { title: string; url: string; description?: string; kind?: 'news' | 'event'; date?: string; publishedAt?: string };

const BusinessNewsSection: React.FC = () => {
  const [posts, setPosts] = React.useState<CmsPost[] | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [bwf, setBwf] = React.useState<NewsItem[]>([]);
  const [clubEmbeds, setClubEmbeds] = React.useState<string[]>([]);
  const [clubItems, setClubItems] = React.useState<ClubEmbedKind[]>([]);

  function normalizeUrl(u: string): string {
    try {
      const url = new URL(u);
      url.search = '';
      return url.toString();
    } catch {
      return (u || '').trim();
    }
  }

  function toPluginSrc(input: string): string {
    const raw = (input || '').trim();
    if (!raw) return '';
    const srcMatch = raw.match(/src=["']([^"']+)["']/i);
    let url = '';
    if (srcMatch && srcMatch[1]) {
      url = srcMatch[1];
    } else {
      const hrefMatch = raw.match(/href=["']([^"']+)["']/i);
      if (hrefMatch && hrefMatch[1]) url = hrefMatch[1];
    }
    if (!url) url = raw;
    // If already a Facebook plugin URL (post or video), use as-is
    if (/facebook\.com\/plugins\/(post|video)\.php/i.test(url)) return url;
    // Choose plugin based on URL path
    const isVideo = /facebook\.com\/.+\/videos\//i.test(url);
    const endpoint = isVideo ? 'video.php' : 'post.php';
    return `https://www.facebook.com/plugins/${endpoint}?href=${encodeURIComponent(url)}&show_text=true&width=500`;
  }

  function extractPostUrl(input: string): string {
    const raw = (input || '').trim();
    if (!raw) return '';
    
    // First, decode any HTML entities
    const decoded = raw.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    
    // If it's an iframe, get src
    const srcMatch = decoded.match(/src=["']([^"']+)["']/i);
    let src = srcMatch?.[1] || decoded;
    
    // If input looks like a direct Facebook URL, return it
    if (/^https?:\/\/.*facebook\.com\/(?!plugins)/.test(src)) {
      return src;
    }
    
    try {
      const u = new URL(src);
      
      // If src is a plugin URL, extract the href param and convert to proper Facebook URL
      if (/facebook\.com\/plugins\/(post|video)\.php/i.test(u.pathname)) {
        const href = u.searchParams.get('href');
        if (href) {
          const decodedHref = decodeURIComponent(href);
          
          // Convert video URLs to watch format
          const videoMatch = decodedHref.match(/facebook\.com\/(\d+|[^\/]+)\/videos\/(\d+)/);
          if (videoMatch) {
            return `https://www.facebook.com/watch/?v=${videoMatch[2]}`;
          }
          
          // Convert permalink URLs to direct post URLs  
          const permalinkMatch = decodedHref.match(/facebook\.com\/permalink\.php\?story_fbid=([^&]+)&id=(\d+)/);
          if (permalinkMatch) {
            // Keep the original permalink format as it's more reliable
            return decodedHref;
          }
          
          // Convert photo URLs to direct photo URLs
          const photoMatch = decodedHref.match(/facebook\.com\/photo\.php\?fbid=(\d+)/);
          if (photoMatch) {
            return `https://www.facebook.com/photo/?fbid=${photoMatch[1]}`;
          }
          
          // Return the original href if no specific pattern matches
          return decodedHref;
        }
      }
      
      return src;
    } catch {
      // Try to extract any Facebook URL from the raw string as fallback
      try {
        const fbUrlMatch = raw.match(/https?:\/\/[^"'\s<>&]*facebook\.com\/[^"'\s<>&]*/);
        if (fbUrlMatch) {
          const url = fbUrlMatch[0];
          // If it's a plugin URL, try to extract href parameter
          if (url.includes('/plugins/')) {
            const hrefMatch = url.match(/href=([^&"'\s]+)/);
            if (hrefMatch) {
              const decodedHref = decodeURIComponent(hrefMatch[1]);
              
              // Convert video URLs to watch format
              const videoMatch = decodedHref.match(/facebook\.com\/(\d+|[^\/]+)\/videos\/(\d+)/);
              if (videoMatch) {
                return `https://www.facebook.com/watch/?v=${videoMatch[2]}`;
              }
              
              // Convert permalink URLs to direct post URLs  
              const permalinkMatch = decodedHref.match(/facebook\.com\/permalink\.php\?story_fbid=([^&]+)&id=(\d+)/);
              if (permalinkMatch) {
                // Keep the original permalink format as it's more reliable
                return decodedHref;
              }
              
              return decodedHref;
            }
          }
          return url;
        }
        return '#';
      } catch {
        return '#';
      }
    }
  }

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      if (isCmsEnabled) {
        try {
          const [p, embeds] = await Promise.all([
            fetchPosts(),
            fetchClubEmbeds(),
          ]);
          if (mounted) {
            setPosts(p);
            setClubItems(embeds as any);
          }
        } catch {
          if (mounted) {
            setPosts([]);
            setClubItems([]);
          }
        } finally {
          if (mounted) setLoading(false);
        }
      } else {
        if (mounted) {
          setPosts([]);
          setClubItems([]);
          setLoading(false);
        }
      }
    })();
    return () => { mounted = false };
  }, []);

  // Sort by publishedAt descending
  React.useEffect(() => {
    if (clubItems.length === 0) return;
    const sorted = [...clubItems].sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());
    setClubItems(sorted);
  }, [clubItems.length]);

  React.useEffect(() => {
    let alive = true;
    (async () => {
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

  const worldDisplay = bwf.length > 0 ? bwf : source.filter(news => news.category === 'world');
  const clubList = clubItems.filter((c) => (c.kind || 'news') === 'news');
  const eventList = clubItems.filter((c) => (c.kind || 'news') === 'event');

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
          {clubList.length === 0 ? (
            <EmptyBlock text="Нет материалов" />
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3">
              {clubList.map((item, idx) => (
                <a key={idx} href={extractPostUrl(item.url)} target="_blank" rel="noreferrer" className="group">
                  <article className="group cursor-pointer mb-8 break-inside-avoid">
                    <div className="bg-white rounded-2xl transition-all duration-500 overflow-hidden">
                      {(() => { const heightClass = ['h-72', 'h-56', 'h-80', 'h-64'][idx % 4]; return (
                      <div className={`${heightClass} relative overflow-hidden`}>
                        <iframe
                          title={`fb-post-${idx}`}
                          src={toPluginSrc(item.url)}
                          width="100%"
                          height="100%"
                          style={{ border: 'none', overflow: 'hidden' } as React.CSSProperties}
                          scrolling="no"
                          frameBorder={0}
                          allowFullScreen
                          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                          className="absolute inset-0 w-full h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      </div>
                      )})()}
                      <div className="p-7">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">{item.publishedAt ? formatDate(item.publishedAt) : 'Дата не указана'}</span>
                          </div>
                          <div className="px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600">🏢 Клуб</div>
                        </div>
                        {item.title && <h3 className="font-bold text-2xl text-gray-900 leading-snug mb-4 break-words whitespace-normal">{item.title}</h3>}
                        {item.description && <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>}
                      </div>
                    </div>
                  </article>
                </a>
              ))}
            </div>
          )}
        </section>
        <section className="mb-24">
          <SectionHeader title="Мировые новости" icon={<Globe className="w-8 h-8 stroke-1" />} gradient="from-orange-500 to-red-500" />
          {worldDisplay.length === 0 ? (
            <EmptyBlock text="Нет материалов" />
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3">
              {worldDisplay.slice(0, 6).map((news, index) => (
                <NewsCard key={(news as any).id ?? index} news={news} index={index} category="world" />
              ))}
            </div>
          )}
        </section>
        <section className="mb-24">
          <SectionHeader title="События" icon={<Award className="w-8 h-8 stroke-1" />} gradient="from-yellow-500 to-orange-500" />
          {eventList.length === 0 ? (
            <EmptyBlock text="Нет материалов" />
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3">
              {eventList.map((item, idx) => (
                <a key={idx} href={extractPostUrl(item.url)} target="_blank" rel="noreferrer" className="group">
                  <article className="group cursor-pointer mb-8 break-inside-avoid">
                    <div className="bg-white rounded-2xl transition-all duration-500 overflow-hidden">
                      {(() => { const heightClass = ['h-72', 'h-56', 'h-80', 'h-64'][idx % 4]; return (
                      <div className={`${heightClass} relative overflow-hidden`}>
                        <iframe
                          title={`fb-event-${idx}`}
                          src={toPluginSrc(item.url)}
                          width="100%"
                          height="100%"
                          style={{ border: 'none', overflow: 'hidden' } as React.CSSProperties}
                          scrolling="no"
                          frameBorder={0}
                          allowFullScreen
                          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                          className="absolute inset-0 w-full h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      </div>
                      )})()}
                      <div className="p-7">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">{item.publishedAt ? formatDate(item.publishedAt) : 'Дата не указана'}</span>
                          </div>
                          <div className="px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-yellow-500 to-orange-500">🎉 Событие</div>
                        </div>
                        {item.title && <h3 className="font-bold text-2xl text-gray-900 leading-snug mb-4 break-words whitespace-normal">{item.title}</h3>}
                        {item.description && <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>}
                      </div>
                    </div>
                  </article>
                </a>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default BusinessNewsSection;
