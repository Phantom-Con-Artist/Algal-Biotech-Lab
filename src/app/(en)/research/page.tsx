import { ResearchView } from '@/views/ResearchView';
import { PAGE_METADATA } from '@/views/metadata';

export const metadata = PAGE_METADATA.research('en');

export default function Page() {
  return <ResearchView locale="en" />;
}
