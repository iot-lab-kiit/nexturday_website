import { useEventStore } from "../../zustand/useEventStore";
import { Card, CardContent, CardHeader } from "./CardComponents";

export const Guidelines = () => {
    const currentEvent = useEventStore((state) => state.currentEvent);
    return (
        <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800/50">
            <CardHeader>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Guidelines
                </h2>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(currentEvent && currentEvent.guidlines.length > 0) ? currentEvent.guidlines.map((guideline, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-400/10 text-purple-400 flex items-center justify-center text-sm">
                                {index + 1}
                            </span>
                            <p className="text-gray-300">{guideline}</p>
                        </div>
                    )) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-12 h-12 rounded-full bg-purple-400/10 flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-purple-400 mb-2">No Guidelines Available</h3>
                            <p className="text-gray-400">Guidelines for this event will be added soon.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}