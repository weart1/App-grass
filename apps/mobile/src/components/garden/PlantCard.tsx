import type { CareTaskType, GrowthStage } from '@leafy/shared';
import { Image } from 'expo-image';
import { ChevronRight } from 'lucide-react-native';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/Badge';
import { Illustration } from '@/components/ui/Illustration';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { toImageSource, type ImageLike } from '@/lib/image';
import { createStyles, useTheme } from '@/theme';

import { CARE_TASK_META, dueLabel, dueTone, type Due } from './careMeta';

export type PlantHealth = 'good' | 'attention' | 'critical';

export interface PlantCardProps {
  nickname: string;
  species: string;
  /** Cover photo URL or bundled asset; falls back to an illustration. */
  photo?: ImageLike | null;
  stage: GrowthStage;
  nextTask?: { type: CareTaskType; due: Due } | null;
  health?: PlantHealth;
  variant?: 'grid' | 'list';
  onPress?: () => void;
}

export function PlantCard({
  nickname,
  species,
  photo,
  stage,
  nextTask,
  health = 'good',
  variant = 'grid',
  onPress,
}: PlantCardProps) {
  const theme = useTheme();
  const s = useStyles();
  const { t } = useTranslation();

  const healthColor = {
    good: theme.colors.primary,
    attention: theme.colors.warning,
    critical: theme.colors.danger,
  }[health];
  const stageLabel = t(`components.stage.${stage}`);
  const healthLabel = t(`components.health.${health}`);
  const taskText = nextTask ? dueLabel(t, nextTask.type, nextTask.due) : null;
  const TaskIcon = nextTask ? CARE_TASK_META[nextTask.type].icon : null;
  const a11yLabel = [nickname, species, stageLabel, healthLabel, taskText]
    .filter(Boolean)
    .join(', ');

  const photoView = (
    <View style={variant === 'grid' ? s.gridPhoto : s.listPhoto}>
      {photo ? (
        <Image
          source={toImageSource(photo)}
          style={s.photoImage}
          contentFit="cover"
          transition={theme.motion.duration.base}
          accessible={false}
        />
      ) : (
        <View style={s.photoFallback}>
          <Illustration name="sprout" width={variant === 'grid' ? 120 : 64} />
        </View>
      )}
      <View
        style={[
          s.healthDot,
          variant === 'list' ? s.healthDotList : null,
          { backgroundColor: healthColor },
        ]}
      />
    </View>
  );

  const nextTaskRow =
    nextTask && TaskIcon ? (
      <View style={s.taskRow}>
        <TaskIcon size={14} color={theme.colors[dueTone(nextTask.due)]} strokeWidth={2.4} />
        <Text variant="caption" color={dueTone(nextTask.due)} numberOfLines={1} style={s.taskText}>
          {taskText}
        </Text>
      </View>
    ) : null;

  if (variant === 'list') {
    return (
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={a11yLabel}
        onPress={onPress}
        disabled={!onPress}
        style={s.listCard}
      >
        {photoView}
        <View style={s.listText}>
          <Text variant="h3" numberOfLines={1}>
            {nickname}
          </Text>
          <Text variant="bodySmall" color="textSecondary" numberOfLines={1}>
            {species}
          </Text>
          <View style={s.listMeta}>
            <Badge label={stageLabel} tone="success" size="S" />
            {nextTaskRow}
          </View>
        </View>
        <ChevronRight size={20} color={theme.colors.textMuted} />
      </PressableScale>
    );
  }

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      onPress={onPress}
      disabled={!onPress}
      style={s.gridCard}
    >
      {photoView}
      <View style={s.gridStage}>
        <Badge label={stageLabel} tone="success" size="S" />
      </View>
      <View style={s.gridText}>
        <Text variant="h3" numberOfLines={1}>
          {nickname}
        </Text>
        <Text variant="bodySmall" color="textSecondary" numberOfLines={1}>
          {species}
        </Text>
        {nextTaskRow}
      </View>
    </PressableScale>
  );
}

const useStyles = createStyles((t) => ({
  gridCard: { flex: 1, gap: t.spacing[2] },
  gridPhoto: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: t.radius.md,
    overflow: 'hidden',
    backgroundColor: t.colors.surfaceAlt,
  },
  gridStage: { position: 'absolute', left: t.spacing[2], top: t.spacing[2] },
  gridText: { gap: 2, paddingHorizontal: 2 },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing[3],
    padding: t.spacing[3],
    borderRadius: t.radius.md,
    backgroundColor: t.colors.bg,
    borderWidth: 1,
    borderColor: t.colors.border,
    boxShadow: t.shadows.soft,
  },
  listPhoto: {
    width: 72,
    height: 72,
    borderRadius: t.radius.sm,
    overflow: 'hidden',
    backgroundColor: t.colors.surfaceAlt,
  },
  listText: { flex: 1, gap: 2 },
  listMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing[2],
    marginTop: t.spacing[1],
    flexWrap: 'wrap',
  },
  photoImage: { width: '100%', height: '100%' },
  photoFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  healthDot: {
    position: 'absolute',
    top: t.spacing[2],
    right: t.spacing[2],
    width: 12,
    height: 12,
    borderRadius: t.radius.full,
    borderWidth: 2,
    borderColor: t.colors.bg,
  },
  healthDotList: { top: 4, right: 4, width: 10, height: 10 },
  taskRow: { flexDirection: 'row', alignItems: 'center', gap: t.spacing[1], marginTop: 2 },
  taskText: { flexShrink: 1 },
}));
