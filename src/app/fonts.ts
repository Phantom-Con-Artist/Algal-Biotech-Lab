import { IBM_Plex_Mono, Unbounded } from 'next/font/google';

/**
 * Unbounded, wide and light, for headings: the voice of an instrument's housing. IBM Plex Mono for
 * everything read and measured, from HUD callouts to paper titles. Both self-hosted at build time;
 * latin-ext covers Polish and Swedish.
 */
export const display = Unbounded({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-unbounded',
  display: 'swap',
});

export const text = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-plex-mono',
  display: 'swap',
});
