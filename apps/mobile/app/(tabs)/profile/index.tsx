import { useRouter } from 'expo-router';
import { ChevronRight, Code, LogIn, Settings } from 'lucide-react-native';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { APP_NAME } from '@leafy/shared';

import { Avatar, Button, Card, IconButton, Screen, ScreenHeader, Text } from '@/components';
import { createStyles, useTheme } from '@/theme';

/** Profile — Phase 7 builds the real profile; Phase 2 adds sign-in. */
export default function ProfileScreen() {
  const s = useStyles();
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Screen scroll tabBarInset>
      <ScreenHeader
        title={t('profile.title')}
        actions={
          <IconButton
            icon={Settings}
            accessibilityLabel={t('profile.settingsA11y')}
            onPress={() => router.push('/settings')}
          />
        }
      />
      <Card variant="surface" padding={5} style={s.guest}>
        <Avatar name={APP_NAME} size="xl" />
        <Text variant="h2" align="center">
          {t('profile.guestName')}
        </Text>
        <Text variant="body" color="textSecondary" align="center">
          {t('profile.guestBody')}
        </Text>
        <Button
          label={t('profile.signInCta')}
          leftIcon={LogIn}
          onPress={() => router.push('/sign-in')}
          style={s.centered}
        />
      </Card>

      {__DEV__ ? (
        <Card
          variant="outlined"
          onPress={() => router.push('/dev')}
          accessibilityLabel={t('profile.devMenu')}
          style={s.devCard}
        >
          <View style={s.devRow}>
            <View style={s.devIcon}>
              <Code size={20} color={theme.colors.primaryStrong} />
            </View>
            <View style={s.devText}>
              <Text variant="h3">{t('profile.devMenu')}</Text>
              <Text variant="bodySmall" color="textSecondary">
                {t('profile.devMenuHint')}
              </Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textMuted} />
          </View>
        </Card>
      ) : null}
    </Screen>
  );
}

const useStyles = createStyles((t) => ({
  guest: { alignItems: 'center', gap: t.spacing[3] },
  centered: { alignSelf: 'center' },
  devCard: { marginTop: t.spacing[5] },
  devRow: { flexDirection: 'row', alignItems: 'center', gap: t.spacing[3] },
  devIcon: {
    width: 40,
    height: 40,
    borderRadius: t.radius.sm,
    backgroundColor: t.colors.primary50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  devText: { flex: 1, gap: 2 },
}));
