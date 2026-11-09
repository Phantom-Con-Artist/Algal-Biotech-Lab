/* ==========================================================================
   Fast-cut edits from real footage (Mixkit, free licence, sources kept in
   public/footage and out of git).
   - Intro: the startup film, 1280x720, ~7 s of accelerating hard cuts that
     settles on one long shot so the site's title can land over it.
   - Cards: 3:4 hero carousel clips, three hard cuts each, loop on a cut.
   Each shot gets a slow push-in, one grade, and a vignette.
   ========================================================================== */
import React from 'react';
import { AbsoluteFill, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

export type Shot = {
  id: string;          // footage id (public/footage/{id}.mp4)
  at: number;          // seconds into the source
  len: number;         // frames on screen
  rate?: number;       // playback rate
  pos?: string;        // object-position for the crop
  push?: 1 | -1;       // push in (1) or pull out (-1)
  flash?: boolean;     // white flash frame on the cut into this shot
};

const ShotView: React.FC<{ s: Shot }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(f, [0, s.len], [0, 1], { extrapolateRight: 'clamp' });
  const dir = s.push ?? 1;
  const scale = dir === 1 ? 1.04 + p * 0.07 : 1.11 - p * 0.07;
  const flash = s.flash ? interpolate(f, [0, 3], [0.85, 0], { extrapolateRight: 'clamp' }) : 0;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#000' }}>
      <AbsoluteFill style={{ scale: String(scale) }}>
        <OffthreadVideo
          src={staticFile(`footage/${s.id}.mp4`)}
          startFrom={Math.round(s.at * fps)}
          playbackRate={s.rate ?? 1}
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: s.pos ?? '50% 50%', filter: 'contrast(1.08) saturate(1.08) brightness(0.96)' }}
        />
      </AbsoluteFill>
      {flash > 0 && <AbsoluteFill style={{ background: '#fff', opacity: flash }} />}
    </AbsoluteFill>
  );
};

export type EditProps = { shots: Shot[]; vignette?: number };

export const Edit: React.FC<EditProps> = ({ shots, vignette = 0.35 }) => {
  let t = 0;
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {shots.map((s, i) => {
        const from = t;
        t += s.len;
        return (
          <Sequence key={i} from={from} durationInFrames={s.len} layout="none">
            <ShotView s={s} />
          </Sequence>
        );
      })}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 85% 75% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,${vignette}) 100%)` }} />
    </AbsoluteFill>
  );
};

export const total = (shots: Shot[]) => shots.reduce((n, s) => n + s.len, 0);

/* ---------- Intro film: accelerating cuts, then one long settle ---------- */
export const INTRO: Shot[] = [
  { id: '3849', at: 2, len: 16 },                      // algal colonies
  { id: '3847', at: 4, len: 13 },                      // green bubbles
  { id: '12066', at: 6, len: 12, flash: true },        // green culture in glass
  { id: '17456', at: 3, len: 11 },                     // pipette into tubes
  { id: '3852', at: 5, len: 10 },                      // cell under the microscope
  { id: '14896', at: 8, len: 10, rate: 1.5 },          // fern unfurling
  { id: '292', at: 6, len: 9 },                        // leaf surface
  { id: '1485', at: 3, len: 9 },                       // beetle on a leaf
  { id: '4733', at: 6, len: 8 },                       // at the microscope
  { id: '26023', at: 5, len: 8, flash: true },         // moss on the shore
  { id: '1705', at: 6, len: 7 },                       // bee
  { id: '18310', at: 3, len: 7 },                      // leaves in shade
  { id: '38375', at: 5, len: 6 },                      // grass macro
  { id: '47781', at: 6, len: 6 },                      // lab, blue light
  { id: '15473', at: 9, len: 6 },                      // rain on leaves
  { id: '1468', at: 4, len: 6, pos: '50% 40%' },       // gecko
  { id: '110', at: 3, len: 8, flash: true },           // a drop
  { id: '3849', at: 6, len: 56, push: -1 },            // settle on the colonies
];

/* ---------- Hero carousel cards: six hard cuts each, ~0.37 s a shot ---------- */
const L = 11; // frames per shot
const c = (id: string, at: number, extra: Partial<Shot> = {}): Shot => ({ id, at, len: L, ...extra });
export const CARD_EDITS: Array<{ id: string; shots: Shot[] }> = [
  { id: 'colonies', shots: [c('3849', 3), c('3847', 6), c('3852', 4), c('3849', 9, { push: -1 }), c('3785', 3), c('3847', 11)] },
  { id: 'bench', shots: [c('17456', 2), c('4733', 8), c('17556', 3), c('3775', 4), c('47781', 9), c('17456', 6)] },
  { id: 'leaf', shots: [c('292', 4), c('15473', 12), c('1886', 3), c('18310', 5), c('2560', 6), c('1611', 14)] },
  { id: 'moss', shots: [c('26023', 8), c('8617', 4), c('11256', 6), c('8113', 5), c('20330', 4), c('26023', 15)] },
  { id: 'insects', shots: [c('1485', 5), c('1705', 10), c('1468', 6, { pos: '50% 40%' }), c('1485', 8, { push: -1 }), c('1705', 18), c('7454', 4)] },
  { id: 'growth', shots: [c('43697', 4), c('14896', 14, { rate: 1.5 }), c('38375', 10), c('26408', 8), c('46104', 2), c('43697', 10)] },
  { id: 'microscope', shots: [c('4733', 10), c('47781', 12), c('4767', 5), c('3852', 8), c('4733', 15), c('3775', 7)] },
  { id: 'water', shots: [c('12066', 14), c('19500', 6), c('1202', 6), c('110', 3), c('12066', 20), c('154', 6)] },
];
