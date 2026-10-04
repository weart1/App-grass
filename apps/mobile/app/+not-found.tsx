import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { EmptyState, Screen } from '@/components';

export default function NotFoundScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <>
      <Stack.Screen options={{ title: t('routes.notFound.title') }} />
      <Screen edges={['bottom']} contentContainerStyle={{ justifyContent: 'center' }}>
        <EmptyState
          illustration="search"
          title={t('routes.notFound.title')}
          body={t('routes.notFound.body')}
          primaryAction={{
            label: t('routes.notFound.cta'),
            onPress: () => router.replace('/garden'),
          }}
        />
      </Screen>
    </>
  );
}
