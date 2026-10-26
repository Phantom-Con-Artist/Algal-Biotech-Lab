import { PeopleView } from '@/views/PeopleView';
import { PAGE_METADATA } from '@/views/metadata';

export const metadata = PAGE_METADATA.people('en');

export default function Page() {
  return <PeopleView locale="en" />;
}
