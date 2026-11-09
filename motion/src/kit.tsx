/* ==========================================================================
   Shared kit for the laboratory's process clips.
   Black line work on white, one typeface (Schibsted Grotesk, as on the site),
   a slow camera push, and step captions. Every clip starts and ends on an
   empty frame so it loops without a cut.
   ========================================================================== */
import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/SchibstedGrotesk';

export const { fontFamily } = loadFont('normal', { weights: ['400', '500', '600'], subsets: ['latin'] });

export const W = 1600;
export const H = 1000;
export const INK = '#000000';
export const INK2 = '#3b3b3b';
export const INK3 = '#6a6a6a';
export const LINE = '#cfcfcf';
export const FILL = '#f2f2f2';

export const out = Easing.bezier(0.16, 1, 0.3, 1);
export const inOut = Easing.bezier(0.65, 0, 0.35, 1);

/** clamp-interpolate between two frames */
export const tw = (f: number, a: number, b: number, from = 0, to = 1, easing = out) =>
  interpolate(f, [a, b], [from, to], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing });

/** 0→1 in, hold, 1→0 out */
export const life = (f: number, a: number, b: number, c: number, d: number) =>
  Math.min(tw(f, a, b), 1 - tw(f, c, d, 0, 1, inOut));

/* ---------- A path that draws itself ---------- */
export const Draw: React.FC<{
  d: string; p: number; w?: number; color?: string; fill?: string; dash?: string; opacity?: number;
}> = ({ d, p, w = 3, color = INK, fill = 'none', dash, opacity = 1 }) => (
  <path
    d={d}
    pathLength={1}
    fill={fill}
    stroke={color}
    strokeWidth={w}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeDasharray={dash ?? '1 1'}
    strokeDashoffset={dash ? 0 : 1 - p}
    opacity={dash ? p * opacity : opacity}
  />
);

/* ---------- Stage: camera push, loop-safe fades, background ---------- */
export const Stage: React.FC<{ children: React.ReactNode; focus?: [number, number]; push?: number }> = ({
  children, focus = [W / 2, H / 2], push = 0.07,
}) => {
  const f = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const fade = Math.min(tw(f, 0, 14, 0, 1, inOut), 1 - tw(f, D - 20, D - 2, 0, 1, inOut));
  return (
    <AbsoluteFill style={{ background: '#ffffff', fontFamily }}>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 70% 70% at 50% 48%, #ffffff 55%, #f1f1f1 100%)',
        }}
      />
      <AbsoluteFill
        style={{
          opacity: fade,
          scale: interpolate(f, [0, D], [1, 1 + push], { extrapolateRight: 'clamp' }),
          transformOrigin: `${(focus[0] / W) * 100}% ${(focus[1] / H) * 100}%`,
        }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
          {children}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- Step captions (outside the camera, so they stay sharp and still) ---------- */
export type Step = { at: number; title: string; note?: string };
export const Captions: React.FC<{ steps: Step[] }> = ({ steps }) => {
  const f = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const i = Math.max(0, steps.reduce((acc, s, k) => (f >= s.at ? k : acc), 0));
  const s = steps[i];
  const end = i < steps.length - 1 ? steps[i + 1].at : D - 20;
  const vis = life(f, s.at, s.at + 14, end - 10, end);
  const whole = Math.min(tw(f, 0, 14), 1 - tw(f, D - 20, D - 4, 0, 1, inOut));
  return (
    <AbsoluteFill style={{ fontFamily, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 96, right: 96, bottom: 72, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40, opacity: whole }}>
        <div style={{ opacity: vis, translate: `0 ${(1 - vis) * 14}px` }}>
          <div style={{ fontSize: 26, fontWeight: 500, color: INK3, letterSpacing: '0.02em' }}>Step {i + 1} of {steps.length}</div>
          <div style={{ fontSize: 50, fontWeight: 600, color: INK, letterSpacing: '-0.02em', lineHeight: 1.1, marginTop: 8 }}>{s.title}</div>
          {s.note && <div style={{ fontSize: 30, color: INK2, marginTop: 8 }}>{s.note}</div>}
        </div>
        <div style={{ display: 'flex', gap: 10, paddingBottom: 14 }}>
          {steps.map((_, k) => (
            <div key={k} style={{ width: 56, height: 3, background: LINE, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: INK, transformOrigin: 'left', scale: `${k < i ? 1 : k === i ? tw(f, s.at, end, 0, 1, Easing.linear) : 0} 1` }} />
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Text label in the drawing ---------- */
export const Label: React.FC<{ x: number; y: number; o: number; size?: number; anchor?: 'start' | 'middle' | 'end'; color?: string; weight?: number; children: React.ReactNode }> = ({
  x, y, o, size = 30, anchor = 'middle', color = INK, weight = 500, children,
}) => (
  <text x={x} y={y + (1 - o) * 10} opacity={o} fontSize={size} fontWeight={weight} textAnchor={anchor} fill={color} fontFamily={fontFamily} letterSpacing="-0.01em">
    {children}
  </text>
);

/* ---------- Shapes ---------- */
/** An egg-shaped cell outline centred at (cx, cy) */
export const cellPath = (cx: number, cy: number, rx: number, ry: number, wob = 0, phase = 0) => {
  const n = 48;
  let d = '';
  for (let k = 0; k <= n; k++) {
    const a = (k / n) * Math.PI * 2;
    const egg = 1 + 0.08 * Math.sin(a);
    const w = 1 + wob * Math.sin(a * 5 + phase);
    const x = cx + Math.cos(a) * rx * w;
    const y = cy + Math.sin(a) * ry * egg * w;
    d += (k ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1);
  }
  return d + 'Z';
};

export const hexPath = (cx: number, cy: number, r: number) => {
  let d = '';
  for (let k = 0; k < 6; k++) {
    const a = (Math.PI / 3) * k + Math.PI / 6;
    d += (k ? 'L' : 'M') + (cx + Math.cos(a) * r).toFixed(1) + ',' + (cy + Math.sin(a) * r).toFixed(1);
  }
  return d + 'Z';
};

export const zigzag = (x: number, y: number, n: number, step = 26, amp = 14) => {
  let d = `M${x},${y}`;
  for (let k = 1; k <= n; k++) d += ` L${x + k * step},${y + (k % 2 ? -amp : amp) * 0.5}`;
  return d;
};

/** deterministic pseudo-random */
export const rnd = (i: number, s = 1) => {
  const x = Math.sin(i * 127.1 * s + s * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** point along a quadratic curve */
export const quad = (t: number, a: [number, number], c: [number, number], b: [number, number]): [number, number] => [
  (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t ** 2 * b[0],
  (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t ** 2 * b[1],
];
