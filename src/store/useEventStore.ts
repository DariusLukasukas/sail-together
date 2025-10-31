import { create } from "zustand";

interface EventState {
  // Stores the id of the event that is currently being hovered over in sidebar
  hoveredEventId: string | null;
  setHoveredEventId: (id: string | null) => void;
}

export const useEventStore = create<EventState>((set) => ({
  hoveredEventId: null,
  setHoveredEventId: (id: string | null) => set({ hoveredEventId: id }),
}));
