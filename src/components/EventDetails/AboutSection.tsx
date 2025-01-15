import { useEventStore } from "../../zustand/useEventStore";
import { Card, CardContent, CardHeader } from "./CardComponents";

const AboutSection = () => {
    const currentEvent = useEventStore((state) => state.currentEvent);
    const subEventIndex = useEventStore((state) => state.subEventIndex);

    return (
        <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800/50 mb-8">
            <CardHeader>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    About the event
                </h2>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                    {(currentEvent && currentEvent.details[subEventIndex].about.length != 0) ? currentEvent.details[subEventIndex].about : "Event at KIIT"}
                </p>
            </CardContent>
        </Card>
    )
}
export default AboutSection