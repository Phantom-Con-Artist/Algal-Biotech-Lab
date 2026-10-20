import type { Milestone } from '../../types';

interface Props {
  items: Milestone[];
  titles: string[];
  notes: string[];
}

export function Timeline({ items, titles, notes }: Props) {
  return (
    <ol className="border-t border-line">
      {items.map((m, i) => (
        <li key={m.place + m.period} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[8rem_1fr] sm:gap-6">
          <span className="font-mono text-xs text-mute sm:pt-0.5">{m.period}</span>
          <div>
            <p className="text-base font-medium">{titles[i]}</p>
            <p className="text-sm text-ink-2">{m.place}</p>
            {notes[i] && <p className="mt-0.5 text-sm text-mute">{notes[i]}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
