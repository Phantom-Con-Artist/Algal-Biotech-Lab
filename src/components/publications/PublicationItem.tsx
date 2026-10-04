import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import type { Publication } from '../../types';
import { doiUrl, formatCitation } from '../../utils/citation';
import { AuthorList } from './AuthorList';

const TYPE_LABEL = { article: 'Article', chapter: 'Book chapter', preprint: 'Preprint' } as const;
const action =
  'inline-flex min-h-11 items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-soft transition-colors hover:text-leaf';

export function PublicationItem({ pub }: { pub: Publication }) {
  const [copied, setCopied] = useState(false);

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
    <li className="grid gap-3 border-b border-line py-7 md:grid-cols-[9rem_1fr] md:gap-8">
      <div className="font-mono text-xs text-mute md:pt-1.5">
        <p>{pub.month ?? pub.year}</p>
        <p className="mt-1 text-leaf">{TYPE_LABEL[pub.type]}</p>
      </div>
      <div>
        <h4 className="max-w-3xl text-[17px] font-medium leading-snug text-paper md:text-lg">{pub.title}</h4>
        <div className="mt-2 max-w-3xl">
          <AuthorList authors={pub.authors} />
        </div>
        <p className="mt-2 text-sm italic text-soft">
          {pub.venue}
          {pub.detail && <span className="not-italic text-mute"> · {pub.detail}</span>}
        </p>
        <div className="-mb-2 mt-2 flex flex-wrap gap-x-6">
          <a href={doiUrl(pub)} target="_blank" rel="noreferrer" className={action}>DOI ↗</a>
          {pub.pmid && (
            <a href={`https://pubmed.ncbi.nlm.nih.gov/${pub.pmid}/`} target="_blank" rel="noreferrer" className={action}>PubMed ↗</a>
          )}
          <button type="button" onClick={copy} className={action}>
            {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
            <span aria-live="polite">{copied ? 'Copied' : 'Copy citation'}</span>
          </button>
        </div>
      </div>
    </li>
  );
}
