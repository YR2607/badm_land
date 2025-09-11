import { type FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, User, MessageSquare } from 'lucide-react';
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

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '', service: '' });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e: React.FormEvent) => { 
    e.preventDefault(); 
    if (process.env.NODE_ENV === 'development') {
      console.log('Form submitted:', formData); 
    }
    // Here you would typically send data to your backend
    alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
    setFormData({ name: '', email: '', phone: '', message: '', service: '' }); 
  };

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

      {/* Contact Form and Map */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="card">
                <h2 className="text-3xl font-bold font-display text-gray-900 mb-6">
                  Отправьте нам сообщение
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Имя *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                          placeholder="Ваше имя"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Телефон
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                        placeholder="+373 60 123 456"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                      Интересующая услуга
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    >
                      <option value="">Выберите услугу</option>
                      <option value="group">Групповые тренировки</option>
                      <option value="individual">Индивидуальные занятия</option>
                      <option value="competition">Подготовка к соревнованиям</option>
                      <option value="court">Аренда корта</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Сообщение *
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent resize-none"
                        placeholder="Расскажите нам о ваших целях и вопросах..."
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    <Send className="mr-2 w-5 h-5" />
                    Отправить сообщение
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="card h-full">
                <h2 className="text-3xl font-bold font-display text-gray-900 mb-6">
                  Как нас найти
                </h2>
                
                {/* Map Placeholder */}
                <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-primary-blue mx-auto mb-4" />
                    <p className="text-gray-600">Интерактивная карта</p>
                    <p className="text-sm text-gray-500">ул. Примерная 123, Кишинев</p>
                  </div>
                </div>

                {/* Directions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Как добраться:</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      На общественном транспорте: автобусы №5, 12, 27 до остановки "Центр"
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-orange rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      На автомобиле: парковка рядом с входом (бесплатная для участников)
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-yellow rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Пешком: 5 минут от центральной площади
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
