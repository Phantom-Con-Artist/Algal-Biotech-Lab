/* ==========================================================================
   "Inside the laboratory" film, in the glow language of the studiokalex reel:
   black ground, blurred heat-ramp light (orange, cream, blue, violet), one
   short white caption at a time, and the lab's own photographs seen through
   the same heat ramp.

   0    a point of light grows into a ring: one cell
   50   two flagella draw out of it
   80   the ring opens like an iris onto the culture flasks
   112  fast cuts through the lab, alternating heat, plain, mono and wave
   206  the last frame melts into a glowing orb
   246  the orb divides in two
   288  end card
   ========================================================================== */
import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Poppins';

const { fontFamily } = loadFont('normal', { weights: ['500'], subsets: ['latin'] });

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const C = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const tw = (f: number, a: number, b: number, x = 0, y = 1, e = ease) => interpolate(f, [a, b], [x, y], { ...C, easing: e });

const W = 1280, H = 720;
const RING = 'radial-gradient(circle, rgba(0,0,0,1) 0 50%, #2f47ff 56%, #fff1e2 64%, #ff8a2e 72%, rgba(255,90,10,0.35) 80%, rgba(255,90,10,0) 88%)';
const ORB = 'radial-gradient(circle at 50% 42%, #ffffff 0 18%, #ffd9b8 30%, #b9b6ff 44%, #ff8a2e 62%, rgba(255,80,0,0.4) 74%, rgba(255,80,0,0) 86%)';

/* crisp light plus a wide bloom behind it */
const Glow: React.FC<{ children: React.ReactNode; soft?: number }> = ({ children, soft = 3 }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ filter: 'blur(34px)', opacity: 0.85, mixBlendMode: 'screen' }}>{children}</AbsoluteFill>
    <AbsoluteFill style={{ filter: `blur(${soft}px)`, mixBlendMode: 'screen' }}>{children}</AbsoluteFill>
  </AbsoluteFill>
);

const Caption: React.FC<{ text: string; from: number; to: number; y?: number }> = ({ text, from, to, y = 0.8 }) => {
  const f = useCurrentFrame();
  const o = Math.min(tw(f, from, from + 8), 1 - tw(f, to - 8, to));
  const b = 8 * (1 - tw(f, from, from + 10));
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: H * y, textAlign: 'center', fontFamily, fontWeight: 500, fontSize: 30, letterSpacing: '-0.03em', color: '#fff', opacity: o, filter: `blur(${b}px)` }}>
      {text}
    </div>
  );
};

const Disc: React.FC<{ x: number; y: number; d: number; bg: string; sx?: number; sy?: number; o?: number }> = ({ x, y, d, bg, sx = 1, sy = 1, o = 1 }) => (
  <div style={{ position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: '50%', background: bg, transform: `scale(${sx}, ${sy})`, opacity: o }} />
);

/* ---------- heat look for photographs ---------- */
const HeatDefs: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <filter id="heat" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0 0.05 0.35 1 1 1" />
            <feFuncG type="table" tableValues="0 0.03 0.25 0.55 0.85 0.97" />
            <feFuncB type="table" tableValues="0 0.45 1 0.2 0.55 0.9" />
          </feComponentTransfer>
        </filter>
        <filter id="wave" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="turbulence" baseFrequency={`0.0015 ${0.045 + Math.sin(f / 6) * 0.01}`} numOctaves={1} seed={3} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={34 + Math.sin(f / 4) * 10} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="liquid" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency={`${0.006 + Math.sin(f / 9) * 0.0018} ${0.0096}`} numOctaves={2} seed={Math.floor(f / 2)} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={48} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
};

type Look = 'heat' | 'plain' | 'mono' | 'wave' | 'liquid';
const LOOK: Record<Look, string> = {
  heat: 'url(#heat) contrast(1.1)',
  plain: 'brightness(1.04) contrast(1.08) saturate(1.08)',
  mono: 'grayscale(1) contrast(1.45)',
  wave: 'url(#wave) contrast(1.08) saturate(1.1)',
  liquid: 'url(#liquid) contrast(1.08) saturate(1.12)',
};

const Photo: React.FC<{ src: string; look: Look; pos?: string; scale?: number; blur?: number; bloom?: boolean }> = ({ src, look, pos, scale = 1, blur = 0, bloom }) => {
  const img = (extra = '') => (
    <Img src={staticFile(`lab/new/${src}`)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos ?? '50% 50%', filter: `${LOOK[look]}${extra}` }} />
  );
  return (
    <AbsoluteFill style={{ scale: String(scale), filter: blur ? `blur(${blur}px)` : undefined }}>
      {img()}
      {bloom && <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.55 }}>{img(' blur(22px)')}</AbsoluteFill>}
    </AbsoluteFill>
  );
};

const Label: React.FC<{ text?: string; len: number }> = ({ text, len }) => {
  const f = useCurrentFrame();
  if (!text) return null;
  const o = interpolate(f, [1, 4, Math.max(5, len - 2), Math.max(6, len)], [0, 1, 1, 0], C);
  return <div style={{ position: 'absolute', left: 44, top: 36, fontFamily, fontWeight: 500, fontSize: 24, letterSpacing: '-0.02em', color: '#fff', opacity: o, textShadow: '0 1px 18px rgba(0,0,0,0.5)' }}>{text}</div>;
};

/* ---------- 0-112: the cell, its flagella, the iris ---------- */
const CellOpen: React.FC = () => {
  const f = useCurrentFrame();
  const cx = W / 2, cy = H / 2 - 10;
  const grow = tw(f, 0, 44, 0.04, 1);
  const breathe = 1 + Math.sin(f / 7) * 0.015;
  const d = 230 * grow * breathe;
  const flag = tw(f, 50, 74, 0, 1, inOut) * (1 - tw(f, 82, 92));
  // iris: from 80 the ring widens past the frame while the photo shows through its centre
  const iris = tw(f, 82, 112, 0, 1, inOut);
  const ringD = d + iris * 1700;
  const hole = ringD * 0.5;
  const photoHeat = 1 - tw(f, 98, 112);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {iris > 0 && (
        <AbsoluteFill style={{ clipPath: `circle(${hole / 2}px at ${cx}px ${cy}px)` }}>
          <Photo src="n02.jpg" look="plain" scale={1.25 - iris * 0.15} />
          <AbsoluteFill style={{ opacity: photoHeat }}><Photo src="n02.jpg" look="heat" scale={1.25 - iris * 0.15} bloom /></AbsoluteFill>
        </AbsoluteFill>
      )}
      <Glow>
        <Disc x={cx} y={cy} d={ringD} bg={RING} o={1 - tw(f, 100, 112)} />
        <svg width={W} height={H} style={{ position: 'absolute', inset: 0, opacity: flag }}>
          <defs>
            <linearGradient id="fl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#fff1e2" /><stop offset="0.5" stopColor="#ff8a2e" /><stop offset="1" stopColor="#7b4dff" /></linearGradient>
          </defs>
          {[-1, 1].map((s) => (
            <path key={s} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - flag}
              d={`M ${cx + s * 22} ${cy - d * 0.46} C ${cx + s * 60} ${cy - d * 0.9}, ${cx + s * 150 + Math.sin(f / 4) * 14 * s} ${cy - d * 0.95}, ${cx + s * 210} ${cy - d * 1.25}`}
              fill="none" stroke="url(#fl)" strokeWidth={9} strokeLinecap="round" />
          ))}
        </svg>
      </Glow>
      <Caption text="One cell." from={8} to={48} />
      <Caption text="Chlamydomonas reinhardtii." from={50} to={84} />
      <Caption text="Grown in the laboratory." from={88} to={112} />
    </AbsoluteFill>
  );
};

/* ---------- 112-206: fast cuts through the lab ---------- */
type Cut = { src: string; look: Look; len: number; pos?: string; label?: string; bloom?: boolean };
const CUTS: Cut[] = [
  { src: 'n02.jpg', look: 'plain', len: 10 },
  { src: 'n06.jpg', look: 'heat', len: 10, pos: '50% 55%', label: 'Growth chamber', bloom: true },
  { src: 'n06.jpg', look: 'plain', len: 8, pos: '50% 55%' },
  { src: 'n01.jpg', look: 'mono', len: 9, pos: '50% 60%', label: 'Orbital shaker' },
  { src: 'n14.jpg', look: 'wave', len: 10, label: 'Tubes and plates' },
  { src: 'n13.jpg', look: 'heat', len: 9, pos: '50% 30%', label: 'Spectrophotometer', bloom: true },
  { src: 'n09.jpg', look: 'plain', len: 8, pos: '50% 60%', label: 'Centrifuge' },
  { src: 'n12.jpg', look: 'mono', len: 9, pos: '50% 45%', label: 'Laminar air-flow cabinet' },
  { src: 'n08.jpg', look: 'heat', len: 9, label: 'Gel electrophoresis', bloom: true },
  { src: 'n15.jpg', look: 'liquid', len: 12, pos: '40% 60%' },
];
const CutView: React.FC<{ c: Cut }> = ({ c }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Photo src={c.src} look={c.look} pos={c.pos} bloom={c.bloom} scale={1.05 + (f / c.len) * 0.08} blur={6 * (1 - tw(f, 0, 4))} />
      <Label text={c.label} len={c.len} />
    </AbsoluteFill>
  );
};

/* ---------- 206-288: the growth chamber melts into an orb, which divides ---------- */
const Orb: React.FC = () => {
  const f = useCurrentFrame(); // local, 0 at 206
  const cx = W / 2, cy = H / 2 - 10;
  const melt = tw(f, 0, 30, 0, 1, inOut);
  const photoR = interpolate(melt, [0, 1], [900, 120]);
  const split = tw(f, 40, 70, 0, 1, inOut);
  const pinch = Math.sin(split * Math.PI) * 0.18;
  const orbO = tw(f, 14, 32);
  const d = 250 - split * 60;
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ clipPath: `circle(${photoR}px at ${cx}px ${cy}px)`, opacity: 1 - tw(f, 18, 34) }}>
        <Photo src="n07.jpg" look="heat" pos="50% 50%" bloom blur={melt * 40} scale={1.1} />
      </AbsoluteFill>
      <Glow soft={6}>
        <Disc x={cx - split * 150} y={cy} d={d} bg={ORB} sx={1 - pinch} sy={1 + pinch * 0.6} o={orbO} />
        <Disc x={cx + split * 150} y={cy} d={d} bg={ORB} sx={1 - pinch} sy={1 + pinch * 0.6} o={orbO * tw(f, 38, 46)} />
      </Glow>
      <Caption text="Measured." from={6} to={38} />
      <Caption text="Divided." from={44} to={82} />
    </AbsoluteFill>
  );
};

/* ---------- 288-330: end card ---------- */
const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const o = tw(f, 0, 12);
  const b = 10 * (1 - tw(f, 0, 14));
  return (
    <AbsoluteFill style={{ background: '#000', alignItems: 'center', justifyContent: 'center', opacity: 1 - tw(f, 34, 42) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: o, filter: `blur(${b}px)` }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff6e8', boxShadow: '0 0 30px 6px rgba(255,170,90,0.45)' }} />
        <div style={{ fontFamily, fontWeight: 500, fontSize: 58, letterSpacing: '-0.0575em', color: '#fff' }}>algalbiotechlab</div>
      </div>
      <div style={{ marginTop: 18, fontFamily, fontWeight: 500, fontSize: 18, letterSpacing: '-0.02em', color: '#cfcfcf', opacity: tw(f, 8, 18) }}>
        Central University of Tamil Nadu, Thiruvarur
      </div>
    </AbsoluteFill>
  );
};

export const AURA_FRAMES = 112 + CUTS.reduce((n, c) => n + c.len, 0) + 82 + 42;

export const LabAura: React.FC = () => {
  let t = 112;
  const cutFrom = CUTS.map((c) => { const at = t; t += c.len; return at; });
  const orbAt = t;
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <HeatDefs />
      <Sequence from={0} durationInFrames={112} layout="none"><CellOpen /></Sequence>
      {CUTS.map((c, i) => (
        <Sequence key={i} from={cutFrom[i]} durationInFrames={c.len} layout="none"><CutView c={c} /></Sequence>
      ))}
      <Sequence from={orbAt} durationInFrames={82} layout="none"><Orb /></Sequence>
      <Sequence from={orbAt + 82} durationInFrames={42} layout="none"><EndCard /></Sequence>
    </AbsoluteFill>
  );
};
