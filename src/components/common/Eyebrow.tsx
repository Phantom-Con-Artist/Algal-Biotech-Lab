import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface Props {
  number?: string;
  children: ReactNode;
  className?: string;
}

export function Eyebrow({ number, children, className }: Props) {
  return (
    <p className={cn('font-mono text-xs uppercase tracking-[0.14em] text-mute', className)}>
      {number && <span className="text-leaf">{number}</span>}
      {number && <span className="mx-2 text-line">—</span>}
      {children}
    </p>
  );
}
