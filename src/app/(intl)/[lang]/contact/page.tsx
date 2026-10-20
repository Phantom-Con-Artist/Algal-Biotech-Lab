import { toLocale } from '@/i18n/config';
import { ContactView } from '@/views/ContactView';
import { PAGE_METADATA } from '@/views/metadata';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  return PAGE_METADATA.contact(toLocale((await params).lang));
}

export default async function Page({ params }: Props) {
  return <ContactView locale={toLocale((await params).lang)} />;
}
