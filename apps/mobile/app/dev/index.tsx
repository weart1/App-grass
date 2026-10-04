import { HealthResponseSchema } from '@leafy/shared';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ChevronRight, LayoutGrid, Route, Server, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge, Button, Card, Screen, Text } from '@/components';
import { API_URL, apiFetch } from '@/lib/api';
import { createStyles, useTheme } from '@/theme';

export default function DevIndexScreen() {
  const s = useStyles();
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const health = useQuery({
    queryKey: ['health'],
    queryFn: ({ signal }) => apiFetch('/health', { schema: HealthResponseSchema, signal }),
    retry: false,
  });

  return (
    <Screen scroll edges={['bottom']} contentContainerStyle={s.content}>
      <DevLink
        icon={LayoutGrid}
        title={t('dev.components')}
        hint={t('dev.componentsHint')}
        onPress={() => router.push('/dev/components')}
      />
      <DevLink
        icon={Route}
        title={t('dev.routes')}
        hint={t('dev.routesHint')}
        onPress={() => router.push('/dev/routes')}
      />
      <Card variant="surface" style={s.api}>
        <View style={s.apiHeader}>
          <Server size={20} color={theme.colors.primaryStrong} />
          <Text variant="h3" style={s.flex}>
            {t('dev.api')}
          </Text>
          <Badge
            dot
            label={t(
              health.isSuccess
                ? 'dev.apiBadge.ok'
                : health.isError
                  ? 'dev.apiBadge.error'
                  : 'dev.apiBadge.pending',
            )}
            tone={health.isSuccess ? 'success' : health.isError ? 'danger' : 'neutral'}
          />
        </View>
        <Text variant="bodySmall" color="textSecondary" selectable>
          {health.isSuccess
            ? t('dev.apiOk', { service: health.data.service, version: health.data.version })
            : health.isError
              ? t('dev.apiError', { url: API_URL, message: health.error.message })
              : t('dev.apiChecking', { url: API_URL })}
        </Text>
        <Button
          label={t('common.actions.retry')}
          size="S"
          variant="secondary"
          loading={health.isFetching}
          onPress={() => void health.refetch()}
        />
      </Card>
    </Screen>
  );
}

function DevLink({
  icon: Icon,
  title,
  hint,
  onPress,
}: {
  icon: LucideIcon;
  title: string;
  hint: string;
  onPress: () => void;
}) {
  const s = useStyles();
  const theme = useTheme();
  return (
    <Card variant="outlined" onPress={onPress} accessibilityLabel={title}>
      <View style={s.linkRow}>
        <View style={s.linkIcon}>
          <Icon size={20} color={theme.colors.primaryStrong} />
        </View>
        <View style={s.flex}>
          <Text variant="h3">{title}</Text>
          <Text variant="bodySmall" color="textSecondary">
            {hint}
          </Text>
        </View>
        <ChevronRight size={20} color={theme.colors.textMuted} />
      </View>
    </Card>
  );
}

const useStyles = createStyles((t) => ({
  content: { paddingTop: t.spacing[4], gap: t.spacing[3] },
  flex: { flex: 1 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: t.spacing[3] },
  linkIcon: {
    width: 40,
    height: 40,
    borderRadius: t.radius.sm,
    backgroundColor: t.colors.primary50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  api: { gap: t.spacing[3] },
  apiHeader: { flexDirection: 'row', alignItems: 'center', gap: t.spacing[2] },
}));
