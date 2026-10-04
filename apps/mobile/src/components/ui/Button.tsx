import type { LucideIcon } from 'lucide-react-native';
import { ActivityIndicator, View } from 'react-native';

import { createStyles, useTheme } from '@/theme';

import { PressableScale, type PressableScaleProps } from './PressableScale';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'L' | 'M' | 'S';

export interface ButtonProps extends Omit<PressableScaleProps, 'children'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
}

const HEIGHT: Record<ButtonSize, number> = { L: 52, M: 44, S: 36 };
const PADDING_X: Record<ButtonSize, 4 | 5 | 6> = { L: 6, M: 5, S: 4 };
const ICON: Record<ButtonSize, number> = { L: 20, M: 18, S: 16 };

export function Button({
  label,
  variant = 'primary',
  size = 'L',
  loading = false,
  disabled,
  fullWidth,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  style,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const s = useStyles();
  const { colors } = theme;
  const isDisabled = disabled || loading;

  const palette = {
    primary: { bg: colors.primaryStrong, pressed: colors.primaryDeep, fg: colors.onPrimary },
    secondary: { bg: colors.primary50, pressed: colors.primary100, fg: colors.primaryStrong },
    ghost: { bg: colors.transparent, pressed: colors.surfaceAlt, fg: colors.primaryStrong },
    destructive: { bg: colors.dangerStrong, pressed: colors.dangerStrong, fg: colors.onDanger },
  }[variant];

  const fg = isDisabled && !loading ? colors.textDisabled : palette.fg;
  const height = HEIGHT[size];
  // S buttons are 36pt tall; extend the hit area to the 44pt minimum.
  const hitSlopY = Math.max(0, (theme.layout.minTouchTarget - height) / 2);

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!isDisabled, busy: loading }}
      disabled={isDisabled}
      hitSlop={{ top: hitSlopY, bottom: hitSlopY }}
      style={({ pressed }) => [
        s.base,
        {
          height,
          paddingHorizontal: theme.spacing[PADDING_X[size]],
          backgroundColor:
            isDisabled && !loading && variant !== 'ghost'
              ? colors.surfaceAlt
              : pressed
                ? palette.pressed
                : palette.bg,
          opacity: variant === 'destructive' && pressed ? 0.88 : 1,
        },
        fullWidth ? s.fullWidth : null,
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
      {...rest}
    >
      {/* While loading, the label stays (invisible) so the button keeps its width. */}
      {loading ? (
        <View style={s.spinner}>
          <ActivityIndicator color={fg} />
        </View>
      ) : null}
      <View style={[s.content, loading ? s.hidden : null]}>
        {LeftIcon ? <LeftIcon size={ICON[size]} color={fg} strokeWidth={2.2} /> : null}
        <Text
          variant="button"
          numberOfLines={1}
          style={[{ color: fg }, size === 'S' ? s.smallLabel : null]}
        >
          {label}
        </Text>
        {RightIcon ? <RightIcon size={ICON[size]} color={fg} strokeWidth={2.2} /> : null}
      </View>
    </PressableScale>
  );
}

const useStyles = createStyles((t) => ({
  base: {
    borderRadius: t.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  fullWidth: { alignSelf: 'stretch' },
  content: { flexDirection: 'row', alignItems: 'center', gap: t.spacing[2] },
  hidden: { opacity: 0 },
  spinner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallLabel: { fontSize: 14, lineHeight: 18 },
}));
