import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge, CareTaskRow, Divider, EmptyState, Screen, ScreenHeader, Text } from '@/components';
import { useDemoCareStore } from '@/features/care/demoCareStore';
import { createStyles } from '@/theme';

/**
 * Care — Phase 1 renders demo tasks (shared with the tab badge) so the row
 * interaction and "All caught up" state can be reviewed. The real calendar,
 * week strip, swipe actions and snooze arrive in Phase 5.
 */
export default function CareScreen() {
  const s = useStyles();
  const router = useRouter();
  const { t } = useTranslation();
  const tasks = useDemoCareStore((st) => st.tasks);
  const toggle = useDemoCareStore((st) => st.toggle);
  const reset = useDemoCareStore((st) => st.reset);
  const allDone = tasks.every((task) => task.done);

  return (
    <Screen scroll tabBarInset onRefresh={reset}>
      <ScreenHeader title={t('care.title')} subtitle={t('care.subtitle')} />
      {allDone ? (
        <EmptyState
          illustration="calendar"
          title={t('care.emptyTitle')}
          body={t('care.emptyBody')}
          primaryAction={{
            label: t('care.addPlantCta'),
            icon: Plus,
            onPress: () => router.push('/plant/new'),
          }}
        />
      ) : (
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text variant="h3">{t('care.today')}</Text>
            <Badge label={t('common.comingInPhase', { phase: 5 })} tone="info" size="S" />
          </View>
          {tasks.map((task, i) => (
            <View key={task.id}>
              {i > 0 ? <Divider inset={60} /> : null}
              <CareTaskRow
                taskType={task.taskType}
                plantName={task.plantName}
                subtitle={task.space}
                due={{ kind: 'today' }}
                done={task.done}
                onToggleDone={(next) => toggle(task.id, next)}
              />
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}

const useStyles = createStyles((t) => ({
  section: { gap: t.spacing[1] },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: t.spacing[2],
  },
}));
