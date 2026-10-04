import { gauss, mulberry32, unitVec, type Rng } from '../shapes/buffer';

export interface BloomData {
  positions: Float32Array;
  /** The seed cell each point grew from; points travel out from here as they are born. */
  origins: Float32Array;
  /** Growth threshold (0..1) at which each point appears. */
  birth: Float32Array;
  /** x = unused, y = size, z = tone, w = phase */
  random: Float32Array;
}

const COLONIES = 16;

/**
 * Branching filaments grown from seed cells, plus free-floating spores. The
 * first colony sits at the centre and the rest start later the further out they
 * are, so the whole bloom spreads from the middle outward.
 */
export function buildBloom(count: number, seed = 7): BloomData {
  const rng: Rng = mulberry32(seed);
  const positions = new Float32Array(count * 3);
  const origins = new Float32Array(count * 3);
  const birth = new Float32Array(count);
  const random = new Float32Array(count * 4);
  for (let i = 0; i < random.length; i++) random[i] = rng();

  const perColony = Math.floor((count * 0.86) / COLONIES);
  let n = 0;

  for (let c = 0; c < COLONIES; c++) {
    const origin = c === 0 ? [0, 0, 0] : [gauss(rng) * 2.2, gauss(rng) * 1.9, gauss(rng) * 1.1];
    const delay = Math.min(0.24, Math.hypot(origin[0], origin[1], origin[2]) * 0.07);
    const steps: number[] = [];
    const start = n;

    for (let k = 0; k < perColony * 0.1 && n < count; k++, n++) {
      positions.set([origin[0] + gauss(rng) * 0.16, origin[1] + gauss(rng) * 0.16, origin[2] + gauss(rng) * 0.16], n * 3);
      steps.push(0);
    }

    type Tip = { p: number[]; d: number[] };
    let tips: Tip[] = Array.from({ length: 5 }, () => ({ p: [...origin], d: [...unitVec(rng)] }));
    let step = 0;
    while (n - start < perColony && n < count) {
      step++;
      const next: Tip[] = [];
      for (const t of tips) {
        const d = t.d.map((v) => v + gauss(rng) * 0.2);
        const len = Math.hypot(d[0], d[1], d[2]) || 1;
        t.d = d.map((v) => v / len);
        t.p = t.p.map((v, a) => v + t.d[a] * 0.085);
        for (let w = 0; w < 2 && n - start < perColony && n < count; w++, n++) {
          positions.set(t.p.map((v) => v + gauss(rng) * 0.03), n * 3);
          steps.push(step);
        }
        if (rng() < 0.035 && tips.length + next.length < 60) {
          const [bx, by, bz] = unitVec(rng);
          next.push({ p: [...t.p], d: [t.d[0] + bx * 0.7, t.d[1] + by * 0.7, t.d[2] + bz * 0.7] });
        }
      }
      tips = tips.concat(next);
    }
    for (let k = 0; k < steps.length; k++) {
      birth[start + k] = delay + 0.7 * (steps[k] / Math.max(step, 1));
      origins.set(origin, (start + k) * 3);
    }
  }

  for (; n < count; n++) {
    const p = [gauss(rng) * 3.6, gauss(rng) * 3.0, gauss(rng) * 2.0];
    positions.set(p, n * 3);
    birth[n] = Math.min(0.92, Math.hypot(p[0], p[1], p[2]) * 0.13 + rng() * 0.2);
  }
  return { positions, origins, birth, random };
}
