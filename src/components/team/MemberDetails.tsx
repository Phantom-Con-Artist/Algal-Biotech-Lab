import type { ReactNode } from 'react';
import { getDictionary, localePath, type Locale } from '../../i18n/config';
import type { LabMember } from '../../types';
import { memberPublications } from '../../utils/lab';
import { doiUrl } from '../../utils/citation';
import { AuthorList } from '../publications/AuthorList';
import { ArrowLink } from '../common/ArrowLink';
import { Leader } from '../common/ActionLink';

/** Long lists (the PI's) show the newest few and link to the full publication list. */
const MAX_PAPERS = 8;

/** Definition-list rows down the right of a profile: education, fellowships, then publications. */
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-3 border-t border-line py-6 md:grid-cols-[12rem_1fr] md:gap-8">
      <dt className="hud text-mute md:pt-1">{label}</dt>
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
                  <span className="ruled font-medium leading-snug">{pub.title}</span>
                  <span className="mt-1 shrink-0 text-mute group-hover:text-ink"><Leader external /></span>
                </a>
                <div className="mt-1"><AuthorList authors={pub.authors} /></div>
                <p className="mt-1 text-[0.8125rem] text-mute"><em>{pub.venue}</em> · {pub.year}</p>
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
              <li key={w.citation} className="leading-relaxed text-ink-2">
                {w.citation}
                {w.href && (
                  <a href={w.href} target="_blank" rel="noopener" className="hud group ml-2 inline-flex items-center gap-2 text-ink">
                    <span className="ruled">Link</span>
                    <Leader external />
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
