/* ==========================================================================
   Hero carousel card: a 3-second, 3:4 clip cut fast from one still.
   Wide push -> hard cut to a punched-in detail -> flash cut back wide.
   The loop point is itself a hard cut, so it never reads as a seam.
   ========================================================================== */
import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';

export type CardProps = { file: string; detail: [number, number]; drift?: 1 | -1 };
export const CARD_FRAMES = 90;

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const ease = Easing.out(Easing.cubic);

export const Card: React.FC<CardProps> = ({ file, detail, drift = 1 }) => {
  const f = useCurrentFrame();
  const [dx, dy] = detail;
  // shot boundaries
  const A = f < 38, B = f >= 38 && f < 64;
  let scale = 1, tx = 0, ty = 0, origin = '50% 50%';
  if (A) {
    const p = interpolate(f, [0, 38], [0, 1], { ...clamp, easing: ease });
    scale = 1.12 + p * 0.1; tx = drift * (2 - p * 4);
  } else if (B) {
    const p = interpolate(f, [38, 64], [0, 1], { ...clamp, easing: ease });
    scale = 1.9 + p * 0.12; ty = 1 - p * 2; origin = `${dx}% ${dy}%`;
  } else {
    const p = interpolate(f, [64, 90], [0, 1], { ...clamp, easing: ease });
    scale = 1.3 - p * 0.14; tx = -drift * (1 - p * 2);
  }
  const flash = interpolate(f, [64, 67], [0.7, 0], clamp);
  const fadeIn = interpolate(f, [0, 3], [0.6, 0], clamp);

  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      <AbsoluteFill style={{ scale: String(scale), translate: `${tx}% ${ty}%`, transformOrigin: origin }}>
        <Img src={staticFile(`reel/${file}.jpg`)} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.08) saturate(0.9) brightness(0.97)' }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)' }} />
      <AbsoluteFill style={{ background: '#000', opacity: fadeIn }} />
      <AbsoluteFill style={{ background: '#fff', opacity: flash }} />
    </AbsoluteFill>
  );
};

/** id, still, detail point for the punch-in (x%, y%), drift direction */
export const CARDS: Array<{ id: string } & CardProps> = [
  { id: 'card-drop', file: 'drop', detail: [30, 45], drift: 1 },
  { id: 'card-flasks', file: 'flasks', detail: [45, 62], drift: -1 },
  { id: 'card-tubes', file: 'tubes', detail: [52, 48], drift: 1 },
  { id: 'card-beads', file: 'beads', detail: [50, 50], drift: -1 },
  { id: 'card-reactor', file: 'reactor', detail: [40, 50], drift: 1 },
  { id: 'card-spirulina', file: 'spirulina', detail: [32, 55], drift: -1 },
  { id: 'card-cascade', file: 'cascade', detail: [42, 55], drift: 1 },
  { id: 'card-facade', file: 'facade', detail: [55, 45], drift: -1 },
  { id: 'card-paddle', file: 'paddle', detail: [46, 56], drift: 1 },
  { id: 'card-pond', file: 'pond', detail: [55, 66], drift: -1 },
];
