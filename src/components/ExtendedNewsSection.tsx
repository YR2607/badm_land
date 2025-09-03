import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Globe, Zap, Trophy, Clock } from 'lucide-react';
import { NewsItem } from '../types';
import { mockNews } from '../data/mockData';

const ExtendedNewsSection: React.FC = () => {
  const featuredNews = mockNews.filter(news => news.featured)[0];
  const latestNews = mockNews.filter(news => news.category === 'news').slice(0, 4);
  const worldNews = mockNews.filter(news => news.category === 'world').slice(0, 3);
  const events = mockNews.filter(news => news.category === 'event').slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
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
      case 'event':
        return <Trophy className="w-4 h-4" />;
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

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'news':
        return 'Новости клуба';
      case 'world':
        return 'Мировые новости';
      case 'event':
        return 'События';
      default:
        return category;
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            Новости и События
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Следите за последними новостями клуба и мировыми событиями в бадминтоне
          </p>
        </motion.div>

        {/* Main Featured News */}
        {featuredNews && (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <article className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
                {/* Image */}
                <div className="relative bg-gradient-to-br from-primary-blue to-primary-gray-800 flex items-center justify-center text-white text-6xl">
                  📰
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                
                {/* Content */}
                <div className="p-8 flex flex-col justify-center bg-gray-50">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(featuredNews.category)}`}>
                      {getCategoryIcon(featuredNews.category)}
                      <span className="ml-1">{getCategoryLabel(featuredNews.category)}</span>
                    </span>
                    <span className="text-sm text-gray-500">{formatDate(featuredNews.date)}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-primary-blue transition-colors">
                    {featuredNews.title}
                  </h3>
                  <p className="text-gray-600 mb-6 text-lg">{featuredNews.content.substring(0, 200)}...</p>
                  <div className="flex items-center text-primary-blue group-hover:translate-x-2 transition-transform">
                    <span className="mr-2 font-medium">Читать полностью</span>
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </article>
          </motion.div>
        )}

        {/* News Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest Club News */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <Zap className="w-6 h-6 text-primary-blue mr-2" />
                Новости клуба
              </h3>
              <button className="text-primary-blue hover:text-primary-blue/80 text-sm font-medium">
                Все новости
              </button>
            </div>
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
                  <div className="card hover:border-primary-blue/20">
                    <div className="flex space-x-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-blue to-primary-blue/80 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0">
                        📢
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 group-hover:text-primary-blue transition-colors line-clamp-2 mb-2">
                          {news.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">{formatDate(news.date)}</p>
                        <p className="text-sm text-gray-500 line-clamp-2">{news.excerpt}</p>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>

          {/* World News */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <Globe className="w-6 h-6 text-primary-orange mr-2" />
                Мировые новости
              </h3>
              <button className="text-primary-orange hover:text-primary-orange/80 text-sm font-medium">
                Все новости
              </button>
            </div>
            <div className="space-y-4">
              {worldNews.map((news, index) => (
                <motion.article
                  key={news.id}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="card hover:border-primary-orange/20">
                    <div className="flex space-x-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-orange to-primary-orange/80 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0">
                        🌍
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 group-hover:text-primary-orange transition-colors line-clamp-2 mb-2">
                          {news.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">{formatDate(news.date)}</p>
                        <p className="text-sm text-gray-500 line-clamp-2">{news.excerpt}</p>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>

          {/* Events and Tournaments */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <Trophy className="w-6 h-6 text-primary-yellow mr-2" />
                События и турниры
              </h3>
              <button className="text-primary-yellow hover:text-primary-yellow/80 text-sm font-medium">
                Все события
              </button>
            </div>
            <div className="space-y-4">
              {events.map((event, index) => (
                <motion.article
                  key={event.id}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="card hover:border-primary-yellow/20">
                    <div className="flex space-x-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-yellow to-primary-yellow/80 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0">
                        📅
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 group-hover:text-primary-yellow transition-colors line-clamp-2 mb-2">
                          {event.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDate(event.date)}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-2">{event.excerpt}</p>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Access Buttons */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">
              Все новости и события
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button className="btn-secondary">
              Календарь мероприятий
              <Calendar className="ml-2 w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExtendedNewsSection;
