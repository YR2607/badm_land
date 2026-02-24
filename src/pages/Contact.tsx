import { type FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { fetchPageBySlug, isCmsEnabled, CmsPage, fetchContactHero, type CmsHero, fetchContactInfo, type CmsContactInfo, fetchContactGymsCards, type CmsContactGymCard } from '../lib/cms';
import { addCmsDevMarkers } from '../utils/cmsDevMarker';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';
import Breadcrumbs from '../components/Breadcrumbs';

const Contact: FC = () => {
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState<CmsPage | null>(null);
  const [heroData, setHeroData] = useState<CmsHero | null>(null);
  const [contactCms, setContactCms] = useState<CmsContactInfo | null>(null);
  const [contactGyms, setContactGyms] = useState<CmsContactGymCard[]>([]);
  useEffect(() => {
    (async () => {
      if (!isCmsEnabled) return;
      const [data, hero, contactInfo, gymsCards] = await Promise.all([
        fetchPageBySlug('contact'),
        fetchContactHero(i18n.language as string),
        fetchContactInfo(),
        fetchContactGymsCards(i18n.language as string)
      ]);
      if (data) setPage(addCmsDevMarkers(data));
      if (hero) setHeroData(addCmsDevMarkers(hero));
      if (contactInfo) setContactCms(addCmsDevMarkers(contactInfo));
      if (gymsCards?.length) setContactGyms(addCmsDevMarkers(gymsCards));
    })();
  }, [i18n.language]);


  const contactInfo = (contactCms?.contacts || []).map((c) => ({
    icon: c.type === 'address' ? <MapPin className="w-6 h-6" aria-hidden="true" /> : c.type === 'phone' ? <Phone className="w-6 h-6" aria-hidden="true" /> : c.type === 'email' ? <Mail className="w-6 h-6" aria-hidden="true" /> : <Clock className="w-6 h-6" aria-hidden="true" />,
    title: c.label,
    content: c.value,
    color: c.type === 'address' ? 'from-primary-blue to-blue-600' : c.type === 'phone' ? 'from-primary-orange to-orange-600' : c.type === 'email' ? 'from-primary-yellow to-yellow-600' : 'from-gray-600 to-gray-800'
  })) as Array<{ icon: JSX.Element; title: string; content: string; color: string }>;

  // No i18n fallback: page relies solely on CMS

  return (
    <div className="min-h-screen bg-zenith-white">
      <SEO
        title={`Altius — ${t('navigation.contacts')}`}
        description={t('contact.heroDescription')}
        image="https://altius.md/og-contact.jpg"
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SportsActivityLocation",
          "name": "Altius Badminton Club",
          "url": "https://altius.md/contact",
          "telephone": (contactCms?.contacts || []).find(c => c.type === 'phone')?.value || "+373 60 123 456",
          "email": (contactCms?.contacts || []).find(c => c.type === 'email')?.value || "info@altius.md",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": (contactCms?.contacts || []).find(c => c.type === 'address')?.value || "Chișinău, str. Example 123",
            "addressLocality": "Chișinău",
            "addressCountry": "MD"
          }
        }}
      />
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-20 text-white">
        <Breadcrumbs
          items={[
            { label: t('navigation.home'), path: '/' },
            { label: t('navigation.contacts') }
          ]}
        />
      </div>
      <section className="relative overflow-hidden py-24 bg-zenith-black">
        {/* Enhanced Badminton Court Background */}
        <div className="absolute inset-0">
          {/* Dynamic Court with Lighting Effects */}
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 1200 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
              <defs>
                <radialGradient id="courtGradient" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="rgba(220,38,38,0.15)" />
                  <stop offset="50%" stopColor="rgba(220,38,38,0.05)" />
                  <stop offset="100%" stopColor="rgba(220,38,38,0.01)" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <rect width="1200" height="600" fill="url(#courtGradient)" />
              <g stroke="rgba(255,255,255,0.4)" strokeWidth="3" fill="none" filter="url(#glow)">
                <rect x="200" y="100" width="800" height="400" strokeWidth="4" />
                <line x1="600" y1="100" x2="600" y2="500" strokeWidth="3" />
                <line x1="200" y1="240" x2="1000" y2="240" />
                <line x1="200" y1="360" x2="1000" y2="360" />
              </g>
            </svg>
          </div>

          {/* Communication & Contact Elements */}
          <div className="absolute top-12 left-8 md:top-16 md:left-16 w-16 h-16 md:w-20 md:h-20 opacity-20">
            <svg viewBox="0 0 80 80" className="w-full h-full">
              <rect x="25" y="15" width="30" height="50" fill="rgba(255,255,255,0.8)" rx="8" />
              <rect x="28" y="20" width="24" height="35" fill="rgba(255,255,255,0.2)" rx="3" />
            </svg>
          </div>

          {/* Email/Letter Icon */}
          <div className="absolute bottom-24 left-12 md:bottom-28 md:left-20 w-14 h-14 md:w-18 md:h-18 opacity-15 transform -rotate-12">
            <svg viewBox="0 0 70 70" className="w-full h-full">
              <rect x="10" y="20" width="50" height="35" fill="rgba(255,255,255,0.8)" rx="3" />
              <path d="M10 20 L35 40 L60 20" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <div className="relative z-10">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              {heroData?.badge?.text && (
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-zenith-crimson/20 bg-zenith-crimson/10 text-zenith-crimson uppercase tracking-widest text-xs font-bold mb-8">
                  <Mail className="w-4 h-4" />
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

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 bg-white/5 backdrop-blur-md rounded-[3rem] p-10 border border-white/10 max-w-5xl mx-auto">
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="text-5xl md:text-7xl font-black font-display text-zenith-crimson mb-2 tracking-tighter">24/7</div>
                  <div className="text-white/80 uppercase tracking-widest text-sm font-bold">{t('contact.hero.stats.support')}</div>
                </motion.div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="text-5xl md:text-7xl font-black font-display text-zenith-crimson mb-2 tracking-tighter">3</div>
                  <div className="text-white/80 uppercase tracking-widest text-sm font-bold">{t('contact.hero.stats.locations')}</div>
                </motion.div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="text-5xl md:text-7xl font-black font-display text-zenith-crimson mb-2 tracking-tighter">100%</div>
                  <div className="text-white/80 uppercase tracking-widest text-sm font-bold">{t('contact.hero.stats.response')}</div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-24 bg-zenith-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list" aria-label={t('contact.info.title', 'Полезная информация')}>
            {contactInfo.length === 0 && (
              <div className="col-span-full text-center text-gray-400">{t('contact.emptySection')}</div>
            )}
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                className="group relative bg-white rounded-[2.5rem] p-10 text-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border-2 border-transparent hover:border-zenith-crimson/20 transition-all duration-500 overflow-hidden h-full"
                role="listitem"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -12 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-zenith-crimson/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-zenith-crimson/10 transition-colors pointer-events-none" />

                <div className={`w-20 h-20 bg-zenith-black rounded-3xl flex items-center justify-center text-white mx-auto mb-8 group-hover:bg-zenith-crimson transition-all duration-500 group-hover:scale-110 shadow-lg group-hover:rotate-6`}>
                  {info.icon}
                </div>
                <h3 className="text-2xl font-black text-zenith-black mb-4 uppercase tracking-tight">{info.title}</h3>
                <p className="text-lg text-gray-500 font-bold leading-relaxed whitespace-pre-line group-hover:text-zenith-black transition-colors">{info.content}</p>

                <div className="mt-8 w-12 h-1 bg-gray-100 group-hover:bg-zenith-crimson/50 mx-auto rounded-full transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gym Locations from CMS */}
      <section className="py-24 bg-zenith-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {contactGyms.map((g, idx) => (
              <motion.div key={g.id || idx} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: idx * 0.1 }}>
                <div className="h-full bg-white rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden flex flex-col group hover:border-zenith-crimson/20 transition-all duration-500">
                  <div className="p-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-16 h-16 bg-zenith-black rounded-[1.25rem] flex items-center justify-center group-hover:bg-zenith-crimson transition-colors duration-500 shadow-lg">
                        <MapPin className="w-8 h-8 text-white" />
                      </div>
                      {g.badge && (
                        <span className="bg-zenith-black text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                          {g.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-3xl font-black text-zenith-black mb-2 uppercase tracking-tight group-hover:text-zenith-crimson transition-colors">{g.name}</h3>
                    {(g.hasChildren || g.hasAdults) && (
                      <div className="flex flex-wrap gap-2 mb-8">
                        {g.hasChildren && <span className="text-[10px] font-black text-zenith-crimson uppercase tracking-widest">{t('gyms.tags.children')}</span>}
                        {g.hasAdults && <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('gyms.tags.adults')}</span>}
                      </div>
                    )}

                    <div className="space-y-6 mb-10 flex-grow">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 w-2 h-2 rounded-full bg-zenith-crimson shrink-0" />
                        <div>
                          {g.address && <p className="font-black text-zenith-black uppercase tracking-tight leading-tight mb-1">{g.address}</p>}
                          {g.description && <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{g.description}</p>}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-50 space-y-3">
                        {g.phone && (
                          <a href={`tel:${g.phone}`} className="flex items-center gap-3 text-sm font-black text-zenith-black/60 hover:text-zenith-crimson transition-colors uppercase tracking-widest">
                            <Phone className="w-4 h-4" />
                            {g.phone}
                          </a>
                        )}
                        {g.email && (
                          <a href={`mailto:${g.email}`} className="flex items-center gap-3 text-sm font-black text-zenith-black/60 hover:text-zenith-crimson transition-colors uppercase tracking-widest">
                            <Mail className="w-4 h-4" />
                            {g.email}
                          </a>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => window.open(g.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(g.address || g.name)}`, '_blank', 'noopener')}
                      className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-zenith-black text-white rounded-2xl hover:bg-zenith-crimson transition-all duration-500 font-black uppercase tracking-widest text-xs shadow-xl hover:shadow-zenith-crimson/20"
                    >
                      <MapPin className="w-4 h-4" />
                      {t('contact.openMap')}
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
