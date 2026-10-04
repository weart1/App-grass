import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useTheme } from '@/theme';

export interface LogoProps {
  size?: number;
  /** Color of the viewfinder + leaf. Defaults to brand `primary`. */
  color?: string;
  /** Leaf vein color. Defaults to white. */
  accentColor?: string;
}

/** Leafy mark: a leaf inside a rounded viewfinder. */
export function Logo({ size = 64, color, accentColor }: LogoProps) {
  const theme = useTheme();
  const c = color ?? theme.colors.primary;
  const vein = accentColor ?? theme.colors.white;
  return (
    // Decorative: hidden from screen readers (props live on a View, which every platform supports).
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Svg width={size} height={size} viewBox="0 0 64 64">
        <Path
          d="M6 21V14a8 8 0 0 1 8-8h7M43 6h7a8 8 0 0 1 8 8v7M58 43v7a8 8 0 0 1-8 8h-7M21 58h-7a8 8 0 0 1-8-8v-7"
          stroke={c}
          strokeWidth={4.5}
          strokeLinecap="round"
          fill="none"
        />
        <Path d="M20 44C20 29 30 20 45 19c0 15-9 25-25 25z" fill={c} />
        <Path d="M24.5 39.5l10.5-10.5" stroke={vein} strokeWidth={2.6} strokeLinecap="round" />
        <Path d="M20 44l-3 3" stroke={c} strokeWidth={3} strokeLinecap="round" />
      </Svg>
    </View>
  );
}
