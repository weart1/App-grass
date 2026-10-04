import type { LucideIcon } from 'lucide-react-native';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { createStyles, useTheme } from '@/theme';

import { Text } from './Text';

export type BadgeTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  icon?: LucideIcon;
  /** Small colored dot before the label. */
  dot?: boolean;
  size?: 'M' | 'S';
  style?: StyleProp<ViewStyle>;
}

/** Text/background pairs are verified for WCAG AA in ui-tokens/contrast.test.ts. */
export function useBadgeColors(tone: BadgeTone) {
  const { colors } = useTheme();
  return {
    success: { bg: colors.primary50, fg: colors.primaryStrong, dot: colors.primary },
    warning: { bg: colors.warningBg, fg: colors.warningStrong, dot: colors.warning },
    danger: { bg: colors.dangerBg, fg: colors.dangerStrong, dot: colors.danger },
    info: { bg: colors.infoBg, fg: colors.infoStrong, dot: colors.info },
    neutral: { bg: colors.surfaceAlt, fg: colors.textSecondary, dot: colors.textDisabled },
  }[tone];
}

export function Badge({ label, tone = 'neutral', icon: Icon, dot, size = 'M', style }: BadgeProps) {
  const s = useStyles();
  const c = useBadgeColors(tone);
  return (
    <View style={[s.base, size === 'S' ? s.small : s.medium, { backgroundColor: c.bg }, style]}>
      {dot ? <View style={[s.dot, { backgroundColor: c.dot }]} /> : null}
      {Icon ? <Icon size={size === 'S' ? 12 : 14} color={c.fg} strokeWidth={2.4} /> : null}
      <Text
        variant="caption"
        style={[{ color: c.fg }, size === 'S' ? s.smallText : null]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const useStyles = createStyles((t) => ({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: t.spacing[1],
    borderRadius: t.radius.full,
  },
  medium: { paddingHorizontal: t.spacing[3] - 2, paddingVertical: t.spacing[1] },
  small: { paddingHorizontal: t.spacing[2], paddingVertical: 2 },
  smallText: { fontSize: 11, lineHeight: 14 },
  dot: { width: 6, height: 6, borderRadius: 3 },
}));
