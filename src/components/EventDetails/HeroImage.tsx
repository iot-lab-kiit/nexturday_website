import { useEventStore } from "../../zustand/useEventStore";

const HeroImage = () => {
    const currentEvent = useEventStore((state) => state.currentEvent);

    const renderImage = () => {
        if (!currentEvent || !currentEvent.images?.[0]?.url) {
            return (
                <div className="w-full h-full rounded-3xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center p-8">
                    <div className="flex flex-col items-center gap-4">
                        <svg className="w-24 h-24 text-purple-400/80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15.5 2V9.85999C15.5 10.3 14.98 10.52 14.66 10.23L12.34 8.09003C12.15 7.91003 11.85 7.91003 11.66 8.09003L9.34003 10.23C9.02003 10.52 8.5 10.3 8.5 9.85999V2H15.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13.5 14H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9 18H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="text-sm text-zinc-400 text-center">Event Preview</div>
                    </div>
                </div>
            );
        }

        return (
            <img
                src={currentEvent?.images[0].url || ""}
                alt={currentEvent?.name || "Event Image"}
                className="w-full h-full object-cover object-center bg-zinc-900/50 transition-transform hover:scale-105 duration-700 ease-in-out"
            />
        );
    };

    return (
        <div className="relative w-full h-auto max-w-[600px] lg:w-[600px] flex-shrink-0">
            <div className="relative w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 z-10" />
                {renderImage()}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
        </div>
    )
}

export default HeroImage
