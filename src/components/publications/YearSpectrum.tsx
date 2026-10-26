'use client';

import { useEffect, useState } from 'react';
import { fmt } from '../../i18n/locales-meta';
import { cn } from '../../utils/cn';

interface Props {
  /** Every year from the first paper to the latest, with its count overall and in the current filter. */
  years: { year: number; all: number; shown: number }[];
  label: string;
  jump: string;
}

/**
 * The record as a spectrum: one bar per year, as tall as that year's output. The year being read
 * lights up; a bar jumps to its year. Years the filter has emptied stay as faint ghosts.
 */
export function YearSpectrum({ years, label, jump }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(1, ...years.map((y) => y.all));

  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>('[data-year]')];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number(e.target.getAttribute('data-year')));
      },
      { rootMargin: '-35% 0px -60% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [years]);

  return (
    <nav aria-label={label} className="mt-10">
      <p className="hud mb-3 text-mute">{label}</p>
      <ol className="flex h-28 items-end gap-[3px] border-b border-line-strong sm:gap-1.5">
        {years.map(({ year, all, shown }) => (
          <li key={year} className="flex h-full flex-1 flex-col justify-end">
            <a
              href={shown ? `#y${year}` : undefined}
              aria-disabled={!shown}
              aria-label={fmt(jump, { year, n: shown })}
              className={cn('group relative flex h-full min-h-11 flex-col justify-end', !shown && 'pointer-events-none')}
            >
              <span className="relative block w-full" style={{ height: `${(all / max) * 100}%` }}>
                <span className="absolute inset-0 bg-line" />
                <span
                  className={cn('absolute inset-x-0 bottom-0 origin-bottom transition-[height,background-color] duration-500 ease-out-quart', active === year ? 'bg-eyespot' : 'bg-ink/70 group-hover:bg-ink')}
                  style={{ height: `${all ? (shown / all) * 100 : 0}%` }}
                />
              </span>
            </a>
          </li>
        ))}
      </ol>
      <ol aria-hidden="true" className="hud mt-2 flex gap-[3px] text-mute sm:gap-1.5">
        {years.map(({ year }, i) => (
          <li key={year} className={cn('flex-1 text-center', active === year && 'text-ink', i % 2 === 1 && 'max-sm:invisible')}>
            {String(year).slice(2)}
          </li>
        ))}
      </ol>
    </nav>
  );
}
