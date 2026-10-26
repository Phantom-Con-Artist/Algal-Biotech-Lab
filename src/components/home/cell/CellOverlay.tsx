'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import type { CellPart, CellPartId, JourneyId, JourneyTag } from '../../../types';
import { cn } from '../../../utils/cn';
import { stainStyle } from '../../../utils/stain';
import type { Projection } from './engine/scene';

export interface OverlayHandle {
  update: (projection: Projection) => void;
}

export type PartLabels = Record<string, { name: string; measure: string }>;

interface Props {
  parts: CellPart[];
  labels: PartLabels;
  /** Lab readouts, with their visible names, shown while their chapter is on screen. */
  tags: (JourneyTag & { name: string })[];
  active: CellPartId | null;
  chapter: JourneyId | null;
  final: boolean;
  status: 'idle' | 'loading' | 'ready' | 'failed';
  copy: { keyLabel: string; scale: string; loading: string; fallback: string };
}

/** Scale-bar lengths per unit; the overlay picks the one that draws closest to 96px. */
const STEPS = [0.5, 1, 2, 5, 10, 20, 50, 100];
const RISE = 46;
const RUN = 54;

/** Instrument layer over the scene: an elbowed leader and readout per object, the index, a live scale bar. */
export const CellOverlay = forwardRef<OverlayHandle, Props>(function CellOverlay({ parts, labels, tags, active, chapter, final, status, copy }, ref) {
  const tagEls = useRef<Record<string, HTMLDivElement | null>>({});
  const leaders = useRef<Record<string, SVGPolylineElement | null>>({});
  const dots = useRef<Record<string, SVGCircleElement | null>>({});
  const bar = useRef<HTMLDivElement>(null);
  const barLabel = useRef<HTMLSpanElement>(null);
  const ids = [...parts.map((p) => p.id as string), ...tags.map((t) => t.id)];

  useImperativeHandle(ref, () => ({
    update({ anchors, pxPerUnit, unit }) {
      const pts = Object.values(anchors);
      const cx = pts.reduce((s, p) => s + p.x, 0) / Math.max(1, pts.length);
      for (const id of ids) {
        const a = anchors[id];
        const tag = tagEls.current[id];
        const leader = leaders.current[id];
        const dot = dots.current[id];
        if (!tag || !leader || !dot) continue;
        if (!a) {
          tag.style.visibility = 'hidden';
          leader.setAttribute('points', '');
          continue;
        }
        // Leaders leave the object diagonally, away from the figure's centre, then run flat to the readout.
        const side = a.x >= cx ? 1 : -1;
        const ex = a.x + side * RISE * 0.8;
        const ey = a.y - RISE;
        const fx = ex + side * RUN;
        leader.setAttribute('points', `${a.x},${a.y} ${ex},${ey} ${fx},${ey}`);
        dot.setAttribute('cx', String(a.x));
        dot.setAttribute('cy', String(a.y));
        tag.style.visibility = 'visible';
        tag.style.transform = `translate(${fx + side * 8}px, ${ey}px) translate(${side < 0 ? '-100%' : '0'}, -50%)`;
        tag.style.textAlign = side < 0 ? 'right' : 'left';
      }
      const step = STEPS.reduce((best, s) => (Math.abs(s * pxPerUnit - 96) < Math.abs(best * pxPerUnit - 96) ? s : best));
      if (bar.current) bar.current.style.width = `${step * pxPerUnit}px`;
      if (barLabel.current) barLabel.current.textContent = copy.scale.replace('{n}', String(step)).replace('{unit}', unit);
    },
  }));

  const ready = status === 'ready';
  const items = [
    ...parts.map((p) => ({ id: p.id as string, index: String(p.key).padStart(2, '0'), name: labels[p.id].name, measure: active === p.id ? labels[p.id].measure : '', stain: p.stain, shown: ready && (final || active === p.id) })),
    ...tags.map((t, i) => ({ id: t.id, index: String(i + 1).padStart(2, '0'), name: t.name, measure: '', stain: undefined, shown: ready && chapter === t.chapter })),
  ];

  return (
    <div className="pointer-events-none absolute inset-0 text-ink">
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
        {items.map((it) => (
          <g key={it.id} style={it.stain ? stainStyle(it.stain) : undefined} className={cn('transition-opacity duration-700', it.shown ? 'opacity-100' : 'opacity-0')}>
            <polyline ref={(n) => { leaders.current[it.id] = n; }} fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.55" />
            <circle ref={(n) => { dots.current[it.id] = n; }} r="3.5" fill={it.stain ? 'var(--stain)' : 'var(--color-ink)'} stroke="var(--color-frost)" strokeWidth="1.5" />
          </g>
        ))}
      </svg>

      {items.map((it) => (
        <div
          key={it.id}
          aria-hidden="true"
          ref={(n) => { tagEls.current[it.id] = n; }}
          className={cn('hud absolute left-0 top-0 whitespace-nowrap transition-opacity duration-700', it.shown ? 'opacity-100' : 'opacity-0')}
        >
          <span className="block text-ink">{it.stain ? `${it.index} / ` : ''}{it.name}</span>
          {it.measure && <span className="block normal-case text-mute">{it.measure}</span>}
        </div>
      ))}

      {/* The index of the cell's structures: always readable, and each entry jumps to its readout. */}
      <nav
        aria-label={copy.keyLabel}
        className={cn('pointer-events-auto absolute right-3 top-1/2 hidden -translate-y-1/2 transition-opacity duration-700 md:block lg:right-[clamp(1.5rem,3vw,3.5rem)]', chapter && 'pointer-events-none opacity-0')}
      >
        <ol className="hud flex flex-col text-mute">
          {parts.map((p) => (
            <li key={p.id} style={stainStyle(p.stain)}>
              <a
                href={`#cell-${p.id}`}
                tabIndex={chapter ? -1 : undefined}
                aria-current={active === p.id ? 'step' : undefined}
                className={cn('flex min-h-8 items-center justify-end gap-3 transition-colors hover:text-ink', active === p.id && 'text-ink')}
              >
                <span className={cn('hidden xl:inline', active !== p.id && 'xl:opacity-60')}>{labels[p.id].name}</span>
                <span className={cn('h-px transition-all duration-500', active === p.id ? 'w-8 bg-ink' : 'w-3 bg-line-strong')} />
                <span className="w-5 text-right">{String(p.key).padStart(2, '0')}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="hud absolute bottom-5 right-4 flex flex-col items-end gap-1.5 text-mute lg:right-[clamp(1.5rem,3vw,3.5rem)]">
        <div ref={bar} className="h-px w-16 bg-ink" aria-hidden="true" />
        <span ref={barLabel} className="normal-case">{copy.scale.replace('{n}', '5').replace('{unit}', 'µm')}</span>
      </div>

      {status === 'loading' && <p className="hud absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-mute">{copy.loading}</p>}
      {status === 'failed' && <p className="hud absolute right-4 top-24 max-w-[18rem] text-right text-mute md:right-1/4 md:top-1/3">{copy.fallback}</p>}
    </div>
  );
});
