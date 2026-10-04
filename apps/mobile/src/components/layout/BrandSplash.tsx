import { APP_NAME } from '@leafy/shared';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { Logo } from '@/components/ui/Logo';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme';

/** Must match `imageWidth` of the expo-splash-screen plugin in app.config.ts. */
const SPLASH_LOGO_SIZE = 120;

/**
 * Continues the native splash (same logo, same spot), fades the wordmark in,
 * then fades the whole overlay out to reveal the app.
 */
export function BrandSplash() {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const wordmark = useSharedValue(0);
  const overlay = useSharedValue(1);

  useEffect(() => {
    const hide = () => setVisible(false);
    if (reduceMotion) {
      // No fades: just hold the brand briefly, then reveal the app.
      const timer = setTimeout(hide, 300);
      return () => clearTimeout(timer);
    }
    wordmark.set(withTiming(1, { duration: theme.motion.duration.slow }));
    overlay.set(
      withDelay(
        700,
        withTiming(0, { duration: theme.motion.duration.slow }, (finished) => {
          if (finished) scheduleOnRN(hide);
        }),
      ),
    );
  }, [overlay, reduceMotion, theme, wordmark]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlay.value }));
  const wordmarkStyle = useAnimatedStyle(() => ({
    opacity: wordmark.value,
    transform: [{ translateY: (1 - wordmark.value) * 8 }],
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        styles.center,
        { backgroundColor: theme.colors.bg },
        overlayStyle,
      ]}
    >
      <Logo size={SPLASH_LOGO_SIZE} />
      <View style={styles.wordmarkSlot}>
        <Animated.View style={wordmarkStyle}>
          <Text variant="display" color="primaryDeep">
            {APP_NAME}
          </Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' },
  // Positioned absolutely so the logo stays exactly where the native splash put it.
  wordmarkSlot: { position: 'absolute', top: '50%', marginTop: SPLASH_LOGO_SIZE / 2 + 16 },
});
