'use client';

import { useState } from 'react';
import { Leader } from '../common/ActionLink';
import type { Publication } from '../../types';
import { doiUrl, formatCitation } from '../../utils/citation';
import { MONTHS } from '../../data/publications';
import { AuthorList } from './AuthorList';
import type { PublicationStrings } from './PublicationList';

const action = 'hud group inline-flex min-h-11 items-center gap-2 text-ink-2 transition-colors hover:text-ink';

export function PublicationItem({ pub, t, htmlLang }: { pub: Publication; t: PublicationStrings; htmlLang: string }) {
  const [copied, setCopied] = useState(false);
  const month = pub.month
    ? new Intl.DateTimeFormat(htmlLang, { month: 'long' }).format(new Date(2000, MONTHS.indexOf(pub.month), 1))
    : '';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(formatCitation(pub));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <li className="grid gap-3 border-b border-line py-8 lg:grid-cols-12 lg:gap-12">
      <p className="hud text-mute lg:col-span-3 lg:pt-1">
        <span className="text-ink">{t.types[pub.type]}</span>
        {month && <span className="ml-2">{month}</span>}
      </p>
      <div className="lg:col-span-9">
        <h3 className="max-w-[60ch] font-display text-[1.0625rem] font-light leading-snug md:text-[1.25rem]">{pub.title}</h3>
        <div className="mt-3 max-w-[80ch]">
          <AuthorList authors={pub.authors} />
        </div>
        <p className="mt-2 text-sm text-ink-2">
          <em>{pub.venue}</em>
          {pub.detail && <span className="text-mute"> · {pub.detail}</span>}
        </p>
        <div className="mt-2 flex flex-wrap gap-x-6">
          <a href={doiUrl(pub)} target="_blank" rel="noopener" className={action}>DOI <Leader external /></a>
          {pub.pmid && (
            <a href={`https://pubmed.ncbi.nlm.nih.gov/${pub.pmid}/`} target="_blank" rel="noopener" className={action}>PubMed <Leader external /></a>
          )}
          <button type="button" onClick={copy} className={action}>
            <span aria-live="polite">{copied ? t.copied : t.copy}</span>
          </button>
        </div>
      </div>
    </li>
  );
}
