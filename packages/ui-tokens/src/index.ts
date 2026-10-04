import { dangerScale, gradients, illustration, lightColors, type Colors } from './colors';
import { motion } from './motion';
import { shadows } from './shadows';
import { layout, radius, spacing } from './spacing';
import { fontFamily, maxFontScale, typography } from './typography';

export * from './colors';
export * from './contrast';
export * from './motion';
export * from './shadows';
export * from './spacing';
export * from './typography';

export interface Theme {
  name: 'light';
  colors: Colors;
  gradients: typeof gradients;
  dangerScale: typeof dangerScale;
  illustration: typeof illustration;
  typography: typeof typography;
  fontFamily: typeof fontFamily;
  maxFontScale: number;
  spacing: typeof spacing;
  radius: typeof radius;
  shadows: typeof shadows;
  layout: typeof layout;
  motion: typeof motion;
}

export const lightTheme: Theme = {
  name: 'light',
  colors: lightColors,
  gradients,
  dangerScale,
  illustration,
  typography,
  fontFamily,
  maxFontScale,
  spacing,
  radius,
  shadows,
  layout,
  motion,
};
