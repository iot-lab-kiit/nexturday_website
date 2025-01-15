import { EventDetailType } from "../../types/types";
import { useEventStore } from "../../zustand/useEventStore";
import { Card, CardContent } from "./CardComponents";
import { Clock, TimerIcon, Building2, Globe, Mail, Phone } from 'lucide-react';

export const EventInfo: React.FC = () => {
    const currentEvent = useEventStore((state) => state.currentEvent);

    const details: EventDetailType[] = [
        { Icon: Phone, title: 'Phone', content: (currentEvent && currentEvent.phoneNumbers.length > 0) ? currentEvent.phoneNumbers.join(', ') : "---" },
        { Icon: Clock, title: 'Time', content: '---' },
        { Icon: TimerIcon, title: 'Duration', content: '---' },
        { Icon: Building2, title: 'Organizer', content: currentEvent?.society.name || '---' },
        { Icon: Globe, title: 'Website', content: (currentEvent && currentEvent.websiteUrl != "") ? currentEvent.websiteUrl : "Website not available!", isLink: (currentEvent && currentEvent.websiteUrl != "") ? true : false },
        { Icon: Mail, title: 'Email', content: (currentEvent && currentEvent.emails.length > 0) ? currentEvent.emails.join(', ') : "---" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {details.map(({ Icon, title, content, isLink }) => (
                <Card key={title} className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-purple-400/10">
                                <Icon className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">{title}</p>
                                {isLink ? (
                                    <a
                                        href={`${content}`}
                                        target="_blank"
                                        className="text-purple-400 hover:text-purple-300 transition-colors"
                                    >
                                        {content}
                                    </a>
                                ) : (
                                    <p className="font-medium">{content}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};