import { smoothstep } from '../../utils/math';

interface Slot { x: number; y: number; r: number; ry: number }

const WIDE: Slot[] = [
  { x: 34, y: 25, r: -5, ry: -14 },
  { x: 68, y: 50, r: 3, ry: -10 },
  { x: 36, y: 76, r: -3, ry: -16 },
];
const NARROW: Slot[] = [
  { x: 32, y: 20, r: -4, ry: -9 },
  { x: 68, y: 50, r: 3, ry: -7 },
  { x: 34, y: 80, r: -2, ry: -9 },
];

/** Cards fly in from depth, hold with a slow drift, then fly past the viewer. */
export function applyCard(el: HTMLElement, k: number, count: number, local: number, wide: boolean): void {
  const slots = wide ? WIDE : NARROW;
  const slot = slots[count === 2 && k === 1 ? 2 : k];
  const dir = k % 2 === 0 ? 1 : -1;
  const ein = 1 - smoothstep(0.0 + 0.05 * k, 0.24 + 0.05 * k, local);
  const eout = smoothstep(0.86 + 0.03 * k, 1, local);
  const z = -1000 * ein + 520 * eout + (local - 0.5) * 70 * (k - 1);
  const ry = slot.ry + 55 * ein * dir - 30 * eout * dir;
  const opacity = (1 - ein) * (1 - eout);

  el.style.left = `${slot.x}%`;
  el.style.top = `${slot.y}%`;
  el.style.transform = `translate(-50%,-50%) translate3d(0,${-eout * 140}px,${z}px) rotateY(${ry}deg) rotateZ(${slot.r}deg)`;
  el.style.opacity = String(opacity);
  el.style.visibility = opacity < 0.01 ? 'hidden' : 'visible';
}

/** Copy fades and slides in once the cards have landed, and out before the next area. */
export function applyCopy(el: HTMLElement, current: boolean, local: number): void {
  const inn = smoothstep(0.04, 0.16, local);
  const out = smoothstep(0.88, 0.98, local);
  const opacity = current ? inn * (1 - out) : 0;
  el.style.opacity = String(opacity);
  el.style.transform = `translateY(${(1 - inn) * 24 - out * 24}px)`;
  el.style.visibility = opacity < 0.01 ? 'hidden' : 'visible';
  if (opacity < 0.5) el.setAttribute('inert', '');
  else el.removeAttribute('inert');
}
