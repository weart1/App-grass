import { useState, type ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useTheme } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PressState = { pressed: boolean };

export interface PressableScaleProps extends Omit<PressableProps, 'style' | 'children'> {
  /** Scale on press-in. Defaults to `motion.pressScale.default` (0.97). */
  scaleTo?: number;
  style?: StyleProp<ViewStyle> | ((state: PressState) => StyleProp<ViewStyle>);
  children?: ReactNode | ((state: PressState) => ReactNode);
}

/** Pressable that gently shrinks on press. Static when "Reduce Motion" is on. */
export function PressableScale({
  scaleTo,
  style,
  onPressIn,
  onPressOut,
  children,
  ...rest
}: PressableScaleProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const [pressed, setPressed] = useState(false);
  const target = scaleTo ?? theme.motion.pressScale.default;

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const state = { pressed };

  return (
    <AnimatedPressable
      onPressIn={(e) => {
        setPressed(true);
        if (!reduceMotion) scale.set(withSpring(target, theme.motion.spring));
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        setPressed(false);
        if (!reduceMotion) scale.set(withSpring(1, theme.motion.spring));
        onPressOut?.(e);
      }}
      style={[typeof style === 'function' ? style(state) : style, animatedStyle]}
      {...rest}
    >
      {typeof children === 'function' ? children(state) : children}
    </AnimatedPressable>
  );
}
