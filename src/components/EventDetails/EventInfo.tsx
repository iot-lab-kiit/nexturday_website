import { EventDetailType } from "../../types/types";
import { Card, CardContent } from "./CardComponents";
import { Clock, TimerIcon, Building2, Globe, Mail, Languages } from 'lucide-react';

export const EventInfo: React.FC = () => {
    const details: EventDetailType[] = [
        { Icon: Languages, title: 'Language', content: 'Hindi, English' },
        { Icon: Clock, title: 'Time', content: '10 AM onwards' },
        { Icon: TimerIcon, title: 'Duration', content: '6 hours' },
        { Icon: Building2, title: 'Organizer', content: 'IoT Lab' },
        { Icon: Globe, title: 'Website', content: 'innovance.iotkit.in', isLink: true },
        { Icon: Mail, title: 'Email', content: 'iot.lab@kiit.ac.in', isLink: true, isEmail: true }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {details.map(({ Icon, title, content, isLink, isEmail }) => (
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
                                        href={isEmail ? `mailto:${content}` : `https://${content}`}
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