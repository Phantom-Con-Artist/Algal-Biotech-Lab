import * as THREE from 'three';
import { now, pointer, presence } from './pointer';

/** Uniforms declared by `interactionGlsl`. */
export function interactionUniforms(): Record<string, THREE.IUniform> {
  return {
    uPointer: { value: new THREE.Vector2() },
    uPresence: { value: 0 },
    uAspect: { value: 1 },
    uPulse: { value: new THREE.Vector3(0, 0, 10) },
  };
}

/** Eases the pointer uniforms toward the live pointer; call once per frame per material. */
export function updateInteraction(u: Record<string, THREE.IUniform>, aspect: number, k: number): void {
  const p = u.uPointer.value as THREE.Vector2;
  p.x += (pointer.x - p.x) * Math.min(1, k * 3);
  p.y += (pointer.y - p.y) * Math.min(1, k * 3);
  u.uPresence.value += (presence() - u.uPresence.value) * k;
  u.uAspect.value = aspect;
  (u.uPulse.value as THREE.Vector3).set(pointer.pulseX, pointer.pulseY, now() - pointer.pulseAt);
}
