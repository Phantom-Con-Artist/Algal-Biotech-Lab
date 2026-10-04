import type { ElementType, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface Props {
  as?: ElementType;
  className?: string;
  id?: string;
  children: ReactNode;
}

export function Container({ as: Tag = 'div', className, id, children }: Props) {
  return <Tag id={id} className={cn('mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12', className)}>{children}</Tag>;
}
