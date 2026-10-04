import { Switch, View, type StyleProp, type ViewStyle } from 'react-native';

import { haptics } from '@/lib/haptics';
import { createStyles, useTheme } from '@/theme';

import { Text } from './Text';

export interface ToggleProps {
  value: boolean;
  onValueChange: (next: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Native switch styled with tokens; renders as a labelled row when `label` is set. */
export function Toggle({ value, onValueChange, label, description, disabled, style }: ToggleProps) {
  const theme = useTheme();
  const s = useStyles();
  const { colors } = theme;

  const control = (
    <Switch
      value={value}
      disabled={disabled}
      accessibilityLabel={label}
      accessibilityHint={description}
      onValueChange={(next) => {
        haptics.selection();
        onValueChange(next);
      }}
      trackColor={{ false: colors.border, true: colors.primaryStrong }}
      thumbColor={colors.white}
      ios_backgroundColor={colors.border}
      // react-native-web: keep the thumb white when on.
      {...({ activeThumbColor: colors.white } as object)}
    />
  );

  if (!label) return control;

  return (
    <View style={[s.row, disabled ? s.disabled : null, style]}>
      <View style={s.text}>
        <Text variant="body" style={s.label}>
          {label}
        </Text>
        {description ? (
          <Text variant="bodySmall" color="textSecondary">
            {description}
          </Text>
        ) : null}
      </View>
      {control}
    </View>
  );
}

const useStyles = createStyles((t) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing[4],
    minHeight: t.layout.minTouchTarget,
  },
  text: { flex: 1, gap: 2 },
  label: { fontFamily: t.fontFamily.medium },
  disabled: { opacity: 0.5 },
}));
