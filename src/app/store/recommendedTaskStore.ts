import { create } from 'zustand';

interface PaginationState {
  limit: number;
  offset: number;
}

interface RecommendedTasksState {
  paginations: Record<string, PaginationState>;
  setLimit: (key: string, limit: number) => void;
  setOffset: (key: string, offset: number) => void;
  nextPage: (key: string) => void;
  prevPage: (key: string) => void;
  reset: (key: string) => void;
}

export const useRecommendedTasksStore = create<RecommendedTasksState>(
  (set) => ({
    paginations: {},

    setLimit: (key, limit) =>
      set((state) => ({
        paginations: {
          ...state.paginations,
          [key]: { limit, offset: 0 },
        },
      })),

    setOffset: (key, offset) =>
      set((state) => ({
        paginations: {
          ...state.paginations,
          [key]: {
            ...(state.paginations[key] ?? { limit: 8, offset: 0 }),
            offset,
          },
        },
      })),

    nextPage: (key) =>
      set((state) => {
        const current = state.paginations[key] ?? { limit: 8, offset: 0 };
        return {
          paginations: {
            ...state.paginations,
            [key]: { ...current, offset: current.offset + current.limit },
          },
        };
      }),

    prevPage: (key) =>
      set((state) => {
        const current = state.paginations[key] ?? { limit: 8, offset: 0 };
        return {
          paginations: {
            ...state.paginations,
            [key]: {
              ...current,
              offset: Math.max(0, current.offset - current.limit),
            },
          },
        };
      }),

    reset: (key) =>
      set((state) => ({
        paginations: {
          ...state.paginations,
          [key]: { limit: 8, offset: 0 },
        },
      })),
  }),
);
