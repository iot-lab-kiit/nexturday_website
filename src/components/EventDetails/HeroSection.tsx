import { useEventStore } from "../../zustand/useEventStore";
import EventDetail from "./EventDetail";
import HeroImage from "./HeroImage";
import { Registration } from "./Registration";

const HeroSection = () => {
  const currentEvent = useEventStore((state) => state.currentEvent);
  return (
    <div className="mb-6 md:mb-8">
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        <HeroImage />
        <div className="flex flex-col gap-4 md:gap-6 flex-1">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
            {currentEvent && currentEvent.name.length != 0
              ? currentEvent.name
              : "---"}
          </h1>
          <EventDetail />
          <Registration />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
