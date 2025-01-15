import React, { useEffect, useState } from 'react';
import HeroSection from './HeroSection';
import { EventInfo } from './EventInfo';
import { VenueSection } from './VenueSection';
import { Guidelines } from './Guidelines';
import LoadingSpinner from '../global/LoadingSpinner';
import { Navbar } from '../global/Navbar';
import { useParams } from 'react-router';
import axios from 'axios';
import { useAuthStore } from '../../zustand/useAuthStore';
import toast from 'react-hot-toast';
import { useEventStore } from '../../zustand/useEventStore';
import AboutSection from './AboutSection';
import TabSwitcher from './TabSwitcher';
import ErrorDisplay from '../global/ErrorDisplay';

const EventPage: React.FC = () => {
  const { eventID } = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const authData = useAuthStore((state) => state.authData);
  const setCurrentEvent = useEventStore((state) => state.setCurrentEvent);

  useEffect(() => {
    if (!eventID) {
      setError(true);
      return;
    }

    const fetchAllEvents = async () => {
      setLoading(true);
      setError(false);

      try {
        const eventURL = `https://nexterday.iotkiit.in/api/events/${eventID}`;
        const eventDetailsApiResponse = await axios.get(eventURL, {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${authData.token}`
          }
        });

        if (eventDetailsApiResponse.status === 200) {
          setCurrentEvent(eventDetailsApiResponse.data.data);
          toast.success('Event fetched successfully');
        }
      } catch (err) {
        console.error(err);
        setError(true);
        toast.error('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      {loading ? (
        <div className="max-w-7xl mx-auto px-4 pt-20 flex justify-center items-center min-h-[80vh]">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="max-w-7xl mx-auto px-4 pt-20">
          <ErrorDisplay
            message="Failed to load event details. Please try again later."
            onRetry={() => window.location.reload()}
          />
        </div>
      ) : (
        <main className="max-w-7xl mx-auto px-4 pt-20">
          <HeroSection />
          <TabSwitcher />
          <AboutSection />
          <EventInfo />
          <VenueSection />
          <Guidelines />
        </main>
      )}
    </div>
  );
};

export default EventPage;
