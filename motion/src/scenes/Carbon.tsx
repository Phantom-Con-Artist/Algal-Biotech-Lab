/* Carbon-concentrating mechanism: CO₂ is scarce, inorganic carbon is pumped
   across the membrane toward the pyrenoid, Rubisco fixes it, carbon leaves
   as sugars, lipids and carotenoids. */
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Captions, Draw, INK, INK3, Label, Stage, cellPath, hexPath, life, tw, rnd, quad, inOut, zigzag } from '../kit';

const CX = 720, CY = 390, PX = 720, PY = 520;
const CHANNELS: Array<[number, number]> = [[-150, 0.62], [-30, 0.62], [200, 0.62], [270, 0.62]];

const co2 = (x: number, y: number, o: number, k: number) => (
  <g key={k} opacity={o} transform={`translate(${x} ${y}) rotate(${(k * 37) % 180})`}>
    <line x1={-20} y1={0} x2={20} y2={0} stroke={INK} strokeWidth={2.5} />
    <circle cx={-22} cy={0} r={8} fill="#fff" stroke={INK} strokeWidth={2.5} />
    <circle cx={0} cy={0} r={9} fill={INK} />
    <circle cx={22} cy={0} r={8} fill="#fff" stroke={INK} strokeWidth={2.5} />
  </g>
);

export const Carbon: React.FC = () => {
  const f = useCurrentFrame();
  const chan = (deg: number) => {
    const a = (deg * Math.PI) / 180;
    return [CX + Math.cos(a) * 300, CY + Math.sin(a) * 270 * (1 + 0.08 * Math.sin(a))] as [number, number];
  };

  return (
    <AbsoluteFill>
      <Stage focus={[PX, PY]} push={0.1}>
        {/* cell, chloroplast cup, pyrenoid */}
        <Draw d={cellPath(CX, CY, 300, 270)} p={tw(f, 0, 32, 0, 1, inOut)} w={4} />
        <Draw d={`M${CX - 250},${CY - 40} C${CX - 250},${CY + 200} ${CX - 120},${CY + 250} ${CX},${CY + 250} C${CX + 120},${CY + 250} ${CX + 250},${CY + 200} ${CX + 250},${CY - 40}`} p={tw(f, 14, 46, 0, 1, inOut)} w={30} color="#e7e7e7" />
        <Label x={CX + 290} y={CY + 200} o={tw(f, 40, 56)} size={26} color={INK3} anchor="start">chloroplast</Label>
        <circle cx={PX} cy={PY} r={58} fill="none" stroke={INK} strokeWidth={6} strokeDasharray="20 8" opacity={tw(f, 34, 56)} />
        <circle cx={PX} cy={PY} r={44} fill="#fff" stroke={INK} strokeWidth={3} opacity={tw(f, 30, 50)} />
        <Label x={PX} y={PY + 100} o={tw(f, 44, 60)} size={28} color={INK3}>pyrenoid</Label>

        {/* scarce CO₂ outside */}
        {Array.from({ length: 6 }).map((_, i) => {
          const x = 180 + rnd(i, 2) * 260 + (i % 2) * 980, y = 150 + rnd(i, 6) * 480;
          return co2(x + Math.sin(f / 40 + i) * 12, y + Math.cos(f / 50 + i) * 10, life(f, 8 + i * 3, 26 + i * 3, 90, 110), i);
        })}
        <Label x={250} y={110} o={life(f, 16, 34, 90, 110)} size={30} weight={600}>Low CO₂</Label>

        {/* transporters in the membrane */}
        {CHANNELS.map(([deg], i) => {
          const [x, y] = chan(deg);
          return (
            <g key={i} opacity={tw(f, 52 + i * 4, 66 + i * 4)} transform={`translate(${x} ${y}) rotate(${deg + 90})`}>
              <rect x={-20} y={-16} width={14} height={32} rx={4} fill={INK} />
              <rect x={6} y={-16} width={14} height={32} rx={4} fill={INK} />
            </g>
          );
        })}

        {/* inorganic carbon flows through the transporters to the pyrenoid */}
        {Array.from({ length: 14 }).map((_, i) => {
          const [deg] = CHANNELS[i % CHANNELS.length];
          const [mx, my] = chan(deg);
          const a = (deg * Math.PI) / 180;
          const start: [number, number] = [mx + Math.cos(a) * 140, my + Math.sin(a) * 140];
          const s = 70 + i * 6;
          const t = tw(f, s, s + 50, 0, 1, inOut);
          const [x, y] = t < 0.45 ? quad(t / 0.45, start, [(start[0] + mx) / 2, (start[1] + my) / 2], [mx, my]) : quad((t - 0.45) / 0.55, [mx, my], [(mx + PX) / 2, my], [PX, PY]);
          return <g key={i} opacity={life(f, s, s + 6, s + 44, s + 52)}><path d={`M${x - 9},${y + 7} L${x},${y - 9} L${x + 9},${y + 7} Z`} fill={INK} /></g>;
        })}
        <Label x={1130} y={170} o={life(f, 78, 96, 160, 176)} size={28} color={INK3}>HCO₃⁻ pumped inward</Label>

        {/* Rubisco packed in the pyrenoid */}
        {[[0, 0], [-20, -12], [20, -12], [-20, 12], [20, 12], [0, -24], [0, 24]].map(([dx, dy], i) => {
          const pulse = 1 + 0.12 * Math.sin(f / 6 + i) * tw(f, 120, 136);
          return <path key={i} d={hexPath(PX + dx, PY + dy, 9 * pulse)} fill={INK} opacity={tw(f, 112 + i * 2, 126 + i * 2)} />;
        })}
        <Label x={PX - 110} y={PY - 70} o={life(f, 118, 134, 200, 214)} size={26} color={INK3} anchor="end">Rubisco</Label>

        {/* fixed carbon leaves as products */}
        <Draw d={`M${PX + 60},${PY} C${PX + 260},${PY} ${CX + 340},${CY + 60} 1150,${CY + 60}`} p={tw(f, 160, 190)} w={2.5} color={INK3} />
        <Draw d={zigzag(1150, CY + 60, 9, 26, 22)} p={tw(f, 178, 206)} w={4} />
        <Label x={1150} y={CY + 20} o={tw(f, 186, 204)} size={30} weight={600} anchor="start">Fixed carbon</Label>
        <Label x={1150} y={CY + 120} o={tw(f, 196, 214)} size={26} color={INK3} anchor="start">sugars, lipids, carotenoids</Label>
      </Stage>
      <Captions
        steps={[
          { at: 0, title: 'CO₂ runs low', note: 'carbon is scarce in water' },
          { at: 56, title: 'Inorganic carbon is pumped in', note: 'through transporters in the membrane' },
          { at: 112, title: 'Concentrated in the pyrenoid', note: 'around the enzyme Rubisco' },
          { at: 168, title: 'Carbon is fixed', note: 'into sugars, lipids and carotenoids' },
        ]}
      />
    </AbsoluteFill>
  );
};
