import { notFound } from 'next/navigation';
import { getMember, MEMBERS } from '@/data/members';
import { MemberView } from '@/views/MemberView';
import { PAGE_METADATA } from '@/views/metadata';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return MEMBERS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props) {
  return PAGE_METADATA.member('en', (await params).slug);
}

export default async function Page({ params }: Props) {
  const member = getMember((await params).slug);
  if (!member) notFound();
  return <MemberView member={member} locale="en" />;
}
