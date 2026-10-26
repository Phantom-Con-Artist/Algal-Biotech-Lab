'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import type { PlacedTile } from '../../../types';
import { Leader } from '../../common/ActionLink';
import { WallPanel } from './WallPanel';

interface Props {
  tiles: PlacedTile[];
  columns: number;
  rows: number;
  copy: { label: string; hint: string; previous: string; next: string };
  /** Corner furniture laid over the wall: the way home, the page name. */
  children?: ReactNode;
}

const GAP = 10;
/** Perspective as a fraction of the radius: close to 1 keeps the lens natural, with little edge stretch. */
const SCALE = 0.92;
/**
 * The panel set repeats round the drum this many times. A larger drum curves less between neighbours,
 * so the wall reads nearly flat across the screen and only bends at its edges.
 */
const REPEAT = 2;

const centreOf = (t: PlacedTile, columns: number) => ((t.col + t.w / 2) / columns) * 360;
const wrap = (deg: number) => ((((deg + 180) % 360) + 360) % 360) - 180;
const fade = (rel: number) => 1 - Math.min(1, Math.max(0, (Math.abs(rel) - 34) / 18));

/**
 * The lab, all round: an inward-facing cylinder of panels that fills the screen, with the visitor at
 * its centre. Scrolling turns it (the page itself never scrolls), as do dragging, swiping, the arrow
 * keys and the buttons; focusing a panel turns it to the front; left alone it drifts. Every panel is a link.
 */
export function CylinderWall({ tiles: set, columns: setColumns, rows, copy, children }: Props) {
  const columns = setColumns * REPEAT;
  const tiles = Array.from({ length: REPEAT }, (_, r) => set.map((t) => ({ ...t, id: r ? `${t.id}~${r}` : t.id, col: t.col + r * setColumns }))).flat();
  const host = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const panels = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const el = host.current;
    const st = stage.current;
    if (!el || !st) return;
    // The wall is the whole screen: no page scroll, no header or footer while it is open.
    document.documentElement.dataset.fullscreen = '';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    /** Every input moves `target`; the wall eases toward it each frame, so motion is always smooth. */
    let angle = 0;
    let target = 0;
    let lastInput = performance.now();
    let raf = 0;
    let dragging = false;
    let moved = 0;
    let lastX = 0;
    let lastY = 0;
    let flick = 0;
    // Degrees per screen pixel from the drum's own geometry (one column of the front panel on screen).
    const degPerPx = () => {
      const rh = (window.innerHeight - 144) / rows;
      return 360 / columns / (rh * 0.82 * SCALE);
    };
    const centres = tiles.map((t) => centreOf(t, columns));

    const apply = () => {
      st.style.transform = `translateZ(var(--P)) rotateY(${-angle}deg)`;
      centres.forEach((c, i) => {
        const p = panels.current[i];
        if (!p) return;
        const o = fade(wrap(c - angle));
        p.style.opacity = String(o);
        p.style.visibility = o > 0.01 ? 'visible' : 'hidden';
      });
    };

    const tick = () => {
      raf = 0;
      // Left alone, the wall keeps turning slowly, as a display in a cockpit would.
      if (!dragging && !reduced && performance.now() - lastInput > 3500) target += 0.03;
      const gap = target - angle;
      angle = reduced || Math.abs(gap) < 0.001 ? target : angle + gap * 0.1;
      apply();
      if (!reduced || angle !== target) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const move = (deg: number) => {
      target += deg;
      lastInput = performance.now();
      kick();
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      moved = 0;
      flick = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      target = angle;
      lastInput = performance.now();
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      // Horizontal drags turn with the hand; vertical swipes (touch) turn the way a scroll would.
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      if (moved > 6 && !el.hasPointerCapture(e.pointerId)) el.setPointerCapture(e.pointerId);
      flick = (dx - (e.pointerType === 'touch' ? dy : 0)) * degPerPx();
      move(flick);
    };
    const onUp = () => {
      dragging = false;
      // A flick carries on a little after the hand lets go.
      move(flick * 8);
      flick = 0;
    };
    const onClick = (e: MouseEvent) => {
      // A drag is never a click.
      if (moved > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      move(-delta * (e.deltaMode === 1 ? 16 : 1) * degPerPx() * 0.6);
    };
    const turn = (dir: number) => move(dir * (360 / columns) * 2);
    const onKey = (e: KeyboardEvent) => {
      const dir = { ArrowLeft: -1, ArrowUp: -1, PageUp: -2, ArrowRight: 1, ArrowDown: 1, PageDown: 2 }[e.key];
      if (!dir) return;
      e.preventDefault();
      turn(dir);
    };
    const onFocus = (e: FocusEvent) => {
      const i = panels.current.findIndex((p) => p?.contains(e.target as Node));
      if (i < 0) return;
      // The nearest way round to the focused panel, so the wall never spins the long way.
      move(wrap(centres[i] - target));
    };
    const buttons = el.querySelectorAll<HTMLButtonElement>('[data-turn]');
    const onButton = (e: Event) => turn(Number((e.currentTarget as HTMLElement).dataset.turn));
    buttons.forEach((b) => b.addEventListener('click', onButton));

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('click', onClick, true);
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    el.addEventListener('focusin', onFocus);
    const onVisibility = () => (document.hidden ? cancelAnimationFrame(raf) : kick());
    document.addEventListener('visibilitychange', onVisibility);
    apply();
    kick();

    return () => {
      delete document.documentElement.dataset.fullscreen;
      cancelAnimationFrame(raf);
      buttons.forEach((b) => b.removeEventListener('click', onButton));
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('click', onClick, true);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      el.removeEventListener('focusin', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [tiles, columns]);

  // Geometry lives in CSS: row height divides the screen; columns follow it; the radius follows the columns.
  const geometry = {
    '--rh': `calc((100svh - 9rem) / ${rows})`,
    '--cw': 'calc(var(--rh) * 0.82)',
    '--R': `calc(var(--cw) * ${columns} / 6.2832)`,
    '--P': `calc(var(--R) * ${SCALE})`,
    perspective: 'var(--P)',
  } as CSSProperties;

  return (
    <div
      ref={host}
      role="region"
      tabIndex={-1}
      aria-roledescription="rotating wall"
      aria-label={copy.label}
      className="fixed inset-0 z-[70] h-svh w-screen cursor-grab touch-none select-none overflow-hidden outline-none active:cursor-grabbing"
      style={geometry}
    >
      <div ref={stage} className="absolute left-1/2 top-[calc(50%+0.5rem)] [transform-style:preserve-3d]" style={{ transform: 'translateZ(var(--P))' }}>
        <ul className="[transform-style:preserve-3d]">
          {tiles.map((t, i) => {
            const centre = centreOf(t, columns);
            const o = fade(wrap(centre));
            return (
              <li
                key={t.id}
                ref={(n) => { panels.current[i] = n; }}
                className="absolute left-0 top-0 origin-top-left [backface-visibility:hidden]"
                style={{
                  // Every panel pivots on the drum's axis (its origin is the stage origin) and is an exact chord of the drum, set at the chord's depth, so neighbours meet
                  // with an even gap instead of cutting into each other at the edges.
                  width: `calc(var(--R) * ${(2 * Math.sin((Math.PI * t.w) / columns)).toFixed(5)} - ${GAP}px)`,
                  height: `calc(var(--rh) * ${t.h} - ${GAP}px)`,
                  transform: `rotateY(${centre}deg) translateZ(calc(var(--R) * -${Math.cos((Math.PI * t.w) / columns).toFixed(5)})) translateY(calc(var(--rh) * ${t.row + t.h / 2 - rows / 2})) translate(-50%, -50%)`,
                  opacity: o,
                  visibility: o > 0.01 ? 'visible' : 'hidden',
                }}
              >
                {/* Repeats are for the eye only: screen readers and the keyboard meet each panel once. */}
                <WallPanel tile={t} hidden={t.id.includes('~')} />
              </li>
            );
          })}
        </ul>
      </div>

      {children}

      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex items-center justify-between gap-4 px-4 sm:px-8 lg:px-[clamp(2.5rem,4vw,4.5rem)]">
        <button type="button" data-turn="-1" aria-label={copy.previous} className="group ticks pointer-events-auto grid h-11 w-11 rotate-180 place-items-center text-ink hover:bg-ink hover:text-frost"><Leader /></button>
        <p className="hud text-center text-mute">{copy.hint}</p>
        <button type="button" data-turn="1" aria-label={copy.next} className="group ticks pointer-events-auto grid h-11 w-11 place-items-center text-ink hover:bg-ink hover:text-frost"><Leader /></button>
      </div>
    </div>
  );
}
