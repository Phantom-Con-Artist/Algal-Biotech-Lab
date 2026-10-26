import { ExploreView } from '@/views/ExploreView';
import { PAGE_METADATA } from '@/views/metadata';

export const metadata = PAGE_METADATA.explore('en');

export default function Page() {
  return <ExploreView locale="en" />;
}
