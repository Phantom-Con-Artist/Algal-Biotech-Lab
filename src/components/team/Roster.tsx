'use client';

import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Leader } from '../common/ActionLink';

export interface RosterRow {
  slug: string;
  href: string;
  name: string;
  role: string;
  joined: number;
  /** The year spelled out for screen readers, for example "Joined 2023". */
  joinedText: string;
  focus: string;
  photo: StaticImageData;
  position?: string;
  alt: string;
}

/**
 * The researchers as an index, one line each. On a pointer screen the portrait of the line under the
 * cursor follows it in a frosted pane that thaws clear; on a phone each line carries its own portrait,
 * which thaws as the line crosses the middle of the screen.
 */
export function Roster({ rows }: { rows: RosterRow[] }) {
  const list = useRef<HTMLOListElement>(null);
  const pane = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  // The pane trails the cursor with a little lag, so it reads as a held object rather than a tooltip.
  useEffect(() => {
    const el = pane.current;
    const ol = list.current;
    if (!el || !ol || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const target = { x: 0, y: 0 };
    const at = { x: 0, y: 0 };
    let raf = 0;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tick = () => {
      at.x += (target.x - at.x) * (still ? 1 : 0.16);
      at.y += (target.y - at.y) * (still ? 1 : 0.16);
      el.style.transform = `translate3d(${at.x}px, ${at.y}px, 0)`;
      raf = Math.abs(target.x - at.x) + Math.abs(target.y - at.y) > 0.3 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e: PointerEvent) => {
      target.x = e.clientX + 28;
      target.y = e.clientY - 120;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    ol.addEventListener('pointermove', move);
    return () => {
      ol.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Below md each line carries its portrait; the line nearest the middle of the screen thaws it.
  useEffect(() => {
    const ol = list.current;
    if (!ol) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.toggleAttribute('data-thawed', e.isIntersecting)),
      { rootMargin: '-42% 0px -42% 0px' },
    );
    ol.querySelectorAll('li').forEach((li) => io.observe(li));
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative">
      <ol ref={list} className="border-t border-line-strong" onPointerLeave={() => setHover(null)}>
        {rows.map((r, i) => (
          <li key={r.slug} className="group border-b border-line" onPointerEnter={() => setHover(i)}>
            <Link
              href={r.href}
              className="grid min-h-11 grid-cols-[3.5rem_1fr_auto] items-center gap-x-4 py-4 transition-colors duration-300 hover:bg-frost/60 md:grid-cols-[3rem_minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,1.2fr)_4rem_1.5rem] md:gap-x-6 md:py-6"
            >
              {/* Phones: the portrait sits in the line, frosted until the line reaches the middle. */}
              <span className="relative block aspect-[4/5] w-14 overflow-hidden bg-mist-lo md:hidden">
                <Image src={r.photo} alt="" fill sizes="56px" placeholder="blur" style={{ objectPosition: r.position }} className="object-cover blur-[3px] grayscale saturate-50 transition-[filter] duration-700 ease-out-quart group-data-[thawed]:blur-none group-data-[thawed]:grayscale-0 group-data-[thawed]:saturate-100" />
              </span>
              <span className="hud hidden text-mute md:block">{String(i + 1).padStart(2, '0')}</span>
              <span className="min-w-0">
                <span className="block font-display text-[1.125rem] font-light leading-tight transition-transform duration-500 ease-out-quart md:text-[clamp(1.25rem,0.9rem+1vw,1.75rem)] md:group-hover:translate-x-2">
                  {r.name}
                </span>
                <span className="hud mt-1 block text-mute md:hidden">{r.role}</span>
              </span>
              <span className="hud hidden text-ink-2 md:block">{r.role}</span>
              <span className="hidden text-[0.8125rem] leading-snug text-mute md:line-clamp-2">{r.focus}</span>
              <span className="hud text-right text-mute md:text-left">
                <span className="sr-only">{r.joinedText}</span>
                <span aria-hidden="true">{r.joined}</span>
              </span>
              <span className="hidden text-mute transition-colors group-hover:text-ink md:block"><Leader /></span>
            </Link>
          </li>
        ))}
      </ol>

      {/* The pane that follows the cursor: frost over the portrait, clearing once it settles. */}
      <div ref={pane} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-40 hidden w-56 md:block">
        {rows.map((r, i) => (
          <div
            key={r.slug}
            className={`ticks absolute inset-x-0 top-0 p-1.5 text-ink/70 transition-[opacity,transform] duration-500 ease-out-quart ${hover === i ? 'opacity-100' : 'scale-[0.96] opacity-0'}`}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-mist-lo">
              <Image src={r.photo} alt={r.alt} fill sizes="224px" placeholder="blur" style={{ objectPosition: r.position }} className={`object-cover transition-[filter,transform] duration-700 ease-out-quart ${hover === i ? 'blur-none saturate-100' : 'scale-105 blur-md saturate-50'}`} />
              <div className={`absolute inset-0 bg-frost/50 transition-opacity duration-700 ease-out-quart ${hover === i ? 'opacity-0' : 'opacity-100'}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
