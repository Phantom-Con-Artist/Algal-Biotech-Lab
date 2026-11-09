/* Algal biofuels, two-step cultivation: cells divide, nitrogen is withdrawn
   and oil accumulates in lipid droplets, the oil is extracted as fuel. */
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Captions, Draw, INK, INK3, Label, Stage, cellPath, life, tw, rnd, quad, inOut } from '../kit';

const SLOTS: Array<[number, number]> = Array.from({ length: 8 }).map((_, k) => [500 + (k % 4) * 190, 290 + Math.floor(k / 4) * 210]);
const BORN = [0, 26, 50, 50, 74, 74, 74, 74];
const parent = (k: number) => (k === 0 ? 0 : k - 2 ** Math.floor(Math.log2(k)));
const DROP = [1370, 400];

export const Biofuel: React.FC = () => {
  const f = useCurrentFrame();
  const harvest = tw(f, 150, 196, 0, 1, inOut);

  return (
    <AbsoluteFill>
      <Stage focus={[900, 380]}>
        {SLOTS.map(([x, y], k) => {
          const b = tw(f, BORN[k], BORN[k] + 22);
          const [px, py] = SLOTS[parent(k)];
          const cx = px + (x - px) * b, cy = py + (y - py) * b;
          const o = Math.min(tw(f, BORN[k], BORN[k] + 8), 1 - harvest * 0.75);
          return (
            <g key={k} opacity={o}>
              <path d={cellPath(cx, cy, 76 * (0.7 + 0.3 * b), 68 * (0.7 + 0.3 * b))} fill="#fff" stroke={INK} strokeWidth={3} />
              <path d={`M${cx - 50},${cy - 8} C${cx - 48},${cy + 44} ${cx + 48},${cy + 44} ${cx + 50},${cy - 8}`} fill="none" stroke="#c9c9c9" strokeWidth={8} strokeLinecap="round" />
              {/* lipid droplets grow during induction, then leave for the collector */}
              {[0, 1, 2].map((d) => {
                const g = tw(f, 108 + d * 6 + k * 2, 140 + d * 6 + k * 2);
                const ox = (rnd(k * 3 + d, 2) - 0.5) * 66, oy = (rnd(k * 3 + d, 5) - 0.5) * 44 - 8;
                const t = tw(f, 152 + k * 3 + d * 2, 186 + k * 3 + d * 2, 0, 1, inOut);
                const [dx, dy] = quad(t, [cx + ox, cy + oy], [(cx + DROP[0]) / 2, cy - 160], [DROP[0], DROP[1]]);
                return <circle key={d} cx={dx} cy={dy} r={(9 + d * 4) * g * (1 - t * 0.6)} fill={INK} opacity={1 - tw(f, 180 + k * 3, 192 + k * 3)} />;
              })}
            </g>
          );
        })}

        {/* nitrogen withdrawn */}
        {Array.from({ length: 8 }).map((_, i) => (
          <Label key={i} x={480 + rnd(i, 4) * 660} y={170 + rnd(i, 9) * 20 - tw(f, 100, 130) * 40} o={life(f, 84 + i, 96 + i, 104 + i, 126 + i)} size={30} color={INK3} weight={600}>N</Label>
        ))}
        <Label x={1330} y={210} o={life(f, 100, 116, 140, 150)} size={28} color={INK3}>nitrogen withdrawn</Label>

        {/* collector: a drop of oil */}
        <g opacity={tw(f, 160, 176)}>
          {(() => {
            const s = 0.35 + 0.65 * tw(f, 160, 200);
            const [x, y] = DROP;
            return <path d={`M${x},${y - 90 * s} C${x + 52 * s},${y - 20 * s} ${x + 62 * s},${y + 20 * s} ${x + 62 * s},${y + 34 * s} A${62 * s},${62 * s} 0 1 1 ${x - 62 * s},${y + 34 * s} C${x - 62 * s},${y + 20 * s} ${x - 52 * s},${y - 20 * s} ${x},${y - 90 * s} Z`} fill={INK} />;
          })()}
          <Label x={DROP[0]} y={DROP[1] + 150} o={tw(f, 196, 212)} size={34} weight={600}>Biodiesel</Label>
          <Label x={DROP[0]} y={DROP[1] + 196} o={tw(f, 206, 220)} size={28} color={INK3}>and biohydrogen</Label>
        </g>
        <Draw d="M1120,560 C1190,560 1240,530 1270,480" p={tw(f, 150, 176)} w={2} color="#bdbdbd" />
      </Stage>
      <Captions
        steps={[
          { at: 0, title: 'Growth phase', note: 'cells divide and build biomass' },
          { at: 96, title: 'Induction', note: 'nitrogen is withdrawn, oil accumulates' },
          { at: 150, title: 'Harvest and extraction', note: 'oil is collected from the cells' },
          { at: 196, title: 'Fuel', note: 'biodiesel and biohydrogen' },
        ]}
      />
    </AbsoluteFill>
  );
};
