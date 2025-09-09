import { FC } from 'react';
import Hero from '../components/Hero';
import BusinessNewsSection from '../components/BusinessNewsSection';
import ServicesSection from '../components/ServicesSection';
import AchievementsSection from '../components/AchievementsSection';
import ClubNewsSection from '../components/ClubNewsSection';
import EventsSection from '../components/EventsSection';

const Home: FC = () => {
  return (
    <div>
      <Hero />
      <AchievementsSection />
      <ServicesSection />
      <BusinessNewsSection />
      <ClubNewsSection />
      <EventsSection />
    </div>
  );
};

export default Home;
