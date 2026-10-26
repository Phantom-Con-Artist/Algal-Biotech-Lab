'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

/**
 * Marks its content as thawed (data-thawed) once it is well into view, so frost layered over a
 * portrait or a specimen can clear with CSS alone (group-data-[thawed]: variants).
 */
export function Thaw({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.setAttribute('data-thawed', '');
        io.disconnect();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={cn('group', className)}>
      {children}
    </div>
  );
}
