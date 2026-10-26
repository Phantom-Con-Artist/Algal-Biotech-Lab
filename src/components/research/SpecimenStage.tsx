'use client';

import { useEffect, useRef } from 'react';

/**
 * The one canvas behind every research specimen. It loads three.js only once a specimen slot nears the
 * screen, then draws each specimen into its slot; without WebGL the slots simply stay empty frames.
 */
export function SpecimenStage() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    const slots = [...document.querySelectorAll<HTMLElement>('[data-specimen]')];
    if (!cv || !slots.length) return;
    let stage: { dispose: () => void } | null = null;
    let cancelled = false;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const io = new IntersectionObserver(
      (entries) => {
        if (stage || !entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        void import('./engine/stage').then(({ createStage }) => {
          if (cancelled) return;
          try {
            stage = createStage(cv, slots, motion.matches);
          } catch {
            stage = null;
          }
        });
      },
      { rootMargin: '400px' },
    );
    for (const s of slots) io.observe(s);
    return () => {
      cancelled = true;
      io.disconnect();
      stage?.dispose();
    };
  }, []);

  return <canvas ref={canvas} aria-hidden="true" className="pointer-events-none fixed inset-0 z-10 h-svh w-full" />;
}
