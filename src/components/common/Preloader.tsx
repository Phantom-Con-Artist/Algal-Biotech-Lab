'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import mark from '../../assets/brand/abl-mark.webp';
import { fetchAsset } from '../../utils/preload';

interface Props {
  /** Files the first screen's scene cannot start without; the page waits for these. */
  critical: string[];
  /** Files later chapters need; fetched quietly once the page is revealed. */
  deferred?: string[];
  label: string;
}

/** Rough size, used until a response reports its own length, so the count never runs backwards. */
const GUESS = 400_000;
/** Never hold the page longer than this, whatever the network does. */
const MAX_MS = 15_000;

/**
 * The opening screen of a page with 3D: the mark, a count and a hairline while the first scene's files
 * arrive. Then it lifts away and the scene starts at once; the rest streams in behind it. A cached visit
 * finishes almost instantly, and without JavaScript the screen never shows.
 */
export function Preloader({ critical, deferred = [], label }: Props) {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'leaving' | 'gone'>('loading');
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    html.dataset.loading = '';
    const loaded = new Map<string, number>();
    const total = new Map<string, number>(critical.map((a) => [a, GUESS]));
    let finished = false;
    let frame = 0;

    // Progress updates are batched to one per frame, so a fast stream never floods React.
    const report = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const sum = (m: Map<string, number>) => [...m.values()].reduce((a, b) => a + b, 0);
        setPct(Math.min(1, sum(loaded) / Math.max(1, sum(total))));
      });
    };
    const finish = () => {
      if (finished) return;
      finished = true;
      setPct(1);
      setPhase('leaving');
      // The later chapters' files follow at low priority, so they never compete with the first scene.
      for (const url of deferred) void fetchAsset(url, undefined, 'low');
    };

    void Promise.all(
      critical.map((url) =>
        fetchAsset(url, (got, size) => {
          total.set(url, size);
          loaded.set(url, Math.min(got, size));
          report();
        }),
      ),
    ).then(finish);
    const cap = window.setTimeout(finish, MAX_MS);
    return () => {
      window.clearTimeout(cap);
      cancelAnimationFrame(frame);
      delete html.dataset.loading;
    };
  }, [critical, deferred]);

  useEffect(() => {
    if (phase !== 'leaving') return;
    delete document.documentElement.dataset.loading;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = window.setTimeout(() => setPhase('gone'), reduced ? 200 : 750);
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (bar.current) bar.current.style.transform = `scaleX(${pct})`;
  }, [pct]);

  if (phase === 'gone') return null;
  const leaving = phase === 'leaving';

  return (
    <div
      id="preloader"
      role="status"
      aria-live="polite"
      aria-label={label}
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-mist transition-[clip-path] duration-700 ease-out-expo motion-reduce:transition-opacity motion-reduce:duration-200"
      style={{ clipPath: leaving ? 'inset(0 0 100% 0)' : 'inset(0 0 0% 0)' }}
    >
      <noscript>
        <style>{'#preloader{display:none}'}</style>
      </noscript>
      <div className={`flex flex-col items-center gap-6 transition-[opacity,transform] duration-300 ease-out-quart ${leaving ? '-translate-y-6 opacity-0' : ''}`}>
        <Image src={mark} alt="" priority sizes="56px" className="h-14 w-14 animate-[preload-breathe_2.4s_ease-in-out_infinite] motion-reduce:animate-none" />
        <p className="font-display text-[clamp(2.5rem,1.8rem+3vw,4rem)] font-light leading-none tabular-nums tracking-[-0.03em]">
          {String(Math.round(pct * 100)).padStart(3, '0')}
        </p>
        <p className="hud text-mute">{label}</p>
      </div>
      <div className="absolute inset-x-4 bottom-10 h-px bg-line sm:inset-x-8 lg:inset-x-[clamp(2.5rem,4vw,4.5rem)]">
        <div ref={bar} className="h-full origin-left bg-ink transition-transform duration-300 ease-out-quart" style={{ transform: 'scaleX(0)' }} />
      </div>
    </div>
  );
}
