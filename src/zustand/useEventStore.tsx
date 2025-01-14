import { create } from "zustand";
import { Event } from "../types/types";

interface EventStoreInterface {
    eventDetails: {
        popular: Event[];
        upcoming: Event[];
    } | null;
    setEventDetails: (eventDetails: { popular: Event[]; upcoming: Event[] } | null) => void;

    eventIndex: number;
    setEventIndex: (eventIndex: number) => void;

    currentEvent: Event | null;
    setCurrentEvent: (currentEvent: Event | null) => void;
}

export const useEventStore = create<EventStoreInterface>((set) => ({
    eventDetails: null,
    setEventDetails: (eventDetails: { popular: Event[]; upcoming: Event[] } | null) => set({ eventDetails }),

    eventIndex: 0,
    setEventIndex: (eventIndex: number) => set({ eventIndex }),

    currentEvent: null,
    setCurrentEvent: (currentEvent: Event | null) => set({ currentEvent }),
}));
