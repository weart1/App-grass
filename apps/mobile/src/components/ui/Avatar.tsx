import { Image } from 'expo-image';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { initials } from '@/lib/format';
import { createStyles, useTheme } from '@/theme';

import { Text } from './Text';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE: Record<AvatarSize, number> = { xs: 24, sm: 32, md: 40, lg: 56, xl: 88 };

export interface AvatarProps {
  name: string;
  uri?: string | null;
  size?: AvatarSize;
  /** Adds a white ring (e.g. when overlapping other avatars). */
  ring?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Photo avatar with an initials fallback on `primary100`. */
export function Avatar({ name, uri, size = 'md', ring, style }: AvatarProps) {
  const theme = useTheme();
  const s = useStyles();
  const d = SIZE[size];
  const fontSize = Math.round(d * 0.38);

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={name}
      style={[s.base, { width: d, height: d }, ring ? s.ring : null, style]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={s.image}
          contentFit="cover"
          transition={theme.motion.duration.fast}
          accessible={false}
        />
      ) : (
        <Text
          variant="button"
          color="primaryDeep"
          style={{ fontSize, lineHeight: Math.round(fontSize * 1.2) }}
          accessible={false}
        >
          {initials(name)}
        </Text>
      )}
    </View>
  );
}

const useStyles = createStyles((t) => ({
  base: {
    borderRadius: t.radius.full,
    backgroundColor: t.colors.primary100,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ring: { borderWidth: 2, borderColor: t.colors.bg },
  image: { width: '100%', height: '100%' },
}));
