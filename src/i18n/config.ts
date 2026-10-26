import en from './locales/en';
import fr from './locales/fr';
import es from './locales/es';
import de from './locales/de';
import pl from './locales/pl';
import sv from './locales/sv';
import zh from './locales/zh';
import ja from './locales/ja';
import ko from './locales/ko';
import type { Locale } from './locales-meta';

export * from './locales-meta';

export type Dictionary = typeof en;

/** A translation may lag behind English; anything it lacks falls back to the English string. */
export type PartialDictionary = { [K in keyof Dictionary]?: DeepPartial<Dictionary[K]> };
type DeepPartial<T> = T extends string ? string : T extends readonly (infer U)[] ? readonly DeepPartial<U>[] : { [K in keyof T]?: DeepPartial<T[K]> };

function withFallback<T>(base: T, over: unknown): T {
  if (Array.isArray(base) || typeof base !== 'object' || base === null) return (over ?? base) as T;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries((over ?? {}) as Record<string, unknown>)) out[k] = withFallback(out[k], v);
  return out as T;
}

const DICTIONARIES: Record<Locale, Dictionary> = {
  en,
  ...Object.fromEntries(Object.entries({ fr, es, de, pl, sv, zh, ja, ko }).map(([code, d]) => [code, withFallback(en, d)])),
} as Record<Locale, Dictionary>;

export const getDictionary = (locale: Locale): Dictionary => DICTIONARIES[locale];
