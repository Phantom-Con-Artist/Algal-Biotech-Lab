import { Search } from 'lucide-react';
import type { PublicationType } from '../../types';
import { cn } from '../../utils/cn';
import { useT } from '../../i18n/I18nProvider';

export type TypeFilter = PublicationType | 'all';

const OPTIONS: TypeFilter[] = ['all', 'article', 'chapter', 'preprint'];

interface Props {
  query: string;
  type: TypeFilter;
  onQuery: (q: string) => void;
  onType: (t: TypeFilter) => void;
}

export function PublicationFilters({ query, type, onQuery, onType }: Props) {
  const t = useT().explore;
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <label className="relative block md:w-96">
        <span className="sr-only">{t.searchLabel}</span>
        <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-mute" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={t.search}
          className="h-11 w-full border-b border-line bg-transparent pl-7 text-[15px] text-paper placeholder:text-mute focus:border-leaf focus:outline-none"
        />
      </label>
      <div role="group" aria-label={t.filterLabel} className="flex flex-wrap gap-x-5">
        {OPTIONS.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={type === o}
            onClick={() => onType(o)}
            className={cn(
              'relative h-11 text-sm transition-colors',
              type === o ? 'text-paper after:absolute after:inset-x-0 after:bottom-2 after:h-px after:bg-leaf' : 'text-mute hover:text-paper',
            )}
          >
            {t.filters[o]}
          </button>
        ))}
      </div>
    </div>
  );
}
