import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface Props {
  number: string;
  label: string;
  title: string;
  id?: string;
  /** Optional link set at the end of the readout line, typically "view all". */
  action?: ReactNode;
  className?: string;
}

/** Section opener: an instrument readout on a hairline (index, label, action), then the heading. */
export function SectionHeader({ number, label, title, id, action, className }: Props) {
  return (
    <header className={cn('mb-10 md:mb-16', className)}>
      <div className="hud flex items-center gap-4 text-mute">
        <span className="text-ink">{number}</span>
        <span>{label}</span>
        <span aria-hidden="true" className="h-px flex-1 bg-line-strong" />
        {action}
      </div>
      <h2 id={id} className="text-h2 mt-6 max-w-[22ch] md:mt-8">{title}</h2>
    </header>
  );
}
