import { useEventStore } from "../../zustand/useEventStore";
import EventDetail from "./EventDetail";
import HeroImage from "./HeroImage";

const HeroSection = () => {
  const currentEvent = useEventStore((state) => state.currentEvent);
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-8">
        <HeroImage />
        <div className="hidden lg:flex flex-col gap-6 flex-1">
          <h1 className="text-4xl mt-4 font-bold">{(currentEvent && currentEvent.name.length != 0) ? currentEvent.name : "---"}</h1>
          <EventDetail />
        </div>

        <div className="lg:hidden mt-6 space-y-3 px-2">
          <EventDetail />
        </div>
      </div>
    </div>
  )
}

export default HeroSection