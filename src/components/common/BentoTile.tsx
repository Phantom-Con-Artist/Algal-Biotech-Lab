import type { ElementType, ReactNode } from 'react';
import { cn } from '../../utils/cn';

type Tone = 'tile' | 'deep' | 'leaf' | 'bare';

const TONES: Record<Tone, string> = {
  tile: 'ticks text-ink [&>*]:text-current',
  deep: 'bg-deep text-deep-ink',
  leaf: 'bg-mist-hi/70',
  bare: 'border-t border-line-strong',
};

interface Props {
  as?: ElementType;
  tone?: Tone;
  /** Grid placement and size classes, for example 'lg:col-span-7 lg:row-span-2'. */
  className?: string;
  children: ReactNode;
  id?: string;
}

/** A region that is genuinely its own object, marked by viewfinder ticks rather than a box. */
export function BentoTile({ as: Tag = 'div', tone = 'tile', className, children, id }: Props) {
  return (
    <Tag id={id} className={cn('reveal relative flex flex-col p-6 sm:p-8 lg:p-10', TONES[tone], className)}>
      {children}
    </Tag>
  );
}
