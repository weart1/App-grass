import { create } from 'zustand';

export type ToastTone = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastState {
  current: ToastMessage | null;
  show: (message: string, tone?: ToastTone) => void;
  hide: (id?: number) => void;
}

let nextId = 1;

export const useToastStore = create<ToastState>((set, get) => ({
  current: null,
  show: (message, tone = 'info') => set({ current: { id: nextId++, message, tone } }),
  hide: (id) => {
    if (id === undefined || get().current?.id === id) set({ current: null });
  },
}));

/** Imperative API usable outside React (e.g. mutation callbacks). */
export const toast = {
  show: (message: string) => useToastStore.getState().show(message, 'info'),
  success: (message: string) => useToastStore.getState().show(message, 'success'),
  error: (message: string) => useToastStore.getState().show(message, 'error'),
};
