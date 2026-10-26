import {
  ACESFilmicToneMapping,
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  Timer,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createMotes } from '../../home/cell/engine/motes';
import { SPECIMENS, type Specimen } from './specimens';

interface View {
  el: HTMLElement;
  scene: Scene;
  camera: PerspectiveCamera;
  specimen: Specimen;
  motes: ReturnType<typeof createMotes>;
  /** How far it has developed from clay, eased toward 1 once it is in view. */
  developed: number;
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/**
 * One WebGL context for every specimen on the page. The canvas covers the viewport, transparent, and
 * each frame draws each specimen inside its own slot's rectangle, so the page scrolls as ordinary HTML.
 */
export function createStage(canvas: HTMLCanvasElement, slots: HTMLElement[], reducedMotion: boolean) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  // The home film's exposure, so the specimens sit in the same light as the cell.
  renderer.toneMappingExposure = 0.95;
  renderer.setClearColor(0x000000, 0);
  renderer.setScissorTest(true);
  const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1 : 1.75);
  renderer.setPixelRatio(dpr);
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04).texture;
  room.dispose();

  const views: View[] = slots.flatMap((el) => {
    const build = SPECIMENS[el.dataset.specimen ?? ''];
    if (!build) return [];
    const scene = new Scene();
    scene.environment = environment;
    // The home film's light: a warm key, a cold rim from behind, a little fill; motes drift in it.
    scene.environmentIntensity = 0.6;
    const key = new DirectionalLight('#fff8ee', 2.6);
    key.position.set(2, 4, 3);
    const rim = new DirectionalLight('#dceeff', 2.0);
    rim.position.set(-3, 2, -3);
    scene.add(key, rim, new AmbientLight('#eef3f7', 0.3));
    const motes = createMotes(reducedMotion ? 0 : 70, 2.6, { drift: 0.025, near: [0.5, 1.5], far: [9, 4] });
    scene.add(motes.points);
    const specimen = build();
    scene.add(specimen.group);
    const camera = new PerspectiveCamera(32, 1, 0.1, 50);
    camera.position.set(0, 0.35, 4.3);
    camera.lookAt(0, 0.1, 0);
    specimen.develop(reducedMotion ? 1 : 0);
    return [{ el, scene, camera, specimen, motes, developed: reducedMotion ? 1 : 0 }];
  });

  const timer = new Timer();
  timer.connect(document);
  let raf = 0;
  let time = 0;
  let disposed = false;
  const pointer = { x: 0, y: 0 };
  const onPointer = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  if (!reducedMotion) window.addEventListener('pointermove', onPointer, { passive: true });

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  }
  resize();

  function frame(now: number) {
    raf = 0;
    if (disposed) return;
    timer.update(now);
    const delta = Math.min(timer.getDelta(), 0.05);
    if (!reducedMotion) time += delta;
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    renderer.setScissor(0, 0, vw, vh);
    renderer.clear();
    let onScreen = false;
    for (const v of views) {
      const r = v.el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh || r.width === 0) continue;
      onScreen = true;
      // It develops once most of its slot has come into view.
      const seen = clamp01((vh - r.top) / (r.height * 0.7));
      if (seen > 0.6 && v.developed < 1) v.developed = reducedMotion ? 1 : Math.min(1, v.developed + delta * 0.9);
      v.specimen.develop(v.developed * v.developed * (3 - 2 * v.developed));
      v.specimen.update(time);
      v.motes.update(time, dpr);
      // The specimen turns a little with the scroll and leans toward the pointer.
      const progress = clamp01((vh - r.top) / (vh + r.height));
      v.specimen.group.rotation.x = (progress - 0.5) * 0.25 + pointer.y * 0.05;
      v.camera.aspect = r.width / r.height;
      // Narrow slots pull the camera back so the whole specimen fits.
      v.camera.position.z = 4.3 * Math.max(1, 1.15 / v.camera.aspect);
      v.camera.position.x = pointer.x * 0.15;
      v.camera.lookAt(0, 0.1, 0);
      v.camera.updateProjectionMatrix();
      const bottom = vh - r.bottom;
      renderer.setViewport(r.left, bottom, r.width, r.height);
      renderer.setScissor(r.left, bottom, r.width, r.height);
      renderer.render(v.scene, v.camera);
    }
    // Keep running while anything is on screen; scrolling wakes the loop again.
    if (onScreen && !reducedMotion) raf = requestAnimationFrame(frame);
  }
  const kick = () => {
    if (!raf && !disposed) raf = requestAnimationFrame(frame);
  };
  const onResize = () => {
    resize();
    kick();
  };
  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', onResize);
  kick();

  return {
    kick,
    dispose() {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
      timer.dispose();
      for (const v of views) {
        v.specimen.dispose();
        v.motes.dispose();
      }
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}

export type Stage = ReturnType<typeof createStage>;
