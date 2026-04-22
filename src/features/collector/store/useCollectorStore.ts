import { create } from "zustand";
import type { CollectorStore } from "../types";

export const useCollectorStore = create<CollectorStore>((set) => ({
  // State
  recordStatus: "idle",
  collectionStatus: "idle",

  // Actions
  startCollection: () => set({ collectionStatus: "collecting" }),
  stoppingCollection: () => set({ collectionStatus: "stopping" }),
  stoppedCollection: () => set({ collectionStatus: "idle" }),

  startRecord: () => set({ recordStatus: "recording" }),
  stopRecord: () => set({ recordStatus: "idle" }),
}));
