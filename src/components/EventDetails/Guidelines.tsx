import { Card, CardContent, CardHeader } from "./CardComponents";

export const Guidelines: React.FC = () => (
    <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800/50 mb-20">
        <CardHeader>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Guidelines
            </h2>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    'Carry your college ID card for verification.',
                    'Entry is restricted to registered participants and authorized personnel.',
                    'Respect the event timings; late entries may not be entertained.',
                    'Pre-registration is mandatory; on-spot registration depends on availability.',
                    'Provide accurate details during registration.',
                    'Registration fees (if applicable) are non-refundable.',
                    'Maintain decorum and discipline throughout the event.',
                    'Avoid any disruptive behavior or misconduct.',
                    'Follow instructions from event coordinators and volunteers.',
                    'Adhere to the schedule provided by the organizers.'
                ].map((guideline, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-400/10 text-purple-400 flex items-center justify-center text-sm">
                            {index + 1}
                        </span>
                        <p className="text-gray-300">{guideline}</p>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);