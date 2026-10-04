import { ArrowUpRight } from 'lucide-react';
import { LAB_INFO } from '../../data/labData';

const INQUIRIES = [
  {
    title: 'Collaborate with us',
    note: 'Shared projects, strains, methods or student exchange.',
    subject: 'Collaboration enquiry',
    body: 'Dear Dr. Bajhaiya,\n\nI am writing about a possible collaboration.\n\nOrganisation:\nWhat we would like to work on:\n\nRegards,',
  },
  {
    title: 'Join the lab',
    note: 'Interested in a Ph.D. or project? Tell us which programme draws you.',
    subject: 'Prospective student enquiry',
    body: 'Dear Dr. Bajhaiya,\n\nI am interested in joining the Algal Biotechnology Laboratory.\n\nCurrent degree and institution:\nResearch programme of interest:\nFunding or fellowship status:\n\nMy CV is attached.\n\nRegards,',
  },
  {
    title: 'Anything else',
    note: 'Press, speaking, data requests, or a question about a paper.',
    subject: 'Enquiry for the Algal Biotechnology Laboratory',
    body: 'Dear Dr. Bajhaiya,\n\n',
  },
];

const mailto = (subject: string, body: string) =>
  `mailto:${LAB_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export function InquiryLinks() {
  return (
    <ul className="border-t border-line">
      {INQUIRIES.map((q) => (
        <li key={q.title} className="border-b border-line">
          <a href={mailto(q.subject, q.body)} className="group flex min-h-11 items-start justify-between gap-6 py-7 md:py-9">
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
