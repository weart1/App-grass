import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

export function Divider({ inset = 0, style }: { inset?: number; style?: StyleProp<ViewStyle> }) {
  const theme = useTheme();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[{ height: 1, backgroundColor: theme.colors.border, marginLeft: inset }, style]}
    />
  );
}
