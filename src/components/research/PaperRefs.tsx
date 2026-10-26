import { getPublication } from '../../data/publications';
import { doiUrl, shortAuthors } from '../../utils/citation';
import { Leader } from '../common/ActionLink';

/** The papers behind a programme or focus area, each linked to its DOI. */
export function PaperRefs({ ids, label }: { ids: string[]; label: string }) {
  return (
    <div>
      <p className="hud mb-2 text-mute">{label}</p>
      <ul className="border-t border-line">
        {ids.map(getPublication).map((p) => (
          <li key={p.id} className="border-b border-line">
            <a href={doiUrl(p)} target="_blank" rel="noopener" className="group flex min-h-11 items-start justify-between gap-4 py-3">
              <span>
                <span className="block text-[0.875rem] leading-snug">{p.title}</span>
                <span className="mt-1 block text-[0.75rem] text-mute">
                  {shortAuthors(p)} · <em>{p.venue}</em> · {p.year}
                </span>
              </span>
              <span className="mt-1 text-mute transition-colors group-hover:text-ink"><Leader external /></span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
