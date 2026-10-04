import type { Milestone } from '../../types';

export function Timeline({ items }: { items: Milestone[] }) {
  return (
    <ol className="border-t border-line">
      {items.map((m) => (
        <li key={`${m.title}-${m.period}`} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
          <span className="font-mono text-xs text-mute sm:pt-1">{m.period}</span>
          <div>
            <p className="text-[15px] text-paper">{m.title}</p>
            <p className="text-sm text-mute">
              {m.place}
              {m.note && <span className="text-soft"> · {m.note}</span>}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
