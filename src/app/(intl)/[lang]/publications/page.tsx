import { toLocale } from '@/i18n/config';
import { PublicationsView } from '@/views/PublicationsView';
import { PAGE_METADATA } from '@/views/metadata';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  return PAGE_METADATA.publications(toLocale((await params).lang));
}

export default async function Page({ params }: Props) {
  return <PublicationsView locale={toLocale((await params).lang)} />;
}
