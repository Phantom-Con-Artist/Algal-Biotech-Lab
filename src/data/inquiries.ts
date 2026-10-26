import { LAB_INFO } from './labData';

/** Mail templates stay in English: that is the language the lab reads and replies in. Same order as contact.inquiries. */
export const INQUIRY_TEMPLATES = [
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

export const mailto = (subject: string, body: string) =>
  `mailto:${LAB_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export const PROSPECTIVE_MAILTO = mailto(INQUIRY_TEMPLATES[1].subject, INQUIRY_TEMPLATES[1].body);
