import { Check, type LucideIcon } from 'lucide-react-native';

import { haptics } from '@/lib/haptics';
import { createStyles, useTheme } from '@/theme';

import { PressableScale, type PressableScaleProps } from './PressableScale';
import { Text } from './Text';

export interface ChipProps extends Omit<PressableScaleProps, 'children'> {
  label: string;
  icon?: LucideIcon;
  /** Emoji or short glyph shown before the label (e.g. "🌱"). */
  leading?: string;
  selected?: boolean;
  size?: 'M' | 'S';
}

/** Rounded pill. Static when no `onPress` is given. */
export function Chip({
  label,
  icon: Icon,
  leading,
  selected = false,
  size = 'M',
  onPress,
  style,
  ...rest
}: ChipProps) {
  const theme = useTheme();
  const s = useStyles();
  const fg = selected ? theme.colors.primaryStrong : theme.colors.textPrimary;
  const interactive = !!onPress;

  return (
    <PressableScale
      accessibilityRole={interactive ? 'button' : 'text'}
      accessibilityState={interactive ? { selected } : undefined}
      disabled={!interactive}
      onPress={onPress}
      hitSlop={size === 'S' ? 8 : 4}
      style={({ pressed }) => [
        s.base,
        size === 'S' ? s.small : s.medium,
        selected ? s.selected : null,
        pressed ? s.pressed : null,
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
      {...rest}
    >
      {leading ? (
        <Text variant={size === 'S' ? 'caption' : 'bodySmall'} accessible={false}>
          {leading}
        </Text>
      ) : null}
      {Icon ? <Icon size={size === 'S' ? 14 : 16} color={fg} strokeWidth={2.2} /> : null}
      <Text
        variant={size === 'S' ? 'caption' : 'bodySmall'}
        style={[{ color: fg }, s.label]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </PressableScale>
  );
}

export interface FilterChipProps extends Omit<ChipProps, 'onPress' | 'selected'> {
  selected: boolean;
  onToggle: (next: boolean) => void;
}

/** Selectable chip for filters; shows a check mark when selected. */
export function FilterChip({ selected, onToggle, icon, ...rest }: FilterChipProps) {
  return (
    <Chip
      {...rest}
      icon={selected ? Check : icon}
      selected={selected}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={() => {
        haptics.selection();
        onToggle(!selected);
      }}
    />
  );
}

const useStyles = createStyles((t) => ({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: t.spacing[1] + 2,
    borderRadius: t.radius.full,
    borderWidth: 1,
    borderColor: t.colors.border,
    backgroundColor: t.colors.bg,
  },
  medium: { minHeight: 36, paddingHorizontal: t.spacing[4] },
  small: { minHeight: 28, paddingHorizontal: t.spacing[3] },
  selected: { backgroundColor: t.colors.surfaceAlt, borderColor: t.colors.primary300 },
  pressed: { backgroundColor: t.colors.surfaceAlt },
  label: { fontFamily: t.fontFamily.medium },
}));
