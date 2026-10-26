import { LabTourView } from '@/views/LabTourView';
import { PAGE_METADATA } from '@/views/metadata';

export const metadata = PAGE_METADATA.lab('en');

export default function Page() {
  return <LabTourView locale="en" />;
}
