'use client';

import { useEffect, useRef, useState } from 'react';
import { LiquidBlobs } from '../LiquidBlobs';
import { createOrganism } from './renderer';

/**
 * The hero organism. A WebGL canvas covers the whole hero behind the text; an invisible anchor, placed by CSS,
 * sets where the organism sits and how large it is. It starts when the browser is idle, so it never competes with
 * the page's first paint. Without WebGL it falls back to the SVG drawing, paused while off screen.
 */
export function Organism() {
  const frame = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const anchor = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    let organism: ReturnType<typeof createOrganism> = null;
    const start = () => {
      if (!frame.current || !canvas.current || !anchor.current) return;
      organism = createOrganism({
        canvas: canvas.current,
        frame: frame.current,
        anchor: anchor.current,
        onLost: () => setFallback(true),
      });
      if (!organism) setFallback(true);
    };
    const idle = 'requestIdleCallback' in window;
    const handle = idle ? window.requestIdleCallback(start, { timeout: 1500 }) : window.setTimeout(start, 200);
    return () => {
      if (idle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      organism?.destroy();
    };
  }, []);

  useEffect(() => {
    const el = frame.current;
    if (!fallback || !el) return;
    const io = new IntersectionObserver(([entry]) => el.toggleAttribute('data-paused', !entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [fallback]);

  return (
    <div
      ref={frame}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,rgb(0_0_0/0.28)_50%,black_68%,black_84%,transparent)] lg:[mask-image:linear-gradient(to_bottom,black_80%,transparent)]"
    >
      <canvas ref={canvas} className="absolute inset-0 size-full opacity-0 transition-opacity duration-1000" />
      <div
        ref={anchor}
        className="absolute left-[62%] top-[73%] aspect-square w-[max(165vw,105svh)] -translate-x-1/2 -translate-y-1/2 sm:top-[70%] lg:left-[66%] lg:top-1/2 lg:w-[max(110vw,145svh)]"
      >
        {fallback && <LiquidBlobs className="size-full" />}
      </div>
    </div>
  );
}
