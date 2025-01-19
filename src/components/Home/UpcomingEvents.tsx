import { useEventStore } from "../../zustand/useEventStore";
import { EventCard } from "./EventCard";

const UpcomingEvents = () => {
    const upcomongEvents = useEventStore((state) => state.eventDetails)?.upcoming
    return (
        <section id="upcomingevents" className="max-w-7xl mx-auto px-4 py-16">
            <h1 className="text-xl font-bold mb-8 bg-gradient-to-r text-center text-white">
                Upcoming Events
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {upcomongEvents && upcomongEvents.length > 0 ? (
                    upcomongEvents.map((event, index) => (
                        <EventCard key={index} {...event} />
                    ))
                ) : (
                    <p className="text-gray-400 col-span-full text-center">No upcoming events found.</p>
                )}
            </div>
        </section>
    );
};

export default UpcomingEvents;
