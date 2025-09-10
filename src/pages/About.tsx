import { type FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Users, MapPin, Clock, Target, Heart, Trophy, Zap, Calendar, ArrowRight } from 'lucide-react';
import { fetchPage, isCmsEnabled, CmsPage } from '../lib/cms';

const About: FC = () => {
  const [page, setPage] = useState<CmsPage | null>(null);
  const [activeTab, setActiveTab] = useState<'mission' | 'coaches' | 'facility'>('mission');
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const VISIBLE_HISTORY_COUNT = 3;

  useEffect(() => {
    (async () => {
      if (!isCmsEnabled) return;
      const data = await fetchPage('about');
      setPage(data);
    })();
  }, []);

  // Drag scroll functionality
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.pageX - e.currentTarget.offsetLeft);
    setScrollLeft(e.currentTarget.scrollLeft);
    e.currentTarget.style.cursor = 'grabbing';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.style.cursor = 'grab';
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.style.cursor = 'grab';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    e.currentTarget.scrollLeft = scrollLeft - walk;
  };

  // Scroll to specific card
  const scrollToCard = (index: number) => {
    const container = document.querySelector('.roadmap-scroll-container') as HTMLElement;
    if (container) {
      const cardWidth = 356; // min-width (320px) + gap (24px) + padding (12px)
      container.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const stats = [
    { number: '1+', label: 'год опыта', icon: <Clock className="w-6 h-6" />, color: 'from-primary-blue to-blue-600', description: 'С 2024 года развиваем бадминтон в регионе' },
    { number: '120+', label: 'активных участников', icon: <Users className="w-6 h-6" />, color: 'from-primary-yellow to-yellow-600', description: 'Игроки всех возрастов и уровней подготовки' },
    { number: '4', label: 'профессиональных корта', icon: <MapPin className="w-6 h-6" />, color: 'from-primary-orange to-red-600', description: 'Современное оборудование и освещение' },
    { number: '15+', label: 'турниров проведено', icon: <Award className="w-6 h-6" />, color: 'from-primary-blue to-blue-700', description: 'Внутренние и выездные соревнования' }
  ];

  const values = [
    { icon: <Target className="w-8 h-8" />, title: 'Профессионализм', description: 'Высокие стандарты обучения и сертифицированные тренеры' },
    { icon: <Heart className="w-8 h-8" />, title: 'Дружелюбие', description: 'Теплая атмосфера и поддержка для игроков всех уровней' },
    { icon: <Award className="w-8 h-8" />, title: 'Результат', description: 'Ориентация на достижение целей каждого участника' }
  ];

  const timeline: Array<{ year: string; title: string; text: string }> = [
    // 2024 — все кварталы
    { year: '2024 Q1', title: 'Старт Altius', text: 'Открыли двери и провели первые наборы для взрослых и подростков.' },
    { year: '2024 Q2', title: 'Формирование ядра команды', text: 'Стабилизировали расписание, собрали первую клубную группу и стартовали базовый рейтинг.' },
    { year: '2024 Q3', title: 'Первые трофеи', text: 'Участники клуба взяли призовые места на локальных турнирах.' },
    { year: '2024 Q4', title: 'Итоги сезона', text: 'Провели клубный финал года, наградили лучших игроков и тренеров.' },
    // 2025 — все кварталы
    { year: '2025 Q1', title: 'Школа юниоров', text: 'Запустили детские группы, тест‑сборы, индивидуальные программы.' },
    { year: '2025 Q2', title: 'Клубная лига', text: 'Регулярные внутренние матчи и мини‑лиги по уровням.' },
    { year: '2025 Q3', title: 'Расширение участия', text: 'Выездные турниры, партнёрства, спарринги с другими клубами региона.' },
    { year: '2025 Q4', title: 'Altius Cup', text: 'Открытый турнир клуба с приглашёнными гостями и праздничной церемонией.' }
  ];

  const roadmap: Array<{ tag: string; title: string; desc: string; status: 'done' | 'progress' | 'planned' }> = [
    { tag: '2025 Q3', title: 'Расширение участия', desc: 'Выезды на турниры, партнёрства и спарринги с клубами региона.', status: 'done' },
    { tag: '2025 Q4', title: 'Altius Cup', desc: 'Открытый турнир клуба с церемонией и приглашёнными гостями.', status: 'progress' },
    { tag: '2026 Q1', title: 'Академия U17', desc: 'Регулярные сборы, тесты, сопровождение и календарь стартов.', status: 'planned' },
    { tag: '2026 Q2', title: 'Клубная лига 2.0', desc: 'Уровневые дивизионы, рейтинги, матч‑дни и трансляции.', status: 'planned' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* HERO: 500px высота, градиентный фон, без CTA */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-blue via-primary-blue/90 to-primary-orange">
        {/* Декоративные элементы */}
        <div className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255,255,255,.1) 0, rgba(255,255,255,.1) 1px, transparent 1px, transparent 20px)"
          }}
        />
        {/* Световые пятна */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div 
              className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Trophy className="w-4 h-4 text-primary-yellow mr-2" />
              <span className="text-sm font-medium">Профессиональный клуб с 2024 года</span>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold font-display mb-6 leading-tight" 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="text-white drop-shadow-lg">ALTIUS</span>
              <br />
              <span className="text-xl md:text-2xl lg:text-3xl font-light text-primary-yellow italic font-display">
                {page?.heroSubtitle || 'Бадминтонный клуб'}
              </span>
            </motion.h1>

            <motion.p 
              className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {page?.heroTitle || 'Профессиональные тренировки, современное оборудование и дружелюбная атмосфера'}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section with 3D Effects */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-3xl p-8 text-center group transition-transform duration-200"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, ease: 'easeOut', delay: index * 0.05 }}
                whileHover={{ 
                  y: -6,
                  scale: 1.03,
                  transition: { duration: 0.18, ease: 'easeOut' }
                }}
                style={{ willChange: 'transform' }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center text-white mx-auto mb-4 transition-transform duration-200 group-hover:scale-105`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-primary-black mb-2">{stat.number}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{stat.label}</h3>
                <p className="text-gray-600 text-sm">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Tabs Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12" 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">О нашем клубе</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Узнайте больше о нашей миссии, тренерах и инфраструктуре</p>
          </motion.div>

          {/* Modern Tab Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {([
              { key: 'mission', label: 'Миссия', icon: <Target className="w-4 h-4" /> },
              { key: 'coaches', label: 'Тренеры', icon: <Users className="w-4 h-4" /> },
              { key: 'facility', label: 'Инфраструктура', icon: <MapPin className="w-4 h-4" /> }
            ] as const).map((t) => (
              <motion.button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === t.key 
                    ? 'bg-primary-blue text-white shadow-lg shadow-primary-blue/25' 
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-blue/50 hover:shadow-md'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t.icon}
                {t.label}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {activeTab === 'mission' && (
              <>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5, delay: 0.1 }} 
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-blue to-blue-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Доступность</h3>
                  <p className="text-gray-600 leading-relaxed">Группы по уровням, понятные планы тренировок и дружеская атмосфера для всех возрастов.</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5, delay: 0.2 }} 
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-yellow to-yellow-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Рост результатов</h3>
                  <p className="text-gray-600 leading-relaxed">Индивидуальные рекомендации, разбор игр и участие в клубной лиге для постоянного развития.</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5, delay: 0.3 }} 
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-orange to-red-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Сообщество</h3>
                  <p className="text-gray-600 leading-relaxed">Совместные выезды, открытые дни, мини-турниры и спортивные мероприятия.</p>
                </motion.div>
              </>
            )}
            {activeTab === 'coaches' && (
              <>
                {[
                  { name: 'Алексей Петров', role: 'Главный тренер', experience: '8 лет опыта' },
                  { name: 'Мария Сидорова', role: 'Тренер по технике', experience: '5 лет опыта' },
                  { name: 'Дмитрий Козлов', role: 'Тренер по физической подготовке', experience: '6 лет опыта' }
                ].map((coach, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }} 
                    className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-blue/20 to-primary-orange/20 mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-8 h-8 text-primary-blue" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{coach.name}</h3>
                    <p className="text-primary-blue font-medium mb-2">{coach.role}</p>
                    <p className="text-gray-600 text-sm">{coach.experience}</p>
                  </motion.div>
                ))}
              </>
            )}
            {activeTab === 'facility' && (
              <>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5, delay: 0.1 }} 
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-blue to-blue-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Профессиональные корты</h3>
                  <p className="text-gray-600 leading-relaxed">4 качественных площадки с современным покрытием, разметкой и освещением для турниров.</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5, delay: 0.2 }} 
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-yellow to-yellow-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Зона отдыха</h3>
                  <p className="text-gray-600 leading-relaxed">Разминка, стрейчинг, восстановление, кофе-корнер и фирменный мерч клуба.</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5, delay: 0.3 }} 
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-orange to-red-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Сервис записи</h3>
                  <p className="text-gray-600 leading-relaxed">Онлайн-расписание, оплата и напоминания — все удобно с телефона.</p>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Unified History + Roadmap Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-[42rem] h-[42rem] rounded-full bg-primary-orange/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-[36rem] h-[36rem] rounded-full bg-primary-blue/5 blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-16" 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 mb-4">
              Наша история и планы
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              От первых шагов до амбициозных целей — путь развития клуба Altius
            </p>
          </motion.div>

          {/* History Section */}
          <motion.div 
            className="mb-20" 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">История развития</h3>
            
            {/* Timeline with years as dividers */}
            {(() => {
              const getYear = (s: string) => (s.match(/\d{4}/)?.[0] || s);
              const items = showAllHistory ? timeline : timeline.slice(0, VISIBLE_HISTORY_COUNT);
              const groups: Record<string, typeof timeline> = {} as any;
              items.forEach((it) => {
                const y = getYear(it.year);
                (groups[y] ||= []).push(it);
              });
              const ordered = Object.entries(groups);
              
              return (
                <div className="space-y-12">
                  {ordered.map(([year, list]) => (
                    <div key={year}>
                      {/* Year divider */}
                      <div className="relative mb-8">
                        <div className="h-px bg-gradient-to-r from-transparent via-primary-blue/30 to-transparent" />
                        <div className="absolute left-1/2 -translate-x-1/2 -top-4 px-6 py-2 rounded-full bg-primary-blue text-white text-lg font-bold shadow-lg">
                          {year}
                        </div>
                      </div>
                      
                      {/* Events grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {list.map((item, idx) => (
                          <motion.div
                            key={`${year}-${idx}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-blue/20"
                          >
                            <div className="mb-3 inline-flex items-center gap-2">
                              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary-blue/10 text-primary-blue">
                                {item.year}
                              </span>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-blue transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-gray-600 leading-relaxed text-sm">
                              {item.text}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Show more button */}
                  {timeline.length > VISIBLE_HISTORY_COUNT && (
                    <div className="text-center pt-8">
                      <motion.button
                        onClick={() => setShowAllHistory((v) => !v)}
                        className="px-8 py-3 rounded-full bg-primary-blue text-white font-medium hover:bg-primary-blue/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {showAllHistory ? 'Свернуть историю' : 'Показать всю историю'}
                      </motion.button>
                    </div>
                  )}
                </div>
              );
            })()}
          </motion.div>

          {/* Roadmap Section with Horizontal Scroll */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Планы развития</h3>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Наши цели и проекты на ближайшее время
            </p>

            {/* Interactive Horizontal Scrollable Roadmap - Full Width */}
            <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
              {/* Scroll hint */}
              <div className="flex items-center justify-center gap-2 mb-6 text-sm text-gray-500 px-4 sm:px-6 lg:px-8">
                <ArrowRight className="w-4 h-4 animate-pulse" />
                <span>Прокрутите мышкой для просмотра планов</span>
                <ArrowRight className="w-4 h-4 animate-pulse" />
              </div>
              
              {/* Scrollable container with full-width blur effects */}
              <div className="relative">
                {/* Left blur fade - с серо-голубым фоном */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[rgb(244,245,249)] via-white/60 to-transparent z-10 pointer-events-none" />
                
                {/* Right blur fade - симметрично с левым */}
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white via-white/90 via-white/60 to-transparent z-10 pointer-events-none" />
                
                {/* Scrollable content - full width */}
                <div 
                  className="roadmap-scroll-container overflow-x-auto pb-4 scrollbar-hide scroll-smooth cursor-grab select-none" 
                  style={{ scrollBehavior: 'smooth' }}
                  onMouseDown={handleMouseDown}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                >
                  <div className="flex gap-6 min-w-max pl-8 pr-24">
                    {roadmap.map((r, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: 50 }} 
                        whileInView={{ opacity: 1, x: 0 }} 
                        viewport={{ once: true }} 
                        transition={{ duration: 0.5, delay: i * 0.1 }} 
                        className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-blue/20 min-w-[320px] max-w-[350px]"
                        style={{ scrollSnapAlign: 'start' }}
                      >
                        <div>
                          <div className="mb-4 flex items-center justify-between">
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary-blue/10 text-primary-blue border border-primary-blue/20">
                              {r.tag}
                            </span>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${
                              r.status === 'done' 
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                                : r.status === 'progress' 
                                ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                            }`}>
                              {r.status === 'done' ? (
                                <>
                                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                  Готово
                                </>
                              ) : r.status === 'progress' ? (
                                <>
                                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                  В процессе
                                </>
                              ) : (
                                <>
                                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                                  Запланировано
                                </>
                              )}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-blue transition-colors">
                            {r.title}
                          </h4>
                          <p className="text-gray-600 leading-relaxed text-sm">
                            {r.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Enhanced scroll indicators with progress */}
              <div className="flex justify-center mt-8 gap-3">
                {roadmap.map((_, i) => (
                  <div 
                    key={i}
                    className="w-3 h-3 rounded-full bg-primary-blue/20 hover:bg-primary-blue/40 transition-colors cursor-pointer"
                    title={`План ${i + 1}: ${roadmap[i].title}`}
                    onClick={() => scrollToCard(i)}
                  />
                ))}
              </div>
              
              {/* Additional scroll hint for mobile */}
              <div className="md:hidden flex justify-center mt-4">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-gray-400" />
                    <div className="w-1 h-1 rounded-full bg-gray-400" />
                    <div className="w-1 h-1 rounded-full bg-gray-400" />
                  </div>
                  <span>Свайпните для просмотра</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-gray-400" />
                    <div className="w-1 h-1 rounded-full bg-gray-400" />
                    <div className="w-1 h-1 rounded-full bg-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section with Interactive Cards */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-64 h-64 rounded-full bg-primary-blue/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-primary-orange/5 blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16" 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 mb-6">
              Наши ценности
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Принципы, которые лежат в основе нашей работы и формируют культуру клуба
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div 
                key={index} 
                className="group relative" 
                initial={{ opacity: 0, y: 16 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, amount: 0.2 }} 
                transition={{ duration: 0.32, ease: 'easeOut', delay: index * 0.06 }}
                whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.16, ease: 'easeOut' } }}
                style={{ willChange: 'transform' }}
              >
                {/* Card with gradient background */}
                <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-primary-blue/20 overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/5 to-primary-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Icon with animated background */}
                  <div className="relative z-10 mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-primary-blue to-primary-orange rounded-2xl flex items-center justify-center text-white mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      {value.icon}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-blue transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {value.description}
                    </p>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary-blue/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary-orange/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Bottom decorative line */}
          <motion.div 
            className="mt-16 flex justify-center"
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="h-1 w-32 bg-gradient-to-r from-primary-blue to-primary-orange rounded-full" />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
