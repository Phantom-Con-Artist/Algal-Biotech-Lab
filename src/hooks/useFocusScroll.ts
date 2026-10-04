import { useEffect, useRef, type RefObject } from 'react';
import { clamp } from '../utils/math';

export interface FocusFrame {
  /** Damped 0..1 progress through the pinned section. */
  progress: number;
  area: number;
  /** 0..1 progress within the current area. */
  local: number;
  /** 0..1 how much the section is on screen (fades the 3D scene in and out). */
  visible: number;
}

/** Drives a pinned, tall section: calls `onFrame` every animation frame while it is on screen. */
export function useFocusScroll(
  ref: RefObject<HTMLElement | null>,
  areas: number,
  onFrame: (frame: FocusFrame) => void,
): void {
  const handler = useRef(onFrame);
  handler.current = onFrame;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let target = 0;
    let cur = 0;
    let visible = 0;
    let raf = 0;

    const measure = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      target = clamp(-r.top / Math.max(r.height - vh, 1));
      visible = clamp((vh * 0.9 - r.top) / (vh * 0.6)) * clamp((r.bottom - vh * 0.1) / (vh * 0.6));
    };

    const tick = () => {
      raf = 0;
      measure();
      cur += (target - cur) * 0.2;
      if (Math.abs(target - cur) < 0.0004) cur = target;
      const scaled = cur * areas;
      const area = Math.min(areas - 1, Math.floor(scaled));
      handler.current({ progress: cur, area, local: clamp(scaled - area), visible });
      if (visible > 0.001 || cur !== target) raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    wake();
    window.addEventListener('scroll', wake, { passive: true });
    window.addEventListener('resize', wake);
    return () => {
      window.removeEventListener('scroll', wake);
      window.removeEventListener('resize', wake);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, areas]);
}
