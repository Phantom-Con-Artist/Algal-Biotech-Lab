import { toLocale } from '@/i18n/config';
import { PeopleView } from '@/views/PeopleView';
import { PAGE_METADATA } from '@/views/metadata';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  return PAGE_METADATA.people(toLocale((await params).lang));
}

export default async function Page({ params }: Props) {
  return <PeopleView locale={toLocale((await params).lang)} />;
}
