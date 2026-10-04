import { gauss, mulberry32 } from '../shapes/buffer';

/** The star volume, in world units. Stars wrap inside it as the page scrolls and drifts. */
export const STAR_BOX = { width: 150, height: 76, near: -7, far: -64 };

export interface StarData {
  positions: Float32Array;
  /** x = magnitude (0 faint, 1 brightest), y = tone, z = twinkle phase, w = twinkle rate */
  random: Float32Array;
}

/**
 * A field of stars behind the scene: an even scatter, plus a dense slanted band
 * of faint ones that gives the sky a structure, like a galactic plane.
 */
export function buildStars(count: number): StarData {
  const rng = mulberry32(7);
  const positions = new Float32Array(count * 3);
  const random = new Float32Array(count * 4);
  const { width, height, near, far } = STAR_BOX;

  for (let i = 0; i < count; i++) {
    const inBand = rng() < 0.34;
    const x = (rng() - 0.5) * width;
    const y = inBand ? x * 0.3 + gauss(rng) * 5.5 : (rng() - 0.5) * height;
    const z = inBand ? far + rng() * 24 : far + rng() * (near - far);
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // A steep power law: almost every star is a pinprick, a handful are bright.
    const magnitude = Math.pow(rng(), inBand ? 9 : 5.5);
    random[i * 4] = magnitude;
    random[i * 4 + 1] = rng();
    random[i * 4 + 2] = rng();
    random[i * 4 + 3] = rng();
  }
  return { positions, random };
}
