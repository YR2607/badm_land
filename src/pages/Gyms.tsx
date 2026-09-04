import { useState, useEffect, type FC } from 'react';
import LocalizedLink from '../components/LocalizedLink';
import { ArrowRight } from 'lucide-react';
import { fetchGyms, type CmsGym, fetchGymsHero, type CmsHero, fetchGymsPageLabels, type CmsGymsPageLabels } from '../lib/cms';
import { addCmsDevMarkers } from '../utils/cmsDevMarker';
import { useTranslation } from 'react-i18next';
import { GymCardSkeleton } from '../components/Skeletons';
import InnerHero from '../components/InnerHero';
import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';

const Gyms: FC = () => {
  const { t, i18n } = useTranslation();
  const [cmsGyms, setCmsGyms] = useState<CmsGym[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      <SEO
        title={`Altius — ${t('navigation.gyms')}`}
        description={t('gyms.hero.subtitle', 'Современные залы с профессиональным оборудованием')}
        image="https://altius.md/og-gyms.jpg"
      />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": `Altius — ${t('navigation.gyms')}`,
        "url": "https://altius.md/gyms",
        "description": t('gyms.hero.subtitle', 'Современные залы с профессиональным оборудованием'),
        "isPartOf": {
          "@type": "WebSite",
          "name": "Altius Badminton Club",
          "url": "https://altius.md/"
        }
      }} />
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

          {/* Gym Selection Cards */}
          <>
              {/* Gym Selection Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {filteredGyms.map((gym) => (
                  <div
                    key={gym.id}
                    className="group relative bg-white rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-10px_rgba(220,38,38,0.15)] border-2 border-transparent hover:border-zenith-crimson/20 overflow-hidden transition-all duration-500 hover:-translate-y-2"
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
                      <LocalizedLink
                        to={`/gyms/${gym.slug}`}
                        className="block w-full bg-zenith-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-zenith-crimson transition-all duration-300 text-center shadow-lg group-hover:shadow-zenith-crimson/20"
                      >
                        <span className="inline-flex items-center justify-center gap-3">
                          {t('gyms.moreDetails')}
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </LocalizedLink>
                    </div>
                  </div>
                ))}
              </div>
              {filteredGyms.length === 0 && (
                <div
                  className="text-center py-12"
                >
                  <div className="text-6xl mb-4">🏸</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('gyms.noGymsFound')}</h3>
                  <p className="text-gray-600">{t('gyms.tryChangeFilter')}</p>
                </div>
              )}
            </>
        </div>
      </section >
    </div >
  );
};

export default Gyms;