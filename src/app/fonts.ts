import { Geist, IBM_Plex_Mono } from 'next/font/google';

/**
 * Geist for everything readable; Plex Mono for specimen labels, dates and DOIs. Both self-hosted at build time.
 * Only the Latin subset is preloaded; other subsets (Polish, for example) are still declared and load on demand.
 */
export const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' });

export const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-plex-mono',
  display: 'swap',
});
