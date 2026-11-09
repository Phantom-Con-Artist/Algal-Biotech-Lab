/* ==========================================================================
   Hero reel: fast-cut cinematic shots, from a single cell to an open pond.
   Hard cuts and whip pans, one push or pan per shot, a light grade and a
   vignette. No grain: it would cost most of the file budget.
   Stills: generated with Antigravity, kept in /motion/public/reel.
   ========================================================================== */
import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';

type Move = 'push' | 'pull' | 'panL' | 'panR' | 'rise';
type Cut = 'hard' | 'whip' | 'flash';
interface Shot { file: string; frames: number; move: Move; cut: Cut; focus?: string }

/* ~8.4 s at 30 fps; quick at the start, a breath on the last shot */
export const SHOTS: Shot[] = [
  { file: 'drop', frames: 24, move: 'push', cut: 'hard' },
  { file: 'flasks', frames: 30, move: 'panL', cut: 'flash', focus: '45% 55%' },
  { file: 'tubes', frames: 26, move: 'push', cut: 'whip' },
  { file: 'beads', frames: 22, move: 'rise', cut: 'hard' },
  { file: 'spirulina', frames: 22, move: 'pull', cut: 'whip' },
  { file: 'cascade', frames: 24, move: 'panR', cut: 'hard' },
  { file: 'facade', frames: 26, move: 'push', cut: 'flash' },
  { file: 'reactor', frames: 32, move: 'panL', cut: 'whip' },
  { file: 'pond', frames: 44, move: 'pull', cut: 'hard' },
];
export const REEL_FRAMES = SHOTS.reduce((s, x) => s + x.frames, 0);

const lin = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const WHIP = 5;

const moveStyle = (m: Move, p: number): React.CSSProperties => {
  const e = Easing.out(Easing.cubic)(p);
  switch (m) {
    case 'push': return { scale: 1.06 + e * 0.12 };
    case 'pull': return { scale: 1.2 - e * 0.12 };
    case 'panL': return { scale: 1.14, translate: `${3 - e * 6}% 0` };
    case 'panR': return { scale: 1.14, translate: `${-3 + e * 6}% 0` };
    case 'rise': return { scale: 1.14, translate: `0 ${3 - e * 6}%` };
  }
};

export const Reel: React.FC = () => {
  const f = useCurrentFrame();
  let start = 0;
  let idx = 0;
  for (let i = 0; i < SHOTS.length; i++) {
    if (f < start + SHOTS[i].frames) { idx = i; break; }
    start += SHOTS[i].frames;
  }
  const shot = SHOTS[idx];
  const local = f - start;
  const p = local / shot.frames;
  const next = SHOTS[idx + 1];

  // whip out of this shot (if the next cut is a whip) and into it (if this cut is a whip)
  const outWhip = next?.cut === 'whip' ? interpolate(local, [shot.frames - WHIP, shot.frames], [0, 1], { ...lin, easing: Easing.in(Easing.cubic) }) : 0;
  const inWhip = shot.cut === 'whip' && idx > 0 ? interpolate(local, [0, WHIP], [1, 0], { ...lin, easing: Easing.out(Easing.cubic) }) : 0;
  const blur = Math.max(outWhip, inWhip) * 18;
  const shift = -outWhip * 22 + inWhip * 22;
  const flash = shot.cut === 'flash' && idx > 0 ? interpolate(local, [0, 3], [0.85, 0], lin) : 0;
  // loop-safe: fade in from black at the start, out to black at the end
  const fade = Math.min(interpolate(f, [0, 8], [0, 1], lin), interpolate(f, [REEL_FRAMES - 10, REEL_FRAMES - 1], [1, 0], lin));

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ opacity: fade, translate: `${shift}% 0`, filter: `blur(${blur}px)` }}>
        <AbsoluteFill style={{ ...moveStyle(shot.move, p), transformOrigin: shot.focus ?? '50% 50%' }}>
          <Img
            src={staticFile(`reel/${shot.file}.jpg`)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: shot.focus ?? '50% 50%', filter: 'contrast(1.08) saturate(0.82) brightness(0.96)' }}
          />
        </AbsoluteFill>
      </AbsoluteFill>
      {/* grade: lifted blacks, cool shadows, vignette */}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)' }} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(10,20,30,0.18), rgba(0,0,0,0) 40%, rgba(0,0,0,0.25))', mixBlendMode: 'multiply' }} />
      <AbsoluteFill style={{ background: '#fff', opacity: flash }} />
    </AbsoluteFill>
  );
};
