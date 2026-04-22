import { create } from 'zustand';

export interface FloatingMenuStore {
  isVisible: boolean;
  overlayPermissionGranted: boolean;

  showMenu: () => void;
  hideMenu: () => void;
  setPermissionGranted: (granted: boolean) => void;
}

export const useFloatingMenuStore = create<FloatingMenuStore>((set) => ({
  // State
  isVisible: false,
  overlayPermissionGranted: false,

  // Actions
  showMenu: () => set({ isVisible: true }),
  hideMenu: () => set({ isVisible: false }),
  setPermissionGranted: (granted) => set({ overlayPermissionGranted: granted }),
}));
