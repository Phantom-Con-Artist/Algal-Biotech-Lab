'use client';

import { Search } from 'lucide-react';
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
      <label className="relative block lg:w-[28rem]">
        <span className="sr-only">{t.searchLabel}</span>
        <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mute" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={t.search}
          className="h-12 w-full rounded-[4px] bg-tile pl-11 pr-4 text-base placeholder:text-mute focus:outline-2 focus:outline-leaf"
        />
      </label>
      <div role="group" aria-label={t.filterLabel} className="flex flex-wrap gap-2">
        {OPTIONS.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={type === o}
            onClick={() => onType(o)}
            className={cn(
              'h-11 rounded-full px-4 text-sm font-medium transition-colors',
              type === o ? 'bg-ink text-paper' : 'bg-tile text-ink-2 hover:text-ink',
            )}
          >
            {t.filters[o]}
          </button>
        ))}
      </div>
    </div>
  );
}
