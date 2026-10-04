export type Rng = () => number;

export const TAU = Math.PI * 2;

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function gauss(rng: Rng): number {
  const u = 1 - rng();
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
}

export function unitVec(rng: Rng): [number, number, number] {
  const z = rng() * 2 - 1;
  const a = rng() * TAU;
  const s = Math.sqrt(1 - z * z);
  return [s * Math.cos(a), z, s * Math.sin(a)];
}

/** Point positions for one morph target, plus a per-point "accent" flag (rendered in the ember colour). */
export class ShapeBuffer {
  readonly pos: Float32Array;
  readonly accent: Uint8Array;

  constructor(count: number) {
    this.pos = new Float32Array(count * 3);
    this.accent = new Uint8Array(count);
  }

  set(i: number, x: number, y: number, z: number, accent = false): void {
    this.pos[i * 3] = x;
    this.pos[i * 3 + 1] = y;
    this.pos[i * 3 + 2] = z;
    this.accent[i] = accent ? 1 : 0;
  }

  rotateX(angle: number): void {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    for (let i = 0; i < this.accent.length; i++) {
      const y = this.pos[i * 3 + 1];
      const z = this.pos[i * 3 + 2];
      this.pos[i * 3 + 1] = y * c - z * s;
      this.pos[i * 3 + 2] = y * s + z * c;
    }
  }

  rotateZ(angle: number): void {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    for (let i = 0; i < this.accent.length; i++) {
      const x = this.pos[i * 3];
      const y = this.pos[i * 3 + 1];
      this.pos[i * 3] = x * c - y * s;
      this.pos[i * 3 + 1] = x * s + y * c;
    }
  }
}

export type ShapeFn = (count: number, rng: Rng) => ShapeBuffer;
