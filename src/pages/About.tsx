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
    { number: '1+', label: 'год опыта', icon: <Clock className="w-6 h-6" />, color: 'from-primary-blue to-blue-600' },
    { number: '120+', label: 'активных участников', icon: <Users className="w-6 h-6" />, color: 'from-primary-yellow to-yellow-600' },
    { number: '4', label: 'профессиональных корта', icon: <MapPin className="w-6 h-6" />, color: 'from-primary-orange to-red-600' },
    { number: '15+', label: 'турниров проведено', icon: <Award className="w-6 h-6" />, color: 'from-primary-blue to-blue-700' }
  ];

  const features = [
    { icon: <Shield className="w-6 h-6" />, title: 'Безопасность', desc: 'Современное оборудование и строгие протоколы безопасности', color: 'from-primary-blue to-blue-600' },
    { icon: <Zap className="w-6 h-6" />, title: 'Динамика', desc: 'Интенсивные тренировки и соревновательный дух', color: 'from-primary-yellow to-yellow-600' },
    { icon: <Star className="w-6 h-6" />, title: 'Качество', desc: 'Профессиональные тренеры и индивидуальный подход', color: 'from-primary-orange to-red-600' }
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
    <div className="min-h-screen bg-white">
      {/* Hero Section matching main site style */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-black via-slate-900 to-slate-900">
        <div className="absolute inset-0">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src="/jump.MP4"
            autoPlay
            muted
            playsInline
            loop
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70vh] md:h-[75vh]">
            <div
              className="w-full h-full bg-white"
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.01) 10%, rgba(0,0,0,0.03) 25%, rgba(0,0,0,0.08) 45%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.30) 75%, rgba(0,0,0,0.55) 90%, rgba(0,0,0,0.80) 97%, rgba(0,0,0,1) 100%)',
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.01) 10%, rgba(0,0,0,0.03) 25%, rgba(0,0,0,0.08) 45%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.30) 75%, rgba(0,0,0,0.55) 90%, rgba(0,0,0,0.80) 97%, rgba(0,0,0,1) 100%)'
              }}
            />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
              <Award className="w-5 h-5 text-primary-yellow mr-2" />
              <span className="text-sm font-medium text-white">Профессиональный клуб с 2024 года</span>
            </motion.div>

            <motion.h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-display mb-8 leading-tight" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
              <span className="text-white">ALTIUS</span>
              <br />
              <span className="text-2xl md:text-3xl lg:text-4xl font-light text-primary-yellow italic font-display">{page?.heroSubtitle || 'Бадминтонный клуб'}</span>
            </motion.h1>

            <motion.p className="text-xl md:text-2xl text-white/90 mb-10 max-w-4xl mx-auto leading-relaxed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}>
              Профессиональные тренировки, современное оборудование и дружелюбная атмосфера в самом современном бадминтонном клубе
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-6 justify-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}>
              <button className="btn-accent">
                Записаться на пробное занятие
                <ChevronRight className="ml-3 w-5 h-5 inline" />
              </button>
              <button className="px-10 py-5 bg-white/10 backdrop-blur-md text-white font-medium rounded-2xl border border-white/30 hover:bg-white/20 transition-all duration-500 shadow-xl tracking-wide">
                Посмотреть видео
              </button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-primary-orange" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.6 }}>
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm">Прокрутите вниз</span>
            <div className="w-6 h-10 border-2 border-primary-orange/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-primary-orange rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section matching main site */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-3xl p-8 text-center group transition-all duration-300 hover:shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-primary-black mb-2">{stat.number}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{stat.label}</h3>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section matching main site */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">
              О клубе Altius
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Профессиональный подход к развитию бадминтона в регионе
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Users className="w-8 h-8" />, title: 'Наша команда', desc: 'Опытные тренеры и администраторы', color: 'from-primary-blue to-blue-600' },
              { icon: <Target className="w-8 h-8" />, title: 'Наша миссия', desc: 'Развитие бадминтона в регионе', color: 'from-primary-yellow to-yellow-600' },
              { icon: <Calendar className="w-8 h-8" />, title: 'Наша история', desc: 'Развитие клуба с 2024 года', color: 'from-primary-orange to-red-600' }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => setActiveSection(['overview', 'mission', 'history'][index] as any)}
              >
                <div className="bg-white rounded-3xl p-8 h-full flex flex-col hover:shadow-2xl transition-all duration-300 cursor-pointer">
                  <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4 flex-grow">{item.desc}</p>
                  <div className="mt-auto">
                    <button className="btn-secondary group-hover:bg-primary-blue group-hover:text-white transition-all duration-300 w-full">
                      Узнать больше
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Content Sections */}
          <div className="space-y-16 mt-16">
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
                    className="bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center text-white mb-4`}>
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
                <div className="bg-white rounded-3xl p-12 border border-gray-200 shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-blue to-blue-600 rounded-xl flex items-center justify-center text-white mx-auto mb-6">
                    <Target className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">Наша миссия</h3>
                  <p className="text-xl text-gray-700 leading-relaxed mb-8">
                    Создавать профессиональное сообщество для развития бадминтона в регионе,
                    предоставляя качественные тренировки и соревнования для спортсменов всех уровней.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-blue to-blue-600 rounded-lg flex items-center justify-center text-white mb-4">
                        <Users className="w-6 h-6" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Профессионализм</h4>
                      <p className="text-sm text-gray-600">Сертифицированные тренеры и современная методика</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-yellow to-yellow-600 rounded-lg flex items-center justify-center text-white mb-4">
                        <Trophy className="w-6 h-6" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Результаты</h4>
                      <p className="text-sm text-gray-600">Систематическое развитие навыков и достижений</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-orange to-red-600 rounded-lg flex items-center justify-center text-white mb-4">
                        <Shield className="w-6 h-6" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Безопасность</h4>
                      <p className="text-sm text-gray-600">Современное оборудование и строгие стандарты</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'history' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-8 relative overflow-hidden"
              >
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
                  История развития клуба
                </h3>

                <div className="relative min-h-[620px]">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 620" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="tlGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#1e3a8a" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                    <path id="timelinePath" d="M 50 40 C 250 80, 200 160, 420 200 S 620 320, 820 300 S 700 440, 500 480 S 300 560, 150 600" fill="none" stroke="url(#tlGrad)" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 14" />
                  </svg>

                  <div className="space-y-8 relative">
                    {timeline.map((milestone, index) => {
                      const isLeft = index % 2 === 0;
                      return (
                        <motion.div
                          key={index}
                          className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                          <div className={`w-1/2 ${isLeft ? 'pl-8 text-left' : 'pr-8 text-right'} relative`}>
                            <div className="relative bg-white rounded-lg p-4 transition-transform duration-300 hover:scale-[1.02] border border-gray-200 shadow-sm">
                              <div className={`text-xl font-bold mb-1 ${milestone.highlight ? 'text-primary-yellow' : 'text-primary-blue'}`}>{milestone.year} {milestone.quarter}</div>
                              <h4 className={`text-lg font-semibold mb-2 ${milestone.highlight ? 'text-primary-blue' : 'text-gray-900'}`}>{milestone.title}</h4>
                              <p className="text-gray-600">{milestone.text}</p>
                            </div>
                          </div>
                          <div className="w-1/2"></div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </section>

      {/* Call to Action matching main site */}
      <section className="py-20 bg-gradient-to-r from-primary-blue to-primary-yellow">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white">Готовы начать?</h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Присоединяйтесь к нашему клубу и откройте для себя мир профессионального бадминтона
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-white text-primary-blue px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              Записаться на тренировку
              <ChevronRight className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
