'use client';

import { useEffect, useRef, useState } from 'react';
import type { TourStop } from '../../types';
import { TOUR_ASSETS } from '../../data/assets3d';
import { LOOP_TO } from '../../data/labTour';
import { assetsReady } from '../../utils/preload';
import type { TourProjection, TourScene } from './engine/tourScene';
import { TourOverlay, type OverlayHandle } from './TourOverlay';

interface Props {
  stops: TourStop[];
  labels: Record<string, string>;
  copy: { fallback: string; note: string };
}

type Status = 'idle' | 'loading' | 'ready' | 'failed';

const supportsWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') ?? c.getContext('webgl'));
  } catch {
    return false;
  }
};

/** Scroll position as a continuous stop index: 0 in the corridor, stops.length - 1 at the overview. */
function measure(section: HTMLElement) {
  return [...section.querySelectorAll<HTMLElement>('[data-block]')].map((b) => ({ top: b.offsetTop + section.offsetTop, height: b.offsetHeight }));
}

export function TourStage({ stops, labels, copy }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const overlay = useRef<OverlayHandle>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const el = host.current;
    const cv = canvas.current;
    const section = el?.closest('section');
    if (!el || !cv || !section) return;
    if (!supportsWebGL()) {
      setStatus('failed');
      return;
    }

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let scene: TourScene | null = null;
    let blocks = measure(section);
    let progress = -1;
    let frame = 0;
    let cancelled = false;

    const read = () => {
      frame = 0;
      const mid = window.scrollY + window.innerHeight * 0.5;
      let p = 0;
      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        if (mid >= b.top) p = i + Math.min(1, (mid - b.top) / b.height) - 0.5;
      }
      p = Math.max(0, Math.min(blocks.length - 1, p));
      // The last block repeats the threshold: on reaching it, the page steps back to the real one.
      const last = blocks.length - 1;
      if (p >= last && last > LOOP_TO) {
        window.scrollTo({ top: window.scrollY - (blocks[last].top - blocks[LOOP_TO].top), behavior: 'instant' });
        progress = LOOP_TO;
        scene?.jump(LOOP_TO);
        return;
      }
      if (motion.matches) p = Math.round(p);
      if (p === progress) return;
      progress = p;
      scene?.setProgress(p);
      const k = Math.round(p);
      setActive(Math.abs(p - k) < 0.32 ? k : null);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    const onResize = () => {
      blocks = measure(section);
      scene?.resize(el.clientWidth, el.clientHeight);
      onScroll();
    };

    // One scene per mount, however many times the section re-enters view while it loads.
    let starting = false;
    const start = async () => {
      if (starting) return;
      starting = true;
      setStatus('loading');
      await assetsReady(...TOUR_ASSETS);
      const { createTourScene } = await import('./engine/tourScene');
      if (cancelled) return;
      scene = createTourScene({
        canvas: cv,
        stops,
        reducedMotion: motion.matches,
        onFrame: (projection: TourProjection) => overlay.current?.update(projection),
        onReady: () => setStatus('ready'),
        onError: () => setStatus('failed'),
      });
      scene.resize(el.clientWidth, el.clientHeight);
      progress = -1;
      read();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !scene) void start();
        scene?.setVisible(entry.isIntersecting);
      },
      { rootMargin: '200px' },
    );
    io.observe(section);
    const onVisibility = () => scene?.setVisible(!document.hidden);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    const ro = new ResizeObserver(onResize);
    ro.observe(section);
    read();

    return () => {
      cancelled = true;
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      if (frame) cancelAnimationFrame(frame);
      scene?.dispose();
    };
  }, [stops]);

  return (
    <div ref={host} className="sticky top-0 h-svh w-full overflow-hidden" data-status={status}>
      <canvas
        ref={canvas}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-1000 ease-out-quart [[data-status=ready]_&]:opacity-100"
      />
      <TourOverlay ref={overlay} stops={stops} labels={labels} active={status === 'ready' ? active : null} status={status} copy={copy} />
    </div>
  );
}
