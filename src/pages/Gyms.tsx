import { FC, useState } from 'react';
import { CheckCircle, Clock, Phone, MapPin, Filter, Users, ArrowLeft, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

// CMS interface for future integration
// interface CmsGymsPage {
//   title: string;
//   hero: {
//     badge?: { icon: string; text: string };
//     title: string;
//     subtitle: string;
//     statistics?: Array<{ number: string; description: string }>;
//   };
//   introSection?: {
//     title: string;
//     description: string;
//   };
// }

const Gyms: FC = () => {
  const [gymFilter, setGymFilter] = useState<'all' | 'children' | 'adults'>('all');
  const [selectedGym, setSelectedGym] = useState<number | null>(null);

  // Comprehensive gym data
  const gyms = [
    {
      id: 1,
      name: 'Малая Малиан, 24',
      description: 'Центральная локация в сердце города',
      badge: 'Зал №1',
      badgeColor: 'from-blue-500 to-indigo-600',
      hasChildren: true,
      hasAdults: true,
      image: '/api/placeholder/400/300',
      gallery: ['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300'],
      address: 'ул. Малая Малиан, 24, Кишинев',
      phone: '+373 22 123-456',
      email: 'maliamilian@altius.md',
      mapUrl: 'https://maps.google.com/?q=Малая+Малиан+24+Кишинев',
      features: ['Гибкое расписание', 'Центральное расположение', 'Парковка', 'Раздевалки'],
      schedule: {
        children: {
          title: 'Детские группы',
          times: 'По договоренности',
          details: 'Индивидуальный подход к расписанию для каждой группы'
        },
        adults: {
          title: 'Любители',
          times: 'По договоренности', 
          details: 'Гибкое расписание под ваши потребности'
        }
      },
      pricing: {
        children: {
          monthly: '300 лей/месяц',
          single: '80 лей/занятие',
          trial: '50 лей - пробное занятие'
        },
        adults: {
          monthly: '400 лей/месяц',
          single: '100 лей/занятие',
          trial: '70 лей - пробное занятие'
        }
      },
      trainers: [
        {
          name: 'Александр Петров',
          experience: '8 лет опыта',
          specialization: 'Детские группы',
          photo: '/api/placeholder/150/150'
        },
        {
          name: 'Мария Иванова',
          experience: '5 лет опыта',
          specialization: 'Взрослые группы',
          photo: '/api/placeholder/150/150'
        }
      ]
    },
    {
      id: 2,
      name: 'Улица 31 августа 1989',
      description: 'Специализированный детский центр',
      badge: 'Зал №2',
      badgeColor: 'from-orange-500 to-red-500',
      hasChildren: true,
      hasAdults: false,
      image: '/api/placeholder/400/300',
      gallery: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
      address: 'ул. 31 августа 1989, Кишинев',
      phone: '+373 22 234-567',
      email: 'august31@altius.md',
      mapUrl: 'https://maps.google.com/?q=31+августа+1989+Кишинев',
      features: ['Только детские группы', 'Удобный район', 'Детская площадка', 'Кафетерий'],
      schedule: {
        children: {
          title: 'Детские группы',
          times: 'Пн-Пт 16:00-18:00',
          details: 'Ежедневные тренировки в будние дни'
        }
      },
      pricing: {
        children: {
          monthly: '250 лей/месяц',
          single: '70 лей/занятие',
          trial: '40 лей - пробное занятие'
        }
      },
      trainers: [
        {
          name: 'Елена Сидорова',
          experience: '10 лет опыта',
          specialization: 'Детский тренер',
          photo: '/api/placeholder/150/150'
        }
      ]
    },
    {
      id: 3,
      name: 'Ион Крянге, 1',
      description: 'Профессиональный тренировочный центр',
      badge: 'Зал №3 - Премиум',
      badgeColor: 'from-yellow-500 to-amber-500',
      hasChildren: true,
      hasAdults: true,
      image: '/api/placeholder/400/300',
      gallery: ['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300'],
      address: 'ул. Ион Крянге, 1, Кишинев',
      phone: '+373 22 345-678',
      email: 'creanga@altius.md',
      mapUrl: 'https://maps.google.com/?q=Ион+Крянге+1+Кишинев',
      features: ['Группа совершенствования', 'Профессиональное оборудование', 'Видеоанализ', 'Сауна'],
      schedule: {
        children: {
          title: 'Группа совершенствования',
          times: 'Пн,Ср,Чт,Пт 17:00-19:00 + СБ,ВС 09:00-12:00',
          details: 'Интенсивные тренировки для подготовки к соревнованиям'
        },
        adults: {
          title: 'Любители',
          times: 'Пн,Ср,Пт 19:00-21:00',
          details: 'Тренировки для взрослых любителей бадминтона'
        }
      },
      pricing: {
        children: {
          monthly: '500 лей/месяц',
          single: '120 лей/занятие',
          trial: '80 лей - пробное занятие'
        },
        adults: {
          monthly: '600 лей/месяц',
          single: '150 лей/занятие',
          trial: '100 лей - пробное занятие'
        }
      },
      trainers: [
        {
          name: 'Дмитрий Козлов',
          experience: '15 лет опыта',
          specialization: 'Мастер спорта, детский тренер',
          photo: '/api/placeholder/150/150'
        },
        {
          name: 'Анна Волкова',
          experience: '12 лет опыта',
          specialization: 'КМС, взрослые группы',
          photo: '/api/placeholder/150/150'
        }
      ]
    }
  ];

  // Filter gyms based on selected filter
  const filteredGyms = gyms.filter(gym => {
    if (gymFilter === 'all') return true;
    if (gymFilter === 'children') return gym.hasChildren;
    if (gymFilter === 'adults') return gym.hasAdults;
    return true;
  });

  const currentGym = selectedGym ? gyms.find(g => g.id === selectedGym) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
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
          
          {/* Flying Shuttlecocks Animation */}
          <div className="absolute top-12 left-1/4 w-8 h-8 md:w-12 md:h-12 opacity-30 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}>
            <svg viewBox="0 0 40 40" className="w-full h-full transform rotate-45">
              <defs>
                <radialGradient id="shuttleGrad1" cx="50%" cy="30%" r="60%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.9)"/>
                  <stop offset="100%" stopColor="rgba(255,255,255,0.3)"/>
                </radialGradient>
              </defs>
              <circle cx="20" cy="30" r="4" fill="url(#shuttleGrad1)"/>
              <g fill="rgba(255,255,255,0.6)">
                <path d="M20 26 L17 8 L20 12 L23 8 Z"/>
                <path d="M16 27 L10 12 L16 15 L19 13 Z"/>
                <path d="M24 27 L30 12 L24 15 L21 13 Z"/>
              </g>
            </svg>
          </div>
          
          <div className="absolute top-20 right-1/3 w-6 h-6 md:w-10 md:h-10 opacity-25 animate-bounce" style={{animationDelay: '1.5s', animationDuration: '2.5s'}}>
            <svg viewBox="0 0 40 40" className="w-full h-full transform -rotate-12">
              <circle cx="20" cy="30" r="4" fill="rgba(255,255,255,0.8)"/>
              <g fill="rgba(255,255,255,0.5)">
                <path d="M20 26 L17 8 L20 12 L23 8 Z"/>
                <path d="M16 27 L10 12 L16 15 L19 13 Z"/>
                <path d="M24 27 L30 12 L24 15 L21 13 Z"/>
              </g>
            </svg>
          </div>
          
          {/* Gym Equipment Icons */}
          <div className="absolute bottom-20 right-8 md:bottom-24 md:right-16 w-16 h-16 md:w-20 md:h-20 opacity-20 animate-pulse">
            <svg viewBox="0 0 80 80" className="w-full h-full">
              <defs>
                <linearGradient id="equipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.7)"/>
                  <stop offset="100%" stopColor="rgba(255,255,255,0.3)"/>
                </linearGradient>
              </defs>
              
              {/* Racket 1 */}
              <g transform="translate(10,10) rotate(-15)">
                <ellipse cx="15" cy="15" rx="12" ry="18" fill="none" stroke="url(#equipGradient)" strokeWidth="2"/>
                <rect x="12" y="33" width="6" height="15" fill="url(#equipGradient)" rx="3"/>
                <g stroke="rgba(255,255,255,0.3)" strokeWidth="0.5">
                  <line x1="8" y1="10" x2="8" y2="20"/>
                  <line x1="15" y1="5" x2="15" y2="25"/>
                  <line x1="22" y1="10" x2="22" y2="20"/>
                  <line x1="5" y1="15" x2="25" y2="15"/>
                </g>
              </g>
              
              {/* Racket 2 */}
              <g transform="translate(35,15) rotate(25)">
                <ellipse cx="15" cy="15" rx="12" ry="18" fill="none" stroke="url(#equipGradient)" strokeWidth="2"/>
                <rect x="12" y="33" width="6" height="15" fill="url(#equipGradient)" rx="3"/>
                <g stroke="rgba(255,255,255,0.3)" strokeWidth="0.5">
                  <line x1="8" y1="10" x2="8" y2="20"/>
                  <line x1="15" y1="5" x2="15" y2="25"/>
                  <line x1="22" y1="10" x2="22" y2="20"/>
                  <line x1="5" y1="15" x2="25" y2="15"/>
                </g>
              </g>
            </svg>
          </div>
          
          {/* Court Lines Enhancement */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-20 md:w-48 md:h-32 opacity-10">
            <svg viewBox="0 0 100 60" className="w-full h-full">
              <defs>
                <filter id="courtGlow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <g stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" filter="url(#courtGlow)">
                <rect x="10" y="10" width="80" height="40"/>
                <line x1="50" y1="10" x2="50" y2="50"/>
                <line x1="10" y1="25" x2="90" y2="25"/>
                <line x1="10" y1="35" x2="90" y2="35"/>
              </g>
            </svg>
          </div>
          
          {/* Motion Trails */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/3 left-1/4 w-1 h-8 bg-gradient-to-b from-white/30 to-transparent rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute top-2/3 right-1/3 w-1 h-6 bg-gradient-to-b from-yellow-300/20 to-transparent rounded-full animate-pulse" style={{animationDelay: '1.2s'}}></div>
            <div className="absolute bottom-1/4 left-1/3 w-1 h-10 bg-gradient-to-b from-blue-300/20 to-transparent rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>
          
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-blue/20 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-medium">Современные спортзалы</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold font-display mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                Наши Спортзалы
              </h1>
              
              <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90 leading-relaxed mb-8">
                Выберите удобную локацию для тренировок в современных залах с профессиональным оборудованием
              </p>
              
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="text-4xl font-bold text-yellow-300 mb-2">3</div>
                  <div className="text-blue-100">Спортивных зала</div>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="text-4xl font-bold text-yellow-300 mb-2">6</div>
                  <div className="text-blue-100">Кортов для игры</div>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="text-4xl font-bold text-yellow-300 mb-2">2</div>
                  <div className="text-blue-100">Локации в городе</div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Filter Buttons - Modern Design */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            <button
              onClick={() => {
                setGymFilter('all');
                if (selectedGym) setSelectedGym(null);
              }}
              className={`group relative flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-150 ${
                gymFilter === 'all' 
                  ? 'bg-gradient-to-r from-primary-blue to-primary-orange text-white shadow-lg shadow-primary-blue/25' 
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-lg border border-gray-200/50'
              }`}
            >
              <div className={`p-2 rounded-xl transition-colors ${
                gymFilter === 'all' ? 'bg-white/20' : 'bg-primary-blue/10 group-hover:bg-primary-blue/20'
              }`}>
                <Filter className="w-4 h-4" />
              </div>
              Все залы
              {gymFilter === 'all' && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-gradient-to-r from-primary-blue to-primary-orange rounded-2xl -z-10"
                />
              )}
            </button>
            
            <button
              onClick={() => {
                setGymFilter('children');
                if (selectedGym) setSelectedGym(null);
              }}
              className={`group relative flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-150 ${
                gymFilter === 'children' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25' 
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-lg border border-gray-200/50'
              }`}
            >
              <div className={`p-2 rounded-xl transition-colors ${
                gymFilter === 'children' ? 'bg-white/20' : 'bg-green-50 group-hover:bg-green-100'
              }`}>
                <span className="text-lg">👨‍👩‍👧‍👦</span>
              </div>
              Детские группы
              {gymFilter === 'children' && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl -z-10"
                />
              )}
            </button>
            
            <button
              onClick={() => {
                setGymFilter('adults');
                if (selectedGym) setSelectedGym(null);
              }}
              className={`group relative flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-150 ${
                gymFilter === 'adults' 
                  ? 'bg-gradient-to-r from-primary-orange to-red-500 text-white shadow-lg shadow-primary-orange/25' 
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-lg border border-gray-200/50'
              }`}
            >
              <div className={`p-2 rounded-xl transition-colors ${
                gymFilter === 'adults' ? 'bg-white/20' : 'bg-primary-orange/10 group-hover:bg-primary-orange/20'
              }`}>
                <span className="text-lg">🏸</span>
              </div>
              Любители
              {gymFilter === 'adults' && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-gradient-to-r from-primary-orange to-red-500 rounded-2xl -z-10"
                />
              )}
            </button>
          </div>

          {/* Gym Selection or Detail View */}
          {!selectedGym ? (
            <>
              {/* Gym Selection Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredGyms.map((gym, index) => (
                  <motion.div
                    key={gym.id}
                    className="group relative bg-white rounded-3xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all duration-200 cursor-pointer"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedGym(gym.id)}
                  >
                    
                    <div className="relative">
                      <div className="relative overflow-hidden">
                        <img 
                          src={gym.image} 
                          alt={gym.name}
                          className="w-full h-56 object-cover transition-transform duration-200 group-hover:scale-102"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                      
                      <div className={`absolute top-6 left-6 px-4 py-2 rounded-2xl text-sm font-bold text-white bg-gradient-to-r ${gym.badgeColor} shadow-lg`}>
                        {gym.badge}
                      </div>
                      
                    </div>
                    
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{gym.name}</h3>
                          <p className="text-gray-600 leading-relaxed">{gym.description}</p>
                        </div>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-3 mb-6">
                        {gym.hasChildren && (
                          <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-2xl text-sm font-semibold border border-green-200/50">
                            <span className="text-base">👨‍👩‍👧‍👦</span>
                            Детские
                          </span>
                        )}
                        {gym.hasAdults && (
                          <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-primary-blue rounded-2xl text-sm font-semibold border border-primary-blue/20">
                            <span className="text-base">🏸</span>
                            Взрослые
                          </span>
                        )}
                      </div>
                      
                      {/* Features */}
                      <div className="space-y-3 mb-8">
                        {gym.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-gray-700">
                            <div className="w-2 h-2 bg-gradient-to-r from-primary-blue to-primary-orange rounded-full" />
                            <span className="font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Action Button */}
                      <button className="w-full bg-gradient-to-r from-primary-blue to-primary-orange text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all duration-200">
                        <span className="flex items-center justify-center gap-2">
                          Подробнее
                          →
                        </span>
                      </button>
                    </div>
                    
                  </motion.div>
                ))}
              </div>
              {filteredGyms.length === 0 && (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-6xl mb-4">🏸</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Залы не найдены</h3>
                  <p className="text-gray-600">Попробуйте изменить фильтр для поиска подходящих залов</p>
                </motion.div>
              )}
            </>
          ) : (
            /* Detailed Gym View */
            currentGym && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Back Button */}
                <button 
                  onClick={() => setSelectedGym(null)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Назад к выбору залов
                </button>

                {/* Gym Header */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="relative h-64 md:h-80">
                    <img 
                      src={currentGym.image} 
                      alt={currentGym.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${currentGym.badgeColor} text-xs font-semibold mb-2`}>
                        {currentGym.badge}
                      </div>
                      <h1 className="text-3xl md:text-4xl font-bold mb-2">{currentGym.name}</h1>
                      <p className="text-lg opacity-90">{currentGym.description}</p>
                    </div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Schedule & Pricing */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Schedule */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Clock className="w-6 h-6 text-blue-500" />
                        Расписание тренировок
                      </h2>
                      
                      <div className="space-y-4">
                        {currentGym.schedule.children && (
                          <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-400">
                            <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                              <span className="text-xl">👨‍👩‍👧‍👦</span>
                              {currentGym.schedule.children.title}
                            </h3>
                            <p className="text-green-700 font-medium mb-1">{currentGym.schedule.children.times}</p>
                            <p className="text-green-600 text-sm">{currentGym.schedule.children.details}</p>
                          </div>
                        )}
                        
                        {currentGym.schedule.adults && (
                          <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-400">
                            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                              <span className="text-xl">🏸</span>
                              {currentGym.schedule.adults.title}
                            </h3>
                            <p className="text-blue-700 font-medium mb-1">{currentGym.schedule.adults.times}</p>
                            <p className="text-blue-600 text-sm">{currentGym.schedule.adults.details}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        Стоимость занятий
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {currentGym.pricing.children && (
                          <div className="border border-green-200 rounded-xl p-4">
                            <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                              <span>👨‍👩‍👧‍👦</span>
                              Детские группы
                            </h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Месячный абонемент:</span>
                                <span className="font-semibold">{currentGym.pricing.children.monthly}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Разовое занятие:</span>
                                <span className="font-semibold">{currentGym.pricing.children.single}</span>
                              </div>
                              <div className="flex justify-between text-green-600">
                                <span>Пробное занятие:</span>
                                <span className="font-semibold">{currentGym.pricing.children.trial}</span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {currentGym.pricing.adults && (
                          <div className="border border-blue-200 rounded-xl p-4">
                            <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                              <span>🏸</span>
                              Взрослые группы
                            </h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Месячный абонемент:</span>
                                <span className="font-semibold">{currentGym.pricing.adults.monthly}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Разовое занятие:</span>
                                <span className="font-semibold">{currentGym.pricing.adults.single}</span>
                              </div>
                              <div className="flex justify-between text-blue-600">
                                <span>Пробное занятие:</span>
                                <span className="font-semibold">{currentGym.pricing.adults.trial}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Gallery */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Фото зала</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {currentGym.gallery.map((photo, idx) => (
                          <div key={idx} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                            <img 
                              src={photo} 
                              alt={`${currentGym.name} фото ${idx + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Contact & Trainers */}
                  <div className="space-y-6">
                    {/* Contact Info */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-blue-500" />
                        Контакты
                      </h2>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Адрес</p>
                            <p className="font-medium">{currentGym.address}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Телефон</p>
                            <a href={`tel:${currentGym.phone}`} className="font-medium text-blue-600 hover:text-blue-800">
                              {currentGym.phone}
                            </a>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <a href={`mailto:${currentGym.email}`} className="font-medium text-blue-600 hover:text-blue-800">
                              {currentGym.email}
                            </a>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 space-y-3">
                        <button className={`w-full py-3 px-4 bg-gradient-to-r ${currentGym.badgeColor} text-white rounded-lg font-medium hover:shadow-md transition-all duration-200`}>
                          <div className="flex items-center justify-center gap-2">
                            <Phone className="w-4 h-4" />
                            Записаться на тренировку
                          </div>
                        </button>
                        
                        <button 
                          onClick={() => window.open(currentGym.mapUrl, '_blank')}
                          className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Показать на карте
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Trainers */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        Наши тренеры
                      </h2>
                      
                      <div className="space-y-4">
                        {currentGym.trainers.map((trainer, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <img 
                              src={trainer.photo} 
                              alt={trainer.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <h3 className="font-semibold text-gray-900">{trainer.name}</h3>
                              <p className="text-sm text-gray-600">{trainer.experience}</p>
                              <p className="text-xs text-gray-500">{trainer.specialization}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Особенности зала</h2>
                      <div className="space-y-2">
                        {currentGym.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default Gyms;