import type { ReactNode } from 'react';
import { display, text } from '../../app/fonts';
import { getDictionary, localeInfo, type Locale } from '../../i18n/config';
import { siteGraph } from '../../utils/structuredData';
import { JsonLd } from '../common/JsonLd';
import { Header } from './Header';
import { Footer } from './Footer';

/** The <html> document shared by the English root layout and the translated one. */
export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  const t = getDictionary(locale);
  return (
    <html lang={localeInfo(locale).htmlLang} className={`${display.variable} ${text.variable}`}>
      <body className="flex min-h-svh flex-col">
        <a
          href="#main"
          className="sr-only z-[60] bg-ink px-4 py-3 text-sm font-medium text-frost focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          {t.nav.skip}
        </a>
        <Header locale={locale} nav={t.nav} machineNote={t.machineNote} />
        <main id="main" className="flex-1 pt-20">
          {children}
        </main>
        <Footer locale={locale} />
        <JsonLd data={siteGraph(locale)} />
      </body>
    </html>
  );
}
