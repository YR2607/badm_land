import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Hero from '../components/Hero';
import BusinessNewsSection from '../components/BusinessNewsSection';
import ServicesSection from '../components/ServicesSection';
import AchievementsSection from '../components/AchievementsSection';
import CmsEmbedsSection from '../components/CmsEmbedsSection';
import { fetchHomePage, CmsHomePage } from '../lib/cms';

const Home: FC = () => {
  const { t, i18n } = useTranslation();
  const [cmsData, setCmsData] = useState<CmsHomePage | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      <Hero cmsData={cmsData?.hero} />
      <AchievementsSection cmsData={cmsData?.achievementsSection} />
      <ServicesSection cmsData={cmsData?.servicesSection} />
      <BusinessNewsSection />
      <CmsEmbedsSection />
    </div>
  );
};

export default Home;
