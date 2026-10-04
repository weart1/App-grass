import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { createStyles } from '@/theme';

import { PressableScale } from './PressableScale';

export type CardVariant = 'surface' | 'outlined' | 'elevated' | 'tinted';

export interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  padding?: 0 | 3 | 4 | 5;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function Card({
  children,
  variant = 'elevated',
  padding = 4,
  onPress,
  accessibilityLabel,
  style,
}: CardProps) {
  const s = useStyles();
  const cardStyle = [s.base, s[variant], s[`p${padding}`], style];

  if (onPress) {
    return (
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={cardStyle}
      >
        {children}
      </PressableScale>
    );
  }
  return <View style={cardStyle}>{children}</View>;
}

const useStyles = createStyles((t) => ({
  base: { borderRadius: t.radius.md },
  surface: { backgroundColor: t.colors.surface },
  outlined: { backgroundColor: t.colors.bg, borderWidth: 1, borderColor: t.colors.border },
  elevated: {
    backgroundColor: t.colors.bg,
    borderWidth: 1,
    borderColor: t.colors.border,
    boxShadow: t.shadows.soft,
  },
  tinted: { backgroundColor: t.colors.primary50 },
  p0: { padding: 0 },
  p3: { padding: t.spacing[3] },
  p4: { padding: t.spacing[4] },
  p5: { padding: t.spacing[5] },
}));
