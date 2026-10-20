import { HomeView } from '@/views/HomeView';
import { PAGE_METADATA } from '@/views/metadata';

export const metadata = PAGE_METADATA.home('en');

export default function Page() {
  return <HomeView locale="en" />;
}
