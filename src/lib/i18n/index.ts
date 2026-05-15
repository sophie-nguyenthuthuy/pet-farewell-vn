import vi from '@/locales/vi/common.json';
import en from '@/locales/en/common.json';
import type { Locale } from './config';

const dictionaries = { vi, en } as const;

export type Dictionary = typeof vi;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.vi;
}

export { locales, defaultLocale, localeLabels, type Locale } from './config';
