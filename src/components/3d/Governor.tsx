import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { load, type Quality } from './quality';

const WINDOW = 50;
/** The full-quality tier only ever gives up resolution, never points, so its look is not thinned out. */
const MAX_STEPS = { software: 4, low: 4, mid: 3, high: 2 };
/** Slow windows in a row needed before anything is given up, so one hitch (an image decoding) costs nothing. */
const STRIKES = 3;
/** Seconds after start during which frame times are not judged: loading makes them unrepresentative. */
const WARM_UP = 2.5;

/**
 * Keeps the scene affordable. It caps the frame rate where the preset asks for
 * it, and watches frame times: when the device cannot keep up it sheds load in
 * steps and never climbs back, so the picture does not flicker between levels.
 * Resolution goes first, because filling pixels is what a weak or absent GPU
 * struggles with; only then are fewer points drawn.
 */
export function Governor({ quality, reduced }: { quality: Quality; reduced: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  const setDpr = useThree((s) => s.setDpr);
  const sample = useRef({ total: 0, frames: 0, steps: 0, strikes: 0 });

  useEffect(() => {
    load.fraction = 1;
    load.pointScale = quality.pointScale;
    if (reduced || quality.fps === null) return;
    const interval = 1000 / quality.fps;
    let raf = 0;
    let last = 0;
    const tick = (time: number) => {
      raf = requestAnimationFrame(tick);
      if (time - last >= interval - 2) {
        last = time;
        invalidate();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [quality, reduced, invalidate]);

  useFrame((state, delta) => {
    const s = sample.current;
    if (state.clock.elapsedTime < WARM_UP) return;
    // Ignore the long gaps left by a hidden tab or a page load.
    if (reduced || s.steps >= MAX_STEPS[quality.tier] || delta > 0.4) return;
    s.total += delta;
    s.frames += 1;
    if (s.frames < WINDOW) return;
    const average = s.total / s.frames;
    s.total = 0;
    s.frames = 0;
    const budget = quality.fps === null ? 1 / 28 : 1.4 / quality.fps;
    if (average <= budget) {
      s.strikes = 0;
      return;
    }
    s.strikes += 1;
    if (s.strikes < STRIKES) return;
    s.strikes = 0;
    s.steps += 1;
    if (s.steps <= 2) setDpr(Math.min(window.devicePixelRatio, quality.dpr) * 0.8 ** s.steps);
    else load.fraction *= 0.7;
  });

  return null;
}
