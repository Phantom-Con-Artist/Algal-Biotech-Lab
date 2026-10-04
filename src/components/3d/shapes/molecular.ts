import { ShapeBuffer, TAU, gauss, type ShapeFn } from './buffer';

/** Double helix with base-pair rungs; a short run of rungs is accented as the "switch" site. */
export const helix: ShapeFn = (count, rng) => {
  const b = new ShapeBuffer(count);
  const turns = 3.4;
  for (let i = 0; i < count; i++) {
    const t = rng();
    const y = (t - 0.5) * 7.2;
    const a = t * turns * TAU;
    if (rng() < 0.82) {
      const strand = rng() < 0.5 ? 0 : Math.PI;
      const r = 1.1 + gauss(rng) * 0.045;
      b.set(i, r * Math.cos(a + strand), y, r * Math.sin(a + strand));
    } else {
      const u = rng() * 2 - 1;
      b.set(i, 1.05 * u * Math.cos(a), y, 1.05 * u * Math.sin(a), t > 0.42 && t < 0.52);
    }
  }
  b.rotateZ(0.3);
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
