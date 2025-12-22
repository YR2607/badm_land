import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Globe, Zap } from 'lucide-react';
import { NewsItem } from '../types';
import { mockNews } from '../data/mockData';
import { useTranslation } from 'react-i18next';

const NewsSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const featuredNews = mockNews.filter(news => news.featured)[0];
  const latestNews = mockNews.filter(news => news.category === 'news').slice(0, 3);
  const worldNews = mockNews.filter(news => news.category === 'world').slice(0, 2);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const map: Record<string, string> = { ru: 'ru-RU', en: 'en-US', ro: 'ro-RO' };
    const loc = map[i18n.language] || 'ru-RU';
    return date.toLocaleDateString(loc, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'news':
        return <Zap className="w-4 h-4" />;
      case 'world':
        return <Globe className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'news':
        return 'bg-primary-blue';
      case 'world':
        return 'bg-primary-orange';
      case 'event':
        return 'bg-primary-yellow';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold font-display text-gray-900 mb-4">
            {t('home.newsSection.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('home.newsSection.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured News */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {featuredNews && (
              <article className="relative group cursor-pointer">
                <div className="relative h-80 bg-gradient-to-br from-primary-blue to-primary-orange rounded-2xl overflow-hidden shadow-xl">
                  {/* Placeholder for image */}
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center text-white text-6xl">
                    📰
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(featuredNews.category)}`}>
                        {getCategoryIcon(featuredNews.category)}
                        <span className="ml-1 capitalize">{featuredNews.category === 'news' ? t('home.newsSection.category.news') : t('home.newsSection.category.events')}</span>
                      </span>
                      <span className="text-sm opacity-80">{formatDate(featuredNews.date)}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary-yellow transition-colors">
                      {featuredNews.title}
                    </h3>
                    <p className="text-gray-200 mb-4">{featuredNews.excerpt}</p>
                    <div className="flex items-center text-primary-yellow group-hover:translate-x-2 transition-transform">
                      <span className="mr-2">{t('common.readMore')}</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </article>
            )}
          </motion.div>

          {/* Latest News Sidebar */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Zap className="w-5 h-5 text-primary-blue mr-2" />
                {t('home.newsSection.latest')}
              </h3>
              <div className="space-y-4">
                {latestNews.map((news, index) => (
                  <motion.article
                    key={news.id}
                    className="group cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="flex space-x-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-blue to-primary-orange rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0">
                        📢
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 group-hover:text-primary-blue transition-colors line-clamp-2">
                          {news.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{formatDate(news.date)}</p>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 text-primary-orange mr-2" />
                {t('home.newsSection.world')}
              </h3>
              <div className="space-y-4">
                {worldNews.map((news, index) => (
                  <motion.article
                    key={news.id}
                    className="group cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                  >
                    <div className="flex space-x-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-orange to-primary-yellow rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0">
                        🌍
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 group-hover:text-primary-orange transition-colors line-clamp-2">
                          {news.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{formatDate(news.date)}</p>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA to Blog */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button className="btn-primary">
            {t('home.newsSection.viewAll')}
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsSection;
