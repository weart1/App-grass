import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';

/**
 * The tab bar floats over screen content (so the raised scan button can
 * receive touches on Android). Scrollable tab screens add this as bottom
 * padding so their last item clears the bar.
 */
export function useTabBarInset(): number {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return theme.layout.tabBarHeight + insets.bottom + theme.spacing[6];
}
