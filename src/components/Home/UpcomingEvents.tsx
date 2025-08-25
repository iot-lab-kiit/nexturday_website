import { useEventStore } from "../../zustand/useEventStore";
import { EventCard } from "./EventCard";
import EventCardSkeleton from "./EventCardSkeleton";
const UpcomingEvents = () => {
  const upcomingEvents = useEventStore((state) => state.eventDetails)?.upcoming;
  const isLoading = !upcomingEvents;

  return (
    <section id="upcomingevents" className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
          Upcoming Events
        </h1>
        <p className="text-zinc-400 text-sm max-w-2xl mx-auto">
          Don't miss out on these exciting events happening soon
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))
        ) : upcomingEvents && upcomingEvents.length > 0 ? (
          upcomingEvents.map((event, index) => (
            <div
              key={index}
              className="transform transition-all duration-300 hover:scale-[1.02]"
            >
              <EventCard {...event} />
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-zinc-400 text-xl mb-2">
              No upcoming events found
            </p>
            <p className="text-zinc-500 text-sm">
              Check back later for new events!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingEvents;
