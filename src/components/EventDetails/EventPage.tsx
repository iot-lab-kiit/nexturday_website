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
import { signOutUser } from '../../firebaseConfig';

const EventPage: React.FC = () => {
  const { eventID } = useParams();
  const setSubEventIndex = useEventStore((state) => state.setSubEventIndex);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const authData = useAuthStore((state) => state.authData);
  const setCurrentEvent = useEventStore((state) => state.setCurrentEvent);
  const setHideFooter = useEventStore((state) => state.setHideFooter);

  useEffect(() => {
    setSubEventIndex(0);
    if (!eventID) {
      setError(true);
      return;
    }

    const fetchAllEvents = async () => {
      setLoading(true);
      setError(false);
      setHideFooter(true);

      try {
        const eventDetailsApiResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/events/${eventID}`, {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${authData.token}`
          }
        });

        if (eventDetailsApiResponse.status === 200) {
          setCurrentEvent(eventDetailsApiResponse.data.data);
          console.log(eventDetailsApiResponse.data.data);
          toast.success('Event fetched successfully');
        }
      } catch (err: any) {
        console.error(err);
        if (err.response?.status === 401) {
          signOutUser();
          return;
        }
        setError(true);
        toast.error('Failed to fetch events');
      } finally {
        setLoading(false);
        setHideFooter(false);
      }
    };

    fetchAllEvents();
  }, []);

  return (
    <div className="bg-black text-white">
      <Navbar />
      {loading ? (
        <div className="max-w-7xl mx-auto px-4 pt-20 flex justify-center items-center h-[calc(100vh-4rem)]">
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
