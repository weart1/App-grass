import type { CareTaskType } from '@leafy/shared';
import { create } from 'zustand';

/**
 * Phase 1 demo data for the Care tab and its badge, so the tab-bar badge,
 * CareTaskRow animation and "All caught up" state can be reviewed together.
 * Phase 5 replaces this with server data (GET /api/care/tasks).
 */
export interface DemoCareTask {
  id: string;
  taskType: CareTaskType;
  plantName: string;
  space: string;
  done: boolean;
}

interface DemoCareState {
  tasks: DemoCareTask[];
  toggle: (id: string, done: boolean) => void;
  reset: () => void;
}

const initialTasks = (): DemoCareTask[] => [
  { id: 't1', taskType: 'water', plantName: 'Basil', space: 'Kitchen', done: false },
  { id: 't2', taskType: 'fertilize', plantName: 'Tommy the Tomato', space: 'Balcony', done: false },
  { id: 't3', taskType: 'mist', plantName: 'Monty', space: 'Living room', done: false },
];

export const useDemoCareStore = create<DemoCareState>((set) => ({
  tasks: initialTasks(),
  toggle: (id, done) =>
    set((state) => ({ tasks: state.tasks.map((t) => (t.id === id ? { ...t, done } : t)) })),
  reset: () => set({ tasks: initialTasks() }),
}));
