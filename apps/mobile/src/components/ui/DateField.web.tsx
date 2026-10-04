import { createElement } from 'react';
import { View } from 'react-native';

import { useTheme } from '@/theme';

import type { DateFieldProps } from './DateField';
import { Text } from './Text';

export { formatDisplayDate } from './DateField.shared';

const toInputValue = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Web (developer preview) fallback: a native HTML date input styled with tokens. */
export function DateField({
  label,
  value,
  onChange,
  minimumDate,
  maximumDate,
  error,
}: DateFieldProps) {
  const t = useTheme();
  // Plain CSS object for a DOM element (not a React Native StyleSheet).
  const inputStyle = {
    height: 48,
    padding: `0 ${t.spacing[4]}px`,
    borderRadius: t.radius.md,
    border: `1.5px solid ${t.colors.border}`,
    backgroundColor: t.colors.surface,
    color: t.colors.textPrimary,
    fontFamily: t.fontFamily.regular,
    fontSize: t.typography.body.fontSize,
  };

  return (
    <View style={{ gap: t.spacing[2] }}>
      {label ? (
        <Text variant="bodySmall" style={{ fontFamily: t.fontFamily.semibold }}>
          {label}
        </Text>
      ) : null}
      {createElement('input', {
        type: 'date',
        'aria-label': label,
        value: value ? toInputValue(value) : '',
        min: minimumDate ? toInputValue(minimumDate) : undefined,
        max: maximumDate ? toInputValue(maximumDate) : undefined,
        onChange: (e: { target: { value: string } }) => {
          const [y, m, d] = e.target.value.split('-').map(Number);
          if (y && m && d) onChange(new Date(y, m - 1, d));
        },
        style: inputStyle,
      })}
      {error ? (
        <Text variant="bodySmall" color="dangerStrong">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
