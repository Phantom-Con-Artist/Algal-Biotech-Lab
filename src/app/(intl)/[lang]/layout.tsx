import type { ReactNode } from 'react';
import { RootDocument } from '@/components/layout/RootDocument';
import { PREFIXED_LOCALES, toLocale } from '@/i18n/config';
import { rootMetadata, VIEWPORT } from '@/utils/seo';
import '../../globals.css';

interface Props {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export const dynamicParams = false;
export const viewport = VIEWPORT;

export function generateStaticParams() {
  return PREFIXED_LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Omit<Props, 'children'>) {
  return rootMetadata(toLocale((await params).lang));
}

/** Every other language lives under /{code}, with its own root so <html lang> is right in the static HTML. */
export default async function LocaleLayout({ children, params }: Props) {
  return <RootDocument locale={toLocale((await params).lang)}>{children}</RootDocument>;
}
