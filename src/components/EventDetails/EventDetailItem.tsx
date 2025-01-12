import React from "react";

interface EventDetailItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

const EventDetailItem: React.FC<EventDetailItemProps> = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-sm p-4 rounded-lg">
        <div className="p-2 rounded-full bg-purple-400/10">{icon}</div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="font-medium">{value}</p>
        </div>
    </div>
);

export default EventDetailItem;
