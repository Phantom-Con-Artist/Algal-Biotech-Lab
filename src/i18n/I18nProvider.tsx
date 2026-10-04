import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { en, isLocale, LOADERS, LOCALES, STORAGE_KEY, type Dictionary, type Locale } from './config';

interface I18nValue {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nValue>({ locale: 'en', t: en, setLocale: () => undefined });

function storedLocale(): Locale {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return isLocale(saved) ? saved : 'en';
  } catch {
    return 'en';
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(storedLocale);
  const [loaded, setLoaded] = useState<{ locale: Locale; t: Dictionary }>({ locale: 'en', t: en });

  useEffect(() => {
    let cancelled = false;
    if (locale === 'en') {
      setLoaded({ locale: 'en', t: en });
    } else {
      LOADERS[locale]()
        .then((mod) => !cancelled && setLoaded({ locale, t: mod.default }))
        .catch(() => !cancelled && setLoaded({ locale: 'en', t: en }));
    }
    return () => {
      cancelled = true;
    };
  }, [locale]);

  useEffect(() => {
    document.documentElement.lang = LOCALES.find((l) => l.code === loaded.locale)?.htmlLang ?? 'en';
  }, [loaded.locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable: the choice simply won't persist */
    }
  }, []);

  const value = useMemo(() => ({ locale: loaded.locale, t: loaded.t, setLocale }), [loaded, setLocale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
export const useT = () => useContext(I18nContext).t;
