import React from "react";
import EventDetailItem from "./EventDetailItem";
import { Calendar, Clock, MapPin } from "lucide-react";

const EventDetails: React.FC = () => (
    <div className="flex flex-col gap-4">
        <EventDetailItem
            icon={<Calendar className="w-5 h-5 text-purple-400" />}
            label="Date"
            value="Sun, 15 Dec, 2024"
        />
        <EventDetailItem
            icon={<Clock className="w-5 h-5 text-purple-400" />}
            label="Time"
            value="10 AM onwards"
        />
        <EventDetailItem
            icon={<MapPin className="w-5 h-5 text-purple-400" />}
            label="Venue"
            value="Campus 6 Auditorium"
        />
    </div>
);

export default EventDetails;
