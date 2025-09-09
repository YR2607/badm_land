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
          .slice(0, 6);
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {worldNews.map((news) => (
              <a key={news.href} href={news.href} target="_blank" rel="noreferrer" className="group">
                <article className="group cursor-pointer">
                  <div className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                    <div className={`h-56 relative overflow-hidden`}>
                      {news.img ? (
                        <img src={news.img} alt={news.title} className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-[1.02]" />
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500`} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 0 0 2-2v-8H3v8a2 2 0 0 0 2 2Z" />
                          </svg>
                          <span className="text-xs md:text-sm font-medium">{formatDate(news.date)}</span>
                        </div>
                        <div className="px-2.5 py-1 rounded-full text-[10px] md:text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500">🌍 Мир</div>
                      </div>
                      <h3 className="font-bold text-xl md:text-2xl text-gray-900 leading-snug mb-2 break-words whitespace-normal">{news.title}</h3>
                      {news.preview && (
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{news.preview}</p>
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
          <div className="mt-6 flex justify-center">
            <a
              href="/blog#world-news"
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              Смотреть все новости
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
