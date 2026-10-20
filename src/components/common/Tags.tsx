import { cn } from '../../utils/cn';

/** Keyword chips: square, hairline, small. */
export function Tags({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)}>
      {items.map((item) => (
        <li key={item} className="rounded-[2px] border border-line px-2 py-1 text-xs leading-none text-ink-2">
          {item}
        </li>
      ))}
    </ul>
  );
}
