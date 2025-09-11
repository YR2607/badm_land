import { FC, useEffect, useState } from 'react';
import Hero from '../components/Hero';
import BusinessNewsSection from '../components/BusinessNewsSection';
import ServicesSection from '../components/ServicesSection';
import AchievementsSection from '../components/AchievementsSection';
import CmsEmbedsSection from '../components/CmsEmbedsSection';
import { fetchHomePage, CmsHomePage } from '../lib/cms';

const Home: FC = () => {
  const [cmsData, setCmsData] = useState<CmsHomePage | null>(null);

  useEffect(() => {
    const loadCmsData = async () => {
      try {
        const data = await fetchHomePage();
        if (data) {
          setCmsData(data);
        }
      } catch (error) {
        console.error('Failed to load CMS data:', error);
      }
    };

    loadCmsData();
  }, []);

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
