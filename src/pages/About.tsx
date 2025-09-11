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
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-primary-blue via-primary-blue/95 to-indigo-700">
        {/* Enhanced Badminton Court Background */}
        <div className="absolute inset-0">
          {/* Dynamic Court with Lighting Effects */}
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 1200 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
              <defs>
                {/* Gradient for court surface */}
                <radialGradient id="courtGradient" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.15)"/>
                  <stop offset="50%" stopColor="rgba(255,255,255,0.08)"/>
                  <stop offset="100%" stopColor="rgba(255,255,255,0.03)"/>
                </radialGradient>
                
                {/* Glow effect for lines */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                
                {/* Shadow filter */}
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                </filter>
              </defs>
              
              {/* Court Surface with gradient */}
              <rect width="1200" height="600" fill="url(#courtGradient)"/>
              
              {/* Court Lines with glow effect */}
              <g stroke="rgba(255,255,255,0.6)" strokeWidth="3" fill="none" filter="url(#glow)">
                {/* Outer boundaries */}
                <rect x="200" y="100" width="800" height="400" strokeWidth="4"/>
                
                {/* Center line */}
                <line x1="600" y1="100" x2="600" y2="500" strokeWidth="3"/>
                
                {/* Service lines */}
                <line x1="200" y1="240" x2="1000" y2="240"/>
                <line x1="200" y1="360" x2="1000" y2="360"/>
                
                {/* Short service lines */}
                <line x1="320" y1="100" x2="320" y2="500"/>
                <line x1="880" y1="100" x2="880" y2="500"/>
                
                {/* Center service lines */}
                <line x1="600" y1="240" x2="600" y2="360"/>
              </g>
              
              {/* Enhanced Net with 3D effect */}
              <g filter="url(#shadow)">
                <line x1="600" y1="100" x2="600" y2="500" stroke="rgba(255,255,255,0.7)" strokeWidth="6"/>
                <rect x="596" y="280" width="8" height="40" fill="rgba(255,255,255,0.8)" rx="2"/>
                
                {/* Net mesh pattern */}
                <g stroke="rgba(255,255,255,0.3)" strokeWidth="1">
                  <line x1="590" y1="120" x2="610" y2="120"/>
                  <line x1="590" y1="140" x2="610" y2="140"/>
                  <line x1="590" y1="160" x2="610" y2="160"/>
                  <line x1="590" y1="180" x2="610" y2="180"/>
                  <line x1="590" y1="200" x2="610" y2="200"/>
                  <line x1="590" y1="220" x2="610" y2="220"/>
                  <line x1="590" y1="240" x2="610" y2="240"/>
                  <line x1="590" y1="260" x2="610" y2="260"/>
                </g>
              </g>
              
              {/* Spotlight effects */}
              <g opacity="0.1">
                <ellipse cx="400" cy="200" rx="150" ry="80" fill="rgba(255,255,255,0.3)"/>
                <ellipse cx="800" cy="400" rx="150" ry="80" fill="rgba(255,255,255,0.3)"/>
              </g>
            </svg>
          </div>
          
          {/* Enhanced Equipment Graphics with 3D Effects */}
          <div className="absolute top-8 left-4 md:top-16 md:left-16 w-16 h-16 md:w-24 md:h-24 opacity-30 transform rotate-12 will-change-transform hover:scale-110 transition-transform duration-300">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Badminton Racket */}
              <defs>
                <linearGradient id="racketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.8)"/>
                  <stop offset="100%" stopColor="rgba(255,255,255,0.4)"/>
                </linearGradient>
                <filter id="racketShadow">
                  <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3"/>
                </filter>
              </defs>
              
              {/* Racket Handle */}
              <rect x="45" y="70" width="10" height="25" fill="url(#racketGradient)" rx="5" filter="url(#racketShadow)"/>
              
              {/* Racket Head */}
              <ellipse cx="50" cy="35" rx="20" ry="30" fill="none" stroke="url(#racketGradient)" strokeWidth="3" filter="url(#racketShadow)"/>
              
              {/* Strings */}
              <g stroke="rgba(255,255,255,0.4)" strokeWidth="1">
                <line x1="35" y1="20" x2="35" y2="50"/>
                <line x1="42" y1="15" x2="42" y2="55"/>
                <line x1="50" y1="10" x2="50" y2="60"/>
                <line x1="58" y1="15" x2="58" y2="55"/>
                <line x1="65" y1="20" x2="65" y2="50"/>
                
                <line x1="32" y1="25" x2="68" y2="25"/>
                <line x1="30" y1="35" x2="70" y2="35"/>
                <line x1="32" y1="45" x2="68" y2="45"/>
              </g>
            </svg>
          </div>
          
          {/* Animated Shuttlecock */}
          <div className="absolute top-20 right-8 md:top-24 md:right-20 w-12 h-12 md:w-16 md:h-16 opacity-40 animate-bounce">
            <svg viewBox="0 0 60 60" className="w-full h-full">
              <defs>
                <radialGradient id="shuttlecockGradient" cx="50%" cy="30%" r="60%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.9)"/>
                  <stop offset="100%" stopColor="rgba(255,255,255,0.3)"/>
                </radialGradient>
              </defs>
              
              {/* Shuttlecock Cork */}
              <circle cx="30" cy="45" r="6" fill="url(#shuttlecockGradient)"/>
              
              {/* Feathers */}
              <g fill="rgba(255,255,255,0.6)">
                <path d="M30 39 L25 15 L30 20 L35 15 Z"/>
                <path d="M24 40 L15 18 L22 22 L28 20 Z"/>
                <path d="M36 40 L45 18 L38 22 L32 20 Z"/>
                <path d="M22 42 L12 25 L20 28 L26 26 Z"/>
                <path d="M38 42 L48 25 L40 28 L34 26 Z"/>
              </g>
            </svg>
          </div>
          
          {/* Trophy with Badminton Theme */}
          <div className="absolute bottom-16 left-8 md:bottom-20 md:left-16 w-14 h-14 md:w-20 md:h-20 opacity-25 animate-pulse">
            <svg viewBox="0 0 80 80" className="w-full h-full">
              <defs>
                <linearGradient id="trophyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,215,0,0.8)"/>
                  <stop offset="100%" stopColor="rgba(255,165,0,0.6)"/>
                </linearGradient>
              </defs>
              
              {/* Trophy Cup */}
              <path d="M20 25 Q20 20 25 20 L55 20 Q60 20 60 25 L60 40 Q60 50 50 50 L30 50 Q20 50 20 40 Z" fill="url(#trophyGradient)"/>
              
              {/* Trophy Handles */}
              <path d="M15 30 Q10 30 10 35 Q10 40 15 40" fill="none" stroke="url(#trophyGradient)" strokeWidth="3"/>
              <path d="M65 30 Q70 30 70 35 Q70 40 65 40" fill="none" stroke="url(#trophyGradient)" strokeWidth="3"/>
              
              {/* Trophy Base */}
              <rect x="25" y="50" width="30" height="8" fill="url(#trophyGradient)" rx="2"/>
              <rect x="30" y="58" width="20" height="12" fill="url(#trophyGradient)" rx="2"/>
              
              {/* Mini Racket on Trophy */}
              <ellipse cx="40" cy="35" rx="8" ry="10" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"/>
              <line x1="40" y1="45" x2="40" y2="50" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
            </svg>
          </div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-yellow-300/30 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
            <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-white/40 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-blue-300/30 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-yellow-200/40 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
          </div>
          
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-blue/20 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Trophy className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-medium">Профессиональный клуб с 2024 года</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold font-display mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                ALTIUS
              </h1>
              
              <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90 leading-relaxed mb-8">
                {page?.heroTitle || 'Профессиональные тренировки, современное оборудование и дружелюбная атмосфера'}
              </p>
              
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="text-4xl font-bold text-yellow-300 mb-2">120+</div>
                  <div className="text-blue-100">Активных участников</div>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="text-4xl font-bold text-yellow-300 mb-2">1+</div>
                  <div className="text-blue-100">Год опыта</div>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="text-4xl font-bold text-yellow-300 mb-2">15+</div>
                  <div className="text-blue-100">Турниров проведено</div>
                </motion.div>
              </div>
            </div>
          </div>
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
