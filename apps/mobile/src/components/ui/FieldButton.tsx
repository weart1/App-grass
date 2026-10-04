import { ChevronDown, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { createStyles, useTheme } from '@/theme';

import { PressableScale } from './PressableScale';
import { Text } from './Text';

export interface FieldButtonProps {
  label?: string;
  value?: string | null;
  placeholder: string;
  icon?: LucideIcon;
  error?: string | null;
  onPress: () => void;
  accessibilityHint?: string;
}

/** Read-only field that opens a picker (used by Select and DateField). */
export function FieldButton({
  label,
  value,
  placeholder,
  icon: Icon = ChevronDown,
  error,
  onPress,
  accessibilityHint,
}: FieldButtonProps) {
  const theme = useTheme();
  const s = useStyles();

  return (
    <View style={s.container}>
      {label ? (
        <Text variant="bodySmall" style={s.label}>
          {label}
        </Text>
      ) : null}
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={label ? `${label}: ${value ?? placeholder}` : (value ?? placeholder)}
        accessibilityHint={accessibilityHint}
        onPress={onPress}
        scaleTo={0.99}
        style={({ pressed }) => [s.field, pressed ? s.pressed : null, error ? s.error : null]}
      >
        <Text
          variant="body"
          color={value ? 'textPrimary' : 'textMuted'}
          style={s.value}
          numberOfLines={1}
        >
          {value ?? placeholder}
        </Text>
        <Icon size={18} color={theme.colors.textSecondary} strokeWidth={2} />
      </PressableScale>
      {error ? (
        <Text variant="bodySmall" color="dangerStrong">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const useStyles = createStyles((t) => ({
  container: { gap: t.spacing[2] },
  label: { fontFamily: t.fontFamily.semibold },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing[2],
    minHeight: 48,
    paddingHorizontal: t.spacing[4],
    borderRadius: t.radius.md,
    borderWidth: 1.5,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
  },
  pressed: { backgroundColor: t.colors.surfaceAlt },
  error: { borderColor: t.colors.dangerStrong },
  value: { flex: 1 },
}));
