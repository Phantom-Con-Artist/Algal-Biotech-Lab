import type { CellPartId } from '../../../../types';

export const STAGES = 9;
/** Index of the last scroll block: every layer peeled, seen from above. */
export const FINAL = STAGES + 1;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);

/** How far stage k has run at scroll progress p (p is the index of the block centred in view). */
export const stageAmount = (k: number, p: number) => clamp01((p - (k - 0.9)) / 0.8);

/** Which stage peels each shell, and how far its gores bend at the tip. */
export const PEEL: Record<string, { stage: number; max: number }> = {
  CellWall: { stage: 2, max: 1.55 },
  PlasmaMembrane: { stage: 3, max: 1.35 },
  Chloroplast: { stage: 5, max: 1.15 },
};

/**
 * One gore's peel at progress p. Gores come away one after another, starting with the one facing the
 * camera and running round both sides of the ring, each taking just over half of the stage.
 */
export function peelAmount(layer: string, index: number, count: number, p: number) {
  const spec = PEEL[layer];
  if (!spec) return 0;
  const half = count / 2;
  const order = Math.min(index, count - index) / half; // 0 at the front gore, 1 at the back
  const t = stageAmount(spec.stage, p);
  return easeOut((t - order * 0.42) / 0.58);
}

/**
 * Rigid moves, in micrometres and Blender axes, for structures that lift rather than peel. A structure
 * only moves once every layer around it has opened.
 */
export const LIFTS: [prefix: string, stage: number, x: number, y: number, z: number][] = [
  ['FlagRig_', 1, 0, 0, 7],
  ['BasalBody_', 1, 0, 0, 7],
  // Once read, the flagella keep rising out of the scene so they never cross the layers below.
  ['FlagRig_', 2, 2, -3, 26],
  ['BasalBody_', 2, 2, -3, 26],
  ['Eyespot', 4, -0.55, -0.75, 0.25],
  // The pyrenoid settles a little lower before its plates lift, so they never reach the nucleus.
  ['StarchPlate_', 6, 0, 0, -1.3],
  ['PyrTubule', 6, 0, 0, -1.3],
  ['PyrenoidMatrix', 6, 0, 0, -1.3],
  // Before the nucleus opens, what sits above it rises out of the envelope's path.
  ['ContractileVacuole_', 9, 0, 0, 4],
  ['CVVesicles_', 9, 0, 0, 4],
  ['Rootlet_', 9, 0, 0, 4.5],
  ['Golgi', 9, 0, 0, 4],
  ['Mitochondrion_', 9, 0, 0, 3.5],
];

/** Groups that drift apart from their own centre when their stage is read, so each piece can be seen. */
export const SPREAD: Record<string, { stage: number; amount: number }> = {
  LipidDroplet_: { stage: 7, amount: 0.7 },
  Acidocalcisome_: { stage: 8, amount: 0.7 },
};

export const PLATE_LIFT = 1;

/**
 * Shells that split rather than peel: the nuclear envelope is a double membrane wrapped tight round
 * the nucleus, so its segments drift apart radially and tilt open, like the arcs of a broken ring.
 */
export const SPLIT: Record<string, { stage: number; distance: number; rise: number; tilt: number }> = {
  NucEnvelope: { stage: 9, distance: 2.6, rise: 0.6, tilt: 0.7 },
};

/** One segment's split at progress p, staggered round the ring from the front. */
export function splitAmount(layer: string, index: number, count: number, p: number) {
  const spec = SPLIT[layer];
  if (!spec) return 0;
  const order = Math.min(index, count - index) / (count / 2);
  return easeOut((stageAmount(spec.stage, p) - order * 0.3) / 0.7);
}

/** Starch plates of the pyrenoid lift off radially, one after another, like the segments of a ring. */
export function plateLift(index: number, count: number, p: number) {
  const t = stageAmount(6, p);
  return easeOut((t - (index / count) * 0.5) / 0.5) * PLATE_LIFT;
}

export interface CameraKey {
  /** Degrees around the cell from the cut that faces the camera. */
  azimuth: number;
  /** Degrees above the cell's equator; the last frames look down into the open bloom. */
  elevation: number;
  /** Multiplier on the fitted distance. */
  zoom: number;
}

/** One framing per scroll block, from the whole cell (0) to the open bloom seen from above (FINAL). */
export const CAMERA: CameraKey[] = [
  { azimuth: -10, elevation: 6, zoom: 0.68 },
  { azimuth: -4, elevation: 8, zoom: 1.05 },
  { azimuth: 6, elevation: 16, zoom: 1 },
  { azimuth: 14, elevation: 24, zoom: 0.96 },
  { azimuth: -16, elevation: 18, zoom: 0.95 },
  { azimuth: 8, elevation: 34, zoom: 0.98 },
  { azimuth: 18, elevation: 30, zoom: 0.8 },
  { azimuth: -6, elevation: 38, zoom: 0.85 },
  { azimuth: 24, elevation: 38, zoom: 0.85 },
  { azimuth: 4, elevation: 56, zoom: 0.9 },
  { azimuth: 0, elevation: 72, zoom: 1 },
];

export function cameraAt(p: number): CameraKey & { i: number; t: number } {
  const i = Math.min(CAMERA.length - 2, Math.max(0, Math.floor(p)));
  const t = smooth(0.1, 0.9, p - i);
  const a = CAMERA[i];
  const b = CAMERA[i + 1];
  const mix = (x: number, y: number) => x + (y - x) * t;
  return { azimuth: mix(a.azimuth, b.azimuth), elevation: mix(a.elevation, b.elevation), zoom: mix(a.zoom, b.zoom), i, t };
}

/** The stage whose reading window contains p, or null between windows and at the ends. */
export function activeStage(p: number, order: CellPartId[]): CellPartId | null {
  const k = Math.round(p);
  if (k < 1 || k > STAGES || Math.abs(p - k) > 0.45) return null;
  return order[k - 1] ?? null;
}
