/* Bioactives: the cell makes carotenoids, mycosporine-like amino acids and
   vitamin D₃; each leads to a use. */
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Captions, Draw, INK, INK3, Label, Stage, cellPath, hexPath, tw, inOut, zigzag } from '../kit';

const CX = 360, CY = 400;
const ROWS = [
  { y: 200, name: 'Carotenoids', use: 'Nutraceuticals' },
  { y: 400, name: 'Mycosporine-like amino acids', use: 'UV protection' },
  { y: 600, name: 'Vitamin D₃', use: 'Food fortification' },
];

export const Bioactives: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage focus={[800, 400]} push={0.05}>
        <Draw d={cellPath(CX, CY, 180, 166)} p={tw(f, 0, 30, 0, 1, inOut)} w={4} />
        <Draw d={`M${CX - 130},${CY - 20} C${CX - 126},${CY + 110} ${CX + 126},${CY + 110} ${CX + 130},${CY - 20}`} p={tw(f, 12, 40)} w={22} color="#e4e4e4" />
        <circle cx={CX} cy={CY + 40} r={22} fill="#fff" stroke={INK} strokeWidth={3} opacity={tw(f, 26, 40)} />

        {ROWS.map((r, i) => {
          const s = 40 + i * 30;
          const mx = 760;
          const mol = tw(f, s + 14, s + 46);
          return (
            <g key={r.name}>
              <Draw d={`M${CX + 186},${CY + (r.y - CY) * 0.35} C${CX + 300},${CY + (r.y - CY) * 0.5} ${mx - 160},${r.y} ${mx - 60},${r.y}`} p={tw(f, s, s + 24)} w={2.5} color={INK3} />
              {i === 0 && (
                <g opacity={mol}>
                  <path d={hexPath(mx - 30, r.y, 22)} fill="none" stroke={INK} strokeWidth={3} />
                  <Draw d={zigzag(mx - 8, r.y, 12, 22, 20)} p={mol} w={3.5} />
                  <path d={hexPath(mx + 12 * 22 + 14, r.y, 22)} fill="none" stroke={INK} strokeWidth={3} opacity={tw(f, s + 36, s + 46)} />
                </g>
              )}
              {i === 1 && (
                <g opacity={mol}>
                  <path d={hexPath(mx + 30, r.y, 30)} fill="none" stroke={INK} strokeWidth={3} />
                  <Draw d={`M${mx + 56},${r.y - 15} L${mx + 100},${r.y - 40} L${mx + 140},${r.y - 20} M${mx + 56},${r.y + 15} L${mx + 100},${r.y + 40} L${mx + 146},${r.y + 26}`} p={mol} w={3} />
                </g>
              )}
              {i === 2 && (
                <g opacity={mol}>
                  <path d={hexPath(mx + 10, r.y + 10, 24)} fill="none" stroke={INK} strokeWidth={3} />
                  <path d={hexPath(mx + 52, r.y - 14, 24)} fill="none" stroke={INK} strokeWidth={3} />
                  <Draw d={`M${mx + 74},${r.y - 26} L${mx + 116},${r.y - 50} L${mx + 156},${r.y - 30} L${mx + 196},${r.y - 54}`} p={mol} w={3} />
                </g>
              )}
              <Label x={mx - 40} y={r.y + 66} o={tw(f, s + 30, s + 48)} size={28} anchor="start" color={INK3}>{r.name}</Label>

              {/* use */}
              <Draw d={`M1080,${r.y} L1200,${r.y}`} p={tw(f, 150 + i * 10, 172 + i * 10)} w={2.5} color={INK3} />
              <path d={`M1190,${r.y - 10} l12,10 l-12,10`} fill="none" stroke={INK3} strokeWidth={2.5} strokeLinecap="round" opacity={tw(f, 168 + i * 10, 174 + i * 10)} />
              <Label x={1226} y={r.y + 12} o={tw(f, 160 + i * 10, 182 + i * 10)} size={36} weight={600} anchor="start">{r.use}</Label>
            </g>
          );
        })}
      </Stage>
      <Captions
        steps={[
          { at: 0, title: 'A microalgal culture', note: 'selected or engineered strains' },
          { at: 40, title: 'Biosynthesis', note: 'pigments, UV screens, vitamins' },
          { at: 150, title: 'Applications', note: 'health, protection and food' },
        ]}
      />
    </AbsoluteFill>
  );
};
