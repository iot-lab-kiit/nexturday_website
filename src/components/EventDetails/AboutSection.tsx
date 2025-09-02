import { useEventStore } from "../../zustand/useEventStore";
import { Card, CardContent, CardHeader } from "./CardComponents";

const AboutSection = () => {
  const currentEvent = useEventStore((state) => state.currentEvent);
  const subEventIndex = useEventStore((state) => state.subEventIndex);

  return (
    <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800/50 mb-6 md:mb-8 p-1 md:p-2">
      <div className="flex flex-col gap-3 md:gap-4">
        <CardHeader className="flex items-center">
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            About the event
          </h2>
        </CardHeader>
        <CardContent className="text-gray-300 leading-relaxed text-sm md:text-base">
          {currentEvent &&
          currentEvent.details[subEventIndex].about.length !== 0
            ? currentEvent.about
            : "---"}
        </CardContent>
      </div>
    </Card>
  );
};
export default AboutSection;
