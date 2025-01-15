import { useEventStore } from '../../zustand/useEventStore';
import { Card } from './CardComponents';

const TabSwitcher = () => {
    const currentEvent = useEventStore((state) => state.currentEvent);
    const subEventIndex = useEventStore((state) => state.subEventIndex);
    const setSubEventIndex = useEventStore((state) => state.setSubEventIndex);

    return (
        <Card className="bg-zinc-900/50 backdrop-blur-sm  mb-8">
            <div className="flex gap-4 overflow-x-auto p-4 scrollbar-hide">
                {currentEvent?.details.map((subevent, index) => (
                    <div
                        key={subevent.id}
                        onClick={() => setSubEventIndex(index)}
                        className={`cursor-pointer px-4 py-2 rounded-xl transition-all duration-300 whitespace-nowrap focus:outline-none
        ${subEventIndex === index
                                ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white'
                                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
                    >
                        {subevent.name}
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default TabSwitcher;
