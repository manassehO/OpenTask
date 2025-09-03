import { create } from 'zustand';

interface RecommendedTasksState {
  limit: number;
  offset: number;
  setLimit: (limit: number) => void;
  setOffset: (offset: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

export const useRecommendedTasksStore = create<RecommendedTasksState>(
  (set) => ({
    limit: 8,
    offset: 0,
    setLimit: (limit) => set({ limit, offset: 0 }),
    setOffset: (offset) => set({ offset }),
    nextPage: () => set((s) => ({ offset: s.offset + s.limit })),
    prevPage: () => set((s) => ({ offset: Math.max(0, s.offset - s.limit) })),
    seeAll: (total: number) => set({ limit: total, offset: 0 }),
  }),
);
