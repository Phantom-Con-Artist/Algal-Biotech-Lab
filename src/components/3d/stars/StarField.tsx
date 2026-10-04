import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { load } from '../quality';
import { pointer } from '../pointer';
import { sceneFocus } from '../sceneState';
import { interactionUniforms, updateInteraction } from '../sceneUniforms';
import { STAR_BOX, buildStars } from './starGeometry';
import { starFragment, starVertex } from './starShader';

/** World units the sky slides per pixel of page scroll. */
const SCROLL_RATE = 0.006;

/** The sea of stars behind everything. It slides with the scroll and leans away from the pointer. */
export function StarField({ count, reduced }: { count: number; reduced: boolean }) {
  const ref = useRef<THREE.Points>(null!);
  const scroll = useRef(typeof window === 'undefined' ? 0 : window.scrollY);

  const { geometry, material } = useMemo(() => {
    const data = buildStars(count);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(data.positions, 3));
    geo.setAttribute('aRand', new THREE.BufferAttribute(data.random, 4));
    const mat = new THREE.ShaderMaterial({
      vertexShader: starVertex,
      fragmentShader: starFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uPixelRatio: { value: 1 },
        uScale: { value: 1 },
        uBox: { value: new THREE.Vector2(STAR_BOX.width, STAR_BOX.height) },
        uFocus: { value: new THREE.Vector3(0, 0, 1) },
        ...interactionUniforms(),
      },
    });
    return { geometry: geo, material: mat };
  }, [count]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state, elapsed) => {
    // Returning from a background tab gives one huge time step; cap it so nothing lurches.
    const delta = Math.min(elapsed, 0.05);
    geometry.setDrawRange(0, Math.ceil(count * load.fraction));
    const u = material.uniforms;
    const k = reduced ? 1 : 1 - Math.exp(-delta * 5);
    scroll.current += (window.scrollY - scroll.current) * k;
    u.uScroll.value = reduced ? 0 : scroll.current * SCROLL_RATE;
    u.uPixelRatio.value = state.gl.getPixelRatio();
    u.uScale.value = Math.min(1, 0.6 + state.size.width / 3000);
    (u.uFocus.value as THREE.Vector3).set(sceneFocus.x, sceneFocus.y, sceneFocus.strength);
    updateInteraction(u, state.size.width / state.size.height, k);
    if (reduced) return;
    u.uTime.value += delta;
    const obj = ref.current;
    obj.position.x += (-pointer.x * 1.6 - obj.position.x) * k * 0.4;
    obj.position.y += (-pointer.y * 1.0 - obj.position.y) * k * 0.4;
  });

  return <points ref={ref} geometry={geometry} material={material} frustumCulled={false} renderOrder={-1} />;
}
