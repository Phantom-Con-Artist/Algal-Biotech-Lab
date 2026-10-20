import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface Props {
  number: string;
  label: string;
  title: string;
  id?: string;
  /** Optional link shown under the heading, typically "view all". */
  action?: ReactNode;
  className?: string;
}

/** Swiss section opener: a hairline rule, the numbered label in the left quarter, the heading across the rest. */
export function SectionHeader({ number, label, title, id, action, className }: Props) {
  return (
    <header className={cn('mb-10 grid gap-5 border-t border-line-strong pt-5 md:mb-16 lg:grid-cols-12 lg:gap-12', className)}>
      <p className="label lg:col-span-3 lg:pt-2">
        <span className="text-ink">{number}</span>
        <span className="mx-2">/</span>
        {label}
      </p>
      <div className="flex flex-col gap-5 lg:col-span-9 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <h2 id={id} className="text-h2 max-w-[20ch] font-medium">{title}</h2>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}
