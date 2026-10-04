import { useRouter } from 'expo-router';
import { History, ScanSearch, Sparkles, X } from 'lucide-react-native';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge, Button, IconButton, Illustration, Screen, Text } from '@/components';
import { createStyles } from '@/theme';

/** Camera screen placeholder — Phase 3 builds the live scanner. */
export default function ScanScreen() {
  const s = useStyles();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={s.topBar}>
        <IconButton
          icon={X}
          variant="tinted"
          accessibilityLabel={t('scan.closeA11y')}
          onPress={() => router.back()}
        />
      </View>
      <View style={s.center}>
        <Illustration name="scan" width={220} />
        <Badge label={t('common.comingInPhase', { phase: 3 })} tone="info" style={s.centered} />
        <Text variant="h1" align="center">
          {t('scan.title')}
        </Text>
        <Text variant="body" color="textSecondary" align="center" style={s.body}>
          {t('scan.body')}
        </Text>
      </View>
      <View style={s.actions}>
        <Button
          label={t('scan.previewProcessing')}
          leftIcon={Sparkles}
          fullWidth
          onPress={() => router.push('/scan/processing')}
        />
        <Button
          label={t('scan.previewResult')}
          leftIcon={ScanSearch}
          variant="secondary"
          fullWidth
          onPress={() => router.push('/scan/result/demo-scan')}
        />
        <Button
          label={t('scan.history')}
          leftIcon={History}
          variant="ghost"
          fullWidth
          onPress={() => router.push('/scan/history')}
        />
      </View>
    </Screen>
  );
}

const useStyles = createStyles((t) => ({
  topBar: { flexDirection: 'row', paddingVertical: t.spacing[2] },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: t.spacing[3] },
  body: { maxWidth: 340 },
  centered: { alignSelf: 'center' },
  actions: { gap: t.spacing[3], paddingBottom: t.spacing[4] },
}));
