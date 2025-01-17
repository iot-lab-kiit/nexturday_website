import { useEffect, useState } from "react";
import { useAuthStore } from "../../zustand/useAuthStore";
import { EventCard } from "../Home/EventCard";

const FavouriteEvents = () => {
  const [favouriteEvents, setFavouriteEvents] = useState([]);
  const token = useAuthStore((state) => state.authData.token);

  useEffect(() => {
    const fetchFavouriteEvents = async () => {
      try {
        const response = await fetch(
          "https://nexterday.iotkiit.in/api/events/participants/favorite",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        
        setFavouriteEvents(data.data.data);
      } catch (error) {
        console.error("Error fetching favourite events:", error);
      }
    };

    if (token) {
      fetchFavouriteEvents();
    }
  }, [token]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        Favourite Events
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favouriteEvents?.length > 0 ? (
          favouriteEvents?.map((event, index) => (
            <EventCard key={index} {...event} />
          ))
        ) : (
          <p className="text-gray-400 col-span-full text-center">
            No favourite events found.
          </p>
        )}
      </div>
    </section>
  );
};

export default FavouriteEvents;
