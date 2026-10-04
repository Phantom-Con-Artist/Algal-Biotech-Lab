import { Search } from 'lucide-react';
import type { PublicationType } from '../../types';
import { cn } from '../../utils/cn';

export type TypeFilter = PublicationType | 'all';

const OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'article', label: 'Articles' },
  { value: 'chapter', label: 'Chapters' },
  { value: 'preprint', label: 'Preprints' },
];

interface Props {
  query: string;
  type: TypeFilter;
  onQuery: (q: string) => void;
  onType: (t: TypeFilter) => void;
}

export function PublicationFilters({ query, type, onQuery, onType }: Props) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <label className="relative block md:w-96">
        <span className="sr-only">Search publications</span>
        <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-mute" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search title, author, journal"
          className="h-11 w-full border-b border-line bg-transparent pl-7 text-[15px] text-paper placeholder:text-mute focus:border-leaf focus:outline-none"
        />
      </label>
      <div role="group" aria-label="Filter by type" className="flex flex-wrap gap-x-5">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={type === o.value}
            onClick={() => onType(o.value)}
            className={cn(
              'relative h-11 text-sm transition-colors',
              type === o.value ? 'text-paper after:absolute after:inset-x-0 after:bottom-2 after:h-px after:bg-leaf' : 'text-mute hover:text-paper',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
