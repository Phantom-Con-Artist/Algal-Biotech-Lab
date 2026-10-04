import { ShapeBuffer, type ShapeFn } from './buffer';

/** The lab mark with its name set underneath, rasterised to the pixels that points may land on. */
export interface WordmarkRaster {
  /** Pixel centres (x, y pairs) in canvas space; denser parts of the artwork appear more often. */
  pixels: Float32Array;
}

const CANVAS = { width: 640, height: 420 };
const MARK = { width: 287, height: 250, top: 6 };
const TEXT_BASELINE = 392;
/** Width of the finished shape in the scene's local units, and how far it is extruded. */
const SHAPE_WIDTH = 5.4;
/** Half-thickness of the slab. The lettering is kept almost flat: any real depth doubles its edges and blurs it. */
const MARK_DEPTH = 0.14;
const TEXT_DEPTH = 0.025;
const TEXT_WIDTH = 540;

export function rasterWordmark(mark: HTMLImageElement, text: string, fontFamily: string): WordmarkRaster | null {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS.width;
  canvas.height = CANVAS.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  ctx.drawImage(mark, (CANVAS.width - MARK.width) / 2, MARK.top, MARK.width, MARK.height);
  let size = 78;
  ctx.font = `500 ${size}px ${fontFamily}`;
  size *= Math.min(1, TEXT_WIDTH / ctx.measureText(text).width);
  ctx.font = `500 ${size}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#2f9e44';
  ctx.fillText(text, CANVAS.width / 2, TEXT_BASELINE);

  const { data } = ctx.getImageData(0, 0, CANVAS.width, CANVAS.height);
  const found: number[] = [];
  for (let y = 0; y < CANVAS.height; y++) {
    for (let x = 0; x < CANVAS.width; x++) {
      const o = (y * CANVAS.width + x) * 4;
      if (data[o + 3] < 140) continue;
      // The pale half-disc of the mark stays a thin veil; the lettering is weighted up so it reads.
      const pale = data[o] > 150;
      const inText = y > MARK.top + MARK.height;
      const copies = pale ? ((x + y) % 2 === 0 ? 1 : 0) : inText ? 4 : 2;
      for (let c = 0; c < copies; c++) found.push(x, y);
    }
  }
  return found.length > 0 ? { pixels: new Float32Array(found) } : null;
}

/** Points scattered over the wordmark and extruded into a shallow slab, densest on its two faces. */
export const wordmark =
  (raster: WordmarkRaster): ShapeFn =>
  (count, rng) => {
    const b = new ShapeBuffer(count);
    const unit = SHAPE_WIDTH / CANVAS.width;
    const total = raster.pixels.length / 2;
    for (let i = 0; i < count; i++) {
      const k = Math.floor(rng() * total) * 2;
      const py = raster.pixels[k + 1];
      const x = (raster.pixels[k] + rng() - CANVAS.width / 2) * unit;
      const y = (CANVAS.height / 2 - py - rng()) * unit;
      const depth = py > MARK.top + MARK.height ? TEXT_DEPTH : MARK_DEPTH;
      const face = rng();
      const z = face < 0.6 ? depth : face < 0.8 ? -depth : (rng() * 2 - 1) * depth;
      b.set(i, x, y, z);
    }
    return b;
  };
