import { useEventStore } from "../../zustand/useEventStore";
import { Card, CardContent, CardHeader } from "./CardComponents";

const SubEventsAbout = () => {
  const currentEvent = useEventStore((state) => state.currentEvent);
  const subEventIndex = useEventStore((state) => state.subEventIndex);

  if (!currentEvent || currentEvent.details.length < 2) {
    return null;
  }

  return (
    <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800/50 mb-8 p-1 md:p-2">
      <div className="flex flex-col gap-4">
        <CardHeader className="flex items-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Sub Event's About
          </h2>
        </CardHeader>
        <CardContent className="text-gray-300 leading-relaxed">
          {currentEvent.details[subEventIndex].about.length !== 0
            ? currentEvent.details[subEventIndex].about
            : "---"}
        </CardContent>
      </div>
    </Card>
  );
};
export default SubEventsAbout;
