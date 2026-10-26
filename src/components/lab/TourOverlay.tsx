'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { TourStop } from '../../types';
import { cn } from '../../utils/cn';
import { placeReadouts, type Readout } from '../../utils/leaders';
import type { TourProjection } from './engine/tourScene';

export interface OverlayHandle {
  update: (projection: TourProjection) => void;
}

interface Props {
  stops: TourStop[];
  labels: Record<string, string>;
  /** Index of the stop being read, or null between stops. */
  active: number | null;
  status: 'idle' | 'loading' | 'ready' | 'failed';
  copy: { fallback: string; note: string };
}

const RISE = 52;
const RUN = 46;

/**
 * Readouts pinned to the instruments of the stop being read: a point on the object, an elbowed leader
 * away from the frame's centre, the instrument's name. Positions are written straight to the DOM each frame.
 */
export const TourOverlay = forwardRef<OverlayHandle, Props>(function TourOverlay({ stops, labels, active, status, copy }, ref) {
  const tags = useRef<Record<string, HTMLDivElement | null>>({});
  const leaders = useRef<Record<string, SVGPolylineElement | null>>({});
  const dots = useRef<Record<string, SVGCircleElement | null>>({});
  const ids = [...new Set(stops.flatMap((s) => s.labels))];
  const shown = new Set(active === null ? [] : stops[active].labels);

  // Label sizes, measured once and again only when the screen changes, never per frame.
  const sizes = useRef(new Map<string, { w: number; h: number }>());
  useEffect(() => {
    const clear = () => sizes.current.clear();
    window.addEventListener('resize', clear);
    return () => window.removeEventListener('resize', clear);
  }, []);
  const sizeOf = (id: string, tag: HTMLElement) => {
    let s = sizes.current.get(id);
    if (!s) {
      s = { w: tag.offsetWidth, h: tag.offsetHeight };
      sizes.current.set(id, s);
    }
    return s;
  };

  useImperativeHandle(ref, () => ({
    update({ anchors }) {
      const w = window.innerWidth;
      const readouts: Readout[] = [];
      for (const id of ids) {
        const a = anchors[id];
        const tag = tags.current[id];
        if (a && tag) readouts.push({ id, x: a.x, y: a.y, ...sizeOf(id, tag), side: a.x >= w / 2 ? 1 : -1 });
      }
      const placed = placeReadouts(readouts, w, RISE, RUN, 0.7);
      for (const id of ids) {
        const a = anchors[id];
        const p = placed.get(id);
        const tag = tags.current[id];
        const leader = leaders.current[id];
        const dot = dots.current[id];
        if (!tag || !leader || !dot) continue;
        if (!a || !p) {
          tag.style.visibility = 'hidden';
          leader.setAttribute('points', '');
          dot.setAttribute('r', '0');
          continue;
        }
        leader.setAttribute('points', `${a.x},${a.y} ${p.ex},${p.ey} ${p.fx},${p.ey}`);
        dot.setAttribute('cx', String(a.x));
        dot.setAttribute('cy', String(a.y));
        dot.setAttribute('r', '3.5');
        tag.style.visibility = 'visible';
        tag.style.transform = `translate(${p.fx + p.side * 8}px, ${p.ey}px) translate(${p.side < 0 ? '-100%' : '0'}, -50%)`;
        tag.style.textAlign = p.side < 0 ? 'right' : 'left';
      }
    },
  }));

  return (
    <div className="pointer-events-none absolute inset-0 text-ink">
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
        {ids.map((id) => (
          <g key={id} className={cn('transition-opacity duration-700', shown.has(id) ? 'opacity-100' : 'opacity-0')}>
            <polyline ref={(n) => { leaders.current[id] = n; }} fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
            <circle ref={(n) => { dots.current[id] = n; }} r="0" fill="var(--color-eyespot)" stroke="var(--color-frost)" strokeWidth="1.5" />
          </g>
        ))}
      </svg>
      {ids.map((id) => (
        <div
          key={id}
          aria-hidden="true"
          ref={(n) => { tags.current[id] = n; }}
          className={cn('hud absolute left-0 top-0 whitespace-nowrap bg-frost/80 px-2 py-1 backdrop-blur-sm transition-opacity duration-700', shown.has(id) ? 'opacity-100' : 'opacity-0')}
        >
          {labels[id]}
        </div>
      ))}

      <p className="hud absolute right-4 top-24 max-w-[16rem] text-right normal-case tracking-normal text-mute md:bottom-5 md:top-auto lg:right-[clamp(1.5rem,3vw,3.5rem)]">{copy.note}</p>
      {status === 'failed' && <p className="hud absolute right-4 top-24 max-w-[18rem] text-right text-mute md:right-1/4 md:top-1/3">{copy.fallback}</p>}
    </div>
  );
});
