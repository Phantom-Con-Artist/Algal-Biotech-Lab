import { toLocale } from '@/i18n/config';
import { HomeView } from '@/views/HomeView';
import { PAGE_METADATA } from '@/views/metadata';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  return PAGE_METADATA.home(toLocale((await params).lang));
}

export default async function Page({ params }: Props) {
  return <HomeView locale={toLocale((await params).lang)} />;
}
