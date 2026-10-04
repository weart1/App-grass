import { Modal, Pressable, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { createStyles } from '@/theme';

import { Button } from './Button';
import { Text } from './Text';

export interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  destructive,
  loading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const s = useStyles();
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  return (
    <Modal
      visible={visible}
      transparent
      animationType={reduceMotion ? 'none' : 'fade'}
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onCancel}
    >
      <View style={s.root}>
        <Pressable
          style={s.scrim}
          onPress={onCancel}
          accessibilityRole="button"
          accessibilityLabel={cancelLabel ?? t('common.actions.cancel')}
        />
        <View style={s.card} accessibilityViewIsModal accessibilityRole="alert">
          <Text variant="h2" align="center">
            {title}
          </Text>
          {message ? (
            <Text variant="body" color="textSecondary" align="center">
              {message}
            </Text>
          ) : null}
          <View style={s.actions}>
            <Button
              label={confirmLabel ?? t('common.actions.confirm')}
              variant={destructive ? 'destructive' : 'primary'}
              loading={loading}
              fullWidth
              onPress={onConfirm}
            />
            <Button
              label={cancelLabel ?? t('common.actions.cancel')}
              variant="ghost"
              fullWidth
              disabled={loading}
              onPress={onCancel}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const useStyles = createStyles((t) => ({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: t.spacing[6] },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: t.colors.overlay,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    gap: t.spacing[3],
    padding: t.spacing[6],
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.bg,
    boxShadow: t.shadows.elevated,
  },
  actions: { gap: t.spacing[2], marginTop: t.spacing[3] },
}));
