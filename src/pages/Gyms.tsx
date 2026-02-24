import { useState, useEffect, type FC } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchGyms, type CmsGym, fetchGymsHero, type CmsHero, fetchGymsPageLabels, type CmsGymsPageLabels } from '../lib/cms';
import { addCmsDevMarkers } from '../utils/cmsDevMarker';
import { useTranslation } from 'react-i18next';
import { GymCardSkeleton } from '../components/Skeletons';
import InnerHero from '../components/InnerHero';
import SEO from '../components/SEO';
import { Sparkles } from 'lucide-react';

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
      <InnerHero
        title={heroData?.title || t('navigation.gyms')}
        subtitle={heroData?.subtitle || t('gyms.hero.subtitle')}
      >
        <div className="hidden md:flex flex-col items-end gap-1">
          <div className="text-4xl font-black font-display text-zenith-crimson uppercase tracking-tighter">
            {cmsGyms.length}
          </div>
          <div className="text-[10px] text-white/50 uppercase tracking-widest font-black">
            {t('gyms.hero.stats.locations', 'Локаций')}
          </div>
        </div>
      </InnerHero>

      <section className="py-20 bg-zenith-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-black font-display text-zenith-black uppercase tracking-tight">
                {t('gyms.list.title')}
              </h2>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                {t('gyms.list.subtitle')}
              </p>
            </div>

            <div className="inline-flex p-2 bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-x-auto max-w-full">
              {[
                { id: 'all', label: t('gyms.filters.all') },
                { id: 'children', label: t('gyms.filters.children') },
                { id: 'adults', label: t('gyms.filters.adults') }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setFilter(btn.id as any)}
                  className={`whitespace-nowrap px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${filter === btn.id ? 'bg-zenith-black text-white shadow-lg' : 'text-gray-400 hover:text-zenith-crimson'}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
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
      </section >
    </div >
  );
};

export default Gyms;