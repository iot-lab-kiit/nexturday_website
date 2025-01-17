import { useEffect, useState } from "react";
import { useAuthStore } from "../../zustand/UseAuthStore";
import { EventCard } from "../Home/EventCard";
import { Event } from "../../types/types";

const JoinedEvents = () => {
  const [joinedEvents, setJoinedEvents] = useState([]);
  const token = useAuthStore((state) => state.authData.token);

  useEffect(() => {
    const fetchJoinedEvents = async () => {
      try {
        const response = await fetch(
          "https://nexterday.iotkiit.in/api/events/participants",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("response",response)
        const data = await response.json();
        setJoinedEvents(data.data.data);
        console.log("event: ", data.events);
      } catch (error) {
        console.error("Error fetching joined events:", error);
      }
    };

    if (token) {
      fetchJoinedEvents();
    }
  }, [token]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        Joined Events
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {joinedEvents?.length > 0 ? (
          joinedEvents?.map((event, index) => (
            <EventCard key={index} {...event as Event} />
          ))
        ) : (
          <p className="text-gray-400 col-span-full text-center">
            No joined events found.
          </p>
        )}
      </div>
    </section>
  );
};

export default JoinedEvents;
