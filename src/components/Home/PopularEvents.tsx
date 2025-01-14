import { Event } from "../../types/types";
import { useEventStore } from "../../zustand/useEventStore";

const PopularEvents = () => {
    const popularEvents = useEventStore((state) => state.eventDetails)?.popular

    const EventCard = (event: Event) => {
        return (
            <div className="group relative rounded-2xl overflow-hidden bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 hover:bg-zinc-800/50 transition-all duration-300">
                <div className="w-full aspect-square p-4">
                    <img
                        src={event.images[0].url}
                        alt={event.name}
                        className="w-full h-full object-contain rounded-xl transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                <div className="px-4 pb-4 flex gap-6">
                    <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 backdrop-blur-sm rounded-lg p-3">
                        <div className="text-center">
                            <div className="text-zinc-400 text-sm font-medium">Sun</div>
                            <div className="text-white font-bold text-2xl">15</div>
                            <div className="text-zinc-400 text-sm font-medium">Dec</div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center space-y-2">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            {event.name}
                        </h2>
                        <div className="space-y-1.5">
                            <p className="text-gray-300 text-sm flex items-center gap-2">
                                {event.details[0].venue || "KIIT Venue"}
                            </p>
                            <p className="text-gray-400 text-sm flex items-center gap-2">
                                {event.society.name }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

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