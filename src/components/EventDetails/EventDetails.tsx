import React, { useEffect, useState } from 'react';
import HeroSection from './HeroSection';
import { AboutSection } from './AboutSection';
import { EventInfo } from './EventInfo';
import { VenueSection } from './VenueSection';
import { Guidelines } from './Guidelines';
import { RegisterButton } from './RegisterButton';
import LoadingSpinner from '../global/LoadingSpinner';
import { Navbar } from '../global/Navbar';

const InnovancePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      {isLoading ? (
        <div className="max-w-7xl mx-auto px-4 pt-20 flex justify-center items-center min-h-[80vh]">
          <LoadingSpinner />
        </div>
      ) : (
        <main className="max-w-7xl mx-auto px-4 pt-20">
          <HeroSection />
          <AboutSection />
          <EventInfo />
          <VenueSection />
          <Guidelines />
          <RegisterButton />
        </main>
      )}
    </div>
  );
};

export default InnovancePage;
