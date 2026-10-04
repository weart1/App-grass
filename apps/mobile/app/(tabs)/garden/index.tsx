import { useRouter } from 'expo-router';
import { Plus, ScanLine, Search } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { EmptyState, IconButton, Screen, ScreenHeader } from '@/components';

/** My Garden — Phase 1 shows the real empty state; the grid arrives in Phase 4. */
export default function GardenScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Screen scroll tabBarInset>
      <ScreenHeader
        title={t('garden.title')}
        subtitle={t('garden.subtitleEmpty')}
        actions={
          <>
            <IconButton
              icon={Search}
              variant="tinted"
              accessibilityLabel={t('garden.searchA11y')}
              onPress={() => router.push('/search')}
            />
            <IconButton
              icon={Plus}
              variant="filled"
              accessibilityLabel={t('garden.addA11y')}
              onPress={() => router.push('/plant/new')}
            />
          </>
        }
      />
      <EmptyState
        illustration="pot"
        title={t('garden.emptyTitle')}
        body={t('garden.emptyBody')}
        primaryAction={{
          label: t('garden.scanCta'),
          icon: ScanLine,
          onPress: () => router.push('/scan'),
        }}
        secondaryAction={{
          label: t('garden.addCta'),
          icon: Plus,
          onPress: () => router.push('/plant/new'),
        }}
      />
    </Screen>
  );
}
