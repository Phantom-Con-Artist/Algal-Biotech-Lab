import { notFound } from 'next/navigation';
import { LAB_PHOTO_SLUGS, labPhotoIndex } from '@/data/gallery';
import { LabPhotoView } from '@/views/LabPhotoView';
import { PAGE_METADATA } from '@/views/metadata';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return LAB_PHOTO_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  return PAGE_METADATA.labPhoto('en', (await params).slug);
}

export default async function Page({ params }: Props) {
  const index = labPhotoIndex((await params).slug);
  if (index < 0) notFound();
  return <LabPhotoView index={index} locale="en" />;
}
