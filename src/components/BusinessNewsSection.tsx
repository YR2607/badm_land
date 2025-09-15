import { FC, useEffect, useState } from 'react';

type WorldNewsItem = {
  title: string;
  href: string;
  img?: string;
  preview?: string;
  date?: string;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const BusinessNewsSection: FC = () => {
  const [worldNews, setWorldNews] = useState<WorldNewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch('/data/bwf_news.json?t=' + Date.now(), { cache: 'no-store' });
        if (!r.ok) throw new Error('Failed to load bwf_news.json');
        const j = await r.json();
        const itemsAll: WorldNewsItem[] = (j?.items || []) as WorldNewsItem[];
        const items: WorldNewsItem[] = itemsAll
          .slice()
          .sort((a: any, b: any) => {
            const da = new Date(a?.date || 0).getTime();
            const db = new Date(b?.date || 0).getTime();
            return db - da;
          })
          .slice(0, 5);
        if (alive) setWorldNews(items);
      } catch (e: any) {
        if (alive) setError(e?.message || 'Не удалось загрузить новости');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="business-news" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-6 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
              </svg>
            </div>
            <div className="text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Мировые новости</h2>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center text-gray-500 py-8">Загрузка…</div>
        )}
        {!loading && error && (
          <div className="text-center text-red-500 py-8">{error}</div>
        )}

        {!loading && !error && worldNews.length === 0 && (
          <div className="text-center text-gray-500 py-8">Нет материалов</div>
        )}

        {!loading && !error && worldNews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:auto-rows-[1fr]">
            {worldNews.map((news, index) => (
              <a key={news.href} href={news.href} target="_blank" rel="noreferrer" className={`group ${index === 1 ? 'lg:row-span-2' : ''}`}>
                <article className="group cursor-pointer h-full">
                  <div className="bg-white rounded-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                    <div className={`${index === 1 ? 'h-56 md:h-72 lg:h-[28rem]' : 'h-56'} relative overflow-hidden`}>
                      {news.img ? (
                        <img 
                          src={news.img.includes('fbcdn.net') || news.img.includes('facebook.com') 
                            ? `/api/image-proxy?url=${encodeURIComponent(news.img)}` 
                            : news.img
                          } 
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
                        className="fallback-bg absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500"
                        style={{ display: news.img ? 'none' : 'block' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 0 0 2-2v-8H3v8a2 2 0 0 0 2 2Z" />
                          </svg>
                          <span className="text-xs md:text-sm font-medium">{formatDate(news.date)}</span>
                        </div>
                        <div className="px-2.5 py-1 rounded-full text-[10px] md:text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500">🌍 Мир</div>
                      </div>
                      <h3 className={`font-bold text-gray-900 leading-snug mb-2 break-words whitespace-normal ${index === 1 ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>{news.title}</h3>
                      {news.preview && (
                        <p className={`text-gray-600 leading-relaxed ${index === 1 ? 'text-base md:text-lg line-clamp-4' : 'text-sm line-clamp-3'}`}>{news.preview}</p>
                      )}
                      <div className="mt-4 flex items-center space-x-2 text-primary-blue transition-all duration-300">
                        <span className="text-sm font-semibold">Читать далее</span>
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

        {/* CTA: Смотреть все новости */}
        {!loading && !error && (
          <div className="text-center mt-12">
            <a 
              href="/blog#world-news" 
              className="inline-flex items-center px-6 py-3 bg-primary-blue text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              <span>Смотреть все новости</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

export default BusinessNewsSection;
