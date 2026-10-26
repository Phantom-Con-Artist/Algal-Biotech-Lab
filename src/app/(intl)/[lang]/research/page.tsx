import { toLocale } from '@/i18n/config';
import { ResearchView } from '@/views/ResearchView';
import { PAGE_METADATA } from '@/views/metadata';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  return PAGE_METADATA.research(toLocale((await params).lang));
}

export default async function Page({ params }: Props) {
  return <ResearchView locale={toLocale((await params).lang)} />;
}
