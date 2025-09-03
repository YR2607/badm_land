import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Globe, Zap, Trophy, Clock, ExternalLink, Newspaper, MapPin, Award } from 'lucide-react';
import { NewsItem } from '../types';
import { mockNews } from '../data/mockData';

const BusinessNewsSection: React.FC = () => {
  const clubNews = mockNews.filter(news => news.category === 'news');
  const worldNews = mockNews.filter(news => news.category === 'world');
  const events = mockNews.filter(news => news.category === 'event');

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
          {/* Image */}
          <div className={`${heightClass} bg-gradient-to-br ${getCategoryGradient(category)} flex items-center justify-center text-white relative overflow-hidden`}>
            {/* Decorative background elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-16 h-16 rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full"></div>
            </div>
            
            {/* Icon */}
            <div className="relative z-10 opacity-90">
              {getCategoryIcon(category)}
            </div>
            
            {/* Floating action button */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <ExternalLink className="w-5 h-5 text-white" />
              </div>
            </div>
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          </div>
          
          {/* Content */}
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
    color: string;
    count: number;
    gradient: string;
  }> = ({ title, icon, color, count, gradient }) => (
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
        
        {/* Club News Section */}
        <section className="mb-24">
          <SectionHeader
            title="Новости клуба"
            icon={<Newspaper className="w-8 h-8 stroke-1" />}
            color="bg-primary-blue"
            count={clubNews.length}
            gradient="from-blue-500 to-blue-600"
          />
          
          <div className="columns-1 md:columns-2 lg:columns-3">
            {clubNews.slice(0, 6).map((news, index) => (
              <NewsCard key={news.id} news={news} index={index} category="news" />
            ))}
          </div>
          
          {clubNews.length > 6 && (
            <div className="mt-16 text-center">
              <button className="group relative px-10 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold transform hover:scale-105 overflow-hidden">
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="relative flex items-center">
                  Показать еще {clubNews.length - 6} новостей
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          )}
        </section>

        {/* World News Section */}
        <section className="mb-24">
          <SectionHeader
            title="Мировые новости"
            icon={<Globe className="w-8 h-8 stroke-1" />}
            color="bg-primary-orange"
            count={worldNews.length}
            gradient="from-orange-500 to-red-500"
          />
          
          <div className="columns-1 md:columns-2 lg:columns-3">
            {worldNews.slice(0, 6).map((news, index) => (
              <NewsCard key={news.id} news={news} index={index} category="world" />
            ))}
          </div>
          
          {worldNews.length > 6 && (
            <div className="mt-16 text-center">
              <button className="group relative px-10 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-semibold transform hover:scale-105 overflow-hidden">
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="relative flex items-center">
                  Показать еще {worldNews.length - 6} новостей
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          )}
        </section>

        {/* Events Section */}
        <section className="mb-24">
          <SectionHeader
            title="События"
            icon={<Award className="w-8 h-8 stroke-1" />}
            color="bg-primary-yellow"
            count={events.length}
            gradient="from-yellow-500 to-orange-500"
          />
          
          <div className="columns-1 md:columns-2 lg:columns-3">
            {events.slice(0, 6).map((event, index) => (
              <NewsCard key={event.id} news={event} index={index} category="event" />
            ))}
          </div>
          
          {events.length > 6 && (
            <div className="mt-16 text-center">
              <button className="group relative px-10 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 font-semibold transform hover:scale-105 overflow-hidden">
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="relative flex items-center">
                  Показать еще {events.length - 6} событий
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          )}
        </section>

        {/* Navigation/Quick Links */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Быстрый доступ
            </h2>
            <p className="text-gray-600">Перейдите к нужному разделу в один клик</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.button 
              className="group relative bg-white rounded-3xl transition-all duration-500 p-10 hover:scale-[1.02] overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Calendar className="w-10 h-10 stroke-1" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors mb-3">
                  Календарь событий
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Все предстоящие турниры и мероприятия с возможностью регистрации
                </p>
                <div className="mt-6 flex items-center justify-center text-blue-600 group-hover:translate-x-2 transition-transform">
                  <span className="text-sm font-semibold mr-2">Перейти</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.button>
            
            <motion.button 
              className="group relative bg-white rounded-3xl transition-all duration-500 p-10 hover:scale-[1.02] overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Globe className="w-10 h-10 stroke-1" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 group-hover:text-orange-600 transition-colors mb-3">
                  Архив новостей
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Полный архив всех публикаций с возможностью поиска по дате
                </p>
                <div className="mt-6 flex items-center justify-center text-orange-600 group-hover:translate-x-2 transition-transform">
                  <span className="text-sm font-semibold mr-2">Перейти</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.button>
            
            <motion.button 
              className="group relative bg-white rounded-3xl transition-all duration-500 p-10 hover:scale-[1.02] overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Award className="w-10 h-10 stroke-1" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 group-hover:text-yellow-600 transition-colors mb-3">
                  Результаты турниров
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Итоги соревнований, рейтинги игроков и статистика
                </p>
                <div className="mt-6 flex items-center justify-center text-yellow-600 group-hover:translate-x-2 transition-transform">
                  <span className="text-sm font-semibold mr-2">Перейти</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BusinessNewsSection;
