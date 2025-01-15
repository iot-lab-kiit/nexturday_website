import { useState } from 'react';
import { useEventStore } from '../../zustand/useEventStore';
import { Card } from './CardComponents';

const TabSwitcher = () => {
    const currentEvent = useEventStore((state) => state.currentEvent);
    const [activeTab, setActiveTab] = useState(0);

    return (
        <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800/50 mb-8">
            <div className="flex gap-4 overflow-x-auto p-4 scrollbar-hide">
                {currentEvent?.details.map((subevent, index) => (
                    <button
                        key={subevent.id}
                        onClick={() => setActiveTab(index)}
                        className={`px-4 py-2 rounded-xl transition-all duration-300 whitespace-nowrap
                            ${activeTab === index
                                ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-purple-500/20'
                                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
                    >
                        {subevent.name}
                    </button>
                ))}
            </div>
        </Card>
    );
};

export default TabSwitcher;
