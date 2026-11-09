/* Polyphosphate: phosphate in the water is taken up beyond need, linked into
   polyphosphate chains in an acidocalcisome, and recovered as fertiliser. */
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Captions, Draw, INK, INK3, Label, Stage, cellPath, life, tw, rnd, quad, inOut } from '../kit';

const CX = 800, CY = 400, VX = 800, VY = 430;
const tetra = (x: number, y: number, s: number, o: number, k: number | string) => (
  <g key={k} opacity={o} transform={`translate(${x} ${y})`}>
    <path d={`M0,${-s} L${s * 0.9},${s * 0.6} L${-s * 0.9},${s * 0.6} Z`} fill="#fff" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
    <path d={`M0,${-s} L0,${s * 0.1} M${s * 0.9},${s * 0.6} L0,${s * 0.1} L${-s * 0.9},${s * 0.6}`} stroke={INK} strokeWidth={1.5} fill="none" />
  </g>
);
// chain coiled inside the acidocalcisome
const chainPt = (u: number): [number, number] => {
  const a = u * Math.PI * 3.2;
  const r = 18 + u * 52;
  return [VX + Math.cos(a) * r, VY + Math.sin(a) * r * 0.85];
};

export const Phosphate: React.FC = () => {
  const f = useCurrentFrame();
  const away = tw(f, 150, 186, 0, 1, inOut);
  const N = 16;
  const chainP = tw(f, 92, 150);
  let chain = '';
  for (let k = 0; k <= 60 * chainP; k++) {
    const [x, y] = chainPt(k / 60);
    chain += (k ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1);
  }

  return (
    <AbsoluteFill>
      <Stage>
        <g transform={`translate(${-360 * away} ${20 * away}) scale(${1 - 0.35 * away})`} style={{ transformOrigin: `${CX}px ${CY}px` }}>
          <Draw d={cellPath(CX, CY, 262, 240)} p={tw(f, 0, 32, 0, 1, inOut)} w={4} />
          <circle cx={VX} cy={VY} r={84} fill="none" stroke={INK} strokeWidth={2.5} strokeDasharray="6 7" opacity={tw(f, 62, 82)} />
          <Label x={VX} y={VY + 128} o={life(f, 86, 104, 150, 164)} size={28} color={INK3}>acidocalcisome</Label>
          {chain && <path d={chain} fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />}
          {Array.from({ length: 10 }).map((_, k) => {
            const u = (k + 1) / 11;
            const [x, y] = chainPt(u);
            return tetra(x, y, 10, chainP >= u ? 1 : 0, 'c' + k);
          })}
        </g>

        {/* phosphate in the medium, then taken up */}
        {Array.from({ length: N }).map((_, i) => {
          const a = rnd(i, 3) * Math.PI * 2;
          const r = 340 + rnd(i, 8) * 220;
          const sx = CX + Math.cos(a) * r * 1.25, sy = CY + Math.sin(a) * r * 0.62;
          const s0 = 46 + i * 3;
          const t = tw(f, s0, s0 + 44, 0, 1, inOut);
          const [x, y] = quad(t, [sx, sy], [(sx + CX) / 2, sy], [VX + Math.cos(a) * 40, VY + Math.sin(a) * 30]);
          return tetra(x + Math.sin(f / 30 + i) * 6 * (1 - t), y, 14, life(f, 6 + i * 2, 22 + i * 2, s0 + 36, s0 + 46), i);
        })}
        <Label x={260} y={120} o={life(f, 18, 36, 70, 88)} size={30} weight={600}>Phosphate in water</Label>

        {/* recovered as fertiliser */}
        <g opacity={tw(f, 172, 190)}>
          <Draw d="M560,410 L780,410" p={tw(f, 172, 196)} w={2.5} color={INK3} />
          <path d="M770,400 l12,10 l-12,10" fill="none" stroke={INK3} strokeWidth={2.5} strokeLinecap="round" opacity={tw(f, 190, 196)} />
          <Draw d="M880,560 L1320,560" p={tw(f, 180, 204)} w={3} />
          <Draw d="M1100,560 C1100,500 1096,450 1104,380" p={tw(f, 190, 218)} w={4} />
          <Draw d="M1102,470 C1060,440 1020,446 1000,470 C1040,486 1080,484 1102,470 Z" p={tw(f, 204, 226)} w={3} />
          <Draw d="M1104,420 C1150,384 1196,392 1214,414 C1172,436 1132,436 1104,420 Z" p={tw(f, 210, 232)} w={3} />
          <Label x={1100} y={620} o={tw(f, 204, 222)} size={32} weight={600}>Phosphate biofertiliser</Label>
        </g>
      </Stage>
      <Captions
        steps={[
          { at: 0, title: 'Phosphate in the medium', note: 'from culture media or wastewater' },
          { at: 46, title: 'Taken up beyond need', note: 'the cell keeps absorbing' },
          { at: 92, title: 'Stored as polyphosphate', note: 'chains inside acidocalcisomes' },
          { at: 160, title: 'Recovered as fertiliser', note: 'returning phosphorus to soil' },
        ]}
      />
    </AbsoluteFill>
  );
};
