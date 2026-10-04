import { useCallback, useEffect, useRef, useState } from 'react';
import { clamp } from '../utils/math';

interface Options {
  /** Degrees of rotateY per item of distance from centre. */
  tilt?: number;
  /** Pixels pushed back per item of distance from centre. */
  depth?: number;
  /** Opacity lost per item of distance from centre. */
  fade?: number;
  reduced?: boolean;
}

/**
 * Native horizontal scroll-snap track whose children are tilted in 3D by their
 * distance from the centre. Swipe, trackpad, arrow buttons and keys all work.
 */
export function useCoverflow<T extends HTMLElement>(count: number, { tilt = 26, depth = 0, fade = 0.3, reduced = false }: Options = {}) {
  const track = useRef<T>(null);
  const [current, setCurrent] = useState(0);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement;
      const d = (c.offsetLeft + c.offsetWidth / 2 - mid) / c.offsetWidth;
      if (Math.abs(d) < bestDist) {
        bestDist = Math.abs(d);
        best = i;
      }
      if (reduced) return;
      const k = clamp(d, -1.5, 1.5);
      const a = Math.abs(k);
      c.style.transform = `perspective(1000px) translateZ(${-a * depth}px) rotateY(${-k * tilt}deg) scale(${1 - a * 0.08})`;
      c.style.opacity = String(1 - a * fade);
    });
    setCurrent(best);
  }, [reduced, tilt, depth, fade]);

  useEffect(() => {
    update();
    let raf = 0;
    const onScroll = () => {
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          update();
        });
      }
    };
    const el = track.current;
    el?.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      el?.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [update]);

  const goTo = useCallback(
    (index: number) => {
      const el = track.current;
      const target = el?.children[clamp(index, 0, count - 1)] as HTMLElement | undefined;
      if (el && target) {
        el.scrollTo({ left: target.offsetLeft - (el.clientWidth - target.offsetWidth) / 2, behavior: reduced ? 'auto' : 'smooth' });
      }
    },
    [count, reduced],
  );

  return { track, current, goTo };
}
