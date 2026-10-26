'use client';

import { useMemo, useState } from 'react';
import { PUBLICATIONS } from '../../data/publications';
import { fmt, type Dictionary } from '../../i18n/config';
import { PublicationFilters, type TypeFilter } from './PublicationFilters';
import { PublicationItem } from './PublicationItem';

export type PublicationStrings = Dictionary['publications'];

/** The full list is rendered into the static HTML; search and filters only narrow it in the browser. */
export function PublicationList({ t, htmlLang }: { t: PublicationStrings; htmlLang: string }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<TypeFilter>('all');

  const byYear = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = PUBLICATIONS.filter(
      (p) =>
        (type === 'all' || p.type === type) &&
        (!q || [p.title, p.venue, p.authors.join(' ')].join(' ').toLowerCase().includes(q)),
    );
    const groups = new Map<number, typeof matches>();
    matches.forEach((p) => groups.set(p.year, [...(groups.get(p.year) ?? []), p]));
    return { total: matches.length, groups: [...groups.entries()] };
  }, [query, type]);

  return (
    <div>
      <PublicationFilters t={t} query={query} type={type} onQuery={setQuery} onType={setType} />
      <p className="hud mt-6 text-mute" aria-live="polite">
        {fmt(t.count, { n: byYear.total, total: PUBLICATIONS.length })}
      </p>

      {byYear.total === 0 && <p className="text-lede mt-16 text-ink-2">{t.none}</p>}

      {byYear.groups.map(([year, items]) => (
        <section key={year} aria-labelledby={`y${year}`} className="mt-12 border-t border-line-strong pt-5">
          <h2 id={`y${year}`} className="key text-[clamp(2.5rem,1.8rem+3vw,4.5rem)] leading-none">{year}</h2>
          <ul>
            {items.map((pub) => (
              <PublicationItem key={pub.id} pub={pub} t={t} htmlLang={htmlLang} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
