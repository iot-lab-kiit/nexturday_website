import React from "react";
import HeroImage from "/images/innovance.png";
import EventDetails from "./EventDetails";

const HeroSection: React.FC = () => (
    <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-8">
            <HeroImage />

            {/* Event Details for Large Screens */}
            <div className="hidden lg:flex flex-col gap-6 flex-1">
                <h1 className="text-4xl font-bold">Innovance 3.0</h1>
                <EventDetails />
            </div>

            {/* Event Details for Small Screens */}
            <div className="lg:hidden mt-6 space-y-3 px-2">
                <EventDetails />
            </div>
        </div>
    </div>
);

export default HeroSection;
