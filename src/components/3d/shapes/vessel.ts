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
      if (g < 0.22) {
        const c = centers[Math.floor(rng() * centers.length)];
        b.set(i, c.x + gauss(rng) * 0.2, c.y + gauss(rng) * 0.2, c.z + gauss(rng) * 0.2, c.hot);
      } else if (g < 0.8) {
        b.set(i, gauss(rng) * 2.3 * spread, gauss(rng) * 1.9 * spread, gauss(rng) * 2.3 * spread);
      } else {
        b.set(i, gauss(rng) * 4.6 * spread, gauss(rng) * 3.4 * spread, gauss(rng) * 4.0 * spread);
      }
    }
    return b;
  };

/** A photobioreactor: ribbed glass wall, culture that turns from green to ember toward the top, rising bubbles. */
export const reactor: ShapeFn = (count, rng) => {
  const b = new ShapeBuffer(count);
  const height = 6.4;
  const radius = 1.5;
  const ribs = 9;
  for (let i = 0; i < count; i++) {
    const g = rng();
    const a = rng() * TAU;
    if (g < 0.2) {
      const y = (Math.floor(rng() * ribs) / (ribs - 1) - 0.5) * height;
      b.set(i, radius * Math.cos(a), y + gauss(rng) * 0.02, radius * Math.sin(a));
    } else if (g < 0.3) {
      b.set(i, radius * Math.cos(a), (rng() - 0.5) * height, radius * Math.sin(a));
    } else if (g < 0.36) {
      const r = radius * Math.sqrt(rng());
      b.set(i, r * Math.cos(a), rng() < 0.5 ? -height / 2 : height / 2, r * Math.sin(a));
    } else if (g < 0.84) {
      const y = (rng() - 0.5) * (height - 0.3);
      const r = (radius - 0.12) * Math.sqrt(rng());
      b.set(i, r * Math.cos(a), y, r * Math.sin(a), y > 0.4 && rng() < 0.7);
    } else {
      b.set(i, gauss(rng) * 0.16, (rng() - 0.5) * height, gauss(rng) * 0.16);
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
