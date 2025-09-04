import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, User, Trophy, Star, CheckCircle, ArrowRight } from 'lucide-react';
import { fetchPage, isCmsEnabled, CmsPage } from '../lib/cms';

const Services: React.FC = () => {
  const [page, setPage] = useState<CmsPage | null>(null);
  useEffect(() => {
    (async () => {
      if (!isCmsEnabled) return;
      const data = await fetchPage('services');
      setPage(data);
    })();
  }, []);

  const services = [
    {
      id: 'group',
      icon: <Users className="w-12 h-12" />,
      title: 'Групповые тренировки',
      description: 'Тренировки в небольших группах до 8 человек с профессиональными тренерами',
      price: 'от 200 лей/месяц',
      features: ['Все уровни подготовки', 'Современное оборудование', 'Гибкое расписание', 'Дружелюбная атмосфера', 'Прогресс отслеживание'],
      color: 'from-primary-blue to-blue-600',
      popular: false
    },
    {
      id: 'individual',
      icon: <User className="w-12 h-12" />,
      title: 'Индивидуальные занятия',
      description: 'Персональные тренировки с личным тренером для быстрого прогресса',
      price: 'от 400 лей/занятие',
      features: ['Индивидуальная программа', 'Гибкий график', 'Максимальное внимание', 'Быстрый прогресс', 'Видеоанализ техники'],
      color: 'from-primary-orange to-orange-600',
      popular: true
    },
    {
      id: 'competition',
      icon: <Trophy className="w-12 h-12" />,
      title: 'Подготовка к соревнованиям',
      description: 'Специализированная подготовка для участия в турнирах и соревнованиях',
      price: 'от 500 лей/месяц',
      features: ['Техническая подготовка', 'Тактическое планирование', 'Психологическая поддержка', 'Спарринг партнеры', 'Анализ соперников'],
      color: 'from-primary-yellow to-yellow-600',
      popular: false
    }
  ];

  const additionalServices = [
    { title: 'Детские группы', description: 'Специальные программы для детей 6-16 лет', icon: '👨‍👩‍👧‍👦' },
    { title: 'Корпоративные занятия', description: 'Тимбилдинг и корпоративные тренировки', icon: '🏢' },
    { title: 'Мастер-классы', description: 'Специальные семинары с приглашенными тренерами', icon: '🎓' },
    { title: 'Фитнес программы', description: 'Общая физическая подготовка для бадминтона', icon: '💪' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-primary-blue to-primary-orange text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">{page?.heroTitle || 'Наши Услуги'}</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">{page?.heroSubtitle || 'Полный спектр услуг для развития ваших навыков в бадминтоне'}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div key={service.id} className={`relative card ${service.popular ? 'ring-2 ring-primary-orange' : ''}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                {service.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-orange text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <Star className="w-4 h-4 mr-1" />Популярно
                    </span>
                  </div>
                )}
                <div className="flex items-start space-x-4 mb-6">
                  <div className={`p-4 bg-gradient-to-r ${service.color} rounded-xl text-white flex-shrink-0`}>
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="text-3xl font-bold text-primary-blue">{service.price}</div>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full btn-primary">Записаться<ArrowRight className="ml-2 w-5 h-5" /></button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-4xl font-bold font-display text-gray-900 mb-4">Дополнительные услуги</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Еще больше возможностей для вашего развития</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => (
              <motion.div key={index} className="card text-center group hover:scale-105 transition-transform duration-300" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
