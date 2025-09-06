import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Award, Users, MapPin, Clock, Target, Heart, ChevronRight, Star, Trophy, Zap, Shield } from 'lucide-react';
import { fetchPage, isCmsEnabled, CmsPage } from '../lib/cms';

const About: React.FC = () => {
  const [page, setPage] = useState<CmsPage | null>(null);
  const [activeSection, setActiveSection] = useState<'overview' | 'mission' | 'history' | 'future'>('overview');
  const [showAllHistory, setShowAllHistory] = useState(false);
  const VISIBLE_HISTORY_COUNT = 4;

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    (async () => {
      if (!isCmsEnabled) return;
      const data = await fetchPage('about');
      setPage(data);
    })();
  }, []);

  const stats = [
    { number: '1+', label: 'год роста', icon: <Clock className="w-6 h-6" />, color: 'from-emerald-500 to-teal-600' },
    { number: '120+', label: 'активных участников', icon: <Users className="w-6 h-6" />, color: 'from-blue-500 to-indigo-600' },
    { number: '4', label: 'профессиональных корта', icon: <MapPin className="w-6 h-6" />, color: 'from-purple-500 to-pink-600' },
    { number: '15+', label: 'турниров проведено', icon: <Trophy className="w-6 h-6" />, color: 'from-orange-500 to-red-600' }
  ];

  const features = [
    { icon: <Shield className="w-6 h-6" />, title: 'Безопасность', desc: 'Современное оборудование и строгие протоколы безопасности' },
    { icon: <Zap className="w-6 h-6" />, title: 'Динамика', desc: 'Интенсивные тренировки и соревновательный дух' },
    { icon: <Star className="w-6 h-6" />, title: 'Качество', desc: 'Профессиональные тренеры и индивидуальный подход' }
  ];

  const timeline: Array<{ year: string; quarter: string; title: string; text: string; highlight?: boolean }> = [
    { year: '2024', quarter: 'Q1', title: 'Основание Altius', text: 'Открыли двери и провели первые наборы для взрослых и подростков.', highlight: true },
    { year: '2024', quarter: 'Q2', title: 'Формирование команды', text: 'Стабилизировали расписание, собрали первую клубную группу и стартовали базовый рейтинг.' },
    { year: '2024', quarter: 'Q3', title: 'Первые победы', text: 'Участники клуба взяли призовые места на локальных турнирах.' },
    { year: '2024', quarter: 'Q4', title: 'Итоги первого сезона', text: 'Провели клубный финал года, наградили лучших игроков и тренеров.' },
    { year: '2025', quarter: 'Q1', title: 'Школа юниоров', text: 'Запустили детские группы, тест-сборы, индивидуальные программы.' },
    { year: '2025', quarter: 'Q2', title: 'Клубная лига', text: 'Регулярные внутренние матчи и мини-лиги по уровням.' },
    { year: '2025', quarter: 'Q3', title: 'Расширение', text: 'Выездные турниры, партнёрства, спарринги с другими клубами региона.' },
    { year: '2025', quarter: 'Q4', title: 'Altius Cup', text: 'Открытый турнир клуба с приглашёнными гостями и праздничной церемонией.', highlight: true }
  ];

  const roadmap: Array<{ quarter: string; title: string; desc: string; status: 'completed' | 'active' | 'upcoming' }> = [
    { quarter: '2025 Q3', title: 'Расширение участия', desc: 'Выезды на турниры, партнёрства и спарринги с клубами региона.', status: 'completed' },
    { quarter: '2025 Q4', title: 'Altius Cup', desc: 'Открытый турнир клуба с церемонией и приглашёнными гостями.', status: 'active' },
    { quarter: '2026 Q1', title: 'Академия U17', desc: 'Регулярные сборы, тесты, сопровождение и календарь стартов.', status: 'upcoming' },
    { quarter: '2026 Q2', title: 'Клубная лига 2.0', desc: 'Уровневые дивизионы, рейтинги, матч-дни и трансляции.', status: 'upcoming' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Modern Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
        <motion.div style={{ y }} className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat"></div>
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
            >
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Основан в 2024 году</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Altius
              <span className="block text-3xl md:text-5xl font-light text-blue-200 mt-2">
                Клуб бадминтона
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Где каждый удар приближает к совершенству, а каждая победа — к новым вершинам
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap justify-center gap-4"
            >
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">Профессиональные тренеры</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">15+ турниров</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Users className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">120+ участников</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Stats Section */}
      <section className="relative -mt-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className="bg-white rounded-3xl shadow-xl p-6 text-center hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-600 leading-tight">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Pills */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Узнайте больше о нас</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Выберите раздел, чтобы погрузиться в нашу историю и ценности
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { key: 'overview', label: 'Обзор', desc: 'Кто мы такие' },
              { key: 'mission', label: 'Миссия', desc: 'Наша цель' },
              { key: 'history', label: 'История', desc: 'Как мы росли' },
              { key: 'future', label: 'Будущее', desc: 'Куда идём' }
            ].map((section) => (
              <motion.button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                  activeSection === section.key
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-sm">{section.label}</div>
                <div className="text-xs opacity-75">{section.desc}</div>
              </motion.button>
            ))}
          </div>

          {/* Content Sections */}
          <div className="space-y-16">
            {activeSection === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-200 hover:border-blue-300 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeSection === 'mission' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center max-w-4xl mx-auto"
              >
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12 border border-blue-100">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="text-6xl mb-6"
                  >
                    🎯
                  </motion.div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">Наша миссия</h3>
                  <p className="text-xl text-gray-700 leading-relaxed mb-8">
                    Создавать сообщество увлечённых бадминтоном людей, где каждый может развиваться,
                    достигать новых высот и находить друзей с похожими интересами.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="text-2xl mb-2">🌟</div>
                      <h4 className="font-semibold mb-2">Доступность</h4>
                      <p className="text-sm text-gray-600">Тренировки для всех уровней подготовки</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="text-2xl mb-2">🏆</div>
                      <h4 className="font-semibold mb-2">Результаты</h4>
                      <p className="text-sm text-gray-600">Регулярные турниры и достижения</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="text-2xl mb-2">🤝</div>
                      <h4 className="font-semibold mb-2">Сообщество</h4>
                      <p className="text-sm text-gray-600">Дружная атмосфера и поддержка</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'history' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
              >
                {timeline.reduce((acc: any[], item, index) => {
                  const yearIndex = acc.findIndex(group => group.year === item.year);
                  if (yearIndex === -1) {
                    acc.push({ year: item.year, items: [item] });
                  } else {
                    acc[yearIndex].items.push(item);
                  }
                  return acc;
                }, []).map((yearGroup, yearIndex) => (
                  <motion.div
                    key={yearGroup.year}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: yearIndex * 0.1 }}
                  >
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-2xl font-bold text-gray-900">{yearGroup.year}</span>
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {yearGroup.items.map((item, itemIndex) => (
                        <motion.div
                          key={itemIndex}
                          whileHover={{ y: -5, scale: 1.02 }}
                          className={`rounded-2xl p-6 border-2 transition-all duration-300 ${
                            item.highlight
                              ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow-lg'
                              : 'bg-white border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                              {item.quarter}
                            </span>
                            {item.highlight && <Star className="w-4 h-4 text-yellow-500" />}
                          </div>
                          <h4 className="font-bold text-gray-900 mb-2 leading-tight">{item.title}</h4>
                          <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeSection === 'future' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Наш путь вперёд</h3>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Мы постоянно развиваемся и планируем новые достижения
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {roadmap.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium">
                          {item.quarter}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'completed' ? 'bg-green-100 text-green-700' :
                          item.status === 'active' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {item.status === 'completed' ? '✅ Выполнено' :
                           item.status === 'active' ? '🔥 В работе' :
                           '⏳ Запланировано'}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold">Готовы присоединиться?</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Станьте частью нашего спортивного сообщества и откройте для себя мир бадминтона
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              Присоединиться к клубу
              <ChevronRight className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
