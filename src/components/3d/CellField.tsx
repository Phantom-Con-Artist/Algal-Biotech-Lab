import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { buildShapes, STAGE_COUNT } from './shapes';
import { fragmentShader, vertexShader } from './particleShader';
import { sceneFocus, sceneState, subscribeScene } from './sceneState';
import { pointer } from './pointer';
import { useWordmark } from '../../hooks/useWordmark';
import { interactionUniforms, updateInteraction } from './sceneUniforms';

/** Horizontal offset (in units of SIDE_X) of the shape at each stage; text sits on the opposite side. */
const SIDE = [0.85, -1, 1, -1, 1, -1, 1, 1, 1];
/** Per-stage size so tall shapes (cell, helix, reactor) stay inside the viewport. */
const SCALE = [1.15, 0.82, 0.74, 0.8, 0.95, 0.85, 0.78, 1.1, 1];
const SIDE_X = 3.3;
/** Half the view height at the shape's depth: camera at z = 11 with a 45° field of view. */
const HALF_VIEW = 11 * Math.tan((45 * Math.PI) / 360);
const LAST = STAGE_COUNT - 1;
const TURN = Math.PI * 2;

interface Props {
  count: number;
  reduced: boolean;
}

export function CellField({ count, reduced }: Props) {
  const ref = useRef<THREE.Points>(null!);
  const invalidate = useThree((s) => s.invalidate);
  const cur = useRef({ stage: sceneState.target, dim: sceneState.dim, yaw: 0, tiltX: 0, tiltY: 0, side: SIDE[0], bloom: 0, spin: 0 });

  const raster = useWordmark();

  const { geometry, material } = useMemo(() => {
    const shapes = buildShapes(count, raster);
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
        uPixelRatio: { value: 1 },
        ...interactionUniforms(),
        uDim: { value: 1 },
        uMotion: { value: reduced ? 0 : 1 },
      },
    });
    return { geometry: geo, material: mat };
  }, [count, reduced, raster]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useEffect(() => subscribeScene(invalidate), [invalidate]);

  useFrame((state, delta) => {
    const c = cur.current;
    const k = reduced ? 1 : 1 - Math.exp(-delta * 4.5);
    const before = c.stage;
    c.stage += (sceneState.target - c.stage) * k;
    // Scrolling between chapters throws the shape into a spin that then settles.
    c.spin += (Math.min(4, Math.abs(c.stage - before) / Math.max(delta, 0.001)) - c.spin) * k;
    c.dim += (sceneState.dim - c.dim) * k;

    const obj0 = ref.current;
    const u = material.uniforms;
    c.bloom += (sceneState.bloom - c.bloom) * k;
    u.uStage.value = Math.min(c.stage, LAST);
    u.uDim.value = c.dim * (1 - c.bloom);
    obj0.visible = c.bloom < 0.995;
    if (!reduced) u.uTime.value += delta;
    u.uPixelRatio.value = state.gl.getPixelRatio();
    u.uSize.value = 46 * state.gl.getPixelRatio() * (state.size.height / 1000);
    updateInteraction(u, state.size.width / state.size.height, k);

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
    sceneFocus.x = obj.position.x / (HALF_VIEW * (state.size.width / state.size.height));
    sceneFocus.y = obj.position.y / HALF_VIEW;
    sceneFocus.strength = c.dim;

    if (!reduced) {
      // The wordmark has to be read, so the turn winds down to face the viewer as the last stage arrives.
      const facing = Math.max(0, c.stage - (LAST - 1));
      c.yaw += delta * (0.14 + c.spin * 1.4) * (1 - facing);
      c.yaw += (Math.round(c.yaw / TURN) * TURN - c.yaw) * k * facing;
      c.tiltX += (-pointer.y * 0.32 - c.tiltX) * k * 0.5;
      c.tiltY += (pointer.x * 0.55 - c.tiltY) * k * 0.5;
    }
    obj.rotation.set(c.tiltX, c.yaw + c.tiltY, 0);
  });

  return <points ref={ref} geometry={geometry} material={material} frustumCulled={false} />;
}
