'use client';

import { useMemo, useState } from 'react';
import { PUBLICATIONS } from '../../data/publications';
import type { Dictionary } from '../../i18n/config';
import { fmt } from '../../i18n/locales-meta';
import { PublicationFilters, type TypeFilter } from './PublicationFilters';
import { PublicationItem } from './PublicationItem';
import { YearSpectrum } from './YearSpectrum';

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

  // Every year from the first paper to the newest, so quiet years show as gaps in the spectrum.
  const spectrum = useMemo(() => {
    const first = Math.min(...PUBLICATIONS.map((p) => p.year));
    const last = Math.max(...PUBLICATIONS.map((p) => p.year));
    const shown = new Map(byYear.groups.map(([y, items]) => [y, items.length]));
    return Array.from({ length: last - first + 1 }, (_, i) => {
      const year = first + i;
      return { year, all: PUBLICATIONS.filter((p) => p.year === year).length, shown: shown.get(year) ?? 0 };
    });
  }, [byYear]);
  const counts = { article: 0, chapter: 0, preprint: 0 };
  PUBLICATIONS.forEach((p) => counts[p.type]++);

  return (
    <div>
      {/* The record at a glance: what kind of work, over how many years. */}
      <dl className="grid grid-cols-2 border-t border-line-strong sm:grid-cols-5">
        {[
          [t.works, PUBLICATIONS.length],
          [t.filters.article, counts.article],
          [t.filters.chapter, counts.chapter],
          [t.filters.preprint, counts.preprint],
          [t.span, `${spectrum[0].year}–${String(spectrum[spectrum.length - 1].year).slice(2)}`],
        ].map(([label, value]) => (
          <div key={label} className="border-b border-line py-4 pr-4 sm:border-b-0">
            <dt className="hud text-mute">{label}</dt>
            <dd className="mt-2 font-display text-[clamp(1.75rem,1.3rem+1.6vw,2.75rem)] font-light leading-none tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>

      <YearSpectrum years={spectrum} label={t.spectrum} jump={t.jump} />

      <div className="z-20 -mx-4 mt-10 bg-mist/90 px-4 py-3 backdrop-blur-md lg:sticky lg:top-20 sm:-mx-8 sm:px-8 lg:-mx-[clamp(2.5rem,4vw,4.5rem)] lg:px-[clamp(2.5rem,4vw,4.5rem)]">
        <PublicationFilters t={t} query={query} type={type} onQuery={setQuery} onType={setType} />
        <p className="hud mt-2 text-mute" aria-live="polite">
          {fmt(t.count, { n: byYear.total, total: PUBLICATIONS.length })}
        </p>
      </div>

      {byYear.total === 0 && <p className="text-lede mt-16 text-ink-2">{t.none}</p>}

      {byYear.groups.map(([year, items]) => (
        <section key={year} id={`y${year}`} data-year={year} aria-labelledby={`y${year}-title`} className="mt-12 scroll-mt-24 border-t lg:scroll-mt-48 border-line-strong pt-5 lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] lg:gap-12">
          {/* On wide screens the year stays pinned beside its papers while they scroll. */}
          <div>
            <div className="lg:sticky lg:top-56">
              <h2 id={`y${year}-title`} className="key text-[clamp(2.5rem,1.8rem+3vw,4.5rem)] leading-none">{year}</h2>
              <p className="hud mt-3 text-mute">{fmt(t.count, { n: items.length, total: spectrum.find((y) => y.year === year)?.all ?? items.length })}</p>
            </div>
          </div>
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
