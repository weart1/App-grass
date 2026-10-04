import { currentLocale } from '@/i18n';

export function formatDisplayDate(date: Date): string {
  return new Intl.DateTimeFormat(currentLocale(), { dateStyle: 'medium' }).format(date);
}
