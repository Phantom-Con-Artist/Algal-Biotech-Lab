import type { Milestone } from '../../types';

interface Props {
  items: Milestone[];
  /** Translated step titles and notes, index-aligned with `items`. */
  titles: string[];
  notes: string[];
}

export function Timeline({ items, titles, notes }: Props) {
  return (
    <ol className="border-t border-line">
      {items.map((m, i) => (
        <li key={`${m.place}-${m.period}`} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
          <span className="font-mono text-xs text-mute sm:pt-1">{m.period}</span>
          <div>
            <p className="text-[15px] text-paper">{titles[i]}</p>
            <p className="text-sm text-mute">
              {m.place}
              {notes[i] && <span className="text-soft"> · {notes[i]}</span>}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
