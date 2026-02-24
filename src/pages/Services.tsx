import { FC, useState, useEffect } from 'react';
import { Sparkles, ChevronDown, Phone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Breadcrumbs from '../components/Breadcrumbs';
import SEO from '../components/SEO';
import { fetchServicesPage, CmsServicesPage, fetchServicesHero, type CmsHero, fetchHomePage, type CmsHomePage } from '../lib/cms';
import { addCmsDevMarkers } from '../utils/cmsDevMarker';
import ServicesSection from '../components/ServicesSection';

const Services: FC = () => {
  const { t, i18n } = useTranslation();
  const [cmsData, setCmsData] = useState<CmsServicesPage | null>(null);
  const [heroData, setHeroData] = useState<CmsHero | null>(null);
  const [homeServicesSection, setHomeServicesSection] = useState<CmsHomePage['servicesSection'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCmsData = async () => {
      try {
        const [data, hero, home] = await Promise.all([
          fetchServicesPage(i18n.language as string),
          fetchServicesHero(i18n.language as string),
          fetchHomePage(i18n.language as string),
        ]);
        if (data) setCmsData(addCmsDevMarkers(data));
        if (hero) setHeroData(addCmsDevMarkers(hero));
        if (home?.servicesSection) {
          setHomeServicesSection(addCmsDevMarkers(home.servicesSection));
        } else {
          setHomeServicesSection(null);
        }
      } catch (error) {
        setError(t('common.error'));
      }
    };

    loadCmsData();
  }, [i18n.language, t]);

  const faqs: Array<{ q: string; a: string }> = [
    { q: t('services.faq.questions.howToSignUp.q'), a: t('services.faq.questions.howToSignUp.a') },
    { q: t('services.faq.questions.trialSession.q'), a: t('services.faq.questions.trialSession.a') },
    { q: t('services.faq.questions.equipment.q'), a: t('services.faq.questions.equipment.a') },
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
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zenith-white">
      <SEO
        title="Услуги - Тренировки по бадминтону | Altius"
        description="Групповые и индивидуальные тренировки по бадминтону в Кишиневе. Программы для детей и взрослых, подготовка к соревнованиям. Цены от 200 MDL/месяц."
        keywords="тренировки бадминтон, групповые занятия, индивидуальные тренировки, цены бадминтон, Кишинев"
        image="https://altius.md/og-services.jpg"
      />
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-20">
        <Breadcrumbs
          items={[
            { label: t('navigation.home'), path: '/' },
            { label: t('navigation.services') }
          ]}
        />
      </div>
      {/* HERO SECTION */}
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

          {/* Enhanced Equipment Graphics with 3D Effects - Optimized for performance */}
          <div className="absolute top-8 left-4 md:top-16 md:left-16 w-16 h-16 md:w-24 md:h-24 opacity-20 transform rotate-12 will-change-transform hover:scale-110 transition-transform duration-300">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="racketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.7)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
                </linearGradient>
                <filter id="equipmentGlow">
                  <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Enhanced Racket Handle with grip texture */}
              <rect x="44" y="58" width="12" height="37" fill="url(#racketGradient)" rx="6" filter="url(#equipmentGlow)" />
              <g stroke="rgba(220,38,38,0.6)" strokeWidth="1">
                <line x1="46" y1="62" x2="54" y2="62" />
                <line x1="46" y1="68" x2="54" y2="68" />
                <line x1="46" y1="74" x2="54" y2="74" />
                <line x1="46" y1="80" x2="54" y2="80" />
              </g>

              {/* Enhanced Racket Head with shadow */}
              <ellipse cx="50" cy="35" rx="26" ry="31" fill="none" stroke="url(#racketGradient)" strokeWidth="4" filter="url(#equipmentGlow)" />

              {/* Detailed String Pattern */}
              <g stroke="rgba(255,255,255,0.4)" strokeWidth="1" opacity="0.8">
                <line x1="28" y1="35" x2="72" y2="35" />
                <line x1="30" y1="25" x2="70" y2="45" />
                <line x1="32" y1="18" x2="68" y2="52" />
                <line x1="38" y1="12" x2="62" y2="58" />
                <line x1="44" y1="8" x2="56" y2="62" />
                <line x1="50" y1="6" x2="50" y2="64" />
                <line x1="56" y1="8" x2="44" y2="62" />
                <line x1="62" y1="12" x2="38" y2="58" />
              </g>
            </svg>
          </div>

          {/* Flying Shuttlecock with Trail Effect */}
          <div className="absolute top-16 right-4 md:top-32 md:right-24 w-14 h-14 md:w-20 md:h-20 opacity-20 transform -rotate-45">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <radialGradient id="shuttlecockGradient" cx="50%" cy="70%">
                  <stop offset="0%" stopColor="rgba(255,255,255,1)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.6)" />
                </radialGradient>
              </defs>

              {/* Motion Trail */}
              <g opacity="0.3">
                <ellipse cx="35" cy="75" rx="4" ry="6" fill="rgba(220,38,38,0.5)" />
                <ellipse cx="25" cy="80" rx="3" ry="5" fill="rgba(220,38,38,0.3)" />
                <ellipse cx="15" cy="85" rx="2" ry="4" fill="rgba(220,38,38,0.1)" />
              </g>

              {/* Enhanced Shuttlecock Body */}
              <ellipse cx="50" cy="70" rx="9" ry="14" fill="url(#shuttlecockGradient)" filter="url(#equipmentGlow)" />

              {/* Detailed Feathers */}
              <g fill="rgba(255,255,255,0.6)">
                <path d="M42 55 L50 70 L58 55 L50 20 Z" opacity="0.9" />
                <path d="M38 60 L50 70 L46 55 L42 25 Z" opacity="0.7" />
                <path d="M62 60 L50 70 L54 55 L58 25 Z" opacity="0.7" />
                <path d="M46 53 L50 70 L54 53 L50 15 Z" opacity="0.8" />
              </g>

              {/* Feather Details */}
              <g stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" fill="none">
                <path d="M48 25 Q50 30 52 35" />
                <path d="M46 30 Q50 35 54 40" />
                <path d="M44 35 Q50 40 56 45" />
              </g>
            </svg>
          </div>

          {/* Professional Racket with Glow */}
          <div className="absolute bottom-12 left-4 md:bottom-20 md:left-32 w-16 h-16 md:w-22 md:h-22 opacity-15 transform rotate-45">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <ellipse cx="50" cy="30" rx="22" ry="27" fill="none" stroke="url(#racketGradient)" strokeWidth="3" filter="url(#equipmentGlow)" />
              <rect x="46" y="57" width="8" height="28" fill="url(#racketGradient)" rx="4" />

              {/* String pattern */}
              <g stroke="rgba(255,255,255,0.3)" strokeWidth="0.8">
                <line x1="32" y1="30" x2="68" y2="30" />
                <line x1="35" y1="20" x2="65" y2="40" />
                <line x1="40" y1="15" x2="60" y2="45" />
                <line x1="50" y1="10" x2="50" y2="50" />
              </g>
            </svg>
          </div>

          {/* Dynamic Shuttlecock with Particle Effect */}
          <div className="absolute bottom-8 right-4 md:bottom-24 md:right-16 w-12 h-12 md:w-18 md:h-18 opacity-20 transform -rotate-12">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Particle Trail */}
              <g opacity="0.4">
                <circle cx="15" cy="55" r="1.5" fill="rgba(220,38,38,0.8)" />
                <circle cx="20" cy="52" r="1" fill="rgba(220,38,38,0.6)" />
                <circle cx="25" cy="58" r="0.8" fill="rgba(220,38,38,0.4)" />
                <circle cx="30" cy="54" r="1.2" fill="rgba(220,38,38,0.2)" />
              </g>

              {/* Enhanced Shuttlecock */}
              <ellipse cx="50" cy="65" rx="7" ry="11" fill="url(#shuttlecockGradient)" />
              <path d="M44 42 L50 65 L56 42 L50 15 Z" fill="rgba(255,255,255,0.5)" />

              {/* Speed Lines */}
              <g stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" opacity="0.6">
                <line x1="10" y1="50" x2="30" y2="50" />
                <line x1="15" y1="45" x2="32" y2="45" />
                <line x1="12" y1="55" x2="28" y2="55" />
              </g>
            </svg>
          </div>

          {/* Optimized Floating Particles - Reduced for performance */}
          <div className="absolute inset-0 opacity-20 hidden md:block">
            <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-zenith-crimson rounded-full animate-pulse will-change-opacity"></div>
            <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-zenith-crimson rounded-full animate-pulse will-change-opacity" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-zenith-crimson rounded-full animate-pulse will-change-opacity" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              {heroData?.badge?.text && (
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-zenith-crimson/20 bg-zenith-crimson/10 text-zenith-crimson uppercase tracking-widest text-xs font-bold mb-8">
                  <Sparkles className="w-4 h-4" />
                  <span>{heroData.badge.text}</span>
                </div>
              )}

              {heroData?.title && (
                <h1 className="text-6xl md:text-[6.5rem] lg:text-[10rem] font-black font-display text-white mb-8 uppercase tracking-tighter leading-[0.8] drop-shadow-[0_10px_30px_rgba(220,38,38,0.3)]">
                  {heroData.title}
                </h1>
              )}

              {heroData?.subtitle && (
                <p className="text-xl md:text-3xl max-w-4xl mx-auto text-gray-400 font-medium leading-tight mb-16 uppercase tracking-tight">
                  {heroData.subtitle}
                </p>
              )}

              {/* Statistics with Entrance Animations Only */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 max-w-5xl mx-auto">
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="text-5xl md:text-6xl font-black font-display text-zenith-crimson mb-2 tracking-tighter">500+</div>
                  <div className="text-white/80 uppercase tracking-widest text-sm font-bold">{t('services.hero.stats.students')}</div>
                </motion.div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="text-5xl md:text-6xl font-black font-display text-zenith-crimson mb-2 tracking-tighter">15+</div>
                  <div className="text-white/80 uppercase tracking-widest text-sm font-bold">{t('services.hero.stats.experience')}</div>
                </motion.div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="text-5xl md:text-6xl font-black font-display text-zenith-crimson mb-2 tracking-tighter">3</div>
                  <div className="text-white/80 uppercase tracking-widest text-sm font-bold">{t('services.hero.stats.formats')}</div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {homeServicesSection && (
        <ServicesSection cmsData={homeServicesSection} />
      )}

      <motion.section
        className="py-24 bg-zenith-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-zenith-crimson/5 blur-3xl rounded-full" />

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-5xl md:text-7xl font-black font-display text-zenith-black mb-6 uppercase tracking-tighter">{t('services.gyms.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 font-medium">
              {t('services.gyms.subtitle')}
            </p>

            <motion.a
              href="/gyms"
              className="inline-flex items-center gap-3 px-10 py-5 bg-zenith-black text-white font-black rounded-full hover:bg-zenith-crimson transition-all duration-300 shadow-xl hover:shadow-[0_10px_40px_-10px_rgba(220,38,38,0.5)] uppercase tracking-widest text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl">🏸</span>
              {t('services.gyms.viewAll')}
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ SECTION */}
      <motion.section
        className="py-32 bg-zenith-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-6xl md:text-8xl font-black font-display text-zenith-black mb-6 uppercase tracking-tighter leading-none">{t('services.faq.title')}</h2>
            <div className="w-24 h-2 bg-zenith-crimson mx-auto mb-8 rounded-full" />
            <p className="text-xl text-gray-500 font-bold uppercase tracking-widest">{t('services.faq.subtitle')}</p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((f, idx) => (
              <motion.div
                key={idx}
                className={`rounded-[2rem] overflow-hidden transition-all duration-500 border-2 ${openFaq === idx ? 'bg-white shadow-2xl border-zenith-crimson/20 -translate-y-1' : 'bg-white border-gray-100 hover:border-zenith-crimson/20'}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-10 py-8 text-left flex justify-between items-center transition-colors"
                >
                  <span className={`font-black text-xl uppercase tracking-tight transition-colors ${openFaq === idx ? 'text-zenith-crimson' : 'text-zenith-black'}`}>{f.q}</span>
                  <div className={`flex-shrink-0 ml-4 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${openFaq === idx ? 'bg-zenith-crimson text-white rotate-180 shadow-lg shadow-zenith-crimson/20' : 'bg-gray-50 text-zenith-black'}`}>
                    <ChevronDown className={`w-6 h-6`} />
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-10 pb-10 pt-2">
                    <div className="h-px w-20 bg-zenith-crimson/20 mb-8" />
                    <p className="text-lg text-gray-600 leading-relaxed font-medium">{f.a}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA SECTION */}
      <motion.section
        className="py-24 bg-zenith-black text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Dynamic background elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-zenith-crimson/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-zenith-crimson/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h2
            className="text-5xl md:text-7xl font-black font-display mb-8 uppercase tracking-tighter"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {t('services.cta.title')}
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl text-gray-400 font-medium mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('services.cta.subtitle')}
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-5 bg-zenith-crimson text-white font-black rounded-full hover:bg-red-700 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)] hover:shadow-[0_0_60px_-15px_rgba(220,38,38,0.7)] uppercase tracking-widest text-sm hover:-translate-y-1"
            >
              {t('services.cta.contact')}
            </a>
            <a
              href="tel:+37322000000"
              className="inline-flex items-center justify-center px-10 py-5 bg-transparent border-2 border-white/20 text-white font-black rounded-full hover:bg-white/10 hover:border-white transition-all duration-300 uppercase tracking-widest text-sm group"
            >
              <Phone className="w-5 h-5 mr-3 group-hover:animate-bounce" />
              {t('services.cta.call')}
            </a>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Services;
