import type { FocusArea } from '../../types';
import { getPublication } from '../../data/publications';
import { doiUrl, shortAuthors } from '../../utils/citation';
import { Eyebrow } from '../common/Eyebrow';
import { useT } from '../../i18n/I18nProvider';

export function FocusCopy({ area, titleTag: Tag = 'h3' }: { area: FocusArea; titleTag?: 'h2' | 'h3' }) {
  const t = useT().focus;
  const copy = t.areas[area.id];
  return (
    <>
      <Eyebrow number={area.number}>{copy.label}</Eyebrow>
      <Tag className="mt-3 font-serif text-[clamp(1.7rem,5.4vw,3rem)] leading-[1.02] tracking-[-0.015em]">{copy.title}</Tag>
      <p className="mt-4 text-sm leading-relaxed text-soft md:text-base">{copy.general}</p>
      <p className="mt-3 border-l border-leaf pl-4 text-sm leading-relaxed text-paper md:text-base">
        <span className="mb-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-leaf">{t.inLab}</span>
        {copy.lab}
      </p>
      <ul className="mt-2 flex flex-wrap gap-x-5">
        {area.paperIds.map((id) => {
          const pub = getPublication(id);
          return (
            <li key={id}>
              <a
                href={doiUrl(pub)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center font-mono text-xs text-mute transition-colors hover:text-leaf"
              >
                {shortAuthors(pub)} · {pub.year} <span aria-hidden="true" className="ml-1">↗</span>
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
}
