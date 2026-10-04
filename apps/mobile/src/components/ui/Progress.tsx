import { useEffect, useState, type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useTranslation } from 'react-i18next';

import { clamp } from '@/lib/format';
import { createStyles, useTheme } from '@/theme';

import { Text } from './Text';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function useAnimatedProgress(progress: number) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const value = useSharedValue(reduceMotion ? clamp(progress, 0, 1) : 0);
  useEffect(() => {
    const target = clamp(progress, 0, 1);
    value.set(reduceMotion ? target : withTiming(target, { duration: theme.motion.duration.slow }));
  }, [progress, reduceMotion, theme, value]);
  return value;
}

export interface ProgressBarProps {
  /** 0..1 */
  progress: number;
  label?: string;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export function ProgressBar({ progress, label, height = 8, style }: ProgressBarProps) {
  const s = useStyles();
  const { t } = useTranslation();
  const value = useAnimatedProgress(progress);
  const [width, setWidth] = useState(0);
  const fillStyle = useAnimatedStyle(() => ({ width: value.value * width }));
  const percent = Math.round(clamp(progress, 0, 1) * 100);

  return (
    <View
      style={style}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{
        min: 0,
        max: 100,
        now: percent,
        text: t('components.progress.a11y', { percent }),
      }}
    >
      {label ? (
        <Text variant="bodySmall" color="textSecondary" style={s.barLabel}>
          {label}
        </Text>
      ) : null}
      <View
        style={[s.track, { height, borderRadius: height / 2 }]}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      >
        <Animated.View style={[s.fill, { borderRadius: height / 2 }, fillStyle]} />
      </View>
    </View>
  );
}

export interface ProgressRingProps {
  /** 0..1 */
  progress: number;
  size?: number;
  strokeWidth?: number;
  /** Content rendered in the center (e.g. stage icon or "34d"). */
  children?: ReactNode;
  accessibilityLabel?: string;
}

export function ProgressRing({
  progress,
  size = 88,
  strokeWidth = 8,
  children,
  accessibilityLabel,
}: ProgressRingProps) {
  const theme = useTheme();
  const s = useStyles();
  const { t } = useTranslation();
  const value = useAnimatedProgress(progress);
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const percent = Math.round(clamp(progress, 0, 1) * 100);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - value.value),
  }));

  return (
    <View
      style={{ width: size, height: size }}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{
        min: 0,
        max: 100,
        now: percent,
        text: t('components.progress.a11y', { percent }),
      }}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={theme.colors.primary100}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={theme.colors.primary}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={s.ringCenter}>{children}</View>
    </View>
  );
}

const useStyles = createStyles((t) => ({
  barLabel: { marginBottom: t.spacing[2] },
  track: { width: '100%', backgroundColor: t.colors.primary100, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: t.colors.primary },
  ringCenter: {
    position: 'absolute',
    pointerEvents: 'none',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
