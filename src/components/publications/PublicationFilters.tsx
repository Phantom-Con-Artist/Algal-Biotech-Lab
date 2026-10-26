'use client';

import type { PublicationType } from '../../types';
import { cn } from '../../utils/cn';
import type { PublicationStrings } from './PublicationList';

export type TypeFilter = PublicationType | 'all';

const OPTIONS: TypeFilter[] = ['all', 'article', 'chapter', 'preprint'];

interface Props {
  t: PublicationStrings;
  query: string;
  type: TypeFilter;
  onQuery: (q: string) => void;
  onType: (t: TypeFilter) => void;
}

export function PublicationFilters({ t, query, type, onQuery, onType }: Props) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <label className="relative block lg:w-[30rem]">
        <span className="sr-only">{t.searchLabel}</span>
        <span aria-hidden="true" className="hud pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-mute">&gt;</span>
        <input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={t.search}
          className="h-12 w-full border-b border-line-strong bg-transparent pl-6 pr-2 text-[0.9375rem] placeholder:text-mute focus:border-ink focus:outline-none"
        />
      </label>
      <div role="group" aria-label={t.filterLabel} className="flex flex-wrap gap-2">
        {OPTIONS.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={type === o}
            onClick={() => onType(o)}
            className={cn('hud h-11 px-3 transition-colors', type === o ? 'ticks text-ink' : 'text-mute hover:text-ink')}
          >
            {t.filters[o]}
          </button>
        ))}
      </div>
    </div>
  );
}
