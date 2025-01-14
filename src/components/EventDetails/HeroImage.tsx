import React from "react";

const HeroImage: React.FC = () => (
    <div className="relative w-full lg:w-[600px] h-[400px] flex-shrink-0">
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 z-10" />
            <img
                src="/images/innovance.png"
                alt="Innovance"
                className="w-full h-full object-cover object-center bg-zinc-900/50 transition-transform hover:scale-105 duration-700 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
    </div>
);

export default HeroImage;
