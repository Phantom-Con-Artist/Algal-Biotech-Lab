/* ==========================================================================
   "Inside the laboratory": a motion-graphics cut of the lab's own photographs
   (public/lab/new). Fast cuts, each frame plain or through a treatment:
   - thermal: luminance mapped to a heat ramp
   - wave:    horizontal bands ripple across the frame
   - liquid:  the frame flows through drifting turbulence
   - mono:    hard black and white
   Two devices carry the rhythm: a scan line that sweeps a plain frame into
   its thermal reading, and a triptych of portrait shots that rises in.
   Equipment is named in small type, top left. The film loops on one image.
   ========================================================================== */
import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Poppins';

const { fontFamily } = loadFont('normal', { weights: ['500'], subsets: ['latin'] });

type Look = 'plain' | 'thermal' | 'wave' | 'liquid' | 'mono';
type Frame = { src: string; pos?: string };
export type Scene =
  | ({ kind: 'shot'; len: number; look?: Look; push?: 1 | -1; label?: string } & Frame)
  | ({ kind: 'scan'; len: number; to: Look; label?: string } & Frame)
  | { kind: 'tri'; len: number; panels: [Frame, Frame, Frame]; looks?: [Look, Look, Look]; label?: string };

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const FILTER: Record<Look, string> = {
  plain: 'brightness(1.04) contrast(1.08) saturate(1.08)',
  thermal: 'url(#thermal)',
  wave: 'url(#wave) contrast(1.08) saturate(1.1)',
  liquid: 'url(#liquid) contrast(1.08) saturate(1.12)',
  mono: 'grayscale(1) contrast(1.45) brightness(1.02)',
};

const Filters: React.FC = () => {
  const f = useCurrentFrame();
  const bf = 0.006 + Math.sin(f / 9) * 0.0018;
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <filter id="thermal" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.02 0.12 0.55 0.95 1 1" />
            <feFuncG type="table" tableValues="0.02 0.02 0.08 0.42 0.82 1" />
            <feFuncB type="table" tableValues="0.12 0.55 0.72 0.22 0.12 0.92" />
          </feComponentTransfer>
        </filter>
        <filter id="wave" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="turbulence" baseFrequency={`0.0015 ${0.045 + Math.sin(f / 6) * 0.01}`} numOctaves={1} seed={3} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={34 + Math.sin(f / 4) * 10} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="liquid" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency={`${bf} ${bf * 1.6}`} numOctaves={2} seed={Math.floor(f / 2)} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={48} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
};

const Pic: React.FC<Frame & { look?: Look; scale?: number }> = ({ src, pos, look = 'plain', scale = 1 }) => (
  <AbsoluteFill style={{ overflow: 'hidden' }}>
    <AbsoluteFill style={{ scale: String(scale) }}>
      <Img src={staticFile(`lab/new/${src}`)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos ?? '50% 50%', filter: FILTER[look] }} />
    </AbsoluteFill>
  </AbsoluteFill>
);

const Label: React.FC<{ text?: string; len: number }> = ({ text, len }) => {
  const f = useCurrentFrame();
  if (!text) return null;
  const o = interpolate(f, [2, 6, Math.max(7, len - 3), Math.max(8, len)], [0, 1, 1, 0], clamp);
  const y = interpolate(f, [2, 9], [10, 0], { ...clamp, easing: ease });
  return (
    <div style={{ position: 'absolute', left: 44, top: 36, fontFamily, fontWeight: 500, fontSize: 26, letterSpacing: '-0.02em', color: '#fff', opacity: o, transform: `translateY(${y}px)`, textShadow: '0 1px 18px rgba(0,0,0,0.45)' }}>
      {text}
    </div>
  );
};

const ShotScene: React.FC<{ s: Extract<Scene, { kind: 'shot' }> }> = ({ s }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, s.len], [0, 1], clamp);
  const scale = (s.push ?? 1) === 1 ? 1.04 + p * 0.09 : 1.13 - p * 0.09;
  return (
    <AbsoluteFill>
      <Pic src={s.src} pos={s.pos} look={s.look} scale={scale} />
      <Label text={s.label} len={s.len} />
    </AbsoluteFill>
  );
};

/* a scan line sweeps left to right; behind it the frame reads in the new look */
const ScanScene: React.FC<{ s: Extract<Scene, { kind: 'scan' }> }> = ({ s }) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [4, s.len - 4], [0, 100], { ...clamp, easing: inOut });
  const scale = 1.05 + interpolate(f, [0, s.len], [0, 0.06], clamp);
  return (
    <AbsoluteFill>
      <Pic src={s.src} pos={s.pos} scale={scale} />
      <AbsoluteFill style={{ clipPath: `inset(0 ${100 - x}% 0 0)` }}>
        <Pic src={s.src} pos={s.pos} look={s.to} scale={scale} />
      </AbsoluteFill>
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${x}%`, width: 2, marginLeft: -1, background: '#fff', boxShadow: '0 0 24px 4px rgba(255,255,255,0.55)', opacity: x > 0 && x < 100 ? 1 : 0 }} />
      <Label text={s.label} len={s.len} />
    </AbsoluteFill>
  );
};

/* three portrait frames rise in one after another */
const TriScene: React.FC<{ s: Extract<Scene, { kind: 'tri' }> }> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#000', flexDirection: 'row', gap: 8 }}>
      {s.panels.map((p, i) => {
        const y = interpolate(f, [i * 2, i * 2 + 9], [45, 0], { ...clamp, easing: ease });
        const sc = 1.12 - interpolate(f, [0, s.len], [0, 0.08], clamp);
        return (
          <div key={i} style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
            <AbsoluteFill style={{ transform: `translateY(${y}%)` }}>
              <Pic src={p.src} pos={p.pos} look={s.looks?.[i]} scale={sc} />
            </AbsoluteFill>
          </div>
        );
      })}
      <Label text={s.label} len={s.len} />
    </AbsoluteFill>
  );
};

export const LabFilm: React.FC<{ scenes: Scene[] }> = ({ scenes }) => {
  let t = 0;
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Filters />
      {scenes.map((s, i) => {
        const from = t;
        t += s.len;
        return (
          <Sequence key={i} from={from} durationInFrames={s.len} layout="none">
            {s.kind === 'shot' ? <ShotScene s={s} /> : s.kind === 'scan' ? <ScanScene s={s} /> : <TriScene s={s} />}
          </Sequence>
        );
      })}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 85% 75% at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.32) 100%)' }} />
    </AbsoluteFill>
  );
};

export const labTotal = (scenes: Scene[]) => scenes.reduce((n, s) => n + s.len, 0);

export const LAB_SCENES: Scene[] = [
  { kind: 'shot', src: 'n02.jpg', len: 14, label: 'Cultures' },
  { kind: 'shot', src: 'n02.jpg', len: 10, look: 'liquid' },
  { kind: 'scan', src: 'n06.jpg', pos: '50% 55%', len: 30, to: 'thermal', label: 'Growth chamber' },
  { kind: 'shot', src: 'n01.jpg', pos: '50% 60%', len: 12, label: 'Orbital shaker' },
  { kind: 'shot', src: 'n01.jpg', pos: '50% 60%', len: 9, look: 'thermal' },
  { kind: 'tri', len: 26, panels: [{ src: 'n05.jpg' }, { src: 'n07.jpg', pos: '50% 60%' }, { src: 'n11.jpg' }], looks: ['plain', 'wave', 'plain'] },
  { kind: 'shot', src: 'n14.jpg', pos: '45% 50%', len: 14, look: 'wave', label: 'Tubes and plates' },
  { kind: 'shot', src: 'n13.jpg', pos: '50% 30%', len: 12, look: 'thermal', label: 'Spectrophotometer' },
  { kind: 'shot', src: 'n09.jpg', pos: '50% 60%', len: 10, look: 'mono', label: 'Centrifuge' },
  { kind: 'scan', src: 'n12.jpg', pos: '50% 45%', len: 24, to: 'mono', label: 'Laminar air-flow cabinet' },
  { kind: 'shot', src: 'n08.jpg', len: 12, look: 'thermal', label: 'Gel electrophoresis' },
  { kind: 'shot', src: 'n15.jpg', pos: '40% 60%', len: 12, look: 'liquid' },
  { kind: 'shot', src: 'n03.jpg', pos: '50% 35%', len: 10, label: 'Ultrasonic bath' },
  { kind: 'tri', len: 22, panels: [{ src: 'n07.jpg', pos: '50% 75%' }, { src: 'n06.jpg', pos: '50% 35%' }, { src: 'n05.jpg', pos: '50% 70%' }], looks: ['thermal', 'plain', 'thermal'] },
  { kind: 'shot', src: 'n02.jpg', len: 36, push: -1 },
];
