import React from 'react';
import HeroSection from './HeroSection';
import { AboutSection } from './AboutSection';
import { EventInfo } from './EventInfo';
import { VenueSection } from './VenueSection';
import { Guidelines } from './Guidelines';
import { RegisterButton } from './RegisterButton';
import { Header } from './Header';

const InnovancePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 pt-20">
        <HeroSection />
        <AboutSection />
        <EventInfo />
        <VenueSection />
        <Guidelines />
        <RegisterButton />
      </main>
    </div>
  );
};

export default InnovancePage;