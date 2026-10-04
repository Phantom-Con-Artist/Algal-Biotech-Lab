import en from './locales/en';

export type Dictionary = typeof en;

export const LOCALES = [
  { code: 'en', name: 'English', htmlLang: 'en' },
  { code: 'fr', name: 'Français', htmlLang: 'fr' },
  { code: 'es', name: 'Español', htmlLang: 'es' },
  { code: 'de', name: 'Deutsch', htmlLang: 'de' },
  { code: 'pl', name: 'Polski', htmlLang: 'pl' },
  { code: 'sv', name: 'Svenska', htmlLang: 'sv' },
  { code: 'zh', name: '简体中文', htmlLang: 'zh-Hans' },
  { code: 'ja', name: '日本語', htmlLang: 'ja' },
  { code: 'ko', name: '한국어', htmlLang: 'ko' },
] as const;

export type Locale = (typeof LOCALES)[number]['code'];

/** Non-English dictionaries are separate chunks, fetched only when chosen. */
export const LOADERS: Record<Exclude<Locale, 'en'>, () => Promise<{ default: Dictionary }>> = {
  fr: () => import('./locales/fr'),
  es: () => import('./locales/es'),
  de: () => import('./locales/de'),
  pl: () => import('./locales/pl'),
  sv: () => import('./locales/sv'),
  zh: () => import('./locales/zh'),
  ja: () => import('./locales/ja'),
  ko: () => import('./locales/ko'),
};

export const STORAGE_KEY = 'abl-locale';

export const isLocale = (value: string | null): value is Locale => LOCALES.some((l) => l.code === value);

/** Replaces {placeholders} in a dictionary string. */
export const fmt = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ''));

export { en };
