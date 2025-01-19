import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader } from "./CardComponents";
import { useEventStore } from "../../zustand/useEventStore";

export const VenueSection = () => {
  const currentEvent = useEventStore((state) => state.currentEvent);
  const subEventIndex = useEventStore((state) => state.subEventIndex);

  return (
    <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800/50 mb-8">
      <CardHeader>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Venue
        </h2>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-purple-400/10">
            <MapPin className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="font-semibold text-lg mb-1 text-white">
              {currentEvent &&
              currentEvent.details[subEventIndex].venue?.name.length > 0
                ? currentEvent.details[subEventIndex].venue?.name
                : "Online"}
            </p>
            {currentEvent?.details[subEventIndex].venue?.mapUrl && (
              <a
                href={currentEvent.details[0].venue?.mapUrl || "#"}
                target="_blank"
                className="text-purple-400 hover:text-purple-300 transition-colors text-sm flex items-center gap-2"
              >
                Get directions
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
