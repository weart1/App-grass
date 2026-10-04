import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';

export const defaultNS = 'translation';
export const resources = { en: { translation: en } } as const;
export const supportedLanguages = Object.keys(resources) as (keyof typeof resources)[];

function detectLanguage(): string {
  const preferred = getLocales().map((l) => l.languageCode);
  return preferred.find((code) => code && code in resources) ?? 'en';
}

const i18n = createInstance();

// Initialized synchronously at import time so the very first render has strings.
void i18n.use(initReactI18next).init({
  resources,
  lng: detectLanguage(),
  fallbackLng: 'en',
  defaultNS,
  interpolation: { escapeValue: false }, // React already escapes.
  // Resources are bundled, so initialize synchronously: strings exist on first render.
  initAsync: false,
});

/** Current locale tag for Intl APIs (dates, numbers). */
export function currentLocale(): string {
  return getLocales()[0]?.languageTag ?? 'en-US';
}

export default i18n;
