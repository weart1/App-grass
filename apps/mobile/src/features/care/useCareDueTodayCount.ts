import { useDemoCareStore } from './demoCareStore';

/**
 * Number of care tasks due today, shown as the badge on the Care tab.
 * Phase 1 reads demo data; Phase 5 switches to a TanStack Query hook.
 */
export function useCareDueTodayCount(): number {
  return useDemoCareStore((s) => s.tasks.filter((t) => !t.done).length);
}
