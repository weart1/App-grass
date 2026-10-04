import type { CareTaskType } from '@leafy/shared';
import type { ColorToken } from '@leafy/ui-tokens';
import {
  Droplet,
  FlaskConical,
  RotateCw,
  Scissors,
  Shovel,
  Sparkles,
  SprayCan,
  type LucideIcon,
} from 'lucide-react-native';
import type { TFunction } from 'i18next';

/** Icon + accent color per care task type. */
export const CARE_TASK_META: Record<CareTaskType, { icon: LucideIcon; color: ColorToken }> = {
  water: { icon: Droplet, color: 'info' },
  fertilize: { icon: FlaskConical, color: 'primary' },
  mist: { icon: SprayCan, color: 'info' },
  prune: { icon: Scissors, color: 'primary' },
  rotate: { icon: RotateCw, color: 'primary' },
  repot: { icon: Shovel, color: 'primary' },
  custom: { icon: Sparkles, color: 'primary' },
};

/** Relative due date, computed by the caller from `next_due_at`. */
export type Due =
  { kind: 'overdue'; days: number } | { kind: 'today' } | { kind: 'upcoming'; days: number };

export function dueTone(due: Due): ColorToken {
  if (due.kind === 'overdue') return 'dangerStrong';
  if (due.kind === 'today') return 'infoStrong';
  return 'textSecondary';
}

/** "Water today", "Overdue 2d", "Fertilize in 3 days". */
export function dueLabel(t: TFunction, task: CareTaskType, due: Due): string {
  const taskLabel = t(`components.task.${task}`);
  switch (due.kind) {
    case 'overdue':
      return t('components.due.overdue', { count: due.days });
    case 'today':
      return t('components.due.today', { task: taskLabel });
    case 'upcoming':
      return due.days === 1
        ? t('components.due.tomorrow', { task: taskLabel })
        : t('components.due.inDays', { task: taskLabel, count: due.days });
  }
}
