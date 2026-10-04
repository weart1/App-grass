import type { ReactNode } from 'react';
import {
  RefreshControl,
  ScrollView,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';

import { useTabBarInset } from '@/components/navigation/useTabBarInset';
import { createStyles, useTheme } from '@/theme';

export interface ScreenProps {
  children: ReactNode;
  /** Wrap content in a ScrollView. */
  scroll?: boolean;
  /** Safe-area edges to pad. Tabs pass ['top']; stack screens with a header pass []. */
  edges?: Edge[];
  /** Apply the standard 20pt horizontal padding. */
  padded?: boolean;
  /** Extra bottom space so content clears the floating tab bar / scan button. */
  tabBarInset?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollProps?: Omit<ScrollViewProps, 'contentContainerStyle' | 'refreshControl'>;
  style?: StyleProp<ViewStyle>;
}

export function Screen({
  children,
  scroll = false,
  edges = ['top'],
  padded = true,
  tabBarInset = false,
  refreshing = false,
  onRefresh,
  contentContainerStyle,
  scrollProps,
  style,
}: ScreenProps) {
  const theme = useTheme();
  const s = useStyles();
  const insets = useSafeAreaInsets();
  const tabBarSpace = useTabBarInset();

  // One resolved padding object: in React Native `paddingLeft: 0` would
  // override a separate `paddingHorizontal`, so the gutter is folded in here.
  const gutter = padded ? theme.layout.screenPaddingX : 0;
  const padding: ViewStyle = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: tabBarInset ? tabBarSpace : edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: gutter + (edges.includes('left') ? insets.left : 0),
    paddingRight: gutter + (edges.includes('right') ? insets.right : 0),
  };

  // Caller styles go on an inner view so their padding adds to the insets
  // instead of being overridden by them.
  const inner = <View style={[s.inner, contentContainerStyle]}>{children}</View>;

  if (scroll) {
    return (
      <ScrollView
        style={[s.root, style]}
        contentContainerStyle={[padding, s.grow]}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primaryStrong}
              colors={[theme.colors.primaryStrong]}
            />
          ) : undefined
        }
        {...scrollProps}
      >
        {inner}
      </ScrollView>
    );
  }

  return <View style={[s.root, padding, style]}>{inner}</View>;
}

const useStyles = createStyles((t) => ({
  root: { flex: 1, backgroundColor: t.colors.bg },
  grow: { flexGrow: 1 },
  inner: { flexGrow: 1, flexShrink: 1, flexBasis: 'auto' },
}));
