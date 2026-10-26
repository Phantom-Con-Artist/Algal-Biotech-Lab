import { cn } from '../../utils/cn';

/** Keywords as one readout line, separated by slashes. */
export function Tags({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn('hud flex flex-wrap gap-x-2 gap-y-1 text-mute', className)}>
      {items.map((item, i) => (
        <li key={item} className="flex gap-2">
          {item}
          {i < items.length - 1 && <span aria-hidden="true">/</span>}
        </li>
      ))}
    </ul>
  );
}
