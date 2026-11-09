/* Transcriptional engineering: phosphate runs out, PSR1 binds the DNA,
   a network of target genes switches on, carbon is stored. */
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Captions, Draw, INK, INK3, LINE, Label, Stage, life, tw, rnd, inOut } from '../kit';

const Y = 420;
const helix = (phase: number) => {
  let d = '';
  for (let x = 160; x <= 1440; x += 8) {
    const y = Y + Math.sin((x / 170) * Math.PI + phase) * 46;
    d += (x === 160 ? 'M' : 'L') + x + ',' + y.toFixed(1);
  }
  return d;
};
const GENES = [560, 740, 920, 1100, 1280];

export const Transcription: React.FC = () => {
  const f = useCurrentFrame();
  const dna = tw(f, 8, 58, 0, 1, inOut);
  const dock = tw(f, 58, 96);
  const tfY = 150 + dock * (Y - 92 - 150);

  return (
    <AbsoluteFill>
      <Stage focus={[800, 420]}>
        {/* phosphate disappears from the medium: the starvation signal */}
        {Array.from({ length: 9 }).map((_, i) => {
          const o = life(f, 4 + i * 2, 20 + i * 2, 30 + i * 3, 52 + i * 3);
          const x = 220 + rnd(i, 3) * 1160;
          const y = 110 + rnd(i, 7) * 90 - tw(f, 30, 60) * 30;
          return <Label key={i} x={x} y={y} o={o} size={28} color={INK3}>PO₄³⁻</Label>;
        })}

        {/* rungs, then the two strands */}
        {Array.from({ length: 64 }).map((_, i) => {
          const x = 170 + i * 20;
          const y1 = Y + Math.sin((x / 170) * Math.PI) * 46;
          const y2 = Y + Math.sin((x / 170) * Math.PI + Math.PI) * 46;
          const o = tw(f, 14 + i * 0.6, 26 + i * 0.6);
          return <line key={i} x1={x} y1={y1} x2={x} y2={y2} stroke={LINE} strokeWidth={2} opacity={o} />;
        })}
        <Draw d={helix(0)} p={dna} w={4} />
        <Draw d={helix(Math.PI)} p={dna} w={4} color="#555" />

        {/* target genes light up in turn */}
        {GENES.map((x, i) => {
          const on = tw(f, 104 + i * 11, 118 + i * 11);
          return (
            <g key={x}>
              <rect x={x - 62} y={Y - 64} width={124} height={128} rx={14} fill={INK} opacity={on * 0.1} stroke={INK} strokeWidth={2} strokeOpacity={tw(f, 60, 80) * 0.5 + on * 0.5} />
              {/* transcript peels away from the gene */}
              <Draw d={`M${x},${Y - 66} C${x - 18},${Y - 104} ${x + 26},${Y - 128} ${x},${Y - 168} S${x + 20},${Y - 206} ${x - 6},${Y - 236}`} p={tw(f, 112 + i * 11, 150 + i * 11)} w={3} color={INK} />
            </g>
          );
        })}
        <Label x={920} y={Y - 262} o={tw(f, 130, 150)} size={30} color={INK3}>transcripts</Label>
        <Label x={920} y={Y + 108} o={tw(f, 108, 126)} size={30} color={INK3}>target genes</Label>

        {/* PSR1 docks on the promoter */}
        <g opacity={tw(f, 54, 70)} transform={`translate(330 ${tfY})`}>
          <rect x={-86} y={-40} width={172} height={80} rx={40} fill={INK} />
          <text x={0} y={12} fontSize={34} fontWeight={600} fill="#fff" textAnchor="middle">PSR1</text>
        </g>
        {[0, 1].map((k) => {
          const p = tw(f, 96 + k * 16, 150 + k * 16, 0, 1);
          return <circle key={k} cx={330} cy={Y} r={60 + p * 140} fill="none" stroke={INK} strokeWidth={2} opacity={(1 - p) * 0.5 * tw(f, 96, 100)} />;
        })}
        <Label x={330} y={Y + 108} o={tw(f, 90, 110)} size={30} color={INK3}>promoter</Label>

        {/* storage products */}
        {[
          { x: 640, t: 'Starch', icon: (o: number) => <g opacity={o}>{[34, 24, 14].map((r) => <ellipse key={r} cx={640} cy={680} rx={r * 1.3} ry={r} fill="none" stroke={INK} strokeWidth={2.5} />)}</g> },
          { x: 920, t: 'Lipids', icon: (o: number) => <g opacity={o}><circle cx={920} cy={680} r={40} fill={INK} /><path d="M902,632 a24,24 0 0 1 22,-10" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" /></g> },
          { x: 1200, t: 'High-value chemicals', icon: (o: number) => <g opacity={o}><path d="M1186,642 v28 l-30,48 a8,8 0 0 0 7,12 h74 a8,8 0 0 0 7,-12 l-30,-48 v-28 z" fill="none" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" /><path d="M1166,702 h68" stroke={INK} strokeWidth={2.5} /></g> },
        ].map((p, i) => {
          const o = tw(f, 170 + i * 9, 192 + i * 9);
          return (
            <g key={p.t}>
              <Draw d={`M${GENES[i * 2]},${Y + 66} C${GENES[i * 2]},${Y + 160} ${p.x},${Y + 130} ${p.x},${630}`} p={tw(f, 160 + i * 9, 190 + i * 9)} w={2} color={INK3} />
              {p.icon(o)}
              <Label x={p.x} y={766} o={o} size={30}>{p.t}</Label>
            </g>
          );
        })}
      </Stage>
      <Captions
        steps={[
          { at: 0, title: 'Phosphorus runs low', note: 'the cell senses a nutrient signal' },
          { at: 56, title: 'PSR1 binds the DNA', note: 'a master transcription factor' },
          { at: 104, title: 'A gene network switches on', note: 'many genes at once' },
          { at: 164, title: 'Carbon is stored', note: 'as starch, lipids and chemicals' },
        ]}
      />
    </AbsoluteFill>
  );
};
