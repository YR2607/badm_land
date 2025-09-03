import React from 'react';
import Hero from '../components/Hero';
import BusinessNewsSection from '../components/BusinessNewsSection';
import ServicesSection from '../components/ServicesSection';
import AchievementsSection from '../components/AchievementsSection';

const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <AchievementsSection />
      <ServicesSection />
      <BusinessNewsSection />
    </div>
  );
};

export default Home;
