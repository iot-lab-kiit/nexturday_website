import { useEventStore } from "../../zustand/useEventStore";
import EventDetail from "./EventDetail";
import HeroImage from "./HeroImage";
import { RegisterButton } from "./RegisterButton";

const HeroSection = () => {
  const currentEvent = useEventStore((state) => state.currentEvent);
  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <HeroImage />
        <div className="flex flex-col gap-6 flex-1">
          <h1 className="text-4xl font-bold">{(currentEvent && currentEvent.name.length != 0) ? currentEvent.name : "---"}</h1>
          <EventDetail />
          <RegisterButton />
        </div>
      </div>
    </div>
  )
}

export default HeroSection
