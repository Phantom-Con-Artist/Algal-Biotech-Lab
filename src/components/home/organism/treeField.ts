import { DEPTH_WIDTH, growTrunks, VIEW } from './tendrils';

/** Extra width, in organism units, of the "something is near" halo: covers the sway, the blur and the sample offsets. */
const HALO = 64;

/**
 * Paints the branching trees into a square canvas the shader reads as two channels:
 * red is the field itself (strokes softened, so the shader can threshold them into the same gel as the body);
 * green is a wide hard-edged halo around every branch, so the shader can skip empty pixels with one lookup.
 * Twigs are kept at least ~2.5 texture pixels wide; anything thinner would fall under the threshold and vanish.
 */
export function paintTreeField(size: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const k = size / VIEW;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, size, size);
  ctx.setTransform(k, 0, 0, k, 0, 0);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const minWidth = 2.5 / k;
  const strokes = growTrunks().flatMap((trunk) =>
    trunk.paths.filter(Boolean).map((d, depth) => ({ path: new Path2D(d), width: Math.max(DEPTH_WIDTH[depth] * 1.2, minWidth) })),
  );

  ctx.strokeStyle = '#0f0';
  for (const s of strokes) {
    ctx.lineWidth = s.width + HALO;
    ctx.stroke(s.path);
  }

  // The field goes on top additively, so the green halo is untouched. Browsers with canvas filters get a true
  // blur; the rest get soft halos drawn by hand.
  ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = '#f00';
  const canBlur = typeof ctx.filter === 'string';
  const passes = canBlur ? [{ grow: 0, alpha: 1 }] : [{ grow: 3, alpha: 0.25 }, { grow: 1.5, alpha: 0.5 }, { grow: 0, alpha: 1 }];
  if (canBlur) ctx.filter = `blur(${(1.4 * (size / 2048)).toFixed(2)}px)`;
  for (const pass of passes) {
    ctx.globalAlpha = pass.alpha;
    for (const s of strokes) {
      ctx.lineWidth = s.width + pass.grow / k;
      ctx.stroke(s.path);
    }
  }
  return canvas;
}
