import { TEAM } from '../../data/team';

export function DirectLines() {
  return (
    <ul className="border-t border-line">
      {TEAM.map((m) => (
        <li key={m.id} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[14rem_1fr] sm:gap-6">
          <span className="text-[15px] text-paper">{m.name}</span>
          <a href={`mailto:${m.email}`} className="inline-flex min-h-11 items-center break-all font-mono text-xs text-soft transition-colors hover:text-leaf sm:min-h-0">
            {m.email}
          </a>
        </li>
      ))}
    </ul>
  );
}
