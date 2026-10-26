'use client';

import { useEffect, useRef, useState } from 'react';
import { JOURNEY, JOURNEY_START } from '../../../data/journey';
import type { CellPart, CellPartId, JourneyId, JourneyTag } from '../../../types';
import { activeStage, FINAL } from './engine/choreography';
import type { CellScene, Projection } from './engine/scene';
import { CellOverlay, type OverlayHandle, type PartLabels } from './CellOverlay';

interface Props {
  parts: CellPart[];
  labels: PartLabels;
  tags: (JourneyTag & { name: string })[];
  copy: { keyLabel: string; scale: string; loading: string; fallback: string };
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

/**
 * Scroll position as a continuous block index: 0 is the opening, 1 to 9 the structures, 10 the full plate,
 * 11 onward the chapters of how the lab works.
 */
function measure(section: HTMLElement) {
  const blocks = [...section.querySelectorAll<HTMLElement>('[data-block]')];
  return blocks.map((b) => ({ top: b.offsetTop + section.offsetTop, height: b.offsetHeight }));
}

export function CellStage({ parts, labels, tags, copy }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const overlay = useRef<OverlayHandle>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [active, setActive] = useState<CellPartId | null>(null);
  const [final, setFinal] = useState(false);
  const [chapter, setChapter] = useState<JourneyId | null>(null);

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
    const order = parts.map((p) => p.id);
    let scene: CellScene | null = null;
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
      if (motion.matches) p = Math.round(p);
      if (p === progress) return;
      progress = p;
      scene?.setProgress(p);
      const stage = activeStage(p, order);
      setActive(stage);
      const plate = Math.abs(p - FINAL) < 0.45;
      setFinal(plate);
      const k = Math.round(p);
      setChapter(k >= JOURNEY_START && Math.abs(p - k) < 0.3 ? (JOURNEY[k - JOURNEY_START] ?? null) : null);
      scene?.setStained(p > FINAL - 0.6 ? 'all' : stage ? [stage] : []);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    const onResize = () => {
      blocks = measure(section);
      scene?.resize(el.clientWidth, el.clientHeight);
      onScroll();
    };

    const start = async () => {
      setStatus('loading');
      const { createCellScene } = await import('./engine/scene');
      if (cancelled) return;
      scene = createCellScene({
        canvas: cv,
        parts,
        reducedMotion: motion.matches,
        onFrame: (projection: Projection) => overlay.current?.update(projection),
        onReady: () => setStatus('ready'),
        onError: () => setStatus('failed'),
      });
      scene.resize(el.clientWidth, el.clientHeight);
      progress = -1;
      read();
    };

    // Load when the section is near; render only while it is on screen.
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
  }, [parts]);

  return (
    <div ref={host} className="sticky top-0 h-svh w-full overflow-hidden" data-status={status}>
      <canvas
        ref={canvas}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-1000 ease-out-quart [[data-status=ready]_&]:opacity-100"
      />
      <CellOverlay
        ref={overlay}
        parts={parts}
        labels={labels}
        tags={tags}
        chapter={chapter}
        active={active}
        final={final}
        status={status}
        copy={copy}
      />
    </div>
  );
}
