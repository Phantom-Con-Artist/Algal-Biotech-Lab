import { Leader } from '../common/ActionLink';
import { getDictionary, type Locale } from '../../i18n/config';
import { INQUIRY_TEMPLATES, mailto } from '../../data/inquiries';

/** Each subject opens the reader's mail app with a short template to complete. */
export function InquiryLinks({ locale }: { locale: Locale }) {
  const inquiries = getDictionary(locale).contact.inquiries;
  return (
    <ul className="border-t border-line-strong">
      {inquiries.map((q, i) => (
        <li key={q.title} className="border-b border-line">
          <a
            href={mailto(INQUIRY_TEMPLATES[i].subject, INQUIRY_TEMPLATES[i].body)}
            className="group flex min-h-11 items-start justify-between gap-6 py-8 md:py-10"
          >
            <span>
              <span className="text-h3 block">{q.title}</span>
              <span className="mt-2 block max-w-md text-ink-2">{q.note}</span>
            </span>
            <span className="mt-2 shrink-0 text-mute group-hover:text-ink"><Leader /></span>
          </a>
        </li>
      ))}
    </ul>
  );
}
