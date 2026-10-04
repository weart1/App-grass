import { Tabs } from 'expo-router/tabs';
import { useTranslation } from 'react-i18next';

import { TabBar } from '@/components';
import { useTheme } from '@/theme';

export default function TabsLayout() {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: theme.colors.bg } }}
    >
      <Tabs.Screen name="garden/index" options={{ title: t('tabs.garden') }} />
      <Tabs.Screen name="community/index" options={{ title: t('tabs.community') }} />
      <Tabs.Screen name="care/index" options={{ title: t('tabs.care') }} />
      <Tabs.Screen name="profile/index" options={{ title: t('tabs.profile') }} />
    </Tabs>
  );
}
