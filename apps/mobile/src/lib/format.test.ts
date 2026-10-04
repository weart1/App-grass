import { describe, expect, it } from 'vitest';

import { clamp, compactNumber, daysBetween, initials, splitRichText, timeAgo } from './format';

describe('compactNumber', () => {
  it.each([
    [0, '0'],
    [950, '950'],
    [1_000, '1K'],
    [1_234, '1.2K'],
    [12_500, '12.5K'],
    [128_400, '128K'],
    [3_400_000, '3.4M'],
    [-1_500, '-1.5K'],
  ])('%d → %s', (input, expected) => {
    expect(compactNumber(input)).toBe(expected);
  });
});

describe('timeAgo', () => {
  const now = new Date('2026-05-10T12:00:00Z');
  const ago = (ms: number) => timeAgo(new Date(now.getTime() - ms), now);

  it('buckets durations', () => {
    expect(ago(10_000)).toEqual({ unit: 'now', count: 0 });
    expect(ago(5 * 60_000)).toEqual({ unit: 'minutes', count: 5 });
    expect(ago(3 * 3_600_000)).toEqual({ unit: 'hours', count: 3 });
    expect(ago(2 * 86_400_000)).toEqual({ unit: 'days', count: 2 });
    expect(ago(15 * 86_400_000)).toEqual({ unit: 'weeks', count: 2 });
  });

  it('treats future dates as now', () => {
    expect(ago(-60_000)).toEqual({ unit: 'now', count: 0 });
  });
});

describe('daysBetween', () => {
  it('counts calendar days', () => {
    expect(daysBetween(new Date(2026, 0, 1, 23, 0), new Date(2026, 0, 2, 1, 0))).toBe(1);
    expect(daysBetween(new Date(2026, 0, 10), new Date(2026, 0, 3))).toBe(-7);
  });
});

describe('initials', () => {
  it.each([
    ['Maya Green', 'MG'],
    ['@fern', 'F'],
    ['  ana  maria  lopez ', 'AL'],
    ['', '?'],
  ])('%s → %s', (input, expected) => {
    expect(initials(input)).toBe(expected);
  });
});

describe('splitRichText', () => {
  it('extracts hashtags and mentions', () => {
    expect(splitRichText('First tomato! #FirstHarvest thanks @maya')).toEqual([
      { type: 'text', value: 'First tomato! ' },
      { type: 'hashtag', value: '#FirstHarvest' },
      { type: 'text', value: ' thanks ' },
      { type: 'mention', value: '@maya' },
    ]);
  });

  it('ignores emails and handles unicode tags', () => {
    expect(splitRichText('mail me@x.com #томаты')).toEqual([
      { type: 'text', value: 'mail me@x.com ' },
      { type: 'hashtag', value: '#томаты' },
    ]);
  });
});

describe('clamp', () => {
  it('bounds values', () => {
    expect(clamp(5, 0, 3)).toBe(3);
    expect(clamp(-1, 0, 3)).toBe(0);
    expect(clamp(2, 0, 3)).toBe(2);
  });
});
