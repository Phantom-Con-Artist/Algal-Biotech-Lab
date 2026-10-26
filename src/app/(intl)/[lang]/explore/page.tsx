import { toLocale } from '@/i18n/config';
import { ExploreView } from '@/views/ExploreView';
import { PAGE_METADATA } from '@/views/metadata';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  return PAGE_METADATA.explore(toLocale((await params).lang));
}

export default async function Page({ params }: Props) {
  return <ExploreView locale={toLocale((await params).lang)} />;
}
