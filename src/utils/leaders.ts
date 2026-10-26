/** A readout to place: its anchor on screen and the size of its label, in CSS pixels. */
export interface Readout {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** The side it would rather run to: away from the figure's centre. */
  side: 1 | -1;
}

/** Where a readout's elbowed leader bends (ex, ey) and ends (fx), and which way it runs. */
export interface Placed {
  side: 1 | -1;
  ex: number;
  ey: number;
  fx: number;
}

const GAP = 6;
const MARGIN = 12;

/**
 * Lays out elbowed leaders: each rises diagonally from its anchor, then runs flat to its label. A label
 * that would leave the screen runs the other way; one that would cover another label rises above it.
 */
export function placeReadouts(readouts: Readout[], viewport: number, rise: number, run: number, slant: number): Map<string, Placed> {
  const out = new Map<string, Placed>();
  const boxes: { l: number; r: number; t: number; b: number }[] = [];
  // Lowest anchors first, so stacks grow upward, away from the readout plates at the foot of the screen.
  for (const o of [...readouts].sort((p, q) => q.y - p.y)) {
    const reach = rise * slant + run + 8 + o.w + MARGIN;
    let side = o.side;
    if (side > 0 && o.x + reach > viewport) side = -1;
    else if (side < 0 && o.x - reach < 0) side = 1;
    const ex = o.x + side * rise * slant;
    let fx = ex + side * run;
    // On a narrow screen neither side may fit: the label then stays inside and its leader shortens to meet it.
    const l = Math.min(Math.max(side > 0 ? fx + 8 : fx - 8 - o.w, MARGIN), viewport - MARGIN - o.w);
    fx = side > 0 ? l - 8 : l + o.w + 8;
    const r = l + o.w;
    let ey = o.y - rise;
    const hits = (y: number) => boxes.some((b) => l < b.r + GAP && r > b.l - GAP && y - o.h / 2 < b.b + GAP && y + o.h / 2 > b.t - GAP);
    for (let k = 0; k < 8 && hits(ey); k++) ey -= o.h + GAP;
    boxes.push({ l, r, t: ey - o.h / 2, b: ey + o.h / 2 });
    out.set(o.id, { side, ex, ey, fx });
  }
  return out;
}
