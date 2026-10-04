import type { BottomTabBarProps } from 'expo-router/tabs';
import { useRouter } from 'expo-router';
import { CalendarCheck, Sprout, UserRound, Users, type LucideIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { ParseKeys } from 'i18next';

import { Text } from '@/components/ui/Text';
import { useCareDueTodayCount } from '@/features/care/useCareDueTodayCount';
import { haptics } from '@/lib/haptics';
import { createStyles, useTheme } from '@/theme';

import { ScanButton } from './ScanButton';

/** Tab route name (from app/(tabs)) → icon + label. Order = left to right. */
export const TAB_CONFIG: Record<string, { icon: LucideIcon; label: ParseKeys }> = {
  'garden/index': { icon: Sprout, label: 'tabs.garden' },
  'community/index': { icon: Users, label: 'tabs.community' },
  'care/index': { icon: CalendarCheck, label: 'tabs.care' },
  'profile/index': { icon: UserRound, label: 'tabs.profile' },
};

/**
 * Custom tab bar: [Garden] [Community] (SCAN) [Care] [Profile].
 *
 * The bar floats over content and its container includes the area the scan
 * button rises into, so the raised part stays tappable on Android (which
 * ignores touches outside a parent's bounds). Empty space passes touches
 * through (`box-none`).
 */
export function TabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  const theme = useTheme();
  const s = useStyles();
  const router = useRouter();
  const { t } = useTranslation();
  const careDue = useCareDueTodayCount();

  const routes = state.routes.filter((r) => r.name in TAB_CONFIG);
  const mid = Math.ceil(routes.length / 2);

  const renderTab = (route: (typeof routes)[number]) => {
    const config = TAB_CONFIG[route.name];
    if (!config) return null;
    const focused = state.routes[state.index]?.key === route.key;
    const Icon = config.icon;
    const label = t(config.label);
    const badge = route.name === 'care/index' && careDue > 0 ? careDue : 0;
    const color = focused ? theme.colors.primaryStrong : theme.colors.textMuted;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      if (!focused && !event.defaultPrevented) {
        haptics.selection();
        navigation.navigate(route.name, route.params);
      }
    };

    return (
      <Pressable
        key={route.key}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={badge ? `${label}, ${t('tabs.careBadge', { count: badge })}` : label}
        testID={descriptors[route.key]?.options.tabBarButtonTestID}
        onPress={onPress}
        onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
        style={s.tab}
      >
        <View style={[s.pill, focused ? s.pillActive : null]}>
          <Icon size={22} color={color} strokeWidth={focused ? 2.4 : 2} />
          {badge ? (
            <View style={s.badge}>
              <Text
                variant="caption"
                color="onPrimary"
                style={s.badgeText}
                maxFontSizeMultiplier={1}
              >
                {badge > 9 ? '9+' : badge}
              </Text>
            </View>
          ) : null}
        </View>
        <Text
          variant="caption"
          numberOfLines={1}
          maxFontSizeMultiplier={1.15}
          style={[s.label, { color }, focused ? s.labelActive : null]}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      style={[
        s.container,
        { height: theme.layout.scanButtonLift + theme.layout.tabBarHeight + insets.bottom },
      ]}
    >
      <View style={[s.bar, { paddingBottom: insets.bottom }]} accessibilityRole="tablist">
        {routes.slice(0, mid).map(renderTab)}
        <View style={s.centerSlot} />
        {routes.slice(mid).map(renderTab)}
      </View>
      <View style={s.scanSlot}>
        <ScanButton onPress={() => router.push('/scan')} />
      </View>
    </View>
  );
}

const useStyles = createStyles((t) => {
  const outer = t.layout.scanButtonSize + t.layout.scanButtonRing * 2;
  return {
    // `box-none`: empty space above the bar passes touches to the screen.
    container: { position: 'absolute', left: 0, right: 0, bottom: 0, pointerEvents: 'box-none' },
    bar: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      top: t.layout.scanButtonLift,
      flexDirection: 'row',
      backgroundColor: t.colors.bg,
      borderTopWidth: 1,
      borderTopColor: t.colors.border,
      boxShadow: t.shadows.tabBar,
    },
    tab: {
      flex: 1,
      height: t.layout.tabBarHeight,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
    },
    pill: {
      width: 56,
      height: 30,
      borderRadius: t.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pillActive: { backgroundColor: t.colors.primary50 },
    label: { fontSize: 11, lineHeight: 14 },
    labelActive: { fontFamily: t.fontFamily.semibold },
    centerSlot: { width: outer + t.spacing[2] },
    scanSlot: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      alignItems: 'center',
      pointerEvents: 'box-none',
    },
    badge: {
      position: 'absolute',
      top: -2,
      right: 6,
      minWidth: 18,
      height: 18,
      paddingHorizontal: 4,
      borderRadius: t.radius.full,
      backgroundColor: t.colors.primaryStrong,
      borderWidth: 2,
      borderColor: t.colors.bg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: { fontSize: 10, lineHeight: 12 },
  };
});
