import { Minus, Plus } from 'lucide-react-native';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';

import { haptics } from '@/lib/haptics';
import { createStyles } from '@/theme';

import { IconButton } from './IconButton';
import { Text } from './Text';

export interface StepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  /** Renders the value, e.g. (n) => t('components.frequency.days', { count: n }). */
  formatValue?: (value: number) => string;
  style?: StyleProp<ViewStyle>;
}

/** "Every N days"-style numeric control. Screen readers get an adjustable role. */
export function Stepper({
  value,
  onChange,
  min = 1,
  max = 365,
  step = 1,
  label,
  formatValue = String,
  style,
}: StepperProps) {
  const s = useStyles();
  const { t } = useTranslation();
  const display = formatValue(value);

  const set = (next: number) => {
    const bounded = Math.min(max, Math.max(min, next));
    if (bounded !== value) {
      haptics.selection();
      onChange(bounded);
    }
  };

  return (
    <View
      style={[s.row, style]}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ min, max, now: value, text: display }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => {
        if (e.nativeEvent.actionName === 'increment') set(value + step);
        if (e.nativeEvent.actionName === 'decrement') set(value - step);
      }}
    >
      {label ? (
        <Text variant="body" style={s.label} numberOfLines={2}>
          {label}
        </Text>
      ) : null}
      <View style={s.controls}>
        <IconButton
          icon={Minus}
          variant="tinted"
          size={36}
          iconSize={18}
          accessibilityLabel={t('components.stepper.decrease')}
          disabled={value <= min}
          onPress={() => set(value - step)}
        />
        <Text variant="h3" align="center" style={s.value} numberOfLines={1}>
          {display}
        </Text>
        <IconButton
          icon={Plus}
          variant="tinted"
          size={36}
          iconSize={18}
          accessibilityLabel={t('components.stepper.increase')}
          disabled={value >= max}
          onPress={() => set(value + step)}
        />
      </View>
    </View>
  );
}

const useStyles = createStyles((t) => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: t.spacing[3] },
  label: { flex: 1, fontFamily: t.fontFamily.medium },
  controls: { flexDirection: 'row', alignItems: 'center', gap: t.spacing[2] },
  value: { minWidth: 112 },
}));
