import { useEffect } from 'react';
import { View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useTranslation } from 'react-i18next';

import { createStyles, useTheme } from '@/theme';

export interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  /** Size by aspect ratio (width / height) instead of a fixed height. */
  aspectRatio?: number;
  radius?: number;
  circle?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Gently pulsing placeholder block. Static when "Reduce Motion" is on. */
export function Skeleton({
  width = '100%',
  height = 14,
  aspectRatio,
  radius,
  circle,
  style,
}: SkeletonProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) return;
    opacity.set(
      withRepeat(withTiming(0.55, { duration: 900, easing: Easing.inOut(Easing.quad) }), -1, true),
    );
  }, [opacity, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const size: ViewStyle =
    circle && typeof height === 'number'
      ? { width: height, height }
      : aspectRatio
        ? { width, aspectRatio }
        : { width, height };

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          backgroundColor: theme.colors.skeleton,
          borderRadius: circle ? theme.radius.full : (radius ?? theme.radius.xs),
        },
        size,
        animatedStyle,
        style,
      ]}
    />
  );
}

/** Multiple text lines; the last one is shorter. */
export function SkeletonText({
  lines = 2,
  lineHeight = 12,
}: {
  lines?: number;
  lineHeight?: number;
}) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.spacing[2] }}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          height={lineHeight}
          width={i === lines - 1 && lines > 1 ? '60%' : '100%'}
        />
      ))}
    </View>
  );
}

export function PlantCardSkeleton() {
  const s = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <View style={s.plantCard} accessibilityLabel={t('common.loading')} accessible>
      <Skeleton aspectRatio={1} radius={theme.radius.md} />
      <View style={s.plantText}>
        <Skeleton height={16} width="70%" />
        <Skeleton height={12} width="45%" />
        <Skeleton height={24} width="55%" radius={theme.radius.full} />
      </View>
    </View>
  );
}

export function CareTaskRowSkeleton() {
  const s = useStyles();
  const theme = useTheme();
  return (
    <View style={s.row}>
      <Skeleton height={48} width={48} radius={theme.radius.sm} />
      <View style={s.rowText}>
        <Skeleton height={15} width="60%" />
        <Skeleton height={12} width="35%" />
      </View>
      <Skeleton height={36} circle />
    </View>
  );
}

export function PostCardSkeleton() {
  const s = useStyles();
  const theme = useTheme();
  return (
    <View style={s.post}>
      <View style={s.row}>
        <Skeleton height={36} circle />
        <View style={s.rowText}>
          <Skeleton height={13} width="40%" />
          <Skeleton height={11} width="20%" />
        </View>
      </View>
      <Skeleton aspectRatio={theme.layout.postMediaAspect} radius={theme.radius.md} />
      <SkeletonText lines={2} />
    </View>
  );
}

const useStyles = createStyles((t) => ({
  plantCard: { flex: 1, gap: t.spacing[3] },
  plantText: { gap: t.spacing[2] },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing[3],
    paddingVertical: t.spacing[2],
  },
  rowText: { flex: 1, gap: t.spacing[2] },
  post: { gap: t.spacing[3] },
}));
