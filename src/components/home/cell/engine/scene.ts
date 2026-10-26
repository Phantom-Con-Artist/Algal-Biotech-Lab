import {
  ACESFilmicToneMapping,
  AmbientLight,
  Color,
  DirectionalLight,
  Fog,
  Mesh,
  PerspectiveCamera,
  PCFShadowMap,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  Timer,
  Vector3,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { JOURNEY_TAGS } from '../../../../data/journey';
import type { CellPart } from '../../../../types';
import { createLoader, loadDetailMaps } from './assets';
import { createCell, type Cell } from './cell';
import { cameraAt, smooth } from './choreography';
import { createLab, LAB_KEYS, labKeyAt, type Lab } from './lab';
import { createMotes } from './motes';
import { createPost } from './post';
import { createSwarm } from './swarm';

/** The mist everything hangs in. Matches --color-mist in globals.css. */
const MIST = new Color('#a9b3bd');
/** Scroll positions of the two scale jumps, each carried by a frost dissolve between two worlds. */
const TO_CULTURE = 10.58;
const TO_LAB = 11.6;
/** Where the key light sits relative to the lab station in view, in centimetres. */
const SUN = new Vector3(70, 130, 90);

export interface Projection {
  /** Screen position of each visible anchor (cell parts and lab tags), in CSS pixels. */
  anchors: Record<string, { x: number; y: number }>;
  /** Length of one unit of the current world on screen, and that unit. */
  pxPerUnit: number;
  unit: 'µm' | 'cm';
}

interface Options {
  canvas: HTMLCanvasElement;
  parts: CellPart[];
  reducedMotion: boolean;
  onFrame: (projection: Projection) => void;
  onReady: () => void;
  onError: (error: unknown) => void;
}

const bump = (p: number, centre: number, width: number) => 1 - smooth(0, width, Math.abs(p - centre));

export function createCellScene({ canvas, parts, reducedMotion, onFrame, onReady, onError }: Options) {
  const renderer = new WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.82;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  // Refraction is blurred by roughness anyway; half resolution is indistinguishable and half the cost.
  renderer.transmissionResolutionScale = 0.5;
  const maxDpr = Math.min(window.devicePixelRatio || 1, 1.5);
  let dpr = maxDpr;
  renderer.setPixelRatio(dpr);
  const post = createPost(renderer);

  const scene = new Scene();
  scene.background = MIST;
  const fog = new Fog(MIST, 30, 90);
  scene.fog = fog;
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  scene.environment = pmrem.fromScene(room, 0.04).texture;
  scene.environmentIntensity = 0.6;
  room.dispose();
  // High-key light, as in a bright field: a soft key, a cold rim from behind, a little fill.
  const key = new DirectionalLight('#fff8ee', 2.6);
  key.position.set(16, 34, 24);
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = key.shadow.camera.bottom = -90;
  key.shadow.camera.right = key.shadow.camera.top = 90;
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 420;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.35;
  key.shadow.radius = 5;
  scene.add(key.target);
  const rim = new DirectionalLight('#dceeff', 2.2);
  rim.position.set(-22, 12, -30);
  scene.add(key, rim, new AmbientLight('#eef3f7', 0.25));

  const camera = new PerspectiveCamera(30, 1, 0.3, 2000);
  const motes = createMotes(reducedMotion ? 0 : 700, 46);
  scene.add(motes.points);
  const loader = createLoader();
  const timer = new Timer();
  timer.connect(document);

  // The pointer leans the camera a few degrees, eased, as if the visitor were moving their head.
  const pointer = { x: 0, y: 0, ex: 0, ey: 0 };
  const onPointer = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  if (!reducedMotion) window.addEventListener('pointermove', onPointer, { passive: true });

  let cell: Cell | null = null;
  let lab: Lab | null = null;
  let swarm: ReturnType<typeof createSwarm> | null = null;
  /** Scroll position as delivered, and the eased value the scene shows. */
  let target = 0;
  let progress = 0;
  let width = 1;
  let height = 1;
  let visible = true;
  let disposed = false;
  let raf = 0;
  let dirty = true;
  let time = 0;
  let frameCount = 0;

  (async () => {
    const maps = await loadDetailMaps(renderer);
    const gltf = await loader.gltf.loadAsync('/models/chlamydomonas.glb');
    if (disposed) return;
    cell = createCell(gltf, maps, parts, reducedMotion);
    scene.add(cell.root);
    swarm = createSwarm(maps, width < 700 ? 140 : 260, reducedMotion);
    scene.add(swarm.group);
    onReady();
    dirty = true;
    kick();
    // The lab loads once the cell is on screen; it is not needed until the second half of the scroll.
    const labGltf = await loader.gltf.loadAsync('/models/lab.glb');
    if (disposed) return;
    lab = createLab(labGltf, maps, reducedMotion);
    scene.add(lab.root);
    dirty = true;
  })().catch((error: unknown) => {
    if (!disposed) onError(error);
  });

  const lookAt = new Vector3();
  const tmp = new Vector3();
  const tmp2 = new Vector3();
  const right = new Vector3();
  type World = 'cell' | 'culture' | 'lab';
  /** The world whose anchors and scale the overlay reads: the one that owns most of the frame. */
  let shown: World = 'cell';

  /** Places the camera on its orbit around `lookAt`. Azimuth and elevation in degrees. */
  function orbit(d: number, azimuth: number, elevation: number, offsetX: number) {
    const drift = reducedMotion ? 0 : 1;
    const az = ((azimuth + (pointer.ex * 4 + Math.sin(time * 0.19) * 1.5) * drift) * Math.PI) / 180;
    const el = ((elevation - (pointer.ey * 3 - Math.sin(time * 0.23) * 1.2) * drift) * Math.PI) / 180;
    camera.position.set(lookAt.x + Math.sin(az) * Math.cos(el) * d, lookAt.y + Math.sin(el) * d, lookAt.z + Math.cos(az) * Math.cos(el) * d);
    camera.lookAt(lookAt);
    const aspect = width / height;
    camera.setViewOffset(width, height, aspect > 1.1 ? -width * offsetX : 0, aspect < 0.9 ? height * 0.17 : 0, width, height);
    camera.updateMatrixWorld();
    return d;
  }

  /** Shows one world and points the camera, fog, light and motes at it for progress p. */
  function pose(w: World, p: number) {
    const aspect = width / height;
    const vHalf = (camera.fov * Math.PI) / 360;
    const usableH = aspect < 0.9 ? 0.62 : 0.9;
    const half = Math.min(Math.atan(Math.tan(vHalf) * aspect * (aspect > 1.1 ? 0.62 : 0.9)), Math.atan(Math.tan(vHalf) * usableH));
    let d = 50;
    let haze = 0;
    if (w === 'cell' && cell) {
      cell.place(Math.min(p, 10), time);
      const c = cameraAt(Math.min(p, 10));
      lookAt.lerpVectors(cell.frames[c.i].center, cell.frames[c.i + 1].center, c.t);
      const radius = cell.frames[c.i].radius + (cell.frames[c.i + 1].radius - cell.frames[c.i].radius) * c.t;
      // Past the full plate the camera keeps pulling back, so the cell recedes as the culture opens.
      const away = 1 + Math.max(0, p - 10) * 2.2;
      d = orbit((radius / Math.sin(half)) * c.zoom * away, 45 + c.azimuth, c.elevation, 0.16);
    } else if (w === 'culture') {
      // From above, where the plate was seen, down and back until the field is full of swimming cells.
      const t = smooth(TO_CULTURE - 0.4, TO_LAB + 0.3, p);
      lookAt.set(0, 0, 0);
      d = orbit(60 + t * 260, 45 - t * 20, 62 - t * 44, 0.1);
    } else if (lab) {
      const k = labKeyAt(p);
      const i = Math.min(LAB_KEYS.length - 2, Math.floor(k));
      const t = smooth(0.12, 0.88, k - i);
      const a = LAB_KEYS[i];
      const b = LAB_KEYS[i + 1];
      const mix = (x: number, y: number) => x + (y - x) * t;
      lookAt.set(mix(a.target[0], b.target[0]), mix(a.target[1], b.target[1]), mix(a.target[2], b.target[2]));
      d = orbit(mix(a.distance, b.distance) * (aspect < 0.9 ? 1.5 : 1), mix(a.azimuth, b.azimuth), mix(a.elevation, b.elevation), 0.14);
      // Between stations the camera travels through a little haze.
      haze = i > 0 ? 0.3 * bump(k % 1, 0.5, 0.4) : 0;
    }
    if (cell) cell.root.visible = w === 'cell';
    if (swarm) swarm.group.visible = w === 'culture';
    if (lab) lab.root.visible = w === 'lab';
    fog.near = d * (1.05 - haze);
    fog.far = d * (3.4 - 2.2 * haze);
    motes.points.scale.setScalar(w === 'cell' ? 1 : w === 'culture' ? 5 : 3);
    motes.points.position.copy(lookAt);
    // In the lab the key light casts soft contact shadows, following the camera from station to station.
    key.castShadow = w === 'lab';
    if (w === 'lab') {
      key.position.copy(lookAt).add(SUN);
      key.target.position.copy(lookAt);
      key.target.updateMatrixWorld();
    } else {
      key.position.set(16, 34, 24);
      key.target.position.set(0, 0, 0);
      key.target.updateMatrixWorld();
    }
  }

  /** Which worlds the frame needs at p, and how far the frost front has carried it from the first to the second. */
  function frameAt(p: number): { a: World; b: World | null; mix: number } {
    if (!swarm) return { a: 'cell', b: null, mix: 0 };
    const toCulture = smooth(TO_CULTURE - 0.42, TO_CULTURE + 0.38, p);
    if (toCulture > 0 && toCulture < 1) return { a: 'cell', b: 'culture', mix: toCulture };
    if (toCulture === 0) return { a: 'cell', b: null, mix: 0 };
    if (!lab) return { a: 'culture', b: null, mix: 0 };
    const toLab = smooth(TO_LAB - 0.4, TO_LAB + 0.35, p);
    if (toLab > 0 && toLab < 1) return { a: 'culture', b: 'lab', mix: toLab };
    return { a: toLab === 0 ? 'culture' : 'lab', b: null, mix: 0 };
  }

  function project(w: World): Projection {
    const anchors: Projection['anchors'] = {};
    const put = (id: string) => {
      tmp.project(camera);
      if (tmp.z < 1) anchors[id] = { x: (tmp.x * 0.5 + 0.5) * width, y: (-tmp.y * 0.5 + 0.5) * height };
    };
    if (w === 'cell' && cell) {
      cell.root.updateMatrixWorld();
      for (const part of parts) if (cell.anchor(part, Math.min(progress, 10), tmp)) put(part.id);
    } else if (w === 'lab' && lab) {
      for (const tag of JOURNEY_TAGS) if (lab.anchor(tag, tmp)) put(tag.id);
    }
    right.setFromMatrixColumn(camera.matrixWorld, 0).multiplyScalar(0.5);
    tmp.copy(lookAt).sub(right).project(camera);
    tmp2.copy(lookAt).add(right).project(camera);
    return { anchors, pxPerUnit: Math.abs(tmp2.x - tmp.x) * 0.5 * width, unit: w === 'lab' ? 'cm' : 'µm' };
  }

  function loop(now: number) {
    if (disposed) return;
    raf = 0;
    if (!visible || !cell) return;
    timer.update(now);
    const delta = Math.min(timer.getDelta(), 0.05);
    time += delta;
    motes.update(time, dpr);
    pointer.ex += (pointer.x - pointer.ex) * 0.04;
    pointer.ey += (pointer.y - pointer.ey) * 0.04;
    // Ease toward the scroll position, so a flick of the wheel glides instead of jumps.
    const gap = target - progress;
    if (gap !== 0) {
      progress = reducedMotion || Math.abs(gap) < 0.0005 ? target : progress + gap * (1 - Math.exp(-delta * 7));
      dirty = true;
    }
    const staining = cell.tick(delta);
    const f = frameAt(progress);
    const uses = (w: World) => f.a === w || f.b === w;
    if (uses('culture')) swarm?.update(time, delta, camera.position);
    if (uses('lab')) lab?.update(progress, time, delta);
    const animating = !reducedMotion || staining;
    if (dirty || animating) {
      // The second world renders first, so the camera ends on the first for the overlay's projection.
      // Shadows refresh every other frame; the shaker's slow orbit never shows the difference.
      frameCount++;
      renderer.shadowMap.needsUpdate = frameCount % 2 === 0;
      // Once the frost front has carried most of the frame, the old world is no longer drawn.
      if (f.b && f.mix > 0.94) {
        f.a = f.b;
        f.b = null;
      }
      if (f.b) {
        pose(f.b, progress);
        renderer.setRenderTarget(post.targetB);
        renderer.render(scene, camera);
      }
      pose(f.a, progress);
      renderer.setRenderTarget(post.targetA);
      renderer.render(scene, camera);
      const surge = f.b ? Math.pow(Math.sin(Math.PI * f.mix), 1.5) : 0;
      const travel = f.a === 'lab' && !f.b ? 0.35 * bump(labKeyAt(progress) % 1, 0.5, 0.4) * (labKeyAt(progress) > 1 ? 1 : 0) : 0;
      post.render(time, f.b ? f.mix : 0, reducedMotion ? 0 : Math.max(surge, travel), surge ** 4 * 0.35);
      shown = f.b && f.mix > 0.5 ? f.b : f.a;
      if (shown !== f.a && f.b) pose(f.b, progress);
      onFrame(project(shown));
      dirty = false;
      adapt(delta * 1000);
    }
    if (animating || progress !== target) raf = requestAnimationFrame(loop);
  }

  /**
   * Keeps 60fps on modest GPUs by trading pixel ratio, never geometry or framing. It reads the real
   * interval between frames: GPU work is asynchronous, so timing the render call would only see the CPU.
   */
  let frameAvg = 16.7;
  let slow = 0;
  let fast = 0;
  function adapt(ms: number) {
    if (ms <= 0 || ms > 100) return;
    frameAvg += (ms - frameAvg) * 0.1;
    slow = frameAvg > 18.5 ? slow + 1 : Math.max(0, slow - 1);
    fast = frameAvg < 15.5 ? fast + 1 : 0;
    if (slow > 10 && dpr > 0.75) {
      dpr = Math.max(0.75, dpr - 0.15);
      resizeTargets();
      slow = 0;
      frameAvg = 16.7;
    } else if (fast > 240 && dpr < maxDpr) {
      dpr = Math.min(maxDpr, dpr + 0.1);
      resizeTargets();
      fast = 0;
    }
  }

  function resizeTargets() {
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    post.setSize(width, height, dpr);
  }

  function kick() {
    if (!raf && !disposed) raf = requestAnimationFrame(loop);
  }

  return {
    setProgress(p: number) {
      if (p === target) return;
      target = p;
      kick();
    },
    setStained(ids: Parameters<Cell['setStained']>[0]) {
      cell?.setStained(ids);
      dirty = true;
      kick();
    },
    resize(w: number, h: number) {
      width = Math.max(1, w);
      height = Math.max(1, h);
      resizeTargets();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      dirty = true;
      kick();
    },
    setVisible(v: boolean) {
      visible = v;
      if (v) {
        dirty = true;
        kick();
      }
    },
    dispose() {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      timer.dispose();
      motes.dispose();
      swarm?.dispose();
      window.removeEventListener('pointermove', onPointer);
      scene.traverse((o) => {
        if (o instanceof Mesh) {
          o.geometry.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
        }
      });
      scene.environment?.dispose();
      pmrem.dispose();
      post.dispose();
      loader.dispose();
      renderer.dispose();
    },
  };
}

export type CellScene = ReturnType<typeof createCellScene>;
