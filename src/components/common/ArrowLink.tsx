import type { ReactNode } from 'react';
import { ActionLink } from './ActionLink';

interface Props {
  href: string;
  children: ReactNode;
  className?: string;
  /** The primary action of its section. */
  solid?: boolean;
}

/** Kept for existing call sites; draws the same leader-line link as ActionLink. */
export function ArrowLink({ href, children, className, solid }: Props) {
  return (
    <ActionLink href={href} className={className} primary={solid}>
      {children}
    </ActionLink>
  );
}
