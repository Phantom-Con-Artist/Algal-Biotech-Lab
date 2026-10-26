import Image, { type StaticImageData } from 'next/image';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface Props {
  src: StaticImageData;
  alt: string;
  sizes: string;
  /** Readout set under the frame, left and right. */
  index?: ReactNode;
  caption?: ReactNode;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

/** A photograph held in viewfinder ticks, graded cool to sit in the mist, with a readout beneath. */
export function Specimen({ src, alt, sizes, index, caption, className, imageClassName, priority }: Props) {
  return (
    <figure className={cn('group', className)}>
      <div className="ticks p-2 text-ink/70">
        <div className={cn('relative overflow-hidden bg-mist-lo', imageClassName ?? 'aspect-[4/3]')}>
          <Image
            src={src}
            alt={alt}
            fill
            placeholder="blur"
            priority={priority}
            sizes={sizes}
            className="object-cover saturate-[0.82] contrast-[1.04] transition-[transform,filter] duration-[1.2s] ease-out-quart group-hover:scale-[1.025] group-hover:saturate-100"
          />
        </div>
      </div>
      {(index || caption) && (
        <figcaption className="hud mt-3 flex items-baseline justify-between gap-4 text-mute">
          {caption && <span>{caption}</span>}
          {index && <span className="text-ink">{index}</span>}
        </figcaption>
      )}
    </figure>
  );
}
