import { useRouter } from 'expo-router';
import { Bell, Plus, Search } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { EmptyState, IconButton, Screen, ScreenHeader } from '@/components';

/** Community feed — Phase 6 adds the For you / Following feed. */
export default function CommunityScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Screen scroll tabBarInset>
      <ScreenHeader
        title={t('community.title')}
        actions={
          <>
            <IconButton
              icon={Search}
              accessibilityLabel={t('community.searchA11y')}
              onPress={() => router.push('/search')}
            />
            <IconButton
              icon={Bell}
              accessibilityLabel={t('community.notificationsA11y')}
              onPress={() => router.push('/notifications')}
            />
            <IconButton
              icon={Plus}
              variant="filled"
              accessibilityLabel={t('community.createA11y')}
              onPress={() => router.push('/post/new')}
            />
          </>
        }
      />
      <EmptyState
        illustration="community"
        title={t('community.emptyTitle')}
        body={t('community.emptyBody')}
        primaryAction={{
          label: t('community.createCta'),
          icon: Plus,
          onPress: () => router.push('/post/new'),
        }}
      />
    </Screen>
  );
}
