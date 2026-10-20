import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { getDictionary, localePath, type Locale } from '../../i18n/config';
import type { LabMember } from '../../types';
import { memberPublications } from '../../utils/lab';
import { doiUrl } from '../../utils/citation';
import { AuthorList } from '../publications/AuthorList';
import { ArrowLink } from '../common/ArrowLink';

/** Long lists (the PI's) show the newest few and link to the full publication list. */
const MAX_PAPERS = 8;

/** Definition-list rows down the right of a profile: education, fellowships, then publications. */
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-3 border-t border-line py-6 md:grid-cols-[12rem_1fr] md:gap-8">
      <dt className="label md:pt-1">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export function MemberDetails({ member, locale }: { member: LabMember; locale: Locale }) {
  const t = getDictionary(locale);
  const p = t.people;
  const papers = memberPublications(member);

  return (
    <dl>
      <Row label={p.education}>
        <ul className="space-y-1.5">
          {member.education.map((e) => <li key={e}>{e}</li>)}
        </ul>
      </Row>

      {member.fellowships.length > 0 && (
        <Row label={p.fellowships}>
          <ul className="space-y-1.5">
            {member.fellowships.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </Row>
      )}

      {papers.length > 0 && (
        <Row label={`${p.labPapers} (${papers.length})`}>
          <ul className="space-y-5">
            {papers.slice(0, MAX_PAPERS).map((pub) => (
              <li key={pub.id}>
                <a href={doiUrl(pub)} target="_blank" rel="noopener" className="group inline-flex items-start gap-2">
                  <span className="font-medium leading-snug transition-colors group-hover:text-leaf">{pub.title}</span>
                  <ArrowUpRight size={16} aria-hidden="true" className="mt-1 shrink-0 text-mute group-hover:text-leaf" />
                </a>
                <div className="mt-1"><AuthorList authors={pub.authors} /></div>
                <p className="mt-1 text-sm text-mute"><em>{pub.venue}</em> · {pub.year}</p>
              </li>
            ))}
          </ul>
          {papers.length > MAX_PAPERS && (
            <div className="mt-5">
              <ArrowLink href={localePath(locale, '/publications')}>{t.home.allPubs}</ArrowLink>
            </div>
          )}
        </Row>
      )}

      {member.otherWorks.length > 0 && (
        <Row label={p.otherPapers}>
          <ul className="space-y-4">
            {member.otherWorks.map((w) => (
              <li key={w.citation} className="text-base leading-relaxed text-ink-2">
                {w.citation}
                {w.href && (
                  <a href={w.href} target="_blank" rel="noopener" className="ml-2 inline-flex items-center gap-1 font-mono text-xs uppercase text-leaf">
                    <span className="measure">Link</span>
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </Row>
      )}
    </dl>
  );
}
