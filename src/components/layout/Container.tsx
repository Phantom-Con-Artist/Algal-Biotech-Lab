import type { ElementType, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface Props {
  as?: ElementType;
  id?: string;
  className?: string;
  children: ReactNode;
  'aria-labelledby'?: string;
}

/** Full-width page frame with fluid gutters: 16px on phones up to about 64px on wide screens. */
export function Container({ as: Tag = 'div', className, children, ...rest }: Props) {
  return (
    <Tag className={cn('w-full px-4 sm:px-8 lg:px-[clamp(2.5rem,4vw,4.5rem)]', className)} {...rest}>
      {children}
    </Tag>
  );
}
