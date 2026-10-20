import { ArrowUpRight } from 'lucide-react';
import { getPublication } from '../../data/publications';
import { doiUrl, shortAuthors } from '../../utils/citation';

/** The papers behind a programme or focus area, each linked to its DOI. */
export function PaperRefs({ ids, label }: { ids: string[]; label: string }) {
  return (
    <div>
      <p className="label mb-2">{label}</p>
      <ul className="border-t border-line">
        {ids.map(getPublication).map((p) => (
          <li key={p.id} className="border-b border-line">
            <a href={doiUrl(p)} target="_blank" rel="noopener" className="group flex min-h-11 items-start justify-between gap-4 py-3">
              <span>
                <span className="block text-sm font-medium leading-snug transition-colors group-hover:text-leaf">{p.title}</span>
                <span className="mt-0.5 block text-xs text-mute">
                  {shortAuthors(p)} · <em>{p.venue}</em> · {p.year}
                </span>
              </span>
              <ArrowUpRight size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-mute transition-colors group-hover:text-leaf" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
