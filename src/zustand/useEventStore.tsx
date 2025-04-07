import { create } from "zustand";
import { Event } from "../types/types";

interface EventStoreInterface {
    eventDetails: {
        popular: Event[];
        upcoming: Event[];
        recent: Event[];
    } | null;
    setEventDetails: (eventDetails: { popular: Event[]; upcoming: Event[]; recent: Event[] } | null) => void;

    eventIndex: number;
    setEventIndex: (eventIndex: number) => void;

    currentEvent: Event | null;
    setCurrentEvent: (currentEvent: Event | null) => void;

    
    markEventAsJoined: (eventId: string | undefined) => void; 

    subEventIndex: number;
    setSubEventIndex: (subEventIndex: number) => void;

    hideFooter: boolean;
    setHideFooter: (hideFooter: boolean) => void;

    teamName: string;
    setTeamName: (teamName: string) => void;

    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
  
    error: string | null;
    setError: (error: string | null) => void;
  
    profileChecked: boolean;
    setProfileChecked: (checked: boolean) => void;
}

export const useEventStore = create<EventStoreInterface>((set, get) => ({
    eventDetails: null,
    setEventDetails: (eventDetails: { popular: Event[]; upcoming: Event[]; recent: Event[] } | null) => set({ eventDetails }),

    eventIndex: 0,
    setEventIndex: (eventIndex: number) => set({ eventIndex }),

    currentEvent: null,
    setCurrentEvent: (currentEvent: Event | null) => set({ currentEvent }),

    
    markEventAsJoined: (eventId) => {
        const currentEvent = get().currentEvent; 
        
        if (currentEvent && eventId === currentEvent.id) {
            set({
                currentEvent: {
                    ...currentEvent, 
                    joined: true      
                }
            });
        } else {
            console.warn("markEventAsJoined called but currentEvent.id doesn't match or currentEvent is null.");
        }
    },

    subEventIndex: 0,
    setSubEventIndex: (subEventIndex: number) => set({ subEventIndex }),

    hideFooter: false,
    setHideFooter: (hideFooter: boolean) => set({ hideFooter }),

    teamName: "",
    setTeamName: (teamName: string) => set({ teamName }),

    isLoading: false,
    setIsLoading: (loading) => set({ isLoading: loading }),
  
    error: null,
    setError: (error) => set({ error }),
  
    profileChecked: false,
    setProfileChecked: (checked) => set({ profileChecked: checked }),
}));
