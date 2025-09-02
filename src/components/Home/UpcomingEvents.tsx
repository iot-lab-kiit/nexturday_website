import { useState, useMemo } from "react";
import { useEventStore } from "../../zustand/useEventStore";
import { EventCard } from "./EventCard";
import EventCardSkeleton from "./EventCardSkeleton";
import {
  Grid3X3,
  Monitor,
  Palette,
  Trophy,
  Music,
  Users,
  Wrench,
  MoreHorizontal,
} from "lucide-react";

const UpcomingEvents = () => {
  const upcomingEvents = useEventStore((state) => state.eventDetails)?.upcoming;
  const isLoading = !upcomingEvents;
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Define available categories with icons
  const categories = [
    { value: "all", label: "All Events", icon: Grid3X3 },
    { value: "tech", label: "Tech", icon: Monitor },
    { value: "fashion", label: "Fashion", icon: Palette },
    { value: "competition", label: "Competition", icon: Trophy },
    { value: "cultural", label: "Cultural", icon: Music },
    { value: "seminar", label: "Seminar", icon: Users },
    { value: "workshop", label: "Workshop", icon: Wrench },
    { value: "others", label: "Others", icon: MoreHorizontal },
  ];

  // Filter events based on selected category
  const filteredEvents = useMemo(() => {
    if (!upcomingEvents || selectedCategory === "all") {
      return upcomingEvents;
    }

    return upcomingEvents.filter((event) => {
      // Check if any of the event's tags include the selected category
      return (
        event.tags &&
        event.tags.some(
          (tag: string) => tag.toLowerCase() === selectedCategory.toLowerCase()
        )
      );
    });
  }, [upcomingEvents, selectedCategory]);

  return (
    <section
      id="upcomingevents"
      className="max-w-7xl mx-auto px-4 py-8 md:py-12"
    >
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
          Upcoming Events
          {filteredEvents && (
            <span className="text-xs md:text-sm text-zinc-500 ml-2">
              ({filteredEvents.length} event
              {filteredEvents.length !== 1 ? "s" : ""})
            </span>
          )}
        </h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto mb-6 md:mb-8">
          Don't miss out on these exciting events happening soon
        </p>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8 max-w-4xl mx-auto">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.value
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25"
                    : "bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 hover:text-white border border-zinc-700/50 hover:border-zinc-600/50"
                }`}
              >
                <Icon size={14} className="md:w-4 md:h-4" />
                <span className="hidden sm:inline">{category.label}</span>
                <span className="sm:hidden">
                  {category.label.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))
        ) : filteredEvents && filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
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
              {selectedCategory === "all"
                ? "No upcoming events found"
                : `No ${
                    categories.find((c) => c.value === selectedCategory)?.label
                  } events found`}
            </p>
            <p className="text-zinc-500 text-sm">
              {selectedCategory === "all"
                ? "Check back later for new events!"
                : "Try selecting a different category or check back later!"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingEvents;
