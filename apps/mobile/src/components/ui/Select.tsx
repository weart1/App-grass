import { Check } from 'lucide-react-native';
import { useRef } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { haptics } from '@/lib/haptics';
import { createStyles, useTheme } from '@/theme';

import { BottomSheet, type BottomSheetRef } from './BottomSheet';
import { FieldButton } from './FieldButton';
import { Text } from './Text';

export interface SelectOption<V extends string> {
  value: V;
  label: string;
  description?: string;
}

export interface SelectProps<V extends string> {
  label?: string;
  value: V | null;
  options: readonly SelectOption<V>[];
  onChange: (value: V) => void;
  placeholder?: string;
  error?: string | null;
}

/** Field that opens a bottom sheet with a single-choice list. */
export function Select<V extends string>({
  label,
  value,
  options,
  onChange,
  placeholder,
  error,
}: SelectProps<V>) {
  const theme = useTheme();
  const s = useStyles();
  const { t } = useTranslation();
  const sheet = useRef<BottomSheetRef>(null);
  const selected = options.find((o) => o.value === value);

  return (
    <>
      <FieldButton
        label={label}
        value={selected?.label ?? null}
        placeholder={placeholder ?? t('components.select.placeholder')}
        error={error}
        onPress={() => sheet.current?.present()}
      />
      <BottomSheet ref={sheet} title={label}>
        <View accessibilityRole="radiogroup">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                onPress={() => {
                  haptics.selection();
                  onChange(option.value);
                  sheet.current?.dismiss();
                }}
                style={({ pressed }) => [s.option, pressed ? s.pressed : null]}
              >
                <View style={s.optionText}>
                  <Text variant="body" style={isSelected ? s.selectedLabel : null}>
                    {option.label}
                  </Text>
                  {option.description ? (
                    <Text variant="bodySmall" color="textSecondary">
                      {option.description}
                    </Text>
                  ) : null}
                </View>
                {isSelected ? (
                  <Check size={20} color={theme.colors.primaryStrong} strokeWidth={2.4} />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </BottomSheet>
    </>
  );
}

const useStyles = createStyles((t) => ({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing[3],
    minHeight: 52,
    paddingHorizontal: t.spacing[3],
    borderRadius: t.radius.sm,
  },
  pressed: { backgroundColor: t.colors.surface },
  optionText: { flex: 1, gap: 2 },
  selectedLabel: { fontFamily: t.fontFamily.semibold, color: t.colors.primaryStrong },
}));
