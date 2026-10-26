import { toLocale } from '@/i18n/config';
import { LabTourView } from '@/views/LabTourView';
import { PAGE_METADATA } from '@/views/metadata';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  return PAGE_METADATA.lab(toLocale((await params).lang));
}

export default async function Page({ params }: Props) {
  return <LabTourView locale={toLocale((await params).lang)} />;
}
