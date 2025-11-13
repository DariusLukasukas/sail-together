import { create } from "zustand";

interface JobState {
  // Stores the id of the job that is currently being hovered over in sidebar
  hoveredJobId: string | null;
  setHoveredJobId: (id: string | null) => void;
}

export const useJobStore = create<JobState>((set) => ({
  hoveredJobId: null,
  setHoveredJobId: (id) => set({ hoveredJobId: id }),
}));
