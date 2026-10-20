import type { Metadata, Viewport } from 'next';
import { DEFAULT_LOCALE, getDictionary, LOCALES, localeInfo, localePath, type Locale } from '../i18n/config';
import { DEVELOPER, LAB_INFO, SITE_URL } from '../data/labData';

export const absoluteUrl = (path: string) => `${SITE_URL}${path === '/' ? '' : path}` || SITE_URL;

/** hreflang map for one page in every language, plus x-default pointing at English. */
export function languageAlternates(path: string): Record<string, string> {
  const map: Record<string, string> = Object.fromEntries(
    LOCALES.map((l) => [l.htmlLang, absoluteUrl(localePath(l.code, path))]),
  );
  map['x-default'] = absoluteUrl(localePath(DEFAULT_LOCALE, path));
  return map;
}

interface PageMeta {
  locale: Locale;
  /** Locale-free path, for example '/people'. */
  path: string;
  /** Page name; omitted on the home page, which uses the full site title. */
  title?: string;
  description: string;
  image?: { url: string; width: number; height: number; alt: string };
  type?: 'website' | 'profile';
}

export function pageMetadata({ locale, path, title, description, image, type = 'website' }: PageMeta): Metadata {
  const t = getDictionary(locale);
  const url = absoluteUrl(localePath(locale, path));
  const og = image ?? { url: '/og.png', width: 1200, height: 630, alt: t.meta.siteTitle };
  const fullTitle = title ? `${title} · ${t.meta.siteTitle}` : t.meta.siteTitle;

  return {
    title: title ?? { absolute: t.meta.siteTitle },
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: t.meta.siteTitle,
      locale: localeInfo(locale).og,
      alternateLocale: LOCALES.filter((l) => l.code !== locale).map((l) => l.og),
      images: [og],
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [og.url] },
  };
}

/** Site-wide defaults set once per root layout. */
export function rootMetadata(locale: Locale): Metadata {
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { template: `%s · ${t.meta.siteTitle}`, default: t.meta.siteTitle },
    description: t.meta.description,
    applicationName: LAB_INFO.name,
    authors: [{ name: LAB_INFO.name, url: SITE_URL }],
    publisher: LAB_INFO.institution,
    creator: DEVELOPER.name,
    keywords: [
      'algal biotechnology', 'microalgae', 'Chlamydomonas reinhardtii', 'biofuels', 'carbon capture',
      'polyphosphate', 'biofertiliser', 'phycoremediation', 'nutraceuticals', 'microbiology',
      'Central University of Tamil Nadu', 'CUTN', 'Amit Kumar Bajhaiya', 'Thiruvarur',
    ],
    icons: {
      icon: [{ url: '/favicon.ico', sizes: '48x48' }, { url: '/icon.png', type: 'image/png' }],
      apple: '/apple-icon.png',
    },
    manifest: '/manifest.webmanifest',
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
    formatDetection: { telephone: false, email: false, address: false },
    category: 'science',
  };
}

export const VIEWPORT: Viewport = {
  themeColor: '#f6f5ef',
  width: 'device-width',
  initialScale: 1,
};
