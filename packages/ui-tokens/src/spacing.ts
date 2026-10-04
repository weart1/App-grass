/** 4-pt spacing scale. `spacing[4]` = 16. */
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
} as const;

export type SpacingToken = keyof typeof spacing;

export const radius = {
  xs: 6,
  sm: 10,
  md: 16, // cards, inputs
  lg: 24, // sheets, big cards
  full: 999, // chips, avatars, scan button
} as const;

export type RadiusToken = keyof typeof radius;

export const layout = {
  screenPaddingX: spacing[5],
  /** Minimum touch target (iOS HIG / Material): 44×44. */
  minTouchTarget: 44,
  tabBarHeight: 64,
  scanButtonSize: 66,
  /** How far the scan button rises above the top edge of the tab bar. */
  scanButtonLift: 20,
  scanButtonRing: 4,
  /** Feed media aspect ratio (4:5 portrait). */
  postMediaAspect: 4 / 5,
} as const;
