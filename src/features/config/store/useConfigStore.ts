import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ConfigStore } from '../types';

// 创建内存存储用于测试
const createMemoryStorage = () => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => {
      const value = store.get(key);
      return Promise.resolve(value ?? null);
    },
    setItem: (key: string, value: string) => {
      store.set(key, value);
      return Promise.resolve();
    },
    removeItem: (key: string) => {
      store.delete(key);
      return Promise.resolve();
    },
  };
};

// 在测试环境中使用内存存储
const storage = process.env.NODE_ENV === 'test'
  ? createMemoryStorage()
  : createJSONStorage(() => AsyncStorage);

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      // State
      collectButtonTemplate: null,
      findEnergyButtonTemplate: null,
      matchingThreshold: 0.8,
      isConfigComplete: false,

      // Actions
      setCollectButtonTemplate: (path) => set((state) => ({
        collectButtonTemplate: path,
        isConfigComplete: !!(path && state.findEnergyButtonTemplate)
      })),

      setFindEnergyButtonTemplate: (path) => set((state) => ({
        findEnergyButtonTemplate: path,
        isConfigComplete: !!(state.collectButtonTemplate && path)
      })),

      setMatchingThreshold: (threshold) => set({ matchingThreshold: threshold }),

      clearConfig: () => set({
        collectButtonTemplate: null,
        findEnergyButtonTemplate: null,
        matchingThreshold: 0.8,
        isConfigComplete: false
      }),
    }),
    {
      name: 'green-energy-reaper-config',
      storage,
    }
  )
);
