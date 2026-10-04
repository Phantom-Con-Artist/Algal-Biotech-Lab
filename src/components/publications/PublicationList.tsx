import { useMemo, useState } from 'react';
import { PUBLICATIONS } from '../../data/publications';
import { PublicationFilters, type TypeFilter } from './PublicationFilters';
import { PublicationItem } from './PublicationItem';
import { fmt } from '../../i18n/config';
import { useT } from '../../i18n/I18nProvider';

export function PublicationList() {
  const t = useT().explore;
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
      <PublicationFilters query={query} type={type} onQuery={setQuery} onType={setType} />
      <p className="mt-6 font-mono text-xs text-mute" aria-live="polite">
        {fmt(t.count, { n: byYear.total, total: PUBLICATIONS.length })}
      </p>

      {byYear.total === 0 && <p className="mt-16 text-soft">{t.none}</p>}

      {byYear.groups.map(([year, items]) => (
        <section key={year} aria-label={String(year)} className="mt-10 grid gap-2 md:grid-cols-[9rem_1fr] md:gap-8">
          <h3 className="font-serif text-4xl leading-none text-leaf md:sticky md:top-24 md:self-start">{year}</h3>
          <ul className="border-t border-line md:col-start-2">
            {items.map((pub) => (
              <PublicationItem key={pub.id} pub={pub} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
