import { PublicationsView } from '@/views/PublicationsView';
import { PAGE_METADATA } from '@/views/metadata';

export const metadata = PAGE_METADATA.publications('en');

export default function Page() {
  return <PublicationsView locale="en" />;
}
