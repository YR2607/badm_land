import { FC } from 'react';
import Hero from '../components/Hero';
import BusinessNewsSection from '../components/BusinessNewsSection';
import ServicesSection from '../components/ServicesSection';
import AchievementsSection from '../components/AchievementsSection';
import CmsEmbedsSection from '../components/CmsEmbedsSection';

const Home: FC = () => {
  return (
    <div>
      <Hero />
      <AchievementsSection />
      <ServicesSection />
      <BusinessNewsSection />
      <CmsEmbedsSection />
    </div>
  );
};

export default Home;
