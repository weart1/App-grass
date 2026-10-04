import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { Logo } from '@/components/ui/Logo';
import { PressableScale } from '@/components/ui/PressableScale';
import { haptics } from '@/lib/haptics';
import { createStyles, useTheme } from '@/theme';

export interface ScanButtonProps {
  onPress: () => void;
}

/**
 * Raised, gradient center button of the tab bar. Idle: soft pulse ring
 * (2s loop). Press: scales to 0.92 with haptic feedback.
 */
export function ScanButton({ onPress }: ScanButtonProps) {
  const theme = useTheme();
  const s = useStyles();
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    pulse.set(
      withRepeat(
        withTiming(1, { duration: theme.motion.duration.pulse, easing: Easing.out(Easing.quad) }),
        -1,
        false,
      ),
    );
    return () => cancelAnimation(pulse);
  }, [pulse, reduceMotion, theme]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: 0.5 * (1 - pulse.value),
    transform: [{ scale: 1 + pulse.value * 0.32 }],
  }));

  const { brand } = theme.gradients;

  return (
    <View style={s.wrap}>
      {reduceMotion ? null : <Animated.View style={[s.pulse, pulseStyle]} />}
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={t('tabs.scan')}
        accessibilityHint={t('tabs.scanA11yHint')}
        scaleTo={theme.motion.pressScale.scanButton}
        onPressIn={() => haptics.medium()}
        onPress={onPress}
        style={s.ring}
      >
        <LinearGradient
          colors={brand.colors}
          start={brand.start}
          end={brand.end}
          style={s.gradient}
        >
          <Logo size={34} color={theme.colors.white} accentColor={brand.colors[1]} />
        </LinearGradient>
      </PressableScale>
    </View>
  );
}

const useStyles = createStyles((t) => {
  const size = t.layout.scanButtonSize;
  const outer = size + t.layout.scanButtonRing * 2;
  return {
    wrap: {
      width: outer,
      height: outer,
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'box-none',
    },
    pulse: {
      position: 'absolute',
      pointerEvents: 'none',
      width: size,
      height: size,
      borderRadius: t.radius.full,
      backgroundColor: t.colors.primary,
    },
    ring: {
      width: outer,
      height: outer,
      padding: t.layout.scanButtonRing,
      borderRadius: t.radius.full,
      backgroundColor: t.colors.bg,
      boxShadow: t.shadows.elevated,
    },
    gradient: {
      flex: 1,
      borderRadius: t.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
  };
});
