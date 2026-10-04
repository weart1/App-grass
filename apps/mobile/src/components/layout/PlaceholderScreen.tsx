import { Stack, useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Illustration, type IllustrationName } from '@/components/ui/Illustration';
import { Text } from '@/components/ui/Text';
import { PLACEHOLDER_ROUTES, type PlaceholderRouteKey } from '@/navigation/routeRegistry';
import { createStyles } from '@/theme';

import { Screen } from './Screen';

export interface PlaceholderScreenProps {
  route: PlaceholderRouteKey;
  /** Route params to echo back (useful to verify dynamic routes). */
  params?: Record<string, string | string[] | undefined>;
  illustration?: IllustrationName;
  /** Presented modally: shows a Close button. */
  modal?: boolean;
  /** Hide the native header (e.g. onboarding/auth screens). */
  headerShown?: boolean;
  children?: ReactNode;
}

/**
 * Phase 1 stand-in for every not-yet-built route. Uses the real design system
 * so navigation, headers and spacing can be reviewed end-to-end.
 */
export function PlaceholderScreen({
  route,
  params,
  illustration = 'sprout',
  modal,
  headerShown = true,
  children,
}: PlaceholderScreenProps) {
  const s = useStyles();
  const router = useRouter();
  const { t } = useTranslation();
  const { phase } = PLACEHOLDER_ROUTES[route];
  const title = t(`routes.${route}.title`);
  const paramEntries = Object.entries(params ?? {}).filter(([, v]) => v !== undefined);

  return (
    <>
      <Stack.Screen options={{ title, headerShown }} />
      <Screen
        scroll
        edges={headerShown ? ['bottom'] : ['top', 'bottom']}
        contentContainerStyle={s.content}
      >
        <View style={s.center}>
          <Illustration name={illustration} width={180} />
          <Badge label={t('common.comingInPhase', { phase })} tone="info" style={s.centered} />
          <Text variant="h1" align="center">
            {title}
          </Text>
          <Text variant="body" color="textSecondary" align="center" style={s.body}>
            {t(`routes.${route}.body`)}
          </Text>
          {paramEntries.length > 0 ? (
            <View style={s.params}>
              {paramEntries.map(([name, value]) => (
                <Text key={name} variant="bodySmall" color="textSecondary">
                  {t('routes.param', { name, value: String(value) })}
                </Text>
              ))}
            </View>
          ) : null}
        </View>
        <View style={s.actions}>
          {children}
          {modal || !headerShown ? (
            <Button
              label={t('common.actions.close')}
              variant="ghost"
              fullWidth
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/garden'))}
            />
          ) : null}
        </View>
      </Screen>
    </>
  );
}

const useStyles = createStyles((t) => ({
  content: { justifyContent: 'space-between', paddingVertical: t.spacing[8], gap: t.spacing[6] },
  center: { alignItems: 'center', gap: t.spacing[3] },
  body: { maxWidth: 340 },
  centered: { alignSelf: 'center' },
  params: {
    marginTop: t.spacing[2],
    paddingHorizontal: t.spacing[4],
    paddingVertical: t.spacing[3],
    borderRadius: t.radius.md,
    backgroundColor: t.colors.surface,
    gap: t.spacing[1],
  },
  actions: { gap: t.spacing[3] },
}));
