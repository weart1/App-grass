import { WifiOff } from 'lucide-react-native';
import { View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useIsOffline } from '@/lib/network';
import { createStyles, useTheme } from '@/theme';

import { Text } from './Text';

/** Presentational banner ("You're offline — showing saved data"). */
export function OfflineBanner() {
  const theme = useTheme();
  const s = useStyles();
  const { t } = useTranslation();
  return (
    <View style={s.banner} accessibilityRole="alert" accessibilityLiveRegion="polite">
      <WifiOff size={16} color={theme.colors.warningStrong} strokeWidth={2.4} />
      <Text variant="bodySmall" color="warningStrong" style={s.text}>
        {t('common.offline')}
      </Text>
    </View>
  );
}

/** Global overlay that shows the banner only while the device is offline. */
export function OfflineBannerHost() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const offline = useIsOffline();
  if (!offline) return null;
  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        top: insets.top + theme.spacing[1],
        left: 0,
        right: 0,
        alignItems: 'center',
      }}
    >
      <OfflineBanner />
    </Animated.View>
  );
}

const useStyles = createStyles((t) => ({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: t.spacing[2],
    paddingHorizontal: t.spacing[4],
    paddingVertical: t.spacing[2],
    borderRadius: t.radius.full,
    backgroundColor: t.colors.warningBg,
    boxShadow: t.shadows.soft,
  },
  text: { fontFamily: t.fontFamily.medium },
}));
