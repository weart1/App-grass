/**
 * Leafy color palette — "morning greenhouse": white + light green.
 *
 * Values marked [spec] come straight from SPEC §3.2. Values marked [a11y] were
 * added or adjusted so every text/background pair meets WCAG AA (4.5:1).
 * The reasoning lives in DECISIONS.md (D-007) and is enforced by
 * `contrast.test.ts`.
 *
 * Usage rules:
 * - `primary` is for icons and large shapes only — never small text.
 * - `danger` / `warning` / `info` are for icons, fills, meters and borders.
 *   Text in those hues uses the matching `*Strong` token.
 */
export const palette = {
  white: '#FFFFFF',
  black: '#000000',

  // Greens
  primary50: '#EEF9EC', // [spec] tab-bar active pill, banners
  primary100: '#D4F0CE', // [spec] tags, progress track
  primary300: '#A6DE9B', // [spec] active borders, illustrations
  primary: '#6CC55C', // [spec] brand light green — icons, accents, progress fill
  primaryStrong: '#2A7F33', // [a11y] spec #2F8F3A measured 4.11:1 on white; darkened to 5.02:1
  primaryDeep: '#1E5E27', // [spec] pressed states, headings on green surfaces

  // Neutrals
  bg: '#FFFFFF', // [spec]
  surface: '#F5FBF3', // [spec] cards, inputs, sheets
  surfaceAlt: '#EAF6E6', // [spec] selected chips, section backgrounds, skeletons
  textPrimary: '#1C2B1F', // [spec]
  textSecondary: '#5B6B5E', // [spec]
  textMuted: '#677769', // [a11y] spec #98A69A measured 2.54:1; darkened to 4.75:1 (placeholders, timestamps)
  textDisabled: '#98A69A', // [a11y] the original spec muted value, kept for disabled/decorative use only
  border: '#E2ECDF', // [spec]

  // Status
  danger: '#E5484D', // [spec] icons/fills: "highly toxic", destructive
  dangerStrong: '#D61E24', // [a11y] text & filled destructive buttons (5.16:1 on white)
  dangerBg: '#FDECEC', // [spec]
  warning: '#F2A93B', // [spec] icons/fills: "mildly toxic / caution"
  warningStrong: '#9E630A', // [a11y] text on white/warningBg (4.95:1 on white)
  warningBg: '#FEF4E4', // [spec]
  info: '#3D9BD6', // [spec] water-drop icons, info accents
  infoStrong: '#2374A7', // [a11y] text on white/infoBg (5.09:1 on white)
  infoBg: '#E8F4FB', // [spec]
  sun: '#F5C542', // [spec] sunlight indicators
} as const;

export type PaletteColor = keyof typeof palette;

/** Semantic aliases used by components. Add dark-mode values here later. */
export const lightColors = {
  ...palette,
  onPrimary: palette.white, // text/icons on primaryStrong fills
  onDanger: palette.white,
  link: palette.primaryStrong,
  focusRing: palette.primary300,
  overlay: 'rgba(28, 43, 31, 0.45)', // modal / dialog scrim (textPrimary @ 45%)
  cameraScrim: 'rgba(0, 0, 0, 0.45)', // translucent dark bar over the camera preview
  skeleton: palette.surfaceAlt,
  skeletonHighlight: palette.primary50,
  transparent: 'transparent',
} as const;

export type ColorToken = keyof typeof lightColors;
export type Colors = { readonly [K in ColorToken]: string };

export const gradients = {
  /** Scan button and onboarding hero (top-left → bottom-right). */
  brand: {
    colors: ['#8BD97C', '#4FB04A'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  /** Camera top bar: dark → transparent so icons stay readable on any preview. */
  cameraTop: {
    colors: ['rgba(0,0,0,0.55)', 'rgba(0,0,0,0)'] as const,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
} as const;

/** Extra hues used only inside illustrations (never for UI text or controls). */
export const illustration = {
  clay: '#F2D3B5',
  clayDeep: '#DDAA82',
  soil: '#8F6E52',
  sky: '#E8F4FB',
} as const;

/** DangerMeter segment colors, safe → severe. */
export const dangerScale = [
  palette.primary,
  '#B9D85A',
  palette.warning,
  '#EE7A3F',
  palette.danger,
] as const;
