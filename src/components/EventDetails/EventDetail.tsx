import EventDetailItem from "./EventDetailItem";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useEventStore } from "../../zustand/useEventStore";
import { formatDate } from "../../utils/utils";

const EventDetail = () => {
  const currentEvent = useEventStore((state) => state.currentEvent);
  const subEventIndex = useEventStore((state) => state.subEventIndex);

  const getDateRange = () => {
    if (!currentEvent) {
      return "---";
    }
    const fromDate = formatDate(currentEvent?.from);
    const toDate = formatDate(currentEvent?.to);

    if (fromDate.day === toDate.day && fromDate.month === toDate.month) {
      return `${fromDate.weekday}, ${fromDate.day} ${fromDate.month}`;
    }

    return `${fromDate.weekday}, ${fromDate.day} ${fromDate.month} - ${toDate.weekday}, ${toDate.day} ${toDate.month}`;
  };

  return (
    <div className="flex flex-col gap-4">
      <EventDetailItem
        icon={<Calendar className="w-5 h-5 text-purple-400" />}
        label="Date"
        value={getDateRange()}
      />
      <EventDetailItem
        icon={<Clock className="w-5 h-5 text-purple-400" />}
        label="Time"
        value={
          currentEvent
            ? new Date(currentEvent.from).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "---"
        }
      />
      <EventDetailItem
        icon={<MapPin className="w-5 h-5 text-purple-400" />}
        label="Venue"
        value={
          currentEvent && currentEvent?.details[subEventIndex]?.venue
            ? currentEvent?.details[subEventIndex]?.venue?.name
            : "Online"
        }
      />
    </div>
  );
};

export default EventDetail;
