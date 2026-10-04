import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface Props {
  children: ReactNode;
  /** Mono caption set beside a scale bar under the framed content. */
  caption?: string;
  className?: string;
}

/** Frames content with graticule corner ticks instead of a box. */
export function Reticle({ children, caption, className }: Props) {
  return (
    <figure className={cn('group/reticle', className)}>
      <div className="reticle p-2 sm:p-2.5">{children}</div>
      {caption && (
        <figcaption className="mt-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
          <ScaleBar />
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** A micrograph-style scale bar: ├────┤ */
export function ScaleBar({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-block h-2 w-10 shrink-0 border-x border-leaf bg-[linear-gradient(var(--color-leaf),var(--color-leaf))] bg-[length:100%_1px] bg-center bg-no-repeat', className)}
    />
  );
}
