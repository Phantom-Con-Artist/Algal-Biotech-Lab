/**
 * Locale facts and URL helpers, without the dictionaries: safe to import from client components, which
 * must not carry nine languages of copy into every page's JavaScript.
 */

/** `og` is the Open Graph locale; `htmlLang` is also the hreflang value. */
export const LOCALES = [
  { code: 'en', name: 'English', htmlLang: 'en', og: 'en_IN' },
  { code: 'fr', name: 'Français', htmlLang: 'fr', og: 'fr_FR' },
  { code: 'es', name: 'Español', htmlLang: 'es', og: 'es_ES' },
  { code: 'de', name: 'Deutsch', htmlLang: 'de', og: 'de_DE' },
  { code: 'pl', name: 'Polski', htmlLang: 'pl', og: 'pl_PL' },
  { code: 'sv', name: 'Svenska', htmlLang: 'sv', og: 'sv_SE' },
  { code: 'zh', name: '简体中文', htmlLang: 'zh-Hans', og: 'zh_CN' },
  { code: 'ja', name: '日本語', htmlLang: 'ja', og: 'ja_JP' },
  { code: 'ko', name: '한국어', htmlLang: 'ko', og: 'ko_KR' },
] as const;

export type Locale = (typeof LOCALES)[number]['code'];

/** English lives at the site root; every other language under /{code}. */
export const DEFAULT_LOCALE: Locale = 'en';
export const PREFIXED_LOCALES = LOCALES.filter((l) => l.code !== DEFAULT_LOCALE).map((l) => l.code);

export const isLocale = (value: string): value is Locale => LOCALES.some((l) => l.code === value);

export const localeInfo = (locale: Locale) => LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

/** '/people' in 'fr' becomes '/fr/people'; the home page of 'fr' is '/fr'. */
export function localePath(locale: Locale, path = '/'): string {
  const clean = path === '/' ? '' : path;
  return locale === DEFAULT_LOCALE ? clean || '/' : `/${locale}${clean}`;
}

/** Strips a language prefix: '/fr/people' becomes '/people'. */
export function stripLocale(pathname: string): string {
  const [, first, ...rest] = pathname.split('/');
  if (first && isLocale(first) && first !== DEFAULT_LOCALE) return `/${rest.join('/')}`.replace(/\/$/, '') || '/';
  return pathname || '/';
}

/** Replaces {placeholders} in a dictionary string. */
export const fmt = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ''));

/** Narrows a route parameter; generateStaticParams guarantees it is a known code. */
export const toLocale = (value: string): Locale => (isLocale(value) ? value : DEFAULT_LOCALE);
