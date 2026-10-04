import { useRouter, type Href } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Fragment } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge, Divider, Screen, Text } from '@/components';
import { PLACEHOLDER_ROUTES, type PlaceholderRouteKey } from '@/navigation/routeRegistry';
import { createStyles, useTheme } from '@/theme';

const TAB_ROUTES: {
  href: Href;
  label: 'tabs.garden' | 'tabs.community' | 'tabs.care' | 'tabs.profile' | 'tabs.scan';
}[] = [
  { href: '/garden', label: 'tabs.garden' },
  { href: '/community', label: 'tabs.community' },
  { href: '/scan', label: 'tabs.scan' },
  { href: '/care', label: 'tabs.care' },
  { href: '/profile', label: 'tabs.profile' },
];

export default function DevRoutesScreen() {
  const s = useStyles();
  const { t } = useTranslation();

  const byPhase = new Map<number, PlaceholderRouteKey[]>();
  (Object.keys(PLACEHOLDER_ROUTES) as PlaceholderRouteKey[]).forEach((key) => {
    const { phase } = PLACEHOLDER_ROUTES[key];
    byPhase.set(phase, [...(byPhase.get(phase) ?? []), key]);
  });

  return (
    <Screen scroll edges={['bottom']} contentContainerStyle={s.content}>
      <Text variant="h3" style={s.group}>
        {t('dev.sample.tabs')}
      </Text>
      {TAB_ROUTES.map((r, i) => (
        <Fragment key={String(r.href)}>
          {i > 0 ? <Divider /> : null}
          <RouteRow label={t(r.label)} href={r.href} />
        </Fragment>
      ))}
      {[...byPhase.entries()].map(([phase, keys]) => (
        <View key={phase}>
          <View style={s.groupRow}>
            <Badge label={t('dev.sample.routeGroups', { phase })} tone="info" />
          </View>
          {keys.map((key, i) => (
            <Fragment key={key}>
              {i > 0 ? <Divider /> : null}
              <RouteRow label={t(`routes.${key}.title`)} href={PLACEHOLDER_ROUTES[key].href} />
            </Fragment>
          ))}
        </View>
      ))}
      <View style={s.groupRow} />
      <RouteRow label={t('dev.sample.notFound')} href={'/this-route-does-not-exist' as Href} />
    </Screen>
  );
}

function RouteRow({ label, href, meta }: { label: string; href: Href; meta?: string }) {
  const s = useStyles();
  const theme = useTheme();
  const router = useRouter();
  return (
    <Pressable
      accessibilityRole="link"
      onPress={() => router.push(href)}
      style={({ pressed }) => [s.row, pressed ? s.pressed : null]}
    >
      <View style={s.flex}>
        <Text variant="body">{label}</Text>
        <Text variant="caption" color="textMuted">
          {meta ?? String(href)}
        </Text>
      </View>
      <ChevronRight size={18} color={theme.colors.textMuted} />
    </Pressable>
  );
}

const useStyles = createStyles((t) => ({
  content: { paddingTop: t.spacing[2] },
  group: { marginTop: t.spacing[4], marginBottom: t.spacing[1] },
  groupRow: { marginTop: t.spacing[6], marginBottom: t.spacing[2], flexDirection: 'row' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing[3],
    minHeight: 56,
    paddingVertical: t.spacing[2],
  },
  pressed: { opacity: 0.6 },
  flex: { flex: 1 },
}));
