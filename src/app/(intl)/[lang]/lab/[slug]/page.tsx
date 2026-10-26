import { notFound } from 'next/navigation';
import { toLocale } from '@/i18n/config';
import { LAB_PHOTO_SLUGS, labPhotoIndex } from '@/data/gallery';
import { LabPhotoView } from '@/views/LabPhotoView';
import { PAGE_METADATA } from '@/views/metadata';

type Props = { params: Promise<{ lang: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return LAB_PHOTO_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  return PAGE_METADATA.labPhoto(toLocale(lang), slug);
}

export default async function Page({ params }: Props) {
  const { lang, slug } = await params;
  const index = labPhotoIndex(slug);
  if (index < 0) notFound();
  return <LabPhotoView index={index} locale={toLocale(lang)} />;
}
