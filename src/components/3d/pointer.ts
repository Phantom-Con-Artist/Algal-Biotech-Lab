/**
 * Shared pointer state for the 3D scene, in normalised device coordinates
 * (x right, y up, both -1..1). The canvas itself ignores pointer events, so
 * the listeners live on the window.
 */
export const pointer = {
  x: 0,
  y: 0,
  /** Screen-space distance moved since the last frame consumed it. */
  travel: 0,
  /** False until the pointer has been seen, and again once it leaves the page. */
  seen: false,
  touch: false,
  lastMove: -10,
  pulseX: 0,
  pulseY: 0,
  /** Time of the last click or tap, in seconds. */
  pulseAt: -10,
  /** Incremented on every click so consumers can react once. */
  pulses: 0,
};

export const now = (): number => performance.now() / 1000;

/** 0..1: how strongly the pointer should light and push the scene right now. */
export function presence(): number {
  if (!pointer.seen) return 0;
  if (!pointer.touch) return 1;
  return Math.min(1, Math.max(0, 1 - (now() - pointer.lastMove - 0.8) / 1.2));
}

export function attachPointer(): () => void {
  const toNdc = (e: MouseEvent): [number, number] => [
    (e.clientX / window.innerWidth) * 2 - 1,
    1 - (e.clientY / window.innerHeight) * 2,
  ];
  const onMove = (e: PointerEvent) => {
    const [x, y] = toNdc(e);
    if (pointer.seen) pointer.travel += Math.hypot(x - pointer.x, y - pointer.y);
    pointer.x = x;
    pointer.y = y;
    pointer.seen = true;
    pointer.touch = e.pointerType !== 'mouse';
    pointer.lastMove = now();
  };
  const onLeave = () => {
    pointer.seen = false;
  };
  const onClick = (e: MouseEvent) => {
    [pointer.pulseX, pointer.pulseY] = toNdc(e);
    pointer.pulseAt = now();
    pointer.pulses += 1;
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onMove, { passive: true });
  window.addEventListener('click', onClick, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);
  return () => {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerdown', onMove);
    window.removeEventListener('click', onClick);
    document.documentElement.removeEventListener('pointerleave', onLeave);
  };
}
