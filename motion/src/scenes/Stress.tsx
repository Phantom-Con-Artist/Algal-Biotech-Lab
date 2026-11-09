/* Stress biology: salt and cold reach the cell, the membrane strains,
   metacaspases cleave proteins, metabolites are remodelled, two outcomes. */
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Captions, Draw, INK, INK3, Label, Stage, cellPath, hexPath, life, tw, rnd, inOut } from '../kit';

const CX = 800, CY = 400;

export const Stress: React.FC = () => {
  const f = useCurrentFrame();
  const split = tw(f, 172, 205, 0, 1, inOut);
  const shrink = 1 - tw(f, 60, 110) * 0.07;
  const wob = tw(f, 60, 90) * 0.025 * (1 - split);
  const main = 1 - split;

  return (
    <AbsoluteFill>
      <Stage>
        {/* the cell */}
        <g opacity={main}>
          <Draw d={cellPath(CX, CY, 236 * shrink, 214 * shrink, wob, f / 6)} p={tw(f, 0, 34, 0, 1, inOut)} w={4} />
          <Draw d={cellPath(CX, CY, 222 * shrink, 200 * shrink, wob, f / 6 + 1)} p={tw(f, 6, 40, 0, 1, inOut)} w={1.5} color="#777" />
        </g>

        {/* salt ions arrive from the left */}
        {Array.from({ length: 12 }).map((_, i) => {
          const t = tw(f, 16 + i * 4, 70 + i * 4);
          const y = 180 + (i / 11) * 440;
          const x = -40 + t * (CX - 330 - (-40) - rnd(i, 5) * 160);
          const o = life(f, 16 + i * 4, 28 + i * 4, 120, 140);
          return <Label key={i} x={x} y={y} o={o} size={30} color={i % 2 ? INK3 : INK} weight={600}>{i % 2 ? 'Cl⁻' : 'Na⁺'}</Label>;
        })}
        {/* cold */}
        <g opacity={life(f, 28, 48, 120, 140)} transform="translate(1290 190)">
          {[0, 60, 120].map((a) => <line key={a} x1={-36} y1={0} x2={36} y2={0} stroke={INK} strokeWidth={3} strokeLinecap="round" transform={`rotate(${a})`} />)}
          <circle r={8} fill="#fff" stroke={INK} strokeWidth={2} />
        </g>
        <Label x={1290} y={270} o={life(f, 32, 50, 120, 140)} size={28} color={INK3}>cold</Label>
        <Label x={250} y={170} o={life(f, 22, 40, 120, 140)} size={28} color={INK3}>salt</Label>

        {/* a protein chain is cleaved by a metacaspase */}
        <g opacity={life(f, 66, 84, 160, 176)}>
          {Array.from({ length: 6 }).map((_, i) => {
            const gap = tw(f, 122, 140) * (i < 3 ? -30 : 30);
            return <rect key={i} x={CX - 132 + i * 46 + gap} y={CY - 14} width={36} height={28} rx={9} fill="none" stroke={INK} strokeWidth={2.5} />;
          })}
          {(() => {
            const t = tw(f, 88, 122);
            const x = CX + 150 - t * 150, y = CY - 120 + t * 82;
            const m = 22 - 16 * Math.abs(Math.sin(f / 3));
            return <path d={`M${x},${y} L${x + 34 * Math.cos(m * Math.PI / 180)},${y - 34 * Math.sin(m * Math.PI / 180)} A34,34 0 1 0 ${x + 34 * Math.cos(m * Math.PI / 180)},${y + 34 * Math.sin(m * Math.PI / 180)} Z`} fill={INK} transform={`rotate(150 ${x} ${y})`} />;
          })()}
          <Label x={CX} y={CY + 270} o={tw(f, 96, 112)} size={28} color={INK3}>a metacaspase cleaves a protein</Label>
        </g>

        {/* metabolites: some stay, some leave the cell */}
        {Array.from({ length: 10 }).map((_, i) => {
          const a = rnd(i, 9) * Math.PI * 2;
          const r0 = 60 + rnd(i, 4) * 100;
          const leave = i % 3 === 0 ? tw(f, 140 + i * 2, 172 + i * 2) * 210 : 0;
          const x = CX + Math.cos(a) * (r0 + leave), y = CY + Math.sin(a) * (r0 * 0.8 + leave * 0.8);
          return <path key={i} d={hexPath(x, y, 15)} fill="none" stroke={INK} strokeWidth={2.5} opacity={life(f, 124 + i * 2, 138 + i * 2, 168, 182)} />;
        })}

        {/* two outcomes */}
        <g opacity={split}>
          <g transform={`translate(${-280 * split} 0)`}>
            <path d={cellPath(CX, CY, 150, 138)} fill="none" stroke={INK} strokeWidth={9} />
            <path d={cellPath(CX, CY, 132, 120)} fill="none" stroke="#777" strokeWidth={1.5} />
            <Label x={CX} y={CY + 210} o={tw(f, 196, 214)} size={34} weight={600}>Acclimation</Label>
          </g>
          <g transform={`translate(${280 * split} 0)`}>
            {Array.from({ length: 7 }).map((_, k) => {
              const a0 = (k / 7) * Math.PI * 2, a1 = a0 + Math.PI * 2 / 7 - 0.18;
              const drift = tw(f, 200, 236) * 26;
              const dx = Math.cos((a0 + a1) / 2) * drift, dy = Math.sin((a0 + a1) / 2) * drift;
              const p = (a: number) => `${CX + dx + Math.cos(a) * 150},${CY + dy + Math.sin(a) * 138}`;
              return <path key={k} d={`M${p(a0)} A150,138 0 0 1 ${p(a1)}`} fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />;
            })}
            <Label x={CX} y={CY + 210} o={tw(f, 202, 220)} size={34} weight={600}>Programmed cell death</Label>
          </g>
        </g>
      </Stage>
      <Captions
        steps={[
          { at: 0, title: 'Stress reaches the cell', note: 'salt, cold or nutrient limitation' },
          { at: 62, title: 'The cell responds', note: 'membrane strain, metacaspase activity' },
          { at: 124, title: 'Metabolites are remodelled', note: 'inside and outside the cell' },
          { at: 176, title: 'Two possible outcomes', note: 'acclimation or programmed cell death' },
        ]}
      />
    </AbsoluteFill>
  );
};
