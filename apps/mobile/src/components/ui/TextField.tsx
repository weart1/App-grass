import type { LucideIcon } from 'lucide-react-native';
import { useId, useState, type ReactNode, type Ref } from 'react';
import { TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';

import { createStyles, useTheme } from '@/theme';

import { Text } from './Text';

export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  helper?: string;
  error?: string | null;
  optional?: boolean;
  leftIcon?: LucideIcon;
  /** Element on the right inside the field (e.g. clear button, availability check). */
  right?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  ref?: Ref<TextInput>;
}

export function TextField({
  label,
  helper,
  error,
  optional,
  leftIcon: LeftIcon,
  right,
  containerStyle,
  multiline,
  editable = true,
  onFocus,
  onBlur,
  ref,
  ...rest
}: TextFieldProps) {
  const theme = useTheme();
  const s = useStyles();
  const { t } = useTranslation();
  const [focused, setFocused] = useState(false);
  const id = useId();
  const hasError = !!error;

  return (
    <View style={[s.container, containerStyle]}>
      {label ? (
        <View style={s.labelRow}>
          <Text variant="bodySmall" style={s.label} nativeID={`${id}-label`}>
            {label}
          </Text>
          {optional ? (
            <Text variant="caption" color="textMuted">
              {t('common.optional')}
            </Text>
          ) : null}
        </View>
      ) : null}
      <View
        style={[
          s.field,
          multiline ? s.multiline : null,
          focused ? s.focused : null,
          hasError ? s.error : null,
          !editable ? s.disabled : null,
        ]}
      >
        {LeftIcon ? <LeftIcon size={18} color={theme.colors.textMuted} strokeWidth={2} /> : null}
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          accessibilityLabelledBy={label ? `${id}-label` : undefined}
          accessibilityHint={error ?? helper}
          placeholderTextColor={theme.colors.textMuted}
          selectionColor={theme.colors.primaryStrong}
          cursorColor={theme.colors.primaryStrong}
          maxFontSizeMultiplier={theme.maxFontScale}
          multiline={multiline}
          editable={editable}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[s.input, multiline ? s.inputMultiline : null]}
          {...rest}
        />
        {right}
      </View>
      {hasError ? (
        <Text variant="bodySmall" color="dangerStrong" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : helper ? (
        <Text variant="bodySmall" color="textSecondary">
          {helper}
        </Text>
      ) : null}
    </View>
  );
}

export interface TextAreaProps extends Omit<TextFieldProps, 'multiline'> {
  /** Shows a live character counter when set. */
  maxLength?: number;
}

export function TextArea({ maxLength, value, helper, ...rest }: TextAreaProps) {
  const { t } = useTranslation();
  const counter =
    maxLength !== undefined
      ? t('common.charCount', { count: value?.length ?? 0, max: maxLength })
      : undefined;
  return (
    <TextField
      {...rest}
      value={value}
      multiline
      maxLength={maxLength}
      helper={[helper, counter].filter(Boolean).join(' · ') || undefined}
    />
  );
}

const useStyles = createStyles((t) => ({
  container: { gap: t.spacing[2] },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
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
  multiline: { alignItems: 'flex-start', paddingVertical: t.spacing[3], minHeight: 120 },
  focused: { borderColor: t.colors.primary300, backgroundColor: t.colors.bg },
  error: { borderColor: t.colors.dangerStrong },
  disabled: { opacity: 0.6 },
  input: {
    flex: 1,
    ...t.typography.body,
    color: t.colors.textPrimary,
    paddingVertical: t.spacing[3],
  },
  inputMultiline: { paddingVertical: 0, minHeight: 96 },
}));
