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
        const fromDate = formatDate(currentEvent?.details[subEventIndex].from);
        const toDate = formatDate(currentEvent?.details[subEventIndex].to);
        
        if (fromDate.day === toDate.day && fromDate.month === toDate.month) {
            return `${fromDate.weekday}, ${fromDate.day} ${fromDate.month}`;
        }
        
        return `${fromDate.weekday}, ${fromDate.day} ${fromDate.month} - ${toDate.weekday}, ${toDate.day} ${toDate.month}`;
    }

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
                value="---"
            />
            <EventDetailItem
                icon={<MapPin className="w-5 h-5 text-purple-400" />}
                label="Venue"
                value={currentEvent ? currentEvent.details[0].venue.name : "---"}
            />
        </div>
    )
}

export default EventDetail