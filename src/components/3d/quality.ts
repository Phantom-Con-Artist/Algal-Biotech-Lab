/** `software` = WebGL drawn on the CPU; `low` = a weak phone or PC that still has a GPU. */
export type Tier = 'software' | 'low' | 'mid' | 'high';

export interface Quality {
  tier: Tier;
  /** Upper bound on the canvas pixel ratio. */
  dpr: number;
  cells: number;
  stars: number;
  bloom: number;
  /** Point size multiplier: with fewer points, each is drawn larger so shapes stay solid. */
  pointScale: number;
  /** The bloom's wide glow pass: large points, so the most expensive thing to fill. */
  halo: boolean;
  /** Most pointer spores alive at once; 0 leaves the spore engine unloaded. */
  spores: number;
  /** Frame-rate cap, or null to run at the display's rate. */
  fps: number | null;
}

interface NavigatorHints extends Navigator {
  deviceMemory?: number;
}

const SOFTWARE = /swiftshader|llvmpipe|softpipe|software|basic render/i;

/** How the browser will draw WebGL here: not at all, on the CPU, or on a GPU. */
function probeRenderer(): 'none' | 'software' | 'gpu' {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
  if (!gl) return 'none';
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  const name = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  if (SOFTWARE.test(name)) return 'software';
  const fast = document.createElement('canvas').getContext('webgl', { failIfMajorPerformanceCaveat: true });
  fast?.getExtension('WEBGL_lose_context')?.loseContext();
  return fast ? 'gpu' : 'software';
}

function detectTier(narrow: boolean): Tier | null {
  const renderer = probeRenderer();
  if (renderer === 'none') return null;
  // `?quality=software|low|mid|high` forces a tier, for checking how the site looks on other hardware.
  const forced = new URLSearchParams(window.location.search).get('quality');
  if (forced === 'software' || forced === 'low' || forced === 'mid' || forced === 'high') return forced;

  if (renderer === 'software') return 'software';
  const nav = navigator as NavigatorHints;
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  // A desktop with a GPU gets the full scene unless it is very small; the governor covers the rest.
  if (!narrow) return cores <= 2 || memory <= 2 ? 'mid' : 'high';
  return cores <= 4 || memory <= 2 ? 'low' : 'mid';
}

const PRESETS: Record<Tier, Omit<Quality, 'tier'>> = {
  software: { dpr: 1, cells: 6500, stars: 1600, bloom: 2600, pointScale: 1.45, halo: false, spores: 0, fps: 30 },
  low: { dpr: 1.25, cells: 7000, stars: 2500, bloom: 4000, pointScale: 1.3, halo: true, spores: 0, fps: null },
  mid: { dpr: 1.5, cells: 10000, stars: 5000, bloom: 6500, pointScale: 1.1, halo: true, spores: 50, fps: null },
  high: { dpr: 2, cells: 26000, stars: 12000, bloom: 10000, pointScale: 1, halo: true, spores: 160, fps: null },
};

let cached: Quality | null | undefined;

/** The starting quality for this device, or null when WebGL is unavailable. Probed once. */
export function getQuality(narrow: boolean): Quality | null {
  if (cached === undefined) {
    const tier = detectTier(narrow);
    cached = tier ? { tier, ...PRESETS[tier] } : null;
  }
  return cached;
}

/**
 * Live load-shedding, written by the governor and read by the fields each frame.
 * `fraction` is the share of every point cloud that is drawn.
 */
export const load = { fraction: 1, pointScale: 1 };
