import { CircleAlert, CircleCheck, Info, type LucideIcon } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useToastStore, type ToastTone } from '@/stores/toast';
import { createStyles, useTheme } from '@/theme';

import { Text } from './Text';

const ICONS: Record<ToastTone, LucideIcon> = {
  success: CircleCheck,
  error: CircleAlert,
  info: Info,
};

/**
 * Renders the current toast. Mount once near the root; trigger with
 * `toast.success('Saved')` from `@/stores/toast`. Layout animations respect
 * the OS "Reduce Motion" setting automatically.
 */
export function ToastHost() {
  const theme = useTheme();
  const s = useStyles();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const current = useToastStore((st) => st.current);
  const hide = useToastStore((st) => st.hide);

  useEffect(() => {
    if (!current) return;
    const timer = setTimeout(() => hide(current.id), theme.motion.duration.toast);
    return () => clearTimeout(timer);
  }, [current, hide, theme]);

  if (!current) return null;
  const Icon = ICONS[current.tone];
  const iconColor = {
    success: theme.colors.primary,
    error: theme.colors.danger,
    info: theme.colors.info,
  }[current.tone];

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { pointerEvents: 'box-none', paddingTop: insets.top + theme.spacing[2] },
      ]}
    >
      <Animated.View key={current.id} entering={FadeInUp} exiting={FadeOutUp} style={s.toast}>
        <Pressable
          accessibilityRole="alert"
          accessibilityLiveRegion="assertive"
          accessibilityHint={t('common.actions.dismiss')}
          onPress={() => hide(current.id)}
          style={s.inner}
        >
          <Icon size={20} color={iconColor} strokeWidth={2.4} />
          <Text variant="body" color="white" style={s.message} numberOfLines={3}>
            {current.message}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const useStyles = createStyles((t) => ({
  toast: {
    alignSelf: 'center',
    marginHorizontal: t.layout.screenPaddingX,
    maxWidth: 480,
    borderRadius: t.radius.md,
    backgroundColor: t.colors.textPrimary,
    boxShadow: t.shadows.elevated,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing[3],
    paddingVertical: t.spacing[3],
    paddingHorizontal: t.spacing[4],
    minHeight: t.layout.minTouchTarget,
  },
  message: { flexShrink: 1, fontFamily: t.fontFamily.medium },
}));
