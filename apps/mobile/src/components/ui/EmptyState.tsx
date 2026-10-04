import type { LucideIcon } from 'lucide-react-native';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';

import { createStyles } from '@/theme';

import { Button } from './Button';
import { Illustration, type IllustrationName } from './Illustration';
import { Text } from './Text';

export interface EmptyStateAction {
  label: string;
  onPress: () => void;
  icon?: LucideIcon;
}

export interface EmptyStateProps {
  illustration?: IllustrationName;
  title: string;
  body?: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({
  illustration = 'sprout',
  title,
  body,
  primaryAction,
  secondaryAction,
  compact,
  style,
}: EmptyStateProps) {
  const s = useStyles();
  return (
    <View style={[s.container, compact ? s.compact : null, style]}>
      <Illustration name={illustration} width={compact ? 140 : 200} />
      <View style={s.text}>
        <Text variant="h2" align="center">
          {title}
        </Text>
        {body ? (
          <Text variant="body" color="textSecondary" align="center">
            {body}
          </Text>
        ) : null}
      </View>
      {primaryAction || secondaryAction ? (
        <View style={s.actions}>
          {primaryAction ? (
            <Button
              label={primaryAction.label}
              leftIcon={primaryAction.icon}
              onPress={primaryAction.onPress}
              fullWidth
            />
          ) : null}
          {secondaryAction ? (
            <Button
              label={secondaryAction.label}
              leftIcon={secondaryAction.icon}
              onPress={secondaryAction.onPress}
              variant="secondary"
              fullWidth
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export interface ErrorStateProps {
  title?: string;
  body?: string;
  onRetry?: () => void;
  offline?: boolean;
  compact?: boolean;
}

/** Standard error with retry, used by every data-driven screen. */
export function ErrorState({ title, body, onRetry, offline, compact }: ErrorStateProps) {
  const { t } = useTranslation();
  return (
    <EmptyState
      illustration={offline ? 'offline' : 'error'}
      title={title ?? t('common.error.title')}
      body={body ?? (offline ? t('common.offline') : t('common.error.body'))}
      primaryAction={onRetry ? { label: t('common.actions.retry'), onPress: onRetry } : undefined}
      compact={compact}
    />
  );
}

const useStyles = createStyles((t) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.spacing[5],
    paddingHorizontal: t.spacing[6],
    paddingVertical: t.spacing[10],
  },
  compact: { paddingVertical: t.spacing[6], gap: t.spacing[4] },
  text: { gap: t.spacing[2], maxWidth: 320 },
  actions: {
    alignSelf: 'stretch',
    gap: t.spacing[3],
    maxWidth: 320,
    width: '100%',
    marginHorizontal: 'auto',
  },
}));
