import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Platform } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/theme';

import { BottomSheet, type BottomSheetRef } from './BottomSheet';
import { formatDisplayDate } from './DateField.shared';
import { Button } from './Button';
import { FieldButton } from './FieldButton';

export interface DateFieldProps {
  label?: string;
  value: Date | null;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  placeholder?: string;
  error?: string | null;
}

export { formatDisplayDate };

/**
 * Date input. Android uses the system dialog; iOS shows the inline calendar in
 * a bottom sheet. (Web uses DateField.web.tsx.)
 */
export function DateField({
  label,
  value,
  onChange,
  minimumDate,
  maximumDate,
  placeholder,
  error,
}: DateFieldProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const sheet = useRef<BottomSheetRef>(null);
  const [draft, setDraft] = useState<Date>(value ?? new Date());

  const open = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: value ?? new Date(),
        mode: 'date',
        minimumDate,
        maximumDate,
        onChange: (event, date) => {
          if (event.type === 'set' && date) onChange(date);
        },
      });
      return;
    }
    setDraft(value ?? new Date());
    sheet.current?.present();
  };

  return (
    <>
      <FieldButton
        label={label}
        value={value ? formatDisplayDate(value) : null}
        placeholder={placeholder ?? t('components.dateField.placeholder')}
        icon={Calendar}
        error={error}
        onPress={open}
      />
      {Platform.OS === 'ios' ? (
        <BottomSheet ref={sheet} title={label}>
          <DateTimePicker
            value={draft}
            mode="date"
            display="inline"
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            accentColor={theme.colors.primaryStrong}
            themeVariant="light"
            onChange={(_, date) => date && setDraft(date)}
          />
          <Button
            label={t('common.actions.done')}
            fullWidth
            onPress={() => {
              onChange(draft);
              sheet.current?.dismiss();
            }}
          />
        </BottomSheet>
      ) : null}
    </>
  );
}
