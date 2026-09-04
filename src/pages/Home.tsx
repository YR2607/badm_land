import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Hero from '../components/Hero';
import BusinessNewsSection from '../components/BusinessNewsSection';
import ServicesSection from '../components/ServicesSection';
import AchievementsSection from '../components/AchievementsSection';
import SocialMediaHubLive from '../components/SocialMediaHubLive';
import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';
import { fetchHomePage, CmsHomePage } from '../lib/cms';

const Home: FC = () => {
  const { t, i18n } = useTranslation();
  const [cmsData, setCmsData] = useState<CmsHomePage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCmsData = async () => {
      try {
        const data = await fetchHomePage(i18n.language as 'ru' | 'en' | 'ro');
        if (data) {
          setCmsData(data);
        }
      } catch (error) {
        // Set error state for user feedback
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    loadCmsData();
  }, [i18n.language]);

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
    <div>
      <SEO 
        title={cmsData?.seo?.metaTitle || "Altius - Бадминтонный клуб в Кишиневе | Профессиональные тренировки"}
        description={cmsData?.seo?.metaDescription || "Профессиональный бадминтонный клуб Altius в Кишиневе. Тренировки для детей и взрослых, индивидуальные и групповые занятия, участие в турнирах. 15+ лет опыта, 500+ учеников."}
        keywords={cmsData?.seo?.keywords || "бадминтон Кишинев, badminton Chisinau, спортивный клуб, тренировки бадминтон, детский бадминтон, взрослый бадминтон, Altius"}
        image="https://altius.md/og-home.jpg"
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": cmsData?.seo?.metaTitle || "Altius Badminton Club",
          "description": cmsData?.seo?.metaDescription || "Профессиональный бадминтонный клуб Altius в Кишиневе. Тренировки для детей и взрослых, индивидуальные и групповые занятия, участие в турнирах. 15+ лет опыта, 500+ учеников.",
          "url": "https://altius.md/",
          "logo": "https://altius.md/altLGOO.jpg"
        }}
      />
      {loading ? (
        <div aria-busy="true" aria-label={t('common.loading', 'Загрузка...')}>
          {/* Hero skeleton */}
          <section className="relative h-screen flex items-center justify-center overflow-hidden bg-zenith-black">
            <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 text-center w-full">
              <div className="animate-pulse h-6 w-48 bg-white/10 rounded-full mx-auto mb-12" />
              <div className="animate-pulse h-28 md:h-40 w-3/4 max-w-4xl bg-white/10 rounded-2xl mx-auto mb-8" />
              <div className="animate-pulse h-16 w-64 bg-zenith-crimson/20 rounded-2xl mx-auto mb-12 -skew-x-12" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 max-w-5xl mx-auto">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse h-16 rounded-2xl bg-white/10" />
                ))}
              </div>
            </div>
          </section>

          {/* Achievements skeleton */}
          <section className="py-32 bg-zenith-white overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-24">
                <div className="animate-pulse h-16 w-72 bg-gray-100 rounded-2xl" />
                <div className="animate-pulse w-32 h-4 bg-zenith-crimson/20 mt-8" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 min-h-[600px]">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse h-72 rounded-[2.5rem] bg-gray-100" />
                ))}
              </div>
            </div>
          </section>

          {/* Services skeleton */}
          <section className="py-32 bg-zenith-white relative overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="mb-32 text-center md:text-right">
                <div className="animate-pulse h-16 w-64 bg-gray-100 rounded-2xl mx-auto md:ml-auto md:mr-0" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="animate-pulse h-96 rounded-[2.5rem] bg-gray-100" />
                ))}
              </div>
            </div>
          </section>
        </div>
      ) : (
        <>
          <Hero cmsData={cmsData?.hero} />
          <AchievementsSection cmsData={cmsData?.achievementsSection} />
          <ServicesSection cmsData={cmsData?.servicesSection} />
          <SocialMediaHubLive />
          <BusinessNewsSection />
        </>
      )}
    </div>
  );
};

export default Home;
