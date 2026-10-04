import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { createStyles } from '@/theme';

export interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  /** Right-aligned actions (IconButtons). */
  actions?: ReactNode;
}

/** Large in-content title used by the tab screens ("My Garden", "Community"…). */
export function ScreenHeader({ title, subtitle, actions }: ScreenHeaderProps) {
  const s = useStyles();
  return (
    <View style={s.row}>
      <View style={s.text}>
        <Text variant="h1" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="bodySmall" color="textSecondary" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {actions ? <View style={s.actions}>{actions}</View> : null}
    </View>
  );
}

const useStyles = createStyles((t) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing[3],
    paddingTop: t.spacing[3],
    paddingBottom: t.spacing[4],
  },
  text: { flex: 1, gap: 2 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: t.spacing[1] },
}));
