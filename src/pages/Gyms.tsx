import { useState, useEffect, type FC } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchGyms, type CmsGym, fetchGymsHero, type CmsHero, fetchGymsPageLabels, type CmsGymsPageLabels } from '../lib/cms';
import { addCmsDevMarkers } from '../utils/cmsDevMarker';
import { useTranslation } from 'react-i18next';
import { GymCardSkeleton } from '../components/Skeletons';

const Gyms: FC = () => {
  const { t, i18n } = useTranslation();
  const [cmsGyms, setCmsGyms] = useState<CmsGym[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGym, setSelectedGym] = useState<CmsGym | null>(null);
  const [filter, setFilter] = useState<'all' | 'children' | 'adults'>('all');
  const [heroData, setHeroData] = useState<CmsHero | null>(null);
  const [labels, setLabels] = useState<CmsGymsPageLabels | null>(null);

  // Загружаем данные из CMS
  useEffect(() => {
    const loadGyms = async () => {
      try {
        setLoading(true);
        // Очищаем состояние перед загрузкой новых данных
        setCmsGyms([]);
        setHeroData(null);
        setLabels(null);
        
        const [gymsData, hero, pageLabels] = await Promise.all([
          fetchGyms(i18n.language as string),
          fetchGymsHero(i18n.language as string),
          fetchGymsPageLabels(i18n.language as string)
        ]);
        const rawGyms = gymsData || [];
        const markedGyms = addCmsDevMarkers(rawGyms) as CmsGym[];
        const cleanedGyms = markedGyms.map((gym, idx) => {
          const source = rawGyms[idx] || gym;
          return {
            ...gym,
            id: source.id,
            slug: source.slug,
          };
        });
        setCmsGyms(cleanedGyms);
        if (hero) setHeroData(addCmsDevMarkers(hero));
        if (pageLabels) setLabels(addCmsDevMarkers(pageLabels));
        setError(null);
      } catch (err) {
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    loadGyms();
  }, [i18n.language, t]);

  // Используем только данные из CMS
  const gyms = cmsGyms;

  // Filter gyms based on selected filter
  const filteredGyms = gyms.filter(gym => {
    if (filter === 'all') return true;
    if (filter === 'children') return gym.hasChildren;
    if (filter === 'adults') return gym.hasAdults;
    return true;
  });

  const handleGymSelect = (gymId: string) => {
    const gym = gyms.find(g => g.id === gymId);
    setSelectedGym(gym || null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <GymCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

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
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              {heroData?.badge?.text && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                  <span className="text-lg">🏸</span>
                  <span className="text-sm font-medium">{heroData.badge.text}</span>
                </div>
              )}
              
              {heroData?.title && (
                <h1 className="text-4xl md:text-6xl font-bold font-display mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  {heroData.title}
                </h1>
              )}
              
              {heroData?.subtitle && (
                <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90 leading-relaxed mb-8">
                  {heroData.subtitle}
                </p>
              )}
              
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="text-4xl font-bold text-yellow-300 mb-2">3</div>
                  <div className="text-blue-100">{t('gyms.hero.stats.facilities')}</div>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="text-4xl font-bold text-yellow-300 mb-2">6</div>
                  <div className="text-blue-100">{t('gyms.hero.stats.courts')}</div>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="text-4xl font-bold text-yellow-300 mb-2">2</div>
                  <div className="text-blue-100">{t('gyms.hero.stats.locations')}</div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-[1600px] mx-auto">
          {/* Filter Buttons - Modern Design */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'all'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}>
              {t('gyms.filters.all')}
            </button>
            
            <button
              onClick={() => setFilter('children')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'children'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}>
              <span className="text-lg">👨‍👩‍👧‍👦</span>
              {t('gyms.filters.children')}
            </button>
            
            <button
              onClick={() => setFilter('adults')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'adults'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}>
              <span className="text-lg">🏸</span>
              {t('gyms.filters.adults')}
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
                    onClick={() => handleGymSelect(gym.id)}
                  >
                    
                    <div className="relative">
                      <div className="relative overflow-hidden">
                        <img 
                          src={gym.heroImage || gym.gallery?.[0] || '/images/gym-placeholder.jpg'} 
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
                            {t('gyms.tags.children')}
                          </span>
                        )}
                        {gym.hasAdults && (
                          <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-primary-blue rounded-2xl text-sm font-semibold border border-primary-blue/20">
                            <span className="text-base">🏸</span>
                            {t('gyms.tags.adults')}
                          </span>
                        )}
                      </div>
                      
                      {/* Features */}
                      <div className="space-y-3 mb-8">
                        {gym.features?.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-gray-700">
                            <div className="w-2 h-2 bg-gradient-to-r from-primary-blue to-primary-orange rounded-full" />
                            <span className="font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Action Button */}
                      <Link
                        to={`/gyms/${gym.slug}`}
                        className="block w-full bg-gradient-to-r from-primary-blue to-primary-orange text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all duration-200 text-center"
                      >
                        <span className="inline-flex items-center justify-center gap-2">
                          {t('gyms.moreDetails')}
                          →
                        </span>
                      </Link>
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('gyms.noGymsFound')}</h3>
                  <p className="text-gray-600">{t('gyms.tryChangeFilter')}</p>
                </motion.div>
              )}
            </>
          ) : (
            /* Detailed Gym View */
            selectedGym && (
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
                  {t('gyms.backToSelection')}
                </button>

                {/* Gym Header */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="relative h-64 md:h-80">
                    <img 
                      src={selectedGym.heroImage || selectedGym.gallery?.[0] || '/images/gym-placeholder.jpg'} 
                      alt={selectedGym.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${selectedGym.badgeColor} text-xs font-semibold mb-2`}>
                        {selectedGym.badge}
                      </div>
                      <h1 className="text-3xl md:text-4xl font-bold mb-2">{selectedGym.name}</h1>
                      <p className="text-lg opacity-90">{selectedGym.description}</p>
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
                        {t('gyms.schedule.title')}
                      </h2>
                      
                      <div className="space-y-4">
                        {selectedGym.schedule?.children && (
                          <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-400">
                            <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                              <span className="text-xl">👨‍👩‍👧‍👦</span>
                              {selectedGym.schedule?.children?.title}
                            </h3>
                            <p className="text-green-700 font-medium mb-1">{selectedGym.schedule?.children?.times}</p>
                            <p className="text-green-600 text-sm">{selectedGym.schedule?.children?.details}</p>
                          </div>
                        )}
                        
                        {selectedGym.schedule?.adults && (
                          <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-400">
                            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                              <span className="text-xl">🏸</span>
                              {selectedGym.schedule?.adults?.title}
                            </h3>
                            <p className="text-blue-700 font-medium mb-1">{selectedGym.schedule?.adults?.times}</p>
                            <p className="text-blue-600 text-sm">{selectedGym.schedule?.adults?.details}</p>
                          </div>
                        )}
                      </div>
                    </div>


                    {/* Gallery */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">{labels?.galleryTitle || t('gyms.gallery.title')}</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedGym.gallery?.map((photo, idx) => (
                          <div key={idx} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                            <img 
                              src={photo} 
                              alt={`${selectedGym.name} фото ${idx + 1}`}
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
                        {labels?.contactTitle || t('gyms.contact.title')}
                      </h2>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">{t('gyms.contact.address')}</p>
                            <p className="font-medium">{selectedGym.address}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">{t('gyms.contact.phone')}</p>
                            <a href={`tel:${selectedGym.phone}`} className="font-medium text-blue-600 hover:text-blue-800">
                              {selectedGym.phone}
                            </a>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="text-sm text-gray-600">{t('gyms.contact.email')}</p>
                            <a href={`mailto:${selectedGym.email}`} className="font-medium text-blue-600 hover:text-blue-800">
                              {selectedGym.email}
                            </a>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 space-y-3">
                        <a 
                          href={selectedGym.mapUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <MapPin className="w-5 h-5" />
                          {labels?.openMapButton || t('gyms.contact.openMap')}
                        </a>
                      </div>
                    </div>

                    {/* Trainers */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        {labels?.trainersTitle || t('gyms.trainers.title')}
                      </h2>
                      
                      <div className="space-y-4">
                        {selectedGym.trainers?.map((trainer: any, idx: number) => (
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
                      <h2 className="text-xl font-bold text-gray-900 mb-4">{t('gyms.features.title')}</h2>
                      <div className="space-y-2">
                        {selectedGym.features?.map((feature: string, idx: number) => (
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