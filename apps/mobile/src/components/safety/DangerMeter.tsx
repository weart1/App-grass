import { SAFETY_LEVELS, type SafetyLevel } from '@leafy/shared';
import type { ColorToken } from '@leafy/ui-tokens';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui/Text';
import { createStyles, useTheme } from '@/theme';

export const SAFETY_TEXT_COLOR: Record<SafetyLevel, ColorToken> = {
  safe: 'primaryStrong',
  low: 'primaryStrong',
  moderate: 'warningStrong',
  high: 'dangerStrong',
  severe: 'dangerStrong',
};

export interface DangerMeterProps {
  level: SafetyLevel;
  /** Show the "Danger level" caption and level name. */
  showLabel?: boolean;
  size?: 'M' | 'S';
  style?: StyleProp<ViewStyle>;
}

/** 5-segment scale from green (safe) to red (severe). */
export function DangerMeter({ level, showLabel = true, size = 'M', style }: DangerMeterProps) {
  const theme = useTheme();
  const s = useStyles();
  const { t } = useTranslation();
  const index = SAFETY_LEVELS.indexOf(level);
  const total = SAFETY_LEVELS.length;
  const levelLabel = t(`components.safety.${level}`);
  const activeColor = theme.dangerScale[index] ?? theme.colors.danger;

  return (
    <View
      style={[s.container, style]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={t('components.dangerMeter.a11y', {
        level: levelLabel,
        position: index + 1,
        total,
      })}
    >
      {showLabel ? (
        <View style={s.labelRow}>
          <Text variant="caption" color="textSecondary">
            {t('components.dangerMeter.label')}
          </Text>
          <Text variant={size === 'S' ? 'caption' : 'h3'} color={SAFETY_TEXT_COLOR[level]}>
            {levelLabel}
          </Text>
        </View>
      ) : null}
      <View style={s.segments}>
        {SAFETY_LEVELS.map((lvl, i) => (
          <View
            key={lvl}
            style={[
              s.segment,
              size === 'S' ? s.segmentSmall : null,
              { backgroundColor: i <= index ? activeColor : theme.colors.surfaceAlt },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const useStyles = createStyles((t) => ({
  container: { gap: t.spacing[2] },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  segments: { flexDirection: 'row', gap: t.spacing[1] },
  segment: { flex: 1, height: 10, borderRadius: t.radius.full },
  segmentSmall: { height: 6 },
}));
