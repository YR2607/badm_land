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
        const items: WorldNewsItem[] = (j?.items || []).slice(0, 12);
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
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
              </svg>
            </div>
            <div className="text-left">
              <h2 className="text-4xl font-bold text-gray-900">Мировые новости</h2>
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
          <div className="columns-1 md:columns-2 lg:columns-3">
            {worldNews.map((news, index) => {
              const heightClass = ['h-72', 'h-56', 'h-80', 'h-64'][index % 4];
              return (
                <a key={news.href} href={news.href} target="_blank" rel="noreferrer" className="group">
                  <article className="group cursor-pointer mb-8 break-inside-avoid">
                    <div className="bg-white rounded-2xl transition-all duration-500 overflow-hidden">
                      <div className={`${heightClass} relative overflow-hidden`}>
                        {news.img ? (
                          <img src={news.img} alt={news.title} className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                          <div className={`absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500`} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                      </div>
                      <div className="p-7">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2 text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 0 0 2-2v-8H3v8a2 2 0 0 0 2 2Z" />
                            </svg>
                            <span className="text-sm font-medium">{formatDate(news.date)}</span>
                          </div>
                          <div className="px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500">🌍 Мир</div>
                        </div>
                        <h3 className="font-bold text-2xl text-gray-900 leading-snug mb-3 break-words whitespace-normal">{news.title}</h3>
                        {news.preview && (
                          <p className="text-gray-600 text-sm leading-relaxed">{news.preview}</p>
                        )}
                        <div className="mt-6 flex items-center space-x-2 text-primary-blue transition-all duration-300">
                          <span className="text-sm font-semibold">Читать далее</span>
                          <div className="w-6 h-6 bg-primary-blue/10 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default BusinessNewsSection;
