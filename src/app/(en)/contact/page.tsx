import { ContactView } from '@/views/ContactView';
import { PAGE_METADATA } from '@/views/metadata';

export const metadata = PAGE_METADATA.contact('en');

export default function Page() {
  return <ContactView locale="en" />;
}
