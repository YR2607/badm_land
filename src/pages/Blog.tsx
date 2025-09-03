import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Globe, Zap, Search, Filter, ArrowRight } from 'lucide-react';
import { NewsItem } from '../types';
import { mockNews } from '../data/mockData';

const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = [
    { value: 'all', label: 'Все', icon: <Filter className="w-4 h-4" /> },
    { value: 'news', label: 'Новости клуба', icon: <Zap className="w-4 h-4" /> },
    { value: 'event', label: 'События', icon: <Calendar className="w-4 h-4" /> },
    { value: 'world', label: 'Мировые новости', icon: <Globe className="w-4 h-4" /> }
  ];

  const filteredNews = mockNews.filter(news => {
    const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory;
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-blue to-primary-orange text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">
              Новости и События
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Следите за последними новостями нашего клуба и мировыми событиями в бадминтоне
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <motion.div
              className="relative flex-grow max-w-md"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск новостей..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              />
            </motion.div>

            {/* Categories */}
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.value
                      ? 'bg-primary-blue text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.icon}
                  <span>{category.label}</span>
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredNews.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Новости не найдены</h3>
              <p className="text-gray-600">Попробуйте изменить параметры поиска</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((news, index) => (
                <motion.article
                  key={news.id}
                  className="card group cursor-pointer hover:scale-105 transition-transform duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {/* Image */}
                  <div className="h-48 bg-gradient-to-br from-primary-blue to-primary-orange rounded-lg mb-4 flex items-center justify-center text-white text-4xl overflow-hidden">
                    {news.category === 'news' && '📰'}
                    {news.category === 'event' && '📅'}
                    {news.category === 'world' && '🌍'}
                  </div>

                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(news.category)}`}>
                      {getCategoryLabel(news.category)}
                    </span>
                    <span className="text-sm text-gray-500">{formatDate(news.date)}</span>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-blue transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{news.excerpt}</p>

                  {/* Author and Read More */}
                  <div className="flex items-center justify-between">
                    {news.author && (
                      <span className="text-sm text-gray-500">
                        {news.author}
                      </span>
                    )}
                    <div className="flex items-center text-primary-blue group-hover:translate-x-2 transition-transform">
                      <span className="mr-2 text-sm font-medium">Читать</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {filteredNews.length > 0 && (
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <button className="btn-primary">
                Загрузить еще
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
