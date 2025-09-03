import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Globe, Zap, Trophy, Clock, Heart } from 'lucide-react';
import { NewsItem } from '../types';
import { mockNews } from '../data/mockData';

const UBFStyleNewsSection: React.FC = () => {
  const featuredNews = mockNews.filter(news => news.featured)[0];
  const latestNews = mockNews.filter(news => news.category === 'news').slice(0, 3);
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
        return <Zap className="w-5 h-5" />;
      case 'world':
        return <Globe className="w-5 h-5" />;
      case 'event':
        return <Trophy className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
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
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display text-primary-black mb-6">
            Новости и События
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Следите за последними новостями клуба и мировыми событиями в бадминтоне. 
            Будьте в курсе всех важных событий нашего спортивного сообщества.
          </p>
        </motion.div>

        {/* Main Featured Article */}
        {featuredNews && (
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <article className="relative group cursor-pointer overflow-hidden rounded-3xl shadow-2xl bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[500px]">
                {/* Large Image */}
                <div className="lg:col-span-3 relative">
                  <div className="h-full bg-gradient-to-br from-primary-blue via-primary-blue/90 to-primary-gray-800 flex items-center justify-center text-white relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full"></div>
                      <div className="absolute bottom-10 right-10 w-24 h-24 border border-primary-yellow rounded-full"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white/30 rounded-full"></div>
                    </div>
                    {/* Main Icon */}
                    <div className="text-8xl opacity-80 group-hover:scale-110 transition-transform duration-500">
                      📰
                    </div>
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/60 transition-all duration-300"></div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="lg:col-span-2 p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center space-x-3 mb-6">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white ${getCategoryColor(featuredNews.category)}`}>
                      {getCategoryIcon(featuredNews.category)}
                      <span className="ml-2">{getCategoryLabel(featuredNews.category)}</span>
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDate(featuredNews.date)}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 group-hover:text-primary-blue transition-colors leading-tight">
                    {featuredNews.title}
                  </h3>
                  
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    {featuredNews.content.substring(0, 300)}...
                  </p>
                  
                  <div className="flex items-center text-primary-blue group-hover:translate-x-3 transition-transform duration-300">
                    <span className="mr-3 font-semibold text-lg">Читать полностью</span>
                    <ArrowRight size={24} className="group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </div>
            </article>
          </motion.div>
        )}

        {/* News Grid - UBF Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Club News Section */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center">
              <div className="inline-flex items-center px-6 py-3 bg-primary-blue rounded-full text-white mb-6">
                <Zap className="w-6 h-6 mr-2" />
                <span className="font-semibold text-lg">Новости клуба</span>
              </div>
            </div>
            
            <div className="space-y-6">
              {latestNews.map((news, index) => (
                <motion.article
                  key={news.id}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:scale-105">
                    {/* Image */}
                    <div className="h-48 bg-gradient-to-br from-primary-blue to-primary-blue/80 flex items-center justify-center text-white text-4xl relative overflow-hidden">
                      📢
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-500">{formatDate(news.date)}</span>
                        <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
                      </div>
                      
                      <h4 className="font-bold text-lg text-gray-900 group-hover:text-primary-blue transition-colors mb-3 line-clamp-2">
                        {news.title}
                      </h4>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {news.excerpt}
                      </p>
                      
                      <div className="flex items-center text-primary-blue group-hover:translate-x-2 transition-transform">
                        <span className="text-sm font-medium">Подробнее</span>
                        <ArrowRight size={16} className="ml-1" />
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>

          {/* World News Section */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-center">
              <div className="inline-flex items-center px-6 py-3 bg-primary-orange rounded-full text-white mb-6">
                <Globe className="w-6 h-6 mr-2" />
                <span className="font-semibold text-lg">Мировые новости</span>
              </div>
            </div>
            
            <div className="space-y-6">
              {worldNews.map((news, index) => (
                <motion.article
                  key={news.id}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:scale-105">
                    <div className="h-48 bg-gradient-to-br from-primary-orange to-primary-orange/80 flex items-center justify-center text-white text-4xl relative overflow-hidden">
                      🌍
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-500">{formatDate(news.date)}</span>
                        <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
                      </div>
                      
                      <h4 className="font-bold text-lg text-gray-900 group-hover:text-primary-orange transition-colors mb-3 line-clamp-2">
                        {news.title}
                      </h4>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {news.excerpt}
                      </p>
                      
                      <div className="flex items-center text-primary-orange group-hover:translate-x-2 transition-transform">
                        <span className="text-sm font-medium">Подробнее</span>
                        <ArrowRight size={16} className="ml-1" />
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>

          {/* Events Section */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-center">
              <div className="inline-flex items-center px-6 py-3 bg-primary-yellow rounded-full text-white mb-6">
                <Trophy className="w-6 h-6 mr-2" />
                <span className="font-semibold text-lg">События</span>
              </div>
            </div>
            
            <div className="space-y-6">
              {events.map((event, index) => (
                <motion.article
                  key={event.id}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:scale-105">
                    <div className="h-48 bg-gradient-to-br from-primary-yellow to-primary-yellow/80 flex items-center justify-center text-white text-4xl relative overflow-hidden">
                      📅
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-500">{formatDate(event.date)}</span>
                        <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
                      </div>
                      
                      <h4 className="font-bold text-lg text-gray-900 group-hover:text-primary-yellow transition-colors mb-3 line-clamp-2">
                        {event.title}
                      </h4>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {event.excerpt}
                      </p>
                      
                      <div className="flex items-center text-primary-yellow group-hover:translate-x-2 transition-transform">
                        <span className="text-sm font-medium">Подробнее</span>
                        <ArrowRight size={16} className="ml-1" />
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center bg-white rounded-3xl shadow-xl p-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Не пропустите важные события!
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Подпишитесь на нашу рассылку и получайте уведомления о новых турнирах, мастер-классах и новостях клуба.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-primary-blue text-white font-semibold rounded-xl hover:bg-primary-blue/90 transition-all duration-300 shadow-lg hover:shadow-xl">
              Все новости
              <ArrowRight className="ml-2 w-5 h-5 inline" />
            </button>
            <button className="px-8 py-4 bg-primary-yellow text-white font-semibold rounded-xl hover:bg-primary-yellow/90 transition-all duration-300 shadow-lg hover:shadow-xl">
              Календарь событий
              <Calendar className="ml-2 w-5 h-5 inline" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UBFStyleNewsSection;
