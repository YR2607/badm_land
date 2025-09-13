import { type FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { fetchPageBySlug, isCmsEnabled, CmsPage } from '../lib/cms';

const Contact: FC = () => {
  const [page, setPage] = useState<CmsPage | null>(null);
  useEffect(() => {
    (async () => {
      if (!isCmsEnabled) return;
      const data = await fetchPageBySlug('contact');
      setPage(data);
    })();
  }, []);


  const contactInfo = [
    { icon: <MapPin className="w-6 h-6" />, title: 'Адрес', content: 'ул. Примерная 123, Кишинев, Молдова', color: 'from-primary-blue to-blue-600' },
    { icon: <Phone className="w-6 h-6" />, title: 'Телефон', content: '+373 60 123 456', color: 'from-primary-orange to-orange-600' },
    { icon: <Mail className="w-6 h-6" />, title: 'Email', content: 'info@altius.md', color: 'from-primary-yellow to-yellow-600' },
    { icon: <Clock className="w-6 h-6" />, title: 'Часы работы', content: 'Пн-Пт: 06:00-22:00\nСб-Вс: 08:00-20:00', color: 'from-gray-600 to-gray-800' }
  ];

  return (
    <div className="min-h-screen bg-white">
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
          
          {/* Communication & Contact Elements */}
          <div className="absolute top-12 left-8 md:top-16 md:left-16 w-16 h-16 md:w-20 md:h-20 opacity-30 animate-pulse">
            <svg viewBox="0 0 80 80" className="w-full h-full">
              <defs>
                <linearGradient id="phoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.8)"/>
                  <stop offset="100%" stopColor="rgba(255,255,255,0.4)"/>
                </linearGradient>
              </defs>
              
              {/* Phone/Communication Device */}
              <rect x="25" y="15" width="30" height="50" fill="url(#phoneGradient)" rx="8"/>
              <rect x="28" y="20" width="24" height="35" fill="rgba(255,255,255,0.3)" rx="3"/>
              <circle cx="40" cy="60" r="3" fill="rgba(255,255,255,0.6)"/>
              
              {/* Badminton app icon on screen */}
              <ellipse cx="35" cy="30" rx="4" ry="5" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1"/>
              <line x1="35" y1="35" x2="35" y2="38" stroke="rgba(255,255,255,0.6)" strokeWidth="1"/>
              
              {/* Signal waves */}
              <g stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none">
                <path d="M15 25 Q20 20 25 25"/>
                <path d="M12 30 Q20 15 28 30"/>
                <path d="M55 25 Q60 20 65 25"/>
                <path d="M52 30 Q60 15 68 30"/>
              </g>
            </svg>
          </div>
          
          {/* Message Bubbles with Badminton Theme */}
          <div className="absolute top-20 right-12 md:top-24 md:right-20 w-12 h-12 md:w-16 md:h-16 opacity-40 animate-bounce" style={{animationDelay: '0.5s'}}>
            <svg viewBox="0 0 60 60" className="w-full h-full">
              <defs>
                <linearGradient id="bubbleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.7)"/>
                  <stop offset="100%" stopColor="rgba(255,255,255,0.3)"/>
                </linearGradient>
              </defs>
              
              {/* Message bubble */}
              <path d="M10 15 Q10 10 15 10 L45 10 Q50 10 50 15 L50 30 Q50 35 45 35 L20 35 L15 40 L15 35 Q10 35 10 30 Z" fill="url(#bubbleGradient)"/>
              
              {/* Shuttlecock emoji in bubble */}
              <circle cx="30" cy="25" r="3" fill="rgba(255,255,255,0.8)"/>
              <g fill="rgba(255,255,255,0.6)" transform="scale(0.6) translate(20,10)">
                <path d="M30 22 L27 8 L30 12 L33 8 Z"/>
                <path d="M26 23 L20 12 L26 15 L29 13 Z"/>
                <path d="M34 23 L40 12 L34 15 L31 13 Z"/>
              </g>
            </svg>
          </div>
          
          {/* Email/Letter Icon */}
          <div className="absolute bottom-24 left-12 md:bottom-28 md:left-20 w-14 h-14 md:w-18 md:h-18 opacity-25 transform -rotate-12 animate-pulse" style={{animationDelay: '1s'}}>
            <svg viewBox="0 0 70 70" className="w-full h-full">
              <defs>
                <linearGradient id="mailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.7)"/>
                  <stop offset="100%" stopColor="rgba(255,255,255,0.3)"/>
                </linearGradient>
              </defs>
              
              {/* Envelope */}
              <rect x="10" y="20" width="50" height="35" fill="url(#mailGradient)" rx="3"/>
              <path d="M10 20 L35 40 L60 20" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
              
              {/* Badminton stamp */}
              <rect x="45" y="25" width="12" height="10" fill="rgba(255,255,255,0.4)" rx="1"/>
              <ellipse cx="51" cy="30" rx="3" ry="4" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5"/>
              <line x1="51" y1="34" x2="51" y2="36" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5"/>
            </svg>
          </div>
          
          {/* Location Pin with Court */}
          <div className="absolute bottom-16 right-8 md:bottom-20 md:right-16 w-12 h-12 md:w-16 md:h-16 opacity-30 animate-bounce" style={{animationDelay: '2s', animationDuration: '3s'}}>
            <svg viewBox="0 0 60 60" className="w-full h-full">
              <defs>
                <linearGradient id="pinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.8)"/>
                  <stop offset="100%" stopColor="rgba(255,255,255,0.4)"/>
                </linearGradient>
              </defs>
              
              {/* Location pin */}
              <path d="M30 10 Q20 10 20 20 Q20 30 30 45 Q40 30 40 20 Q40 10 30 10 Z" fill="url(#pinGradient)"/>
              <circle cx="30" cy="20" r="8" fill="rgba(255,255,255,0.3)"/>
              
              {/* Mini court in pin */}
              <g stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" fill="none">
                <rect x="25" y="16" width="10" height="8"/>
                <line x1="30" y1="16" x2="30" y2="24"/>
                <line x1="25" y1="20" x2="35" y2="20"/>
              </g>
            </svg>
          </div>
          
          {/* Floating Communication Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Signal dots */}
            <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 bg-green-300/40 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
            <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-blue-300/50 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-yellow-300/30 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-white/60 rounded-full animate-ping" style={{animationDelay: '0.7s'}}></div>
            
            {/* Connection lines */}
            <div className="absolute top-1/3 left-1/2 w-8 h-0.5 bg-gradient-to-r from-white/20 to-transparent animate-pulse" style={{animationDelay: '1.5s'}}></div>
            <div className="absolute bottom-1/2 right-1/4 w-6 h-0.5 bg-gradient-to-l from-blue-300/20 to-transparent animate-pulse" style={{animationDelay: '2.2s'}}></div>
          </div>
          
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-blue/20 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Mail className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-medium">Мы всегда на связи</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold font-display mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                Свяжитесь с нами
              </h1>
              
              <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90 leading-relaxed mb-8">
                {page?.heroSubtitle || 'Готовы начать свой путь в бадминтоне? Мы ждем вас!'}
              </p>
              
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="text-4xl font-bold text-yellow-300 mb-2">24/7</div>
                  <div className="text-blue-100">Поддержка клиентов</div>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="text-4xl font-bold text-yellow-300 mb-2">3</div>
                  <div className="text-blue-100">Локации для связи</div>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="text-4xl font-bold text-yellow-300 mb-2">100%</div>
                  <div className="text-blue-100">Ответ на сообщения</div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                className="card text-center group hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${info.color} rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {info.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
                <p className="text-gray-600 whitespace-pre-line">{info.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gym Locations */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-800 mb-6">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">3 удобные локации</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 mb-6">
              Как нас найти
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Выберите наиболее удобную для вас локацию. Каждый зал оборудован всем необходимым для комфортных тренировок.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Gym 1 - Малая Малиан */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 group-hover:border-blue-200 h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Зал №1</h3>
                      <p className="text-sm text-blue-600 font-medium">Центральная локация</p>
                    </div>
                  </div>
                  <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Популярный
                  </span>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">ул. Малая Малиан, 24</p>
                      <p className="text-sm text-gray-600">Центр города, легко добраться</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <a href="tel:+37360123456" className="text-gray-900 hover:text-blue-600 transition-colors">
                      +373 60 123 456
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">Пн-Вс: 08:00-22:00</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">Детские группы</span>
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">Взрослые группы</span>
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">Парковка</span>
                </div>

                <button 
                  onClick={() => window.open('https://maps.google.com/?q=Малая+Малиан+24', '_blank')}
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-medium group-hover:scale-105"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Открыть на карте
                  <ExternalLink className="w-4 h-4 ml-2" />
                </button>
              </div>
            </motion.div>

            {/* Gym 2 - 31 августа */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100 group-hover:border-green-200 h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Зал №2</h3>
                      <p className="text-sm text-green-600 font-medium">Детский центр</p>
                    </div>
                  </div>
                  <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Для детей
                  </span>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">ул. 31 августа 1989, 15</p>
                      <p className="text-sm text-gray-600">Современный детский центр</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <a href="tel:+37360234567" className="text-gray-900 hover:text-green-600 transition-colors">
                      +373 60 234 567
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">Пн-Пт: 16:00-18:00</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Детские группы</span>
                  <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Детская площадка</span>
                  <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Кафетерий</span>
                </div>

                <button 
                  onClick={() => window.open('https://maps.google.com/?q=31+августа+1989+15', '_blank')}
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium group-hover:scale-105"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Открыть на карте
                  <ExternalLink className="w-4 h-4 ml-2" />
                </button>
              </div>
            </motion.div>

            {/* Gym 3 - Ион Крянге */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-amber-100 group-hover:border-amber-200 h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Зал №3</h3>
                      <p className="text-sm text-amber-600 font-medium">Премиум зал</p>
                    </div>
                  </div>
                  <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Премиум
                  </span>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">ул. Ион Крянге, 1</p>
                      <p className="text-sm text-gray-600">Профессиональный центр</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <a href="tel:+37360345678" className="text-gray-900 hover:text-amber-600 transition-colors">
                      +373 60 345 678
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">Пн-Вс: 09:00-21:00</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">Совершенствование</span>
                  <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">Взрослые группы</span>
                  <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">Сауна</span>
                </div>

                <button 
                  onClick={() => window.open('https://maps.google.com/?q=Ион+Крянге+1', '_blank')}
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 font-medium group-hover:scale-105"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Открыть на карте
                  <ExternalLink className="w-4 h-4 ml-2" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* General Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Полезная информация</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Удобное расположение</h4>
                <p className="text-sm text-gray-600">Все залы доступны на общественном транспорте и имеют парковку</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Предварительная запись</h4>
                <p className="text-sm text-gray-600">Рекомендуем звонить заранее для уточнения расписания</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Гибкое расписание</h4>
                <p className="text-sm text-gray-600">Разные время работы для максимального удобства</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
