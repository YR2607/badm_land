import { FC, useState, useEffect } from 'react';
import { CheckCircle, Clock, Sparkles, Zap, Target, ChevronDown, Phone, Users, Star, Award, User, Calendar, Trophy, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchServicesPage, CmsServicesPage } from '../lib/cms';

const Services: FC = () => {
  const [cmsData, setCmsData] = useState<CmsServicesPage | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadCmsData = async () => {
      try {
        const data = await fetchServicesPage();
        if (data) {
          setCmsData(data);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to load CMS data:', error);
        }
        setError('Не удалось загрузить данные');
      }
    };

    loadCmsData();
  }, []);

  const services = [
    {
      id: 'group',
      icon: <Users className="w-8 h-8" />,
      title: 'Групповые тренировки',
      subtitle: 'Для начинающих и любителей',
      description: 'Тренировки в небольших группах до 8 человек с профессиональными тренерами. Идеально для изучения основ и социализации.',
      priceMonthly: '200',
      pricePerSession: '60',
      originalPrice: '280',
      features: [
        { icon: <Target className="w-4 h-4" />, text: 'Все уровни подготовки' },
        { icon: <Zap className="w-4 h-4" />, text: 'Современное оборудование' },
        { icon: <Clock className="w-4 h-4" />, text: 'Гибкое расписание' },
        { icon: <Users className="w-4 h-4" />, text: 'Дружелюбная атмосфера' },
        { icon: <Award className="w-4 h-4" />, text: 'Прогресс отслеживание' }
      ],
      gradient: 'from-blue-500 via-blue-600 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      popular: false,
      badge: null
    },
    {
      id: 'individual',
      icon: <User className="w-8 h-8" />,
      title: 'Индивидуальные занятия',
      subtitle: 'Максимальный результат',
      description: 'Персональные тренировки с личным тренером для быстрого прогресса. Индивидуальный подход к каждому ученику.',
      priceMonthly: '1400',
      pricePerSession: '400',
      originalPrice: '1800',
      features: [
        { icon: <Target className="w-4 h-4" />, text: 'Индивидуальная программа' },
        { icon: <Calendar className="w-4 h-4" />, text: 'Гибкий график' },
        { icon: <Sparkles className="w-4 h-4" />, text: 'Максимальное внимание' },
        { icon: <Zap className="w-4 h-4" />, text: 'Быстрый прогресс' },
        { icon: <Target className="w-4 h-4" />, text: 'Видеоанализ техники' }
      ],
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      bgGradient: 'from-orange-50 to-pink-50',
      popular: true,
      badge: 'Популярно'
    },
    {
      id: 'competition',
      icon: <Trophy className="w-8 h-8" />,
      title: 'Подготовка к соревнованиям',
      subtitle: 'Профессиональный уровень',
      description: 'Специализированная подготовка для участия в турнирах и соревнованиях. Для серьезных спортсменов.',
      priceMonthly: '500',
      pricePerSession: null,
      originalPrice: '650',
      features: [
        { icon: <Target className="w-4 h-4" />, text: 'Техническая подготовка' },
        { icon: <Sparkles className="w-4 h-4" />, text: 'Тактическое планирование' },
        { icon: <Award className="w-4 h-4" />, text: 'Психологическая поддержка' },
        { icon: <Users className="w-4 h-4" />, text: 'Спарринг партнеры' },
        { icon: <Zap className="w-4 h-4" />, text: 'Анализ соперников' }
      ],
      gradient: 'from-yellow-500 via-amber-500 to-orange-500',
      bgGradient: 'from-yellow-50 to-amber-50',
      popular: false,
      badge: 'Про'
    }
  ];

  const [billing, setBilling] = useState<'monthly' | 'per_session'>('monthly');

  const faqs: Array<{ q: string; a: string }> = [
    { q: 'Как записаться на тренировку?', a: 'Оставьте заявку через контактную форму на странице Контакты или позвоните нам — подберём удобное время и группу.' },
    { q: 'Можно ли прийти на пробное занятие?', a: 'Да, у нас есть пробная тренировка. Свяжитесь с администратором, чтобы согласовать дату и время.' },
    { q: 'Нужен ли свой инвентарь?', a: 'Ракетки и воланы предоставим на первых занятиях. Позже поможем выбрать подходящее оборудование.' },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary-blue text-white rounded hover:bg-blue-600"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* HERO SECTION */}
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
          
          {/* Enhanced Equipment Graphics with 3D Effects - Optimized for performance */}
          <div className="absolute top-8 left-4 md:top-16 md:left-16 w-16 h-16 md:w-24 md:h-24 opacity-30 transform rotate-12 will-change-transform hover:scale-110 transition-transform duration-300">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="racketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.9)"/>
                  <stop offset="50%" stopColor="rgba(255,255,255,0.7)"/>
                  <stop offset="100%" stopColor="rgba(255,255,255,0.5)"/>
                </linearGradient>
                <filter id="equipmentGlow">
                  <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Enhanced Racket Handle with grip texture */}
              <rect x="44" y="58" width="12" height="37" fill="url(#racketGradient)" rx="6" filter="url(#equipmentGlow)"/>
              <g stroke="rgba(255,255,255,0.4)" strokeWidth="0.5">
                <line x1="46" y1="62" x2="54" y2="62"/>
                <line x1="46" y1="68" x2="54" y2="68"/>
                <line x1="46" y1="74" x2="54" y2="74"/>
                <line x1="46" y1="80" x2="54" y2="80"/>
              </g>
              
              {/* Enhanced Racket Head with shadow */}
              <ellipse cx="50" cy="35" rx="26" ry="31" fill="none" stroke="url(#racketGradient)" strokeWidth="4" filter="url(#equipmentGlow)"/>
              
              {/* Detailed String Pattern */}
              <g stroke="rgba(255,255,255,0.6)" strokeWidth="1" opacity="0.8">
                <line x1="28" y1="35" x2="72" y2="35"/>
                <line x1="30" y1="25" x2="70" y2="45"/>
                <line x1="32" y1="18" x2="68" y2="52"/>
                <line x1="38" y1="12" x2="62" y2="58"/>
                <line x1="44" y1="8" x2="56" y2="62"/>
                <line x1="50" y1="6" x2="50" y2="64"/>
                <line x1="56" y1="8" x2="44" y2="62"/>
                <line x1="62" y1="12" x2="38" y2="58"/>
              </g>
            </svg>
          </div>
          
          {/* Flying Shuttlecock with Trail Effect */}
          <div className="absolute top-16 right-4 md:top-32 md:right-24 w-14 h-14 md:w-20 md:h-20 opacity-35 transform -rotate-45">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <radialGradient id="shuttlecockGradient" cx="50%" cy="70%">
                  <stop offset="0%" stopColor="rgba(255,255,255,1)"/>
                  <stop offset="100%" stopColor="rgba(255,255,255,0.6)"/>
                </radialGradient>
              </defs>
              
              {/* Motion Trail */}
              <g opacity="0.3">
                <ellipse cx="35" cy="75" rx="4" ry="6" fill="rgba(255,255,255,0.3)"/>
                <ellipse cx="25" cy="80" rx="3" ry="5" fill="rgba(255,255,255,0.2)"/>
                <ellipse cx="15" cy="85" rx="2" ry="4" fill="rgba(255,255,255,0.1)"/>
              </g>
              
              {/* Enhanced Shuttlecock Body */}
              <ellipse cx="50" cy="70" rx="9" ry="14" fill="url(#shuttlecockGradient)" filter="url(#equipmentGlow)"/>
              
              {/* Detailed Feathers */}
              <g fill="rgba(255,255,255,0.8)">
                <path d="M42 55 L50 70 L58 55 L50 20 Z" opacity="0.9"/>
                <path d="M38 60 L50 70 L46 55 L42 25 Z" opacity="0.7"/>
                <path d="M62 60 L50 70 L54 55 L58 25 Z" opacity="0.7"/>
                <path d="M46 53 L50 70 L54 53 L50 15 Z" opacity="0.8"/>
              </g>
              
              {/* Feather Details */}
              <g stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" fill="none">
                <path d="M48 25 Q50 30 52 35"/>
                <path d="M46 30 Q50 35 54 40"/>
                <path d="M44 35 Q50 40 56 45"/>
              </g>
            </svg>
          </div>
          
          {/* Professional Racket with Glow */}
          <div className="absolute bottom-12 left-4 md:bottom-20 md:left-32 w-16 h-16 md:w-22 md:h-22 opacity-25 transform rotate-45">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <ellipse cx="50" cy="30" rx="22" ry="27" fill="none" stroke="url(#racketGradient)" strokeWidth="3" filter="url(#equipmentGlow)"/>
              <rect x="46" y="57" width="8" height="28" fill="url(#racketGradient)" rx="4"/>
              
              {/* String pattern */}
              <g stroke="rgba(255,255,255,0.5)" strokeWidth="0.8">
                <line x1="32" y1="30" x2="68" y2="30"/>
                <line x1="35" y1="20" x2="65" y2="40"/>
                <line x1="40" y1="15" x2="60" y2="45"/>
                <line x1="50" y1="10" x2="50" y2="50"/>
              </g>
            </svg>
          </div>
          
          {/* Dynamic Shuttlecock with Particle Effect */}
          <div className="absolute bottom-8 right-4 md:bottom-24 md:right-16 w-12 h-12 md:w-18 md:h-18 opacity-30 transform -rotate-12">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Particle Trail */}
              <g opacity="0.4">
                <circle cx="15" cy="55" r="1.5" fill="rgba(255,255,255,0.6)"/>
                <circle cx="20" cy="52" r="1" fill="rgba(255,255,255,0.5)"/>
                <circle cx="25" cy="58" r="0.8" fill="rgba(255,255,255,0.4)"/>
                <circle cx="30" cy="54" r="1.2" fill="rgba(255,255,255,0.3)"/>
              </g>
              
              {/* Enhanced Shuttlecock */}
              <ellipse cx="50" cy="65" rx="7" ry="11" fill="url(#shuttlecockGradient)"/>
              <path d="M44 42 L50 65 L56 42 L50 15 Z" fill="rgba(255,255,255,0.7)"/>
              
              {/* Speed Lines */}
              <g stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" opacity="0.6">
                <line x1="10" y1="50" x2="30" y2="50"/>
                <line x1="15" y1="45" x2="32" y2="45"/>
                <line x1="12" y1="55" x2="28" y2="55"/>
              </g>
            </svg>
          </div>
          
          {/* Optimized Floating Particles - Reduced for performance */}
          <div className="absolute inset-0 opacity-15 hidden md:block">
            <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse will-change-opacity"></div>
            <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-white rounded-full animate-pulse will-change-opacity" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse will-change-opacity" style={{animationDelay: '2s'}}></div>
          </div>
          
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-blue/20 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-medium">Профессиональные тренировки</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold font-display mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                {cmsData?.hero?.title || 'Наши услуги'}
              </h1>
              
              <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90 leading-relaxed mb-8">
                {cmsData?.hero?.subtitle || 'Выберите идеальный формат тренировок для достижения ваших целей в бадминтоне'}
              </p>
              
              {/* Statistics with Entrance Animations Only */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="text-4xl font-bold text-yellow-300 mb-2">500+</div>
                  <div className="text-blue-100">Довольных учеников</div>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="text-4xl font-bold text-yellow-300 mb-2">15+</div>
                  <div className="text-blue-100">Лет опыта</div>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="text-4xl font-bold text-yellow-300 mb-2">3</div>
                  <div className="text-blue-100">Формата тренировок</div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODERN PRICING SECTION */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 mb-4">
              Выберите свой формат
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Каждый формат тренировок разработан для достижения конкретных целей
            </p>
          </div>

          {/* Sticky Billing Toggle */}
          <div className="flex items-center justify-center mb-12 sticky top-20 z-40">
            <div className="inline-flex items-center rounded-2xl bg-white/90 backdrop-blur-md border border-gray-200/50 p-1.5 shadow-xl">
              <button 
                className={`px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                  billing === 'monthly' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`} 
                onClick={() => setBilling('monthly')}
              >
                Месячная подписка
              </button>
              <button 
                className={`px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                  billing === 'per_session' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`} 
                onClick={() => setBilling('per_session')}
              >
                За занятие
              </button>
            </div>
          </div>

          {/* Enhanced Service Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                className={`group relative ${service.popular ? 'lg:-mt-4' : ''}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                {/* Enhanced Card */}
                <div className={`relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 ${
                  service.popular ? 'ring-2 ring-blue-500/20 shadow-blue-500/10' : ''
                }`}>
                  
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-50 rounded-3xl transition-opacity duration-500`} />
                  
                  {/* Badge */}
                  {service.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className={`px-4 py-2 rounded-full text-white text-sm font-semibold shadow-lg bg-gradient-to-r ${service.gradient}`}>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {service.badge}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Header */}
                  <div className="relative z-10 mb-6">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${service.gradient} text-white shadow-lg mb-4`}>
                      {service.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-sm font-medium text-gray-500 mb-3">{service.subtitle}</p>
                    <p className="text-gray-600 leading-relaxed">{service.description}</p>
                  </div>

                  {/* Features */}
                  <div className="relative z-10 mb-8 space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg bg-gradient-to-r ${service.gradient} text-white`}>
                          {feature.icon}
                        </div>
                        <span className="text-gray-700 font-medium">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div className="relative z-10 mb-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold text-gray-900">
                        {billing === 'monthly' ? service.priceMonthly : (service.pricePerSession || '—')}
                      </span>
                      {(billing === 'monthly' ? service.priceMonthly : service.pricePerSession) !== '—' && (
                        <>
                          <span className="text-lg text-gray-600">лей</span>
                          <span className="text-sm text-gray-500">
                            {billing === 'monthly' ? '/месяц' : '/занятие'}
                          </span>
                        </>
                      )}
                    </div>
                    {service.originalPrice && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400 line-through">{service.originalPrice} лей</span>
                        <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          Скидка {Math.round((1 - parseInt(billing === 'monthly' ? service.priceMonthly : service.pricePerSession || '0') / parseInt(service.originalPrice)) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button className={`relative z-10 w-full py-4 px-6 rounded-2xl font-semibold text-white bg-gradient-to-r ${service.gradient} hover:shadow-lg transition-all duration-300`}>
                    <div className="flex items-center justify-center gap-2">
                      <span>Записаться</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MODERN COMPARISON TABLE */}
      <motion.section 
        className="py-20 bg-gradient-to-br from-gray-50 to-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">Сравнение форматов</h3>
            <p className="text-lg text-gray-600">Выберите формат, который лучше всего подходит для ваших целей</p>
          </motion.div>
          
          <div className="overflow-x-auto">
            <div className="min-w-[720px] rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-4 gap-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="px-6 py-4 text-sm font-medium">Параметр</div>
                {services.map((s) => (
                  <div key={s.id} className="px-6 py-4 text-sm font-semibold flex items-center gap-2">
                    <span className={`inline-block w-3 h-3 rounded-full bg-gradient-to-r ${s.gradient} shadow-sm`} />
                    {s.title}
                  </div>
                ))}
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-100">
                {[
                  { k: 'Размер группы', v: ['до 8 человек', '1 на 1', '2–4 человека'] },
                  { k: 'Индивидуальный план', v: ['Опционально', 'Да', 'Да'] },
                  { k: 'Видеоанализ техники', v: ['Опционально', 'Да', 'Да'] },
                  { k: 'Соревновательная практика', v: ['Клубные игры', 'По запросу', 'Регулярно'] },
                  { k: 'Гибкость расписания', v: ['Фиксированное', 'Полная', 'Высокая'] },
                ].map((row, i, array) => (
                  <div key={i} className={`grid grid-cols-4 hover:bg-blue-50/50 transition-colors duration-200 ${i === array.length - 1 ? 'rounded-b-3xl overflow-hidden' : ''}`}>
                    <div className="px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50/50">{row.k}</div>
                    {row.v.map((val, j) => (
                      <div key={j} className="px-6 py-4 text-sm">
                        {val === 'Да' ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium border border-emerald-200">
                            <CheckCircle className="w-3 h-3" />
                            Да
                          </span>
                        ) : val === 'Опционально' ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-medium border border-amber-200">
                            <Clock className="w-3 h-3" />
                            Опционально
                          </span>
                        ) : val === 'Полная' ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-xs font-medium border border-green-200">
                            <Sparkles className="w-3 h-3" />
                            Полная
                          </span>
                        ) : val === 'Высокая' ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium border border-blue-200">
                            <Zap className="w-3 h-3" />
                            Высокая
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                            <Target className="w-3 h-3" />
                            {val}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* GYMS CTA SECTION */}
      <motion.section 
        className="py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 mb-6">Наши спортзалы</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Удобные локации с профессиональным оборудованием для тренировок по бадминтону
            </p>
            
            <motion.a
              href="/gyms"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg">🏸</span>
              Посмотреть все залы
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ SECTION */}
      <motion.section 
        className="py-20 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 mb-4">Часто задаваемые вопросы</h2>
            <p className="text-xl text-gray-600">Ответы на популярные вопросы о наших услугах</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((f, idx) => (
              <motion.div
                key={idx}
                className="border border-gray-200 rounded-2xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{f.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <p className="text-gray-700">{f.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA SECTION */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Готовы начать тренировки?
          </motion.h2>
          <motion.p 
            className="text-xl opacity-90 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Свяжитесь с нами сегодня и получите персональную консультацию по выбору программы тренировок
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
            >
              Связаться с нами
            </a>
            <a
              href="tel:+37322000000"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-colors"
            >
              <Phone className="w-5 h-5 mr-2" />
              Позвонить сейчас
            </a>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Services;
