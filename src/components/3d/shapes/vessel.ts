import { ShapeBuffer, TAU, gauss, type ShapeFn } from './buffer';

/** A loose culture: gaussian cloud with a few dense clusters standing in for cells. */
export const suspension =
  (spread: number): ShapeFn =>
  (count, rng) => {
    const b = new ShapeBuffer(count);
    const centers = Array.from({ length: 18 }, (_, k) => ({
      x: gauss(rng) * 2.4 * spread,
      y: gauss(rng) * 1.9 * spread,
      z: gauss(rng) * 2.4 * spread,
      hot: k < 4,
    }));
    for (let i = 0; i < count; i++) {
      const g = rng();
      if (g < 0.3) {
        const c = centers[Math.floor(rng() * centers.length)];
        b.set(i, c.x + gauss(rng) * 0.17, c.y + gauss(rng) * 0.17, c.z + gauss(rng) * 0.17, c.hot);
      } else if (g < 0.92) {
        b.set(i, gauss(rng) * 2.2 * spread, gauss(rng) * 1.8 * spread, gauss(rng) * 2.2 * spread);
      } else {
        b.set(i, gauss(rng) * 3.6 * spread, gauss(rng) * 2.8 * spread, gauss(rng) * 3.4 * spread);
      }
    }
    return b;
  };

/** A tilted torus with a modulated tube: the circular bioeconomy. */
export const loop: ShapeFn = (count, rng) => {
  const b = new ShapeBuffer(count);
  const major = 2.6;
  for (let i = 0; i < count; i++) {
    const u = rng() * TAU;
    const v = rng() * TAU;
    const tube = (0.55 + 0.2 * Math.sin(3 * u)) * (rng() < 0.3 ? Math.cbrt(rng()) : 1);
    const ring = major + tube * Math.cos(v);
    b.set(i, ring * Math.cos(u), ring * Math.sin(u), tube * Math.sin(v), u < 1.3);
  }
  b.rotateX(1.15);
  b.rotateZ(0.25);
  return b;
};
