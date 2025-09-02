import { signOutUser } from "../../firebaseConfig";
import { EventDetailType } from "../../types/types";
import { useEventStore } from "../../zustand/useEventStore";
import { Card, CardContent } from "./CardComponents";
import { Clock, TimerIcon, Building2, Globe, Mail, Phone } from "lucide-react";
import axios from "axios";

export const EventInfo: React.FC = () => {
  const currentEvent = useEventStore((state) => state.currentEvent);
  const subEventIndex = useEventStore((state) => state.subEventIndex);

  const formatEventTime = () => {
    try {
      const subEventFrom = currentEvent?.details[subEventIndex].from;
      const subEventTo = currentEvent?.details[subEventIndex].to;

      if (!subEventFrom || !subEventTo) {
        return "---";
      }

      const fromDate = new Date(subEventFrom);
      const toDate = new Date(subEventTo);

      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        return "---";
      }

      const formatOptions: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };

      const startTime = fromDate.toLocaleTimeString([], formatOptions);
      const endTime = toDate.toLocaleTimeString([], formatOptions);
      const eventDate = fromDate.toLocaleDateString();

      return `${eventDate}, ${startTime} - ${endTime}`;
    } catch (error: unknown) {
      console.error("Error formatting event time:", error);
      return "---";
    }
  };

  const calculateDuration = () => {
    try {
      const subEventFrom = currentEvent?.details[subEventIndex].from;
      const subEventTo = currentEvent?.details[subEventIndex].to;

      if (!subEventFrom || !subEventTo) {
        return "---";
      }

      const fromDate = new Date(subEventFrom);
      const toDate = new Date(subEventTo);

      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        return "---";
      }

      const diffInMs = toDate.getTime() - fromDate.getTime();
      const diffInHours = Math.max(0, Math.round(diffInMs / (1000 * 60 * 60)));

      return `${diffInHours} hrs`;
    } catch (error: unknown) {
      console.error("Error calculating duration:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        signOutUser();
      }
      return "---";
    }
  };

  const details: EventDetailType[] = [
    {
      Icon: Phone,
      title: "Phone",
      content:
        currentEvent && currentEvent.phoneNumbers.length > 0
          ? currentEvent.phoneNumbers.join(", ")
          : "---",
    },
    { Icon: Clock, title: "When", content: formatEventTime() },
    { Icon: TimerIcon, title: "Duration", content: calculateDuration() },
    {
      Icon: Building2,
      title: "Organizer",
      content: currentEvent?.society.name || "---",
    },
    {
      Icon: Globe,
      title: "Website",
      content:
        currentEvent && currentEvent.websiteUrl != ""
          ? currentEvent.websiteUrl
          : "Website not available!",
      isLink: currentEvent && currentEvent.websiteUrl != "" ? true : false,
    },
    {
      Icon: Mail,
      title: "Email",
      content:
        currentEvent && currentEvent.emails.length > 0
          ? currentEvent.emails.join(", ")
          : "---",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
      {details.map(({ Icon, title, content, isLink }) => (
        <Card
          key={title}
          className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800/50 hover:bg-zinc-800/50 transition-colors"
        >
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 rounded-full bg-purple-400/10">
                <Icon className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-gray-400">{title}</p>
                {isLink ? (
                  <a
                    href={`${content}`}
                    target="_blank"
                    className="text-purple-400 hover:text-purple-300 transition-colors break-words text-xs md:text-sm"
                  >
                    {content}
                  </a>
                ) : (
                  <p className="font-medium break-words text-xs md:text-sm">
                    {content}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
