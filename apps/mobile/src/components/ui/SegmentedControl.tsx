import { useState } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, withSpring } from 'react-native-reanimated';

import { haptics } from '@/lib/haptics';
import { createStyles, useTheme } from '@/theme';

import { Text } from './Text';

export interface Segment<K extends string> {
  key: K;
  label: string;
}

export interface SegmentedControlProps<K extends string> {
  segments: readonly Segment<K>[];
  value: K;
  onChange: (key: K) => void;
  style?: StyleProp<ViewStyle>;
}

const PAD = 4;

export function SegmentedControl<K extends string>({
  segments,
  value,
  onChange,
  style,
}: SegmentedControlProps<K>) {
  const theme = useTheme();
  const s = useStyles();
  const reduceMotion = useReducedMotion();
  const [width, setWidth] = useState(0);
  const index = Math.max(
    0,
    segments.findIndex((seg) => seg.key === value),
  );
  const segmentWidth = width > 0 ? (width - PAD * 2) / segments.length : 0;

  const thumbStyle = useAnimatedStyle(() => {
    const x = index * segmentWidth;
    return {
      width: segmentWidth,
      transform: [{ translateX: reduceMotion ? x : withSpring(x, theme.motion.spring) }],
    };
  }, [index, segmentWidth, reduceMotion]);

  return (
    <View
      style={[s.track, style]}
      accessibilityRole="tablist"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {segmentWidth > 0 ? <Animated.View style={[s.thumb, thumbStyle]} /> : null}
      {segments.map((seg) => {
        const selected = seg.key === value;
        return (
          <Pressable
            key={seg.key}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={seg.label}
            onPress={() => {
              if (!selected) {
                haptics.selection();
                onChange(seg.key);
              }
            }}
            style={s.segment}
          >
            <Text
              variant="bodySmall"
              color={selected ? 'textPrimary' : 'textSecondary'}
              style={selected ? s.selectedLabel : s.label}
              numberOfLines={1}
            >
              {seg.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const useStyles = createStyles((t) => ({
  track: {
    flexDirection: 'row',
    padding: PAD,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.surfaceAlt,
  },
  thumb: {
    position: 'absolute',
    top: PAD,
    bottom: PAD,
    left: PAD,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.bg,
    boxShadow: t.shadows.soft,
  },
  segment: {
    flex: 1,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: t.spacing[2],
  },
  label: { fontFamily: t.fontFamily.medium },
  selectedLabel: { fontFamily: t.fontFamily.semibold },
}));
