import { ArrowUpRight } from 'lucide-react';
import { LAB_INFO } from '../../data/labData';
import { useT } from '../../i18n/I18nProvider';

/** Mail templates stay in English: that is the language the lab reads and replies in. */
const TEMPLATES = [
  {
    subject: 'Collaboration enquiry',
    body: 'Dear Dr. Bajhaiya,\n\nI am writing about a possible collaboration.\n\nOrganisation:\nWhat we would like to work on:\n\nRegards,',
  },
  {
    subject: 'Prospective student enquiry',
    body: 'Dear Dr. Bajhaiya,\n\nI am interested in joining the Algal Biotechnology Laboratory.\n\nCurrent degree and institution:\nResearch programme of interest:\nFunding or fellowship status:\n\nMy CV is attached.\n\nRegards,',
  },
  {
    subject: 'Enquiry for the Algal Biotechnology Laboratory',
    body: 'Dear Dr. Bajhaiya,\n\n',
  },
];

const mailto = (subject: string, body: string) =>
  `mailto:${LAB_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export function InquiryLinks() {
  const inquiries = useT().contact.inquiries;
  return (
    <ul className="border-t border-line">
      {inquiries.map((q, i) => (
        <li key={q.title} className="border-b border-line">
          <a href={mailto(TEMPLATES[i].subject, TEMPLATES[i].body)} className="group flex min-h-11 items-start justify-between gap-6 py-7 md:py-9">
            <span>
              <span className="block font-serif text-3xl leading-tight transition-colors group-hover:text-leaf md:text-4xl">{q.title}</span>
              <span className="mt-2 block max-w-md text-sm text-mute">{q.note}</span>
            </span>
            <ArrowUpRight aria-hidden="true" size={22} className="mt-2 shrink-0 text-mute transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-leaf" />
          </a>
        </li>
      ))}
    </ul>
  );
}
