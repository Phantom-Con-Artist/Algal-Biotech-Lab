import type { Metadata } from 'next';
import { geist, plexMono } from './fonts';
import { getDictionary } from '@/i18n/config';
import { LAB_INFO } from '@/data/labData';
import './globals.css';

const t = getDictionary('en');

export const metadata: Metadata = {
  title: `404 · ${t.meta.siteTitle}`,
  robots: { index: false, follow: true },
};

/** Served for any URL that matches no page. It sits outside both root layouts, so it is self-contained. */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${geist.variable} ${plexMono.variable}`}>
      <body className="grid min-h-svh place-items-center px-4">
        <main className="w-full max-w-3xl py-24">
          <p className="label">404 / {LAB_INFO.name}</p>
          <h1 className="text-page mt-6 font-medium">{t.notFound.title}</h1>
          <p className="text-lede mt-6 max-w-[44ch] text-ink-2">{t.notFound.body}</p>
          <a href="/" className="mt-10 inline-flex min-h-11 items-center rounded-[4px] bg-ink px-5 text-sm font-medium text-paper hover:bg-leaf">
            {t.notFound.home} →
          </a>
        </main>
      </body>
    </html>
  );
}
