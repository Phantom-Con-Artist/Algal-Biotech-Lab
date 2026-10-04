import { useEffect, useRef, useState } from 'react';
import { FOCUS_AREAS } from '../../data/focus';
import { useFocusScroll, type FocusFrame } from '../../hooks/useFocusScroll';
import { setScene } from '../3d/sceneState';
import { smoothstep } from '../../utils/math';
import { applyCard, applyCopy } from './focusMotion';
import { FocusCopy } from './FocusCopy';
import { FocusNav } from './FocusNav';
import { useT } from '../../i18n/I18nProvider';

/** Scroll distance per area, in viewport heights. Kept short so one or two swipes move to the next area. */
export const AREA_VH = 110;
const N = FOCUS_AREAS.length;

/** Pinned 3D stage: image cards fly through depth while a bloom of algae grows behind them. */
export function FocusStage() {
  const t = useT().focus;
  const section = useRef<HTMLElement>(null);
  const deck = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[][]>(FOCUS_AREAS.map(() => []));
  const copies = useRef<(HTMLElement | null)[]>([]);
  const pointer = useRef({ x: 0, y: 0, cx: 0, cy: 0 });
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      setScene({ bloom: 0, growth: 0, hue: 0 });
    };
  }, []);

  useFocusScroll(section, N, ({ area, local, visible }: FocusFrame) => {
    if (area !== activeRef.current) {
      activeRef.current = area;
      setActive(area);
    }
    const wide = window.innerWidth >= 768;
    FOCUS_AREAS.forEach((_, i) => {
      const els = cards.current[i];
      els.forEach((el, k) => {
        if (!el) return;
        if (i === area) applyCard(el, k, els.length, local, wide);
        else el.style.visibility = 'hidden';
      });
      const copy = copies.current[i];
      if (copy) applyCopy(copy, i === area, local);
    });

    const p = pointer.current;
    p.cx += (p.x - p.cx) * 0.08;
    p.cy += (p.y - p.cy) * 0.08;
    if (deck.current) {
      deck.current.style.transform = wide ? `rotateY(${p.cx * 6}deg) rotateX(${-p.cy * 4}deg)` : '';
    }

    const growth = smoothstep(0.0, 0.6, local) * (1 - 0.85 * smoothstep(0.88, 1, local));
    const hue = area + (area < N - 1 ? smoothstep(0.9, 1, local) : 0);
    setScene({ bloom: visible, growth, hue });
  });

  const select = (i: number) => {
    const el = section.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const scrollable = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((i + 0.45) / N) * scrollable, behavior: 'smooth' });
  };

  return (
    <section ref={section} data-focus-stage aria-label={t.navLabel} style={{ height: `${AREA_VH * N}svh` }} className="relative">
      <div className="sticky top-0 h-svh overflow-hidden">
        <FocusNav active={active} onSelect={select} />

        <div
          ref={deck}
          className="absolute inset-x-0 top-[7.25rem] h-[34svh] [transform-style:preserve-3d] [perspective:1100px] md:inset-y-0 md:left-auto md:right-0 md:h-auto md:w-[56%]"
        >
          {FOCUS_AREAS.map((area, i) =>
            area.images.map((src, k) => (
              <figure
                key={src}
                ref={(el) => {
                  cards.current[i][k] = el;
                }}
                className="invisible absolute w-[58%] will-change-transform md:w-[46%]"
                style={{ boxShadow: `0 40px 90px -30px ${area.accent}66` }}
              >
                <img
                  src={src}
                  alt={t.areas[area.id].alts[k] ?? ''}
                  width={1200}
                  height={670}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/9] w-full border border-line object-cover"
                />
                <figcaption className="absolute bottom-0 left-0 bg-ink/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
                  {t.illustrative}
                </figcaption>
              </figure>
            )),
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-ink via-ink/90 to-transparent px-5 pb-6 pt-14 sm:px-8 md:inset-y-0 md:right-auto md:flex md:w-[46%] md:items-center md:bg-none md:px-0 md:pb-0 md:pl-12 md:pt-24 lg:pl-[max(3rem,calc((100vw-80rem)/2+3rem))]">
          <div className="grid w-full max-w-[34rem] [&>*]:[grid-area:1/1]">
            {FOCUS_AREAS.map((area, i) => (
              <div
                key={area.id}
                ref={(el) => {
                  copies.current[i] = el;
                }}
                className="invisible"
              >
                <FocusCopy area={area} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
