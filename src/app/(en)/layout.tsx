import type { ReactNode } from 'react';
import { RootDocument } from '@/components/layout/RootDocument';
import { rootMetadata, VIEWPORT } from '@/utils/seo';
import '../globals.css';

export const metadata = rootMetadata('en');
export const viewport = VIEWPORT;

/** English is served from the site root. */
export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
