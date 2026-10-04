import { ShapeBuffer, gauss, unitVec, type ShapeFn } from './buffer';

/** Chlamydomonas: membrane, cup-shaped chloroplast, pyrenoid, nucleus, eyespot and two flagella. */
export const cell: ShapeFn = (count, rng) => {
  const b = new ShapeBuffer(count);
  const y0 = -1.55;
  for (let i = 0; i < count; i++) {
    const g = rng();
    if (g < 0.36) {
      const [x, y, z] = unitVec(rng);
      const k = 1 + gauss(rng) * 0.02;
      b.set(i, x * 1.75 * k, y * 2.0 * k + y0, z * 1.75 * k);
    } else if (g < 0.66) {
      let v = unitVec(rng);
      while (v[1] > 0.55 || (v[2] > 0.55 && v[1] > -0.2)) v = unitVec(rng);
      const r = 1.45 + gauss(rng) * 0.06;
      b.set(i, v[0] * r, v[1] * r * 1.1 + y0 - 0.1, v[2] * r);
    } else if (g < 0.74) {
      const [x, y, z] = unitVec(rng);
      const r = 0.5 * Math.cbrt(rng());
      b.set(i, x * r, y * r - 0.95 + y0, z * r - 0.1, true);
    } else if (g < 0.82) {
      const [x, y, z] = unitVec(rng);
      b.set(i, x * 0.55, y * 0.55 + 0.45 + y0, z * 0.55 + 0.15);
    } else if (g < 0.84) {
      b.set(i, 1.45 + gauss(rng) * 0.07, 0.9 + y0 + gauss(rng) * 0.07, 0.4 + gauss(rng) * 0.07, true);
    } else {
      const side = rng() < 0.5 ? -1 : 1;
      const t = rng();
      const x = side * (0.22 + 0.55 * t) + Math.sin(t * 10 + side) * 0.18 * t;
      const y = 2.0 + y0 + t * 2.8;
      const z = Math.sin(t * 7 + side * 2) * 0.15 * t;
      b.set(i, x + gauss(rng) * 0.02, y, z + gauss(rng) * 0.02);
    }
  }
  return b;
};

/** A fractured cell surrounded by apoptotic bodies. */
export const apoptosis: ShapeFn = (count, rng) => {
  const b = new ShapeBuffer(count);
  const blebs = Array.from({ length: 14 }, (_, k) => {
    const y = 1 - (2 * (k + 0.5)) / 14;
    const r = Math.sqrt(1 - y * y);
    const th = k * 2.399963;
    const dist = 2.5 + rng() * 0.9;
    return { x: r * Math.cos(th) * dist, y: y * dist, z: r * Math.sin(th) * dist, radius: 0.32 + rng() * 0.25, hot: k % 3 === 0 };
  });
  for (let i = 0; i < count; i++) {
    const g = rng();
    if (g < 0.28) {
      let v = unitVec(rng);
      while (Math.sin(v[0] * 5) * Math.sin(v[1] * 5) * Math.sin(v[2] * 5) < -0.35) v = unitVec(rng);
      b.set(i, v[0] * 1.25, v[1] * 1.25, v[2] * 1.25);
    } else if (g < 0.9) {
      const bl = blebs[Math.floor(rng() * blebs.length)];
      const [x, y, z] = unitVec(rng);
      const k = bl.radius * (1 + gauss(rng) * 0.03);
      b.set(i, bl.x + x * k, bl.y + y * k, bl.z + z * k, bl.hot);
    } else {
      const [x, y, z] = unitVec(rng);
      const r = 3.4 + rng() * 1.2;
      b.set(i, x * r, y * r * 0.7, z * r);
    }
  }
  return b;
};
