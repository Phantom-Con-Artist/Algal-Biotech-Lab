import {
  ACESFilmicToneMapping,
  CatmullRomCurve3,
  Color,
  Fog,
  HalfFloatType,
  Matrix4,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  Timer,
  Vector3,
  WebGLRenderer,
  WebGLRenderTarget,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { DRACO_PATH } from '../../../data/assets3d';
import { LABEL_OFFSETS } from '../../../data/labTour';
import type { TourStop } from '../../../types';
import { createMotes } from '../../home/cell/engine/motes';
import { createPost } from '../../home/cell/engine/post';
import { createRoom, loadLightmaps, ROOM_URL, roomPoint, type Room } from './room';
import { createRoomUniforms } from './roomMaterial';

/** The white the room dissolves into at distance; matches --color-mist. */
const HAZE = new Color('#ebeeea');

export interface TourProjection {
  anchors: Record<string, { x: number; y: number }>;
}

interface Options {
  canvas: HTMLCanvasElement;
  stops: TourStop[];
  reducedMotion: boolean;
  onFrame: (projection: TourProjection) => void;
  onReady: () => void;
  onError: (error: unknown) => void;
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export function createTourScene({ canvas, stops, reducedMotion, onFrame, onReady, onError }: Options) {
  // Antialiasing comes from the multisampled film target, as on the home page.
  const renderer = new WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.82;
  const maxDpr = Math.min(window.devicePixelRatio || 1, 1.75);
  let dpr = maxDpr;

  const scene = new Scene();
  scene.background = HAZE;
  scene.fog = new Fog(HAZE, 14, 46);
  const camera = new PerspectiveCamera(46, 1, 0.05, 120);
  const shared = createRoomUniforms();
  // The home film's look: its grade, grain and lens, and dust hanging in the light.
  const phone = window.innerWidth < 768;
  const post = createPost(renderer, phone ? 0 : 2);
  const motes = createMotes(reducedMotion ? 0 : phone ? 140 : 320, 7, { drift: 0.05, near: [0.35, 1.1], far: [14, 6] });
  scene.add(motes.points);
  shared.uLightGain.value = 1.6;
  // Nothing is thrown until a station is reached.
  shared.uSplat.value = 0;
  shared.uDrip.value = 0;

  // Planar reflection for the gloss floor: the room drawn from below the floor, at reduced size.
  const mirror = new PerspectiveCamera();
  const reflectTarget = new WebGLRenderTarget(1, 1, { type: HalfFloatType });
  const bias = new Matrix4().set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
  shared.uReflection.value = reflectTarget.texture;

  const eyes = new CatmullRomCurve3(stops.map((s) => roomPoint(s.eye)), false, 'centripetal');
  const looks = new CatmullRomCurve3(stops.map((s) => roomPoint(s.look)), false, 'centripetal');
  const lookAt = new Vector3();
  const tmp = new Vector3();
  const nudged = new Vector3();

  const draco = new DRACOLoader().setDecoderPath(DRACO_PATH);
  const loader = new GLTFLoader().setDRACOLoader(draco);
  const timer = new Timer();
  timer.connect(document);

  const pointer = { x: 0, y: 0, ex: 0, ey: 0 };
  const onPointer = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  if (!reducedMotion) window.addEventListener('pointermove', onPointer, { passive: true });

  let room: Room | null = null;
  let target = 0;
  let progress = 0;
  let width = 1;
  let height = 1;
  let visible = true;
  let disposed = false;
  let raf = 0;
  let dirty = true;
  let time = 0;
  let reflect = true;

  (async () => {
    const [gltf, lightmaps] = await Promise.all([loader.loadAsync(ROOM_URL), loadLightmaps(renderer)]);
    if (disposed) return;
    room = createRoom(gltf, lightmaps, shared);
    scene.add(room.root);
    // Shaders compile before the canvas is revealed, without blocking the page while they do.
    await renderer.compileAsync(scene, camera).catch(() => undefined);
    if (disposed) return;
    onReady();
    dirty = true;
    kick();
  })().catch((error: unknown) => {
    if (!disposed) onError(error);
  });

  /** Camera, focus and reveal for progress p (0 at the first stop, stops.length - 1 at the last). */
  function pose(p: number) {
    const n = stops.length - 1;
    const i = Math.min(n - 1, Math.max(0, Math.floor(p)));
    // Each stop holds for a moment; the walk between stops eases in and out.
    const t = smooth(0.14, 0.86, p - i);
    const u = (i + t) / n;
    eyes.getPoint(u, camera.position);
    looks.getPoint(u, lookAt);
    const drift = reducedMotion ? 0 : 1;
    camera.position.x += pointer.ex * 0.12 * drift;
    camera.position.y += -pointer.ey * 0.06 * drift;
    camera.lookAt(lookAt);
    const narrow = width / height < 0.9;
    camera.fov = narrow ? 62 : 46;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    motes.points.position.copy(lookAt);
  }

  /**
   * The throw. When a station is reached, paint bursts out from its instruments in under a second and
   * its drips run on for a few more; the instruments lift off the bench with it. Moving on, the paint
   * draws back into the clay before the next throw lands. Time-driven, so it plays even when scrolling stops.
   */
  let thrown: number | null = null;
  let since = 0;
  const weights = new Map<string, number>();
  function splatter(p: number, delta: number): boolean {
    let busy = false;
    const k = Math.round(p);
    const want = Math.abs(p - k) < 0.35 && stops[k]?.radius > 0 ? k : null;
    const u = shared;
    if (want !== thrown) {
      busy = true;
      // Draw the old paint back first; the new throw starts from clean clay.
      u.uSplat.value = reducedMotion ? 0 : Math.max(0, u.uSplat.value - delta * 3.2);
      u.uDrip.value = Math.min(u.uDrip.value, u.uSplat.value);
      if (u.uSplat.value === 0) {
        thrown = want;
        since = 0;
        if (want !== null) {
          roomPoint(stops[want].focus, u.uFocus.value);
          u.uRadius.value = stops[want].radius;
        } else u.uRadius.value = 0;
      }
    } else if (thrown !== null) {
      since += delta;
      u.uSplat.value = reducedMotion ? 1 : 1 - Math.exp(-since * 5.5);
      u.uDrip.value = reducedMotion ? 1 : smooth(0.35, 3.2, since);
      busy ||= since < 3.3;
    }
    // Instruments of the thrown station float; every other one settles.
    const rate = 1 - Math.exp(-delta * 4);
    for (const [i, stop] of stops.entries()) {
      for (const id of stop.labels) {
        const inst = room?.instruments.get(id);
        if (!inst) continue;
        const goal = thrown === i ? 1 : 0;
        const w = reducedMotion ? goal : (weights.get(id) ?? 0) + (goal - (weights.get(id) ?? 0)) * rate;
        weights.set(id, w);
        busy ||= Math.abs(goal - w) > 0.002;
        // Floor-standing instruments rise further than bench-top ones.
        const height = inst.y < 0.2 ? 0.3 : 0.18;
        const breathe = reducedMotion ? 0 : Math.sin(time * 1.3 + i) * 0.012;
        inst.object.position.y = inst.y + (height + breathe) * w;
        inst.object.rotation.y = inst.ry + (0.2 + (reducedMotion ? 0 : Math.sin(time * 0.5 + i) * 0.05)) * w;
      }
    }
    return busy;
  }

  function renderReflection() {
    if (!room || !reflect) {
      shared.uReflectionStrength.value = 0;
      return;
    }
    mirror.copy(camera);
    mirror.position.set(camera.position.x, -camera.position.y, camera.position.z);
    tmp.set(lookAt.x, -lookAt.y, lookAt.z);
    mirror.up.set(0, -1, 0);
    mirror.lookAt(tmp);
    mirror.updateMatrixWorld();
    mirror.projectionMatrix.copy(camera.projectionMatrix);
    shared.uReflectionMatrix.value.copy(bias).multiply(mirror.projectionMatrix).multiply(mirror.matrixWorldInverse);
    // While the mirror pass draws into the target, nothing may sample it.
    for (const f of room.floors) f.visible = false;
    shared.uReflectionStrength.value = 0;
    shared.uReflection.value = null;
    renderer.setRenderTarget(reflectTarget);
    renderer.render(scene, mirror);
    renderer.setRenderTarget(null);
    for (const f of room.floors) f.visible = true;
    shared.uReflection.value = reflectTarget.texture;
    shared.uReflectionStrength.value = 1;
  }

  function project(): TourProjection {
    const anchors: TourProjection['anchors'] = {};
    if (!room) return { anchors };
    const stop = stops[Math.round(Math.min(stops.length - 1, Math.max(0, progress)))];
    for (const id of stop.labels) {
      if (!room.anchorOf(id, tmp)) continue;
      const nudge = LABEL_OFFSETS[id];
      if (nudge) tmp.add(roomPoint(nudge, nudged));
      tmp.project(camera);
      if (tmp.z < 1 && Math.abs(tmp.x) < 1.1 && Math.abs(tmp.y) < 1.1) anchors[id] = { x: (tmp.x * 0.5 + 0.5) * width, y: (-tmp.y * 0.5 + 0.5) * height };
    }
    return { anchors };
  }

  /**
   * Renders only what changed. Scrolling, the pointer, a throw or a lift render every frame; once all of
   * that settles only the ambient motion (dust, a floating instrument's breath) remains, at half rate.
   * The floor reflection is redrawn only when the camera or the splash has moved.
   */
  let lastActive = 0;
  let odd = false;
  const lastEye = new Vector3(Infinity, 0, 0);
  function loop(now: number) {
    if (disposed) return;
    raf = 0;
    if (!visible || !room) return;
    timer.update(now);
    const delta = Math.min(timer.getDelta(), 0.05);
    // A queued pixel-ratio change lands here, in the same frame that redraws the canvas.
    if (pendingDpr) {
      dpr = pendingDpr;
      pendingDpr = 0;
      resizeTargets();
      dirty = true;
    }
    time += delta;
    shared.uTime.value = reducedMotion ? 0 : time;
    const reach = Math.abs(pointer.x - pointer.ex) + Math.abs(pointer.y - pointer.ey);
    pointer.ex += (pointer.x - pointer.ex) * 0.04;
    pointer.ey += (pointer.y - pointer.ey) * 0.04;
    const gap = target - progress;
    if (gap !== 0) progress = reducedMotion || Math.abs(gap) < 0.0005 ? target : progress + gap * (1 - Math.exp(-delta * 5));
    const ambient = !reducedMotion;
    pose(progress);
    const busy = splatter(progress, delta);
    const moved = camera.position.distanceToSquared(lastEye) > 1e-8;
    if (dirty || gap !== 0 || reach > 0.001 || busy || moved) lastActive = now;
    odd = !odd;
    const idle = now - lastActive > 1500;
    if (dirty || !idle || (ambient && odd)) {
      if (moved || busy || dirty) renderReflection();
      lastEye.copy(camera.position);
      motes.update(time, dpr);
      renderer.setRenderTarget(post.targetA);
      renderer.render(scene, camera);
      post.render(time);
      onFrame(project());
      dirty = false;
      if (!idle) adapt(delta * 1000);
    }
    if (ambient || !idle) raf = requestAnimationFrame(loop);
  }

  /** Trades pixel ratio, then the floor reflection, to hold the frame rate on modest GPUs. */
  let frameAvg = 16.7;
  let slow = 0;
  let fast = 0;
  /** Frames to ignore after the first render: shaders compile then, and slow frames say nothing about the device. */
  let warmup = 90;
  /** A pixel-ratio change waits for the start of the next frame, so the canvas is never shown cleared. */
  let pendingDpr = 0;
  function adapt(ms: number) {
    if (warmup > 0) {
      warmup--;
      return;
    }
    if (ms <= 0 || ms > 100) return;
    frameAvg += (ms - frameAvg) * 0.1;
    slow = frameAvg > 19 ? slow + 1 : Math.max(0, slow - 1);
    fast = frameAvg < 15.5 ? fast + 1 : 0;
    if (slow > 12) {
      if (dpr > 0.8) pendingDpr = Math.max(0.8, dpr - 0.15);
      else reflect = false;
      slow = 0;
      frameAvg = 16.7;
    } else if (fast > 240 && dpr < maxDpr) {
      pendingDpr = Math.min(maxDpr, dpr + 0.1);
      fast = 0;
    }
  }

  function resizeTargets() {
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    post.setSize(width, height, dpr);
    reflectTarget.setSize(Math.round(width * dpr * 0.4), Math.round(height * dpr * 0.4));
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
    /** Moves straight to p with no easing: the loop's seam, where both ends show the same view. */
    jump(p: number) {
      target = progress = p;
      dirty = true;
      kick();
    },
    resize(w: number, h: number) {
      width = Math.max(1, w);
      height = Math.max(1, h);
      // Phones skip the floor reflection from the start.
      reflect = width >= 760;
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
      window.removeEventListener('pointermove', onPointer);
      room?.dispose();
      scene.traverse((o) => {
        if ('geometry' in o && o.geometry && typeof (o.geometry as { dispose?: () => void }).dispose === 'function') (o.geometry as { dispose: () => void }).dispose();
      });
      reflectTarget.dispose();
      post.dispose();
      motes.dispose();
      draco.dispose();
      renderer.dispose();
    },
  };
}

export type TourScene = ReturnType<typeof createTourScene>;
