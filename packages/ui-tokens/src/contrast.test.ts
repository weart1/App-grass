import { describe, expect, it } from 'vitest';

import { lightColors as c, palette } from './colors';
import { WCAG_AA_TEXT, contrastRatio } from './contrast';

type Pair = [fg: keyof typeof c, bg: keyof typeof c, min: number, usage: string];

/**
 * Every text/background combination the component library uses. If you add a
 * new combination in a component, add it here too.
 */
const pairs: Pair[] = [
  // Body text on every light surface
  ...(['bg', 'surface', 'surfaceAlt', 'primary50'] as const).flatMap((bg): Pair[] => [
    ['textPrimary', bg, WCAG_AA_TEXT, 'body text'],
    ['textSecondary', bg, WCAG_AA_TEXT, 'secondary text'],
    ['primaryStrong', bg, WCAG_AA_TEXT, 'links, active tab label, chip labels'],
    ['primaryDeep', bg, WCAG_AA_TEXT, 'headings on green surfaces'],
  ]),
  ['textMuted', 'bg', WCAG_AA_TEXT, 'placeholders / timestamps on white'],
  ['textMuted', 'surface', WCAG_AA_TEXT, 'placeholders in inputs'],
  ['primaryDeep', 'primary100', WCAG_AA_TEXT, 'tag text'],
  ['textSecondary', 'primary100', WCAG_AA_TEXT, 'progress labels on track'],

  // Filled buttons
  ['onPrimary', 'primaryStrong', WCAG_AA_TEXT, 'primary button label'],
  ['onPrimary', 'primaryDeep', WCAG_AA_TEXT, 'primary button pressed'],
  ['onDanger', 'dangerStrong', WCAG_AA_TEXT, 'destructive button label'],

  // Status badges and inline status text
  ['dangerStrong', 'dangerBg', WCAG_AA_TEXT, 'danger badge'],
  ['dangerStrong', 'bg', WCAG_AA_TEXT, '"Overdue 2d" label'],
  ['warningStrong', 'warningBg', WCAG_AA_TEXT, 'warning badge'],
  ['warningStrong', 'bg', WCAG_AA_TEXT, 'caution label'],
  ['infoStrong', 'infoBg', WCAG_AA_TEXT, 'watering badge'],
  ['infoStrong', 'bg', WCAG_AA_TEXT, '"Water today" label'],
  ['primaryStrong', 'primary50', WCAG_AA_TEXT, 'success badge'],
  ['textSecondary', 'surfaceAlt', WCAG_AA_TEXT, 'neutral badge'],
];

describe('WCAG AA contrast', () => {
  it.each(pairs)('%s on %s ≥ %d (%s)', (fg, bg, min) => {
    expect(contrastRatio(c[fg], c[bg])).toBeGreaterThanOrEqual(min);
  });
});

describe('contrastRatio', () => {
  it('matches known reference values', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
  });

  it('documents why the spec greens were adjusted', () => {
    // Original spec values fail AA for small text — see DECISIONS.md D-007.
    expect(contrastRatio('#2F8F3A', palette.white)).toBeLessThan(WCAG_AA_TEXT);
    expect(contrastRatio('#98A69A', palette.white)).toBeLessThan(WCAG_AA_TEXT);
  });

  it('rejects non-hex input', () => {
    expect(() => contrastRatio('green', '#FFFFFF')).toThrow();
  });
});
