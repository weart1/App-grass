/** Pure formatting helpers (no React / RN imports — unit-tested with Vitest). */

/** 950 → "950", 1234 → "1.2K", 12_500 → "12.5K", 3_400_000 → "3.4M". */
export function compactNumber(value: number): string {
  const abs = Math.abs(value);
  const fmt = (n: number, suffix: string) => {
    const rounded = n >= 100 ? Math.round(n).toString() : (Math.round(n * 10) / 10).toString();
    return `${value < 0 ? '-' : ''}${rounded}${suffix}`;
  };
  if (abs < 1_000) return String(value);
  if (abs < 1_000_000) return fmt(abs / 1_000, 'K');
  return fmt(abs / 1_000_000, 'M');
}

export type TimeAgoUnit = 'now' | 'minutes' | 'hours' | 'days' | 'weeks';

/** Returns the unit + count for a short relative timestamp ("3h", "2d"). */
export function timeAgo(date: Date, now: Date = new Date()): { unit: TimeAgoUnit; count: number } {
  const seconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));
  if (seconds < 60) return { unit: 'now', count: 0 };
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return { unit: 'minutes', count: minutes };
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return { unit: 'hours', count: hours };
  const days = Math.floor(hours / 24);
  if (days < 7) return { unit: 'days', count: days };
  return { unit: 'weeks', count: Math.floor(days / 7) };
}

/** Whole calendar days from `from` to `to` (local time), negative if `to` is earlier. */
export function daysBetween(from: Date, to: Date): number {
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b - a) / 86_400_000);
}

export function initials(name: string): string {
  const parts = name.trim().replace(/^@/, '').split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

export type TextSegment = { type: 'text' | 'hashtag' | 'mention'; value: string };

/** Splits a caption into plain text, #hashtags and @mentions for rich rendering. */
export function splitRichText(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const pattern = /([#@])([\p{L}\p{N}_]+)/gu;
  let lastIndex = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    const prev = index > 0 ? text[index - 1] : ' ';
    // Ignore "email@domain" style matches.
    if (prev && /[\p{L}\p{N}_]/u.test(prev)) continue;
    if (index > lastIndex) segments.push({ type: 'text', value: text.slice(lastIndex, index) });
    segments.push({ type: match[1] === '#' ? 'hashtag' : 'mention', value: match[0] });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) segments.push({ type: 'text', value: text.slice(lastIndex) });
  return segments;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
