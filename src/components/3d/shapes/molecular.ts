import { ShapeBuffer, TAU, gauss, unitVec, type ShapeFn } from './buffer';

/** `groove` is the angle between the strands: just short of opposite, so the rungs still cross near the axis. */
const HELIX = { turns: 2.1, length: 7.4, radius: 1.3, rungs: 18, groove: 2.75 };

/** A point on one backbone strand of the helix, at t in 0..1 along its length. */
function strandPoint(t: number, strand: 0 | 1): [number, number, number] {
  const a = t * HELIX.turns * TAU + strand * HELIX.groove;
  return [HELIX.radius * Math.cos(a), (t - 0.5) * HELIX.length, HELIX.radius * Math.sin(a)];
}

/**
 * B-form DNA: two tubular backbones offset to leave a major and a minor groove,
 * a phosphate bead at every step, and discrete base-pair rungs split at the
 * hydrogen bond. A short run of rungs is accented as the "switch" site.
 */
export const helix: ShapeFn = (count, rng) => {
  const b = new ShapeBuffer(count);
  for (let i = 0; i < count; i++) {
    const g = rng();
    const strand = rng() < 0.5 ? 0 : 1;
    if (g < 0.46) {
      const [x, y, z] = strandPoint(rng(), strand);
      const [nx, ny, nz] = unitVec(rng);
      b.set(i, x + nx * 0.1, y + ny * 0.1, z + nz * 0.1);
    } else if (g < 0.62) {
      const k = Math.floor(rng() * HELIX.rungs);
      const [x, y, z] = strandPoint((k + 0.5) / HELIX.rungs, strand);
      const [nx, ny, nz] = unitVec(rng);
      b.set(i, x + nx * 0.2, y + ny * 0.2, z + nz * 0.2);
    } else {
      const k = Math.floor(rng() * HELIX.rungs);
      const t = (k + 0.5) / HELIX.rungs;
      const from = strandPoint(t, 0);
      const to = strandPoint(t, 1);
      let u = rng();
      while (Math.abs(u - 0.5) < 0.045) u = rng();
      b.set(
        i,
        from[0] + (to[0] - from[0]) * u + gauss(rng) * 0.026,
        from[1] + gauss(rng) * 0.026,
        from[2] + (to[2] - from[2]) * u + gauss(rng) * 0.026,
        k >= 8 && k <= 10,
      );
    }
  }
  b.rotateZ(0.32);
  return b;
};

/** Polyphosphate: a torus-knot polymer chain with granule-like beads. */
export const polymerChain: ShapeFn = (count, rng) => {
  const b = new ShapeBuffer(count);
  const beads = 60;
  const scale = 0.85;
  for (let i = 0; i < count; i++) {
    const onBead = rng() < 0.82;
    const k = Math.floor(rng() * beads);
    const t = onBead ? ((k + 0.5) / beads + gauss(rng) * 0.003) * TAU : rng() * TAU;
    const m = 2 + Math.cos(3 * t);
    const spread = onBead ? 0.09 : 0.025;
    b.set(
      i,
      (m * Math.cos(2 * t) + gauss(rng) * spread) * scale,
      (m * Math.sin(2 * t) + gauss(rng) * spread) * scale,
      (Math.sin(3 * t) + gauss(rng) * spread) * scale * 1.1,
      onBead && k % 8 === 0,
    );
  }
  return b;
};
