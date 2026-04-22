import { create } from 'zustand';
import type { CollectorStore } from '../types';

export const useCollectorStore = create<CollectorStore>((set) => ({
  // State
  isCollecting: false,
  currentStatus: 'idle',
  statistics: {
    totalCollected: 0,
    successCount: 0,
    failCount: 0,
    startTime: null,
    endTime: null,
  },
  currentOperation: null,

  // Actions
  startCollection: () => set((state) => ({
    isCollecting: true,
    currentStatus: 'collecting',
    statistics: {
      ...state.statistics,
      startTime: Date.now(),
      endTime: null,
    },
  })),

  stopCollection: () => set((state) => ({
    isCollecting: false,
    currentStatus: 'finished',
    statistics: {
      ...state.statistics,
      endTime: Date.now(),
    },
    currentOperation: null,
  })),

  updateStatistics: (data) => set((state) => ({
    statistics: {
      ...state.statistics,
      ...data,
    },
  })),

  setCurrentOperation: (operation) => set({ currentOperation: operation }),

  resetStatistics: () => set({
    isCollecting: false,
    currentStatus: 'idle',
    statistics: {
      totalCollected: 0,
      successCount: 0,
      failCount: 0,
      startTime: null,
      endTime: null,
    },
    currentOperation: null,
  }),
}));
