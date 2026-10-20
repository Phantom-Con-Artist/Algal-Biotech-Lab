/**
 * Builds the branching proboscides of the hero organism: trees that split into ever-finer twigs, like an everted
 * nemertean proboscis. Seeded, so the server renders the same organism on every build. Each trunk is returned as one
 * path per depth, so strokes can taper by depth while the DOM stays small.
 */
export const VIEW = 1000;
export const CENTER = VIEW / 2;
export const MAX_DEPTH = 5;

/** Stroke width per depth, in viewBox units: thick at the body, hair-thin at the tips. */
export const DEPTH_WIDTH = [5.5, 3.6, 2.4, 1.6, 1.05, 0.7, 0.5];

export interface Trunk {
  /** One SVG path string per depth (index 0 is the trunk itself). */
  paths: string[];
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r = (n: number) => Math.round(n);

export function growTrunks(count = 9, seed = 20200601): Trunk[] {
  const rnd = mulberry32(seed);

  function branch(paths: string[], x: number, y: number, angle: number, len: number, depth: number): void {
    if (depth > MAX_DEPTH || len < 7) return;
    const ex = x + Math.cos(angle) * len;
    const ey = y + Math.sin(angle) * len;
    const bend = (rnd() - 0.5) * 0.5 * len;
    const cx = (x + ex) / 2 + Math.cos(angle + Math.PI / 2) * bend;
    const cy = (y + ey) / 2 + Math.sin(angle + Math.PI / 2) * bend;
    paths[depth] += `M${r(x)} ${r(y)}Q${r(cx)} ${r(cy)} ${r(ex)} ${r(ey)}`;

    const heading = Math.atan2(ey - cy, ex - cx);
    const kids = depth < 2 ? (rnd() < 0.35 ? 3 : 2) : rnd() < 0.72 ? 2 : 1;
    const spread = 0.38 + rnd() * 0.34;
    for (let k = 0; k < kids; k++) {
      const offset = kids === 1 ? (rnd() - 0.5) * 0.5 : (k / (kids - 1) - 0.5) * spread * 2;
      branch(paths, ex, ey, heading + offset + (rnd() - 0.5) * 0.25, len * (0.6 + rnd() * 0.18), depth + 1);
    }

    // A short side twig from part-way along the segment, for the feathery look.
    if (depth >= 1 && rnd() < 0.55) {
      const t = 0.35 + rnd() * 0.35;
      const px = (1 - t) ** 2 * x + 2 * (1 - t) * t * cx + t ** 2 * ex;
      const py = (1 - t) ** 2 * y + 2 * (1 - t) * t * cy + t ** 2 * ey;
      const side = (rnd() < 0.5 ? -1 : 1) * (0.7 + rnd() * 0.5);
      branch(paths, px, py, angle + side, len * (0.3 + rnd() * 0.15), depth + 2);
    }
  }

  return Array.from({ length: count }, (_, i) => {
    const paths = Array.from({ length: MAX_DEPTH + 2 }, () => '');
    const angle = (i / count) * Math.PI * 2 + (rnd() - 0.5) * 0.45;
    const start = 52;
    branch(paths, CENTER + Math.cos(angle) * start, CENTER + Math.sin(angle) * start, angle, 140 + rnd() * 60, 0);
    return { paths };
  });
}
