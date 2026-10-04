import type { CareTaskType } from '@leafy/shared';
import { Image } from 'expo-image';
import { Check, Sprout } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui/Text';
import { haptics } from '@/lib/haptics';
import { toImageSource, type ImageLike } from '@/lib/image';
import { createStyles, useTheme } from '@/theme';

import { CARE_TASK_META, dueLabel, dueTone, type Due } from './careMeta';

export interface CareTaskRowProps {
  taskType: CareTaskType;
  plantName: string;
  /** Custom task title; defaults to "<Task> <plant>". */
  title?: string;
  /** Secondary line, e.g. the plant's space ("Balcony"). */
  subtitle?: string;
  thumbnail?: ImageLike | null;
  due: Due;
  done: boolean;
  onToggleDone: (next: boolean) => void;
  onPress?: () => void;
}

export function CareTaskRow({
  taskType,
  plantName,
  title,
  subtitle,
  thumbnail,
  due,
  done,
  onToggleDone,
  onPress,
}: CareTaskRowProps) {
  const theme = useTheme();
  const s = useStyles();
  const { t } = useTranslation();
  const meta = CARE_TASK_META[taskType];
  const TaskIcon = meta.icon;
  const accent = theme.colors[meta.color];
  const heading =
    title ??
    t('components.careTask.title', { task: t(`components.task.${taskType}`), plant: plantName });

  return (
    <View style={s.row}>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole={onPress ? 'button' : undefined}
        style={s.main}
      >
        <View style={s.thumbWrap}>
          {thumbnail ? (
            <Image
              source={toImageSource(thumbnail)}
              style={s.thumb}
              contentFit="cover"
              accessible={false}
            />
          ) : (
            <View style={[s.thumb, s.thumbFallback]}>
              <Sprout size={22} color={theme.colors.primary} strokeWidth={2} />
            </View>
          )}
          <View style={[s.taskIcon, { backgroundColor: accent }]}>
            <TaskIcon size={12} color={theme.colors.white} strokeWidth={2.6} />
          </View>
        </View>
        <View style={s.text}>
          <Text variant="h3" numberOfLines={1} style={done ? s.doneTitle : null}>
            {heading}
          </Text>
          <Text variant="bodySmall" numberOfLines={1}>
            {subtitle ? (
              <Text variant="bodySmall" color="textSecondary">{`${subtitle} · `}</Text>
            ) : null}
            <Text variant="bodySmall" color={dueTone(due)} style={s.due}>
              {dueLabel(t, taskType, due)}
            </Text>
          </Text>
        </View>
      </Pressable>
      <CheckButton
        checked={done}
        color={accent}
        label={t(done ? 'components.careTask.markUndone' : 'components.careTask.markDone', {
          title: heading,
        })}
        onPress={() => onToggleDone(!done)}
      />
    </View>
  );
}

interface CheckButtonProps {
  checked: boolean;
  color: string;
  label: string;
  onPress: () => void;
}

/** Round check that fills with a little water-drop splash when completed. */
function CheckButton({ checked, color, label, onPress }: CheckButtonProps) {
  const theme = useTheme();
  const s = useStyles();
  const reduceMotion = useReducedMotion();
  const fill = useSharedValue(checked ? 1 : 0);
  const splash = useSharedValue(0);

  useEffect(() => {
    const target = checked ? 1 : 0;
    fill.set(reduceMotion ? target : withTiming(target, { duration: theme.motion.duration.base }));
  }, [checked, fill, reduceMotion, theme]);

  const bg = theme.colors.bg;
  const border = theme.colors.primary300;

  const circleStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(fill.value, [0, 1], [bg, color]),
    borderColor: interpolateColor(fill.value, [0, 1], [border, color]),
  }));
  const checkStyle = useAnimatedStyle(() => ({
    opacity: fill.value,
    transform: [{ scale: 0.5 + 0.5 * fill.value }],
  }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: splash.value > 0 && splash.value < 1 ? (1 - splash.value) * 0.7 : 0,
    transform: [{ scale: 1 + splash.value * 0.8 }],
  }));

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      hitSlop={6}
      onPress={() => {
        if (!checked) {
          haptics.success();
          if (!reduceMotion) {
            splash.set(0);
            splash.set(withTiming(1, { duration: 520 }));
          }
        } else {
          haptics.light();
        }
        onPress();
      }}
      style={s.checkHit}
    >
      <Animated.View style={[s.ring, { borderColor: color }, ringStyle]} />
      {DROP_ANGLES.map((angle) => (
        <SplashDrop key={angle} angle={angle} progress={splash} color={color} />
      ))}
      <Animated.View style={[s.check, circleStyle]}>
        <Animated.View style={checkStyle}>
          <Check size={20} color={theme.colors.white} strokeWidth={3} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const DROP_ANGLES = [-90, -30, -150, 30, 150] as const;

/** One droplet flying outward as `progress` goes 0 → 1. */
function SplashDrop({
  angle,
  progress,
  color,
}: {
  angle: number;
  progress: SharedValue<number>;
  color: string;
}) {
  const s = useStyles();
  const style = useAnimatedStyle(() => {
    const distance = 14 + progress.value * 14;
    const rad = (angle * Math.PI) / 180;
    return {
      opacity: progress.value > 0 && progress.value < 1 ? 1 - progress.value : 0,
      transform: [
        { translateX: Math.cos(rad) * distance },
        { translateY: Math.sin(rad) * distance },
      ],
    };
  });
  return <Animated.View style={[s.drop, { backgroundColor: color }, style]} />;
}

const CHECK = 36;

const useStyles = createStyles((t) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing[3],
    paddingVertical: t.spacing[2],
    minHeight: 64,
  },
  main: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: t.spacing[3] },
  thumbWrap: { width: 48, height: 48 },
  thumb: { width: 48, height: 48, borderRadius: t.radius.sm },
  thumbFallback: {
    backgroundColor: t.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskIcon: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 22,
    height: 22,
    borderRadius: t.radius.full,
    borderWidth: 2,
    borderColor: t.colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: 2 },
  doneTitle: { color: t.colors.textSecondary, textDecorationLine: 'line-through' },
  due: { fontFamily: t.fontFamily.medium },
  checkHit: {
    width: t.layout.minTouchTarget,
    height: t.layout.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    width: CHECK,
    height: CHECK,
    borderRadius: t.radius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    pointerEvents: 'none',
    width: CHECK,
    height: CHECK,
    borderRadius: t.radius.full,
    borderWidth: 2,
  },
  drop: { position: 'absolute', pointerEvents: 'none', width: 5, height: 7, borderRadius: 3 },
}));
