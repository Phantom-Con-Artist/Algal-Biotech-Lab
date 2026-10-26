import { notFound } from 'next/navigation';
import { toLocale } from '@/i18n/config';
import { getMember, MEMBERS } from '@/data/members';
import { MemberView } from '@/views/MemberView';
import { PAGE_METADATA } from '@/views/metadata';

type Props = { params: Promise<{ lang: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return MEMBERS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  return PAGE_METADATA.member(toLocale(lang), slug);
}

export default async function Page({ params }: Props) {
  const { lang, slug } = await params;
  const member = getMember(slug);
  if (!member) notFound();
  return <MemberView member={member} locale={toLocale(lang)} />;
}
