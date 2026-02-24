import { useState, useEffect, type FC } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-zenith-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 bg-zenith-black">
        {/* Enhanced Badminton Court Background */}
        <div className="absolute inset-0">
          {/* Dynamic Court with Lighting Effects */}
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 1200 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
              <defs>
                {/* Gradient for court surface */}
                <radialGradient id="courtGradient" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="rgba(220,38,38,0.15)" />
                  <stop offset="50%" stopColor="rgba(220,38,38,0.05)" />
                  <stop offset="100%" stopColor="rgba(220,38,38,0.01)" />
                </radialGradient>

                {/* Glow effect for lines */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Shadow filter */}
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.5" />
                </filter>
              </defs>

              {/* Court Surface with gradient */}
              <rect width="1200" height="600" fill="url(#courtGradient)" />

              {/* Court Lines with glow effect */}
              <g stroke="rgba(255,255,255,0.4)" strokeWidth="3" fill="none" filter="url(#glow)">
                {/* Outer boundaries */}
                <rect x="200" y="100" width="800" height="400" strokeWidth="4" />

                {/* Center line */}
                <line x1="600" y1="100" x2="600" y2="500" strokeWidth="3" />

                {/* Service lines */}
                <line x1="200" y1="240" x2="1000" y2="240" />
                <line x1="200" y1="360" x2="1000" y2="360" />

                {/* Short service lines */}
                <line x1="320" y1="100" x2="320" y2="500" />
                <line x1="880" y1="100" x2="880" y2="500" />

                {/* Center service lines */}
                <line x1="600" y1="240" x2="600" y2="360" />
              </g>

              {/* Enhanced Net with 3D effect */}
              <g filter="url(#shadow)">
                <line x1="600" y1="100" x2="600" y2="500" stroke="rgba(255,255,255,0.5)" strokeWidth="6" />
                <rect x="596" y="280" width="8" height="40" fill="rgba(220,38,38,0.8)" rx="2" />

                {/* Net mesh pattern */}
                <g stroke="rgba(255,255,255,0.15)" strokeWidth="1">
                  <line x1="590" y1="120" x2="610" y2="120" />
                  <line x1="590" y1="140" x2="610" y2="140" />
                  <line x1="590" y1="160" x2="610" y2="160" />
                  <line x1="590" y1="180" x2="610" y2="180" />
                  <line x1="590" y1="200" x2="610" y2="200" />
                  <line x1="590" y1="220" x2="610" y2="220" />
                  <line x1="590" y1="240" x2="610" y2="240" />
                  <line x1="590" y1="260" x2="610" y2="260" />
                </g>
              </g>

              {/* Spotlight effects */}
              <g opacity="0.1">
                <ellipse cx="400" cy="200" rx="150" ry="80" fill="rgba(220,38,38,0.3)" />
                <ellipse cx="800" cy="400" rx="150" ry="80" fill="rgba(220,38,38,0.3)" />
              </g>
            </svg>
          </div>

          {/* Flying Shuttlecocks Animation */}
          <div className="absolute top-12 left-1/4 w-8 h-8 md:w-12 md:h-12 opacity-20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
            <svg viewBox="0 0 40 40" className="w-full h-full transform rotate-45">
              <defs>
                <radialGradient id="shuttleGrad1" cx="50%" cy="30%" r="60%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
                </radialGradient>
              </defs>
              <circle cx="20" cy="30" r="4" fill="url(#shuttleGrad1)" />
              <g fill="rgba(255,255,255,0.4)">
                <path d="M20 26 L17 8 L20 12 L23 8 Z" />
                <path d="M16 27 L10 12 L16 15 L19 13 Z" />
                <path d="M24 27 L30 12 L24 15 L21 13 Z" />
              </g>
            </svg>
          </div>

          <div className="absolute top-20 right-1/3 w-6 h-6 md:w-10 md:h-10 opacity-15 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '2.5s' }}>
            <svg viewBox="0 0 40 40" className="w-full h-full transform -rotate-12">
              <circle cx="20" cy="30" r="4" fill="rgba(255,255,255,0.8)" />
              <g fill="rgba(255,255,255,0.3)">
                <path d="M20 26 L17 8 L20 12 L23 8 Z" />
                <path d="M16 27 L10 12 L16 15 L19 13 Z" />
                <path d="M24 27 L30 12 L24 15 L21 13 Z" />
              </g>
            </svg>
          </div>

          {/* Gym Equipment Icons */}
          <div className="absolute bottom-20 right-8 md:bottom-24 md:right-16 w-16 h-16 md:w-20 md:h-20 opacity-15 animate-pulse">
            <svg viewBox="0 0 80 80" className="w-full h-full">
              <defs>
                <linearGradient id="equipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
                </linearGradient>
              </defs>

              {/* Racket 1 */}
              <g transform="translate(10,10) rotate(-15)">
                <ellipse cx="15" cy="15" rx="12" ry="18" fill="none" stroke="url(#equipGradient)" strokeWidth="2" />
                <rect x="12" y="33" width="6" height="15" fill="url(#equipGradient)" rx="3" />
                <g stroke="rgba(255,255,255,0.2)" strokeWidth="0.5">
                  <line x1="8" y1="10" x2="8" y2="20" />
                  <line x1="15" y1="5" x2="15" y2="25" />
                  <line x1="22" y1="10" x2="22" y2="20" />
                  <line x1="5" y1="15" x2="25" y2="15" />
                </g>
              </g>

              {/* Racket 2 */}
              <g transform="translate(35,15) rotate(25)">
                <ellipse cx="15" cy="15" rx="12" ry="18" fill="none" stroke="url(#equipGradient)" strokeWidth="2" />
                <rect x="12" y="33" width="6" height="15" fill="url(#equipGradient)" rx="3" />
                <g stroke="rgba(255,255,255,0.2)" strokeWidth="0.5">
                  <line x1="8" y1="10" x2="8" y2="20" />
                  <line x1="15" y1="5" x2="15" y2="25" />
                  <line x1="22" y1="10" x2="22" y2="20" />
                  <line x1="5" y1="15" x2="25" y2="15" />
                </g>
              </g>
            </svg>
          </div>

          {/* Court Lines Enhancement */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-20 md:w-48 md:h-32 opacity-5">
            <svg viewBox="0 0 100 60" className="w-full h-full">
              <defs>
                <filter id="courtGlow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" filter="url(#courtGlow)">
                <rect x="10" y="10" width="80" height="40" />
                <line x1="50" y1="10" x2="50" y2="50" />
                <line x1="10" y1="25" x2="90" y2="25" />
                <line x1="10" y1="35" x2="90" y2="35" />
              </g>
            </svg>
          </div>

          {/* Motion Trails */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/3 left-1/4 w-1 h-8 bg-gradient-to-b from-white/30 to-transparent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-2/3 right-1/3 w-1 h-6 bg-gradient-to-b from-zenith-crimson/20 to-transparent rounded-full animate-pulse" style={{ animationDelay: '1.2s' }}></div>
            <div className="absolute bottom-1/4 left-1/3 w-1 h-10 bg-gradient-to-b from-white/20 to-transparent rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              {heroData?.badge?.text && (
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-zenith-crimson/20 bg-zenith-crimson/10 text-zenith-crimson uppercase tracking-widest text-xs font-bold mb-8">
                  <span className="text-lg">🏸</span>
                  <span>{heroData.badge.text}</span>
                </div>
              )}

              {heroData?.title && (
                <h1 className="text-6xl md:text-[6rem] lg:text-[8rem] font-black font-display text-white mb-8 uppercase tracking-tighter leading-[0.85] drop-shadow-2xl">
                  {heroData.title}
                </h1>
              )}

              {heroData?.subtitle && (
                <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-300 font-medium leading-relaxed mb-16">
                  {heroData.subtitle}
                </p>
              )}

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 max-w-5xl mx-auto">
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="text-5xl md:text-6xl font-black font-display text-zenith-crimson mb-2 tracking-tighter">3</div>
                  <div className="text-white/80 uppercase tracking-widest text-sm font-bold">{t('gyms.hero.stats.facilities')}</div>
                </motion.div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="text-5xl md:text-6xl font-black font-display text-zenith-crimson mb-2 tracking-tighter">6</div>
                  <div className="text-white/80 uppercase tracking-widest text-sm font-bold">{t('gyms.hero.stats.courts')}</div>
                </motion.div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="text-5xl md:text-6xl font-black font-display text-zenith-crimson mb-2 tracking-tighter">2</div>
                  <div className="text-white/80 uppercase tracking-widest text-sm font-bold">{t('gyms.hero.stats.locations')}</div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-4 bg-zenith-white relative">
        <div className="max-w-[1600px] mx-auto">
          {/* Filter Buttons - Modern Design */}
          <div className="flex flex-wrap justify-center gap-4 mb-20">
            <button
              onClick={() => setFilter('all')}
              className={`px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all duration-300 ${filter === 'all'
                ? 'bg-zenith-black text-white shadow-2xl scale-110'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}>
              {t('gyms.filters.all')}
            </button>

            <button
              onClick={() => setFilter('children')}
              className={`px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all duration-300 flex items-center gap-2 ${filter === 'children'
                ? 'bg-zenith-crimson text-white shadow-2xl scale-110'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}>
              <span>👨‍👩‍👧‍👦</span>
              {t('gyms.filters.children')}
            </button>

            <button
              onClick={() => setFilter('adults')}
              className={`px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all duration-300 flex items-center gap-2 ${filter === 'adults'
                ? 'bg-zenith-black text-white shadow-2xl scale-110 border border-zenith-crimson/30'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}>
              <span>🏸</span>
              {t('gyms.filters.adults')}
            </button>
          </div>

          {/* Gym Selection or Detail View */}
          {!selectedGym ? (
            <>
              {/* Gym Selection Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {filteredGyms.map((gym, index) => (
                  <motion.div
                    key={gym.id}
                    className="group relative bg-white rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-10px_rgba(220,38,38,0.15)] border-2 border-transparent hover:border-zenith-crimson/20 overflow-hidden transition-all duration-500 cursor-pointer"
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
                    whileHover={{ y: -8 }}
                    onClick={() => handleGymSelect(gym.id)}
                  >

                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={gym.heroImage || gym.gallery?.[0] || '/images/gym-placeholder.jpg'}
                        alt={gym.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zenith-black/60 via-transparent to-transparent opacity-60" />

                      <div className="absolute top-6 left-6">
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white bg-zenith-crimson shadow-xl`}>
                          {gym.badge}
                        </div>
                      </div>
                    </div>

                    <div className="p-10">
                      <div className="mb-6">
                        <h3 className="text-3xl font-black font-display text-zenith-black mb-3 uppercase tracking-tight group-hover:text-zenith-crimson transition-colors">{gym.name}</h3>
                        <p className="text-gray-600 font-medium leading-relaxed line-clamp-2">{gym.description}</p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-8">
                        {gym.hasChildren && (
                          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 text-zenith-black rounded-xl text-xs font-bold uppercase tracking-widest border border-gray-100">
                            👨‍👩‍👧‍👦 {t('gyms.tags.children')}
                          </span>
                        )}
                        {gym.hasAdults && (
                          <span className="inline-flex items-center gap-2 px-4 py-2 bg-zenith-crimson/5 text-zenith-crimson rounded-xl text-xs font-bold uppercase tracking-widest border border-zenith-crimson/10">
                            🏸 {t('gyms.tags.adults')}
                          </span>
                        )}
                      </div>

                      {/* Action Button */}
                      <Link
                        to={`/gyms/${gym.slug}`}
                        className="block w-full bg-zenith-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-zenith-crimson transition-all duration-300 text-center shadow-lg group-hover:shadow-zenith-crimson/20"
                      >
                        <span className="inline-flex items-center justify-center gap-3">
                          {t('gyms.moreDetails')}
                          <ArrowRight className="w-4 h-4" />
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
                className="space-y-12"
              >
                {/* Back Button */}
                <button
                  onClick={() => setSelectedGym(null)}
                  className="flex items-center gap-3 text-zenith-black hover:text-zenith-crimson transition-all font-black uppercase tracking-widest text-xs group"
                >
                  <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-zenith-crimson group-hover:bg-zenith-crimson group-hover:text-white transition-all">
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                  {t('gyms.backToSelection')}
                </button>

                {/* Gym Header */}
                <div className="relative h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-2 border-white">
                  <img
                    src={selectedGym.heroImage || selectedGym.gallery?.[0] || '/images/gym-placeholder.jpg'}
                    alt={selectedGym.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zenith-black via-zenith-black/20 to-transparent" />
                  <div className="absolute bottom-12 left-12 right-12 text-white">
                    <div className="inline-block px-6 py-2 rounded-full bg-zenith-crimson text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-xl">
                      {selectedGym.badge}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black font-display uppercase tracking-tighter mb-4 leading-none">{selectedGym.name}</h1>
                    <p className="text-xl md:text-2xl text-gray-200 font-medium max-w-3xl leading-relaxed">{selectedGym.description}</p>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Left Column - Schedule & Pricing */}
                  <div className="lg:col-span-2 space-y-12">
                    {/* Schedule */}
                    <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-100">
                      <div className="flex items-center gap-4 mb-10">
                        <div className="w-14 h-14 bg-zenith-black text-white flex items-center justify-center rounded-2xl shadow-lg">
                          <Clock className="w-7 h-7" />
                        </div>
                        <h2 className="text-4xl font-black font-display text-zenith-black uppercase tracking-tight">
                          {t('gyms.schedule.title')}
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {selectedGym.schedule?.children && (
                          <div className="p-8 rounded-[2rem] bg-gray-50 border-t-4 border-zenith-crimson/30 hover:bg-white transition-colors hover:shadow-xl group">
                            <h3 className="text-xl font-black font-display text-zenith-black mb-4 uppercase tracking-tight flex items-center gap-3">
                              <span className="text-2xl">👨‍👩‍👧‍👦</span>
                              {selectedGym.schedule?.children?.title}
                            </h3>
                            <div className="text-3xl font-black font-display text-zenith-crimson mb-4 leading-none">
                              {selectedGym.schedule?.children?.times}
                            </div>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">{selectedGym.schedule?.children?.details}</p>
                          </div>
                        )}

                        {selectedGym.schedule?.adults && (
                          <div className="p-8 rounded-[2rem] bg-gray-50 border-t-4 border-zenith-black hover:bg-white transition-colors hover:shadow-xl group">
                            <h3 className="text-xl font-black font-display text-zenith-black mb-4 uppercase tracking-tight flex items-center gap-3">
                              <span className="text-2xl">🏸</span>
                              {selectedGym.schedule?.adults?.title}
                            </h3>
                            <div className="text-3xl font-black font-display text-zenith-black mb-4 leading-none">
                              {selectedGym.schedule?.adults?.times}
                            </div>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">{selectedGym.schedule?.adults?.details}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Gallery */}
                    <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-[0_20px_50px_-12_rgba(0,0,0,0.05)] border border-gray-100">
                      <h2 className="text-4xl font-black font-display text-zenith-black uppercase tracking-tight mb-10">
                        {labels?.galleryTitle || t('gyms.gallery.title')}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {selectedGym.gallery?.map((photo, idx) => (
                          <motion.div
                            key={idx}
                            className="aspect-[4/5] bg-gray-100 rounded-[2rem] overflow-hidden shadow-lg border-2 border-transparent hover:border-zenith-crimson transition-all"
                            whileHover={{ scale: 1.03 }}
                          >
                            <img
                              src={photo}
                              alt={`${selectedGym.name} фото ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Contact & Trainers */}
                  <div className="space-y-12">
                    {/* Contact Info */}
                    <div className="bg-zenith-black rounded-[2.5rem] p-10 md:p-12 shadow-2xl relative overflow-hidden text-white">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-zenith-crimson/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                      <div className="flex items-center gap-4 mb-10 relative z-10">
                        <div className="w-12 h-12 bg-zenith-crimson text-white flex items-center justify-center rounded-xl shadow-lg shadow-zenith-crimson/20">
                          <Phone className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-black font-display uppercase tracking-tight">
                          {labels?.contactTitle || t('gyms.contact.title')}
                        </h2>
                      </div>

                      <div className="space-y-8 relative z-10">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                            <MapPin className="w-4 h-4 text-zenith-crimson" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{t('gyms.contact.address')}</p>
                            <p className="font-bold leading-tight">{selectedGym.address}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                            <Phone className="w-4 h-4 text-zenith-crimson" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{t('gyms.contact.phone')}</p>
                            <a href={`tel:${selectedGym.phone}`} className="text-lg font-black font-display text-white hover:text-zenith-crimson transition-colors">
                              {selectedGym.phone}
                            </a>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                            <ArrowRight className="w-4 h-4 text-zenith-crimson" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{t('gyms.contact.email')}</p>
                            <a href={`mailto:${selectedGym.email}`} className="font-bold hover:text-zenith-crimson transition-colors">
                              {selectedGym.email}
                            </a>
                          </div>
                        </div>
                      </div>

                      <a
                        href={selectedGym.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-12 w-full bg-white text-zenith-black py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-zenith-crimson hover:text-white transition-all duration-300 flex items-center justify-center gap-3 shadow-xl relative z-10"
                      >
                        <MapPin className="w-4 h-4" />
                        {labels?.openMapButton || t('gyms.contact.openMap')}
                      </a>
                    </div>

                    {/* Trainers */}
                    <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-100">
                      <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-gray-100 text-zenith-black flex items-center justify-center rounded-xl">
                          <ArrowRight className="w-6 h-6 rotate-45" />
                        </div>
                        <h2 className="text-2xl font-black font-display text-zenith-black uppercase tracking-tight">
                          {labels?.trainersTitle || t('gyms.trainers.title')}
                        </h2>
                      </div>

                      <div className="space-y-6">
                        {selectedGym.trainers?.map((trainer: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-5 p-5 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100 group">
                            <img
                              src={trainer.photo}
                              alt={trainer.name}
                              className="w-16 h-16 rounded-2xl object-cover shadow-lg group-hover:scale-110 transition-transform duration-500"
                            />
                            <div>
                              <h3 className="font-black text-zenith-black text-lg uppercase tracking-tight">{trainer.name}</h3>
                              <p className="text-[10px] font-black text-zenith-crimson uppercase tracking-widest leading-none mt-1">{trainer.experience}</p>
                              <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-tight">{trainer.specialization}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features Bento */}
                    <div className="bg-zenith-crimson rounded-[2.5rem] p-10 md:p-12 shadow-2xl shadow-zenith-crimson/20 text-white">
                      <h2 className="text-2xl font-black font-display uppercase tracking-tight mb-8">
                        {t('gyms.features.title')}
                      </h2>
                      <div className="grid grid-cols-1 gap-4">
                        {selectedGym.features?.map((feature: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-4 py-3 border-b border-white/20 last:border-0">
                            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
                            <span className="text-sm font-bold uppercase tracking-widest leading-tight">{feature}</span>
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