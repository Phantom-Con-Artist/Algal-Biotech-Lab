import type { ElementType, ReactNode } from 'react';
import { cn } from '../../utils/cn';

type Tone = 'tile' | 'deep' | 'leaf' | 'bare';

const TONES: Record<Tone, string> = {
  tile: 'bg-tile',
  deep: 'bg-deep text-deep-ink',
  leaf: 'bg-leaf-soft',
  bare: 'border border-line',
};

interface Props {
  as?: ElementType;
  tone?: Tone;
  /** Grid placement and size classes, for example 'lg:col-span-7 lg:row-span-2'. */
  className?: string;
  children: ReactNode;
  id?: string;
}

/** One cell of a bento grid: near-white on paper, square corners, generous padding, rises in on scroll. */
export function BentoTile({ as: Tag = 'div', tone = 'tile', className, children, id }: Props) {
  return (
    <Tag id={id} className={cn('reveal relative flex flex-col rounded-[4px] p-6 sm:p-8 lg:p-10', TONES[tone], className)}>
      {children}
    </Tag>
  );
}
