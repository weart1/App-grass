/**
 * Soft, green-tinted shadows (rgb of primaryStrong from the spec, #2F8F3A).
 * Expressed as CSS `boxShadow` strings, supported natively by React Native's
 * New Architecture on iOS, Android and web.
 */
export const shadows = {
  none: 'none',
  soft: '0px 4px 16px rgba(47, 143, 58, 0.08)',
  elevated: '0px 8px 24px rgba(47, 143, 58, 0.18)',
  /** Tab bar casts its shadow upward. */
  tabBar: '0px -4px 24px rgba(47, 143, 58, 0.10)',
} as const;

export type ShadowToken = keyof typeof shadows;
