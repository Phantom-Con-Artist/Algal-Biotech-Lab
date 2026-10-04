import type { MutableRefObject } from 'react';
import { cn } from '../../utils/cn';
import { fmt } from '../../i18n/config';
import { useT } from '../../i18n/I18nProvider';

interface Props {
  active: number;
  labels: string[];
  sections: MutableRefObject<(HTMLElement | null)[]>;
}

export function ChapterRail({ active, labels, sections }: Props) {
  const t = useT().story;
  return (
    <nav aria-label={t.progress} className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 lg:block xl:right-6">
      <ul>
        {labels.map((label, i) => (
          <li key={label}>
            <button
              type="button"
              aria-label={fmt(t.goTo, { label })}
              aria-current={i === active}
              onClick={() => sections.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              className="group flex h-8 w-9 items-center justify-end"
            >
              <span
                className={cn(
                  'block h-px bg-mute transition-all duration-300 group-hover:bg-leaf',
                  i === active ? 'w-8 bg-leaf' : 'w-3',
                )}
              />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
