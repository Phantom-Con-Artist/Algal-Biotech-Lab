import { mulberry32, type ShapeFn } from './buffer';
import { apoptosis, cell } from './organic';
import { helix, polymerChain } from './molecular';
import { cultureFlask } from './flask';
import { loop, suspension } from './vessel';
import { wordmark, type WordmarkRaster } from './wordmark';

/**
 * Morph targets, in story order. Index = scroll stage. The second-to-last is the
 * loose culture shown behind the focus areas; the last becomes the lab's wordmark
 * once it has loaded.
 */
const SEQUENCE: ShapeFn[] = [
  suspension(0.7),
  cell,
  helix,
  apoptosis,
  polymerChain,
  cultureFlask,
  loop,
  suspension(0.7),
  suspension(0.7),
];

export const STAGE_COUNT = SEQUENCE.length;

export interface BuiltShapes {
  positions: Float32Array[];
  /** Bit i set when the point is accented in shape i. */
  accentMask: Float32Array;
  /** x = stagger seed, y = size, z = tone, w = phase */
  random: Float32Array;
}

export function buildShapes(count: number, raster: WordmarkRaster | null): BuiltShapes {
  const accentMask = new Float32Array(count);
  const sequence = raster ? [...SEQUENCE.slice(0, -1), wordmark(raster)] : SEQUENCE;
  const positions = sequence.map((fn, shapeIndex) => {
    const buf = fn(count, mulberry32(1000 + shapeIndex * 97));
    for (let i = 0; i < count; i++) accentMask[i] += buf.accent[i] * 2 ** shapeIndex;
    return buf.pos;
  });
  const rng = mulberry32(42);
  const random = new Float32Array(count * 4);
  for (let i = 0; i < random.length; i++) random[i] = rng();
  return { positions, accentMask, random };
}
