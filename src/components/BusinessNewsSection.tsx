import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { proxied } from '../utils/blockFacebookImages';
import { useTranslation } from 'react-i18next';

type WorldNewsItem = {
  title: string;
  href: string;
  img?: string;
  preview?: string;
  date?: string;
};

const formatDate = (dateString?: string, locale: string = 'ru') => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const map: Record<string, string> = { ru: 'ru-RU', en: 'en-US', ro: 'ro-RO' };
  const loc = map[locale] || 'ru-RU';
  return date.toLocaleDateString(loc, { day: 'numeric', month: 'long', year: 'numeric' });
};

const BusinessNewsSection: FC = () => {
  const { t, i18n } = useTranslation();
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
        if (alive) setError(e?.message || t('common.error'));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="business-news" className="py-32 bg-zenith-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-24 relative"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-8xl md:text-[12rem] font-black font-display leading-[0.8] tracking-tighter uppercase text-zenith-black opacity-10 absolute -top-10 left-0 pointer-events-none select-none">
            Global
          </h2>
          <h2 className="text-4xl md:text-8xl font-black font-display leading-tight-impact tracking-tighter uppercase text-zenith-black relative z-10 break-words [overflow-wrap:anywhere]">
            {t('home.worldNews.title', 'Мировые новости')}
          </h2>
          <div className="w-32 h-4 bg-zenith-crimson mt-8" />
        </motion.div>

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-zenith-black/10 border-t-zenith-crimson rounded-full animate-spin" />
          </div>
        )}
        {!loading && error && (
          <div className="text-center text-zenith-crimson py-8 font-bold text-xl uppercase tracking-widest">{error}</div>
        )}

        {!loading && !error && worldNews.length === 0 && (
          <div className="text-center text-zenith-black/40 py-8 font-bold text-xl uppercase tracking-widest">{t('home.worldNews.noMaterials')}</div>
        )}

        {!loading && !error && worldNews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-6 min-h-[800px]">
            {worldNews.slice(0, 4).map((news, index) => (
              <motion.a
                key={news.href}
                href={news.href}
                target="_blank"
                rel="noreferrer"
                className={`bento-card group relative flex flex-col ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className="absolute inset-0 scanlines opacity-50 z-10 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-zenith-black via-zenith-black/80 to-transparent z-20" />

                <div className="absolute inset-0 overflow-hidden">
                  {news.img ? (
                    <img
                      src={proxied(news.img)}
                      alt={news.title}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-zenith-black" />
                  )}
                </div>

                <div className="relative z-30 mt-auto p-8 md:p-12">
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="px-4 py-1 bg-zenith-crimson text-white text-xs font-black uppercase tracking-[0.2em]">
                      {t('home.worldNews.tagWorld', 'World')}
                    </span>
                    <span className="text-white/60 text-xs font-bold uppercase tracking-widest">
                      {formatDate(news.date, i18n.language)}
                    </span>
                  </div>

                  <h3 className={`font-black font-display text-white uppercase tracking-tight leading-tight group-hover:text-zenith-crimson transition-colors duration-300 break-words [overflow-wrap:anywhere] ${index === 0 ? 'text-3xl md:text-5xl' : 'text-xl md:text-2xl'}`}>
                    {news.title}
                  </h3>

                  {index === 0 && news.preview && (
                    <p className="mt-6 text-white/70 text-lg font-medium leading-relaxed line-clamp-3">
                      {news.preview}
                    </p>
                  )}

                  <div className="mt-8 flex items-center space-x-4 group-hover:translate-x-2 transition-transform duration-300">
                    <span className="text-sm font-black text-white uppercase tracking-widest">{t('common.readMore')}</span>
                    <ArrowRight className="w-5 h-5 text-zenith-crimson" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}

        {!loading && !error && (
          <div className="text-center mt-20">
            <motion.div
              className="inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/blog#world-news"
                className="inline-block px-12 py-6 bg-zenith-black text-white font-black uppercase tracking-[0.3em] text-xl hover:bg-zenith-crimson transition-colors duration-500 shadow-2xl"
              >
                {t('home.worldNews.viewAll')}
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BusinessNewsSection;
