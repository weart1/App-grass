import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { createStyles, useTheme } from '@/theme';

import { PressableScale, type PressableScaleProps } from './PressableScale';
import { Text } from './Text';

export type IconButtonVariant = 'plain' | 'tinted' | 'filled' | 'overlay';

export interface IconButtonProps extends Omit<PressableScaleProps, 'children'> {
  icon: LucideIcon;
  /** Required: icon-only controls must be labelled for screen readers. */
  accessibilityLabel: string;
  variant?: IconButtonVariant;
  /** Visual diameter. The touch target is always at least 44×44. */
  size?: number;
  iconSize?: number;
  /** Small count bubble (e.g. unread notifications). Hidden when 0/undefined. */
  badgeCount?: number;
  /** Fill the icon (e.g. liked heart, saved bookmark). */
  active?: boolean;
  activeColor?: string;
}

export function IconButton({
  icon: Icon,
  variant = 'plain',
  size = 44,
  iconSize,
  badgeCount,
  active = false,
  activeColor,
  disabled,
  style,
  ...rest
}: IconButtonProps) {
  const theme = useTheme();
  const s = useStyles();
  const { colors } = theme;

  const look = {
    plain: { bg: colors.transparent, pressed: colors.surfaceAlt, fg: colors.textPrimary },
    tinted: { bg: colors.surface, pressed: colors.surfaceAlt, fg: colors.primaryStrong },
    filled: { bg: colors.primaryStrong, pressed: colors.primaryDeep, fg: colors.onPrimary },
    overlay: { bg: colors.cameraScrim, pressed: colors.overlay, fg: colors.white },
  }[variant];

  const fg = disabled ? colors.textDisabled : active && activeColor ? activeColor : look.fg;
  const hit = Math.max(0, (theme.layout.minTouchTarget - size) / 2);

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled, selected: active || undefined }}
      disabled={disabled}
      hitSlop={hit}
      scaleTo={0.9}
      style={({ pressed }) => [
        s.base,
        { width: size, height: size, backgroundColor: pressed ? look.pressed : look.bg },
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
      {...rest}
    >
      <Icon
        size={iconSize ?? Math.round(size * 0.5)}
        color={fg}
        fill={active ? fg : 'none'}
        strokeWidth={2}
      />
      {badgeCount ? (
        <View style={s.badge}>
          <Text variant="caption" color="onPrimary" style={s.badgeText}>
            {badgeCount > 99 ? '99+' : badgeCount}
          </Text>
        </View>
      ) : null}
    </PressableScale>
  );
}

const useStyles = createStyles((t) => ({
  base: {
    borderRadius: t.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    pointerEvents: 'none',
    top: 2,
    right: 2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.primaryStrong,
    borderWidth: 2,
    borderColor: t.colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 10, lineHeight: 12 },
}));
