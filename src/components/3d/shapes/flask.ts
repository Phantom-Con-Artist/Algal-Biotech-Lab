import { ShapeBuffer, TAU, gauss, unitVec, type ShapeFn, type Rng } from './buffer';

/** Erlenmeyer profile, bottom to top. */
const BASE_Y = -2.9;
const SHOULDER_Y = 1.15;
const LIP_Y = 2.75;
const BASE_R = 2.3;
const NECK_R = 0.56;
const LIQUID_Y = -0.75;

/** Wall radius of the flask at height y: a cone that narrows into a straight neck. */
function wallRadius(y: number): number {
  if (y >= SHOULDER_Y) return NECK_R;
  const t = (y - BASE_Y) / (SHOULDER_Y - BASE_Y);
  // Ease the cone into the neck so the shoulder is a curve, not a crease.
  return BASE_R + (NECK_R - BASE_R) * Math.pow(t, 0.86);
}

/** A height on the glass, weighted by circumference so the wall is evenly covered. */
function wallHeight(rng: Rng, from: number, to: number): number {
  for (;;) {
    const y = from + rng() * (to - from);
    if (rng() * BASE_R < wallRadius(y)) return y;
  }
}

/**
 * A culture flask: glass wall, neck and lip, a green culture
 * with a bright meniscus, and ember lipid droplets forming inside it. The two
 * colours are the two steps of the chapter: grow first, make later.
 */
export const cultureFlask: ShapeFn = (count, rng) => {
  const b = new ShapeBuffer(count);
  const droplets = Array.from({ length: 11 }, () => {
    const y = BASE_Y + 0.35 + rng() * (LIQUID_Y - BASE_Y - 0.7);
    const r = (wallRadius(y) - 0.45) * Math.sqrt(rng());
    const a = rng() * TAU;
    return { x: r * Math.cos(a), y, z: r * Math.sin(a), radius: 0.14 + rng() * 0.16 };
  });

  for (let i = 0; i < count; i++) {
    const g = rng();
    const a = rng() * TAU;
    if (g < 0.3) {
      const y = wallHeight(rng, BASE_Y, LIP_Y);
      const r = wallRadius(y);
      b.set(i, r * Math.cos(a), y, r * Math.sin(a));
    } else if (g < 0.36) {
      const r = BASE_R * Math.sqrt(rng());
      b.set(i, r * Math.cos(a), BASE_Y, r * Math.sin(a));
    } else if (g < 0.42) {
      const [x, y, z] = unitVec(rng);
      const ring = NECK_R + 0.1 + x * 0.07;
      b.set(i, ring * Math.cos(a), LIP_Y + y * 0.07, ring * Math.sin(a) + z * 0.01);
    } else if (g < 0.54) {
      const r = (wallRadius(LIQUID_Y) - 0.03) * Math.sqrt(rng());
      b.set(i, r * Math.cos(a), LIQUID_Y + gauss(rng) * 0.015, r * Math.sin(a));
    } else if (g < 0.84) {
      const y = BASE_Y + 0.05 + rng() * (LIQUID_Y - BASE_Y - 0.05);
      const r = (wallRadius(y) - 0.06) * Math.sqrt(rng());
      b.set(i, r * Math.cos(a), y, r * Math.sin(a));
    } else {
      const d = droplets[Math.floor(rng() * droplets.length)];
      const [x, y, z] = unitVec(rng);
      const k = d.radius * Math.cbrt(rng());
      b.set(i, d.x + x * k, d.y + y * k, d.z + z * k, true);
    }
  }
  return b;
};
