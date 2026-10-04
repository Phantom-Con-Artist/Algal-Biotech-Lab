import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { buildShapes, STAGE_COUNT } from './shapes';
import { fragmentShader, vertexShader } from './particleShader';
import { sceneState, subscribeScene } from './sceneState';

/** Horizontal offset (in units of SIDE_X) of the shape at each stage; text sits on the opposite side. */
const SIDE = [0.5, -1, 1, -1, 1, -1, 1, 1];
/** Per-stage size so tall shapes (cell, helix, reactor) stay inside the viewport. */
const SCALE = [1.15, 0.82, 0.85, 0.8, 0.95, 0.85, 0.78, 1.1];
const SIDE_X = 3.3;
const LAST = STAGE_COUNT - 1;

interface Props {
  count: number;
  reduced: boolean;
}

export function CellField({ count, reduced }: Props) {
  const ref = useRef<THREE.Points>(null!);
  const invalidate = useThree((s) => s.invalidate);
  const cur = useRef({ stage: sceneState.target, dim: sceneState.dim, yaw: 0, tiltX: 0, tiltY: 0, side: SIDE[0], bloom: 0 });
  const pointer = useRef({ x: 0, y: 0 });

  const { geometry, material } = useMemo(() => {
    const shapes = buildShapes(count);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(shapes.positions[0], 3));
    for (let i = 1; i < STAGE_COUNT; i++) {
      geo.setAttribute(`aP${i}`, new THREE.BufferAttribute(shapes.positions[i], 3));
    }
    geo.setAttribute('aRand', new THREE.BufferAttribute(shapes.random, 4));
    geo.setAttribute('aAccent', new THREE.BufferAttribute(shapes.accentMask, 1));
    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uStage: { value: 0 },
        uTime: { value: 0 },
        uSize: { value: 30 },
        uDim: { value: 1 },
        uMotion: { value: reduced ? 0 : 1 },
      },
    });
    return { geometry: geo, material: mat };
  }, [count, reduced]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useEffect(() => subscribeScene(invalidate), [invalidate]);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced]);

  useFrame((state, delta) => {
    const c = cur.current;
    const k = reduced ? 1 : 1 - Math.exp(-delta * 4.5);
    c.stage += (sceneState.target - c.stage) * k;
    c.dim += (sceneState.dim - c.dim) * k;

    const obj0 = ref.current;
    const u = material.uniforms;
    c.bloom += (sceneState.bloom - c.bloom) * k;
    u.uStage.value = Math.min(c.stage, LAST);
    u.uDim.value = c.dim * (1 - c.bloom);
    obj0.visible = c.bloom < 0.995;
    if (!reduced) u.uTime.value += delta;
    u.uSize.value = 40 * state.gl.getPixelRatio() * (state.size.height / 1000);

    const narrow = state.size.width < 768;
    const i0 = Math.min(Math.floor(c.stage), LAST);
    const i1 = Math.min(i0 + 1, LAST);
    const f = c.stage - i0;
    const e = f * f * (3 - 2 * f);
    const sideTarget = sceneState.side ?? SIDE[i0] + (SIDE[i1] - SIDE[i0]) * e;
    c.side += (sideTarget - c.side) * k;
    const scale = SCALE[i0] + (SCALE[i1] - SCALE[i0]) * e;

    const obj = ref.current;
    obj.position.set(narrow ? 0 : c.side * SIDE_X, narrow ? 2.2 : 0, 0);
    obj.scale.setScalar(narrow ? scale * 0.5 : scale * 1.25);

    if (!reduced) {
      c.yaw += delta * 0.12;
      c.tiltX += (pointer.current.y * 0.14 - c.tiltX) * k * 0.4;
      c.tiltY += (pointer.current.x * 0.25 - c.tiltY) * k * 0.4;
    }
    obj.rotation.set(c.tiltX, c.yaw + c.tiltY, 0);
  });

  return <points ref={ref} geometry={geometry} material={material} frustumCulled={false} />;
}
