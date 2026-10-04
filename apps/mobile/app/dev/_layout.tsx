import { Redirect, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useStackScreenOptions } from '@/navigation/useStackScreenOptions';

/** Developer-only screens. Unreachable in production builds. */
export default function DevLayout() {
  const screenOptions = useStackScreenOptions();
  const { t } = useTranslation();
  if (!__DEV__) return <Redirect href="/garden" />;
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ title: t('dev.title') }} />
      <Stack.Screen name="components" options={{ title: t('dev.components') }} />
      <Stack.Screen name="routes" options={{ title: t('dev.routes') }} />
    </Stack>
  );
}
