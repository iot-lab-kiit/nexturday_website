import { useEventStore } from "../../zustand/useEventStore";
import { EventCard } from "./EventCard";

const PopularEvents = () => {
    const popularEvents = useEventStore((state) => state.eventDetails)?.popular

    return (
        <section className="max-w-7xl mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Popular Events
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {popularEvents && popularEvents.length > 0 ? (
                    popularEvents.map((event, index) => (
                        <EventCard key={index} {...event} />
                    ))
                ) : (
                    <p className="text-gray-400 col-span-full text-center">No popular events found.</p>
                )}
            </div>
        </section>
    );
};

export default PopularEvents;