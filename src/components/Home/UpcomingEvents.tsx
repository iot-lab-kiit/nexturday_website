import { useEventStore } from "../../zustand/useEventStore";

const UpcomingEvents = () => {
    const upcomongEvents = useEventStore((state) => state.eventDetails)?.upcoming

    const EventCard = ({ event }: any) => {
        return (
            <div className="flex flex-col bg-zinc-900/50 rounded-2xl overflow-hidden border border-zinc-800/50">
                <img
                    src={event.img}
                    alt={event.name}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                />
                <div className="flex p-4 gap-4">
                    <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 backdrop-blur-sm rounded-lg p-3">
                        <div className="text-center">
                            <div className="text-zinc-400 text-sm font-medium">Sun</div>
                            <div className="text-white font-bold text-2xl">15</div>
                            <div className="text-zinc-400 text-sm font-medium">Dec</div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-white">
                            {event.name}
                        </h2>
                        <p className="text-zinc-300">
                            {event.venue}
                        </p>
                        <p className="text-zinc-400 text-sm">
                            {event.by}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section className="max-w-7xl mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
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
