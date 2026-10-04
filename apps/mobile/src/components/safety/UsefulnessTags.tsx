import type { UsefulnessTag } from '@leafy/shared';
import {
  Flower2,
  Handshake,
  HeartPulse,
  Sparkles,
  Utensils,
  Wind,
  Bug,
  type LucideIcon,
} from 'lucide-react-native';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Chip } from '@/components/ui/Chip';
import { createStyles } from '@/theme';

export const USEFULNESS_ICONS: Record<UsefulnessTag, LucideIcon> = {
  edible: Utensils,
  medicinal: HeartPulse,
  decorative: Flower2,
  air_purifying: Wind,
  pollinator_friendly: Bug,
  aromatic: Sparkles,
  companion: Handshake,
};

export interface UsefulnessTagsProps {
  tags: readonly UsefulnessTag[];
  onPressTag?: (tag: UsefulnessTag) => void;
  style?: StyleProp<ViewStyle>;
}

export function UsefulnessTags({ tags, onPressTag, style }: UsefulnessTagsProps) {
  const s = useStyles();
  const { t } = useTranslation();
  return (
    <View style={[s.wrap, style]}>
      {tags.map((tag) => (
        <Chip
          key={tag}
          label={t(`components.usefulness.${tag}`)}
          icon={USEFULNESS_ICONS[tag]}
          selected
          size="S"
          onPress={onPressTag ? () => onPressTag(tag) : undefined}
        />
      ))}
    </View>
  );
}

const useStyles = createStyles((t) => ({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing[2] },
}));
