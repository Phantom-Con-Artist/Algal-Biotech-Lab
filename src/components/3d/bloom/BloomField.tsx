import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { buildBloom } from './bloomGeometry';
import { BLOOM_PALETTE, bloomFragment, bloomVertex } from './bloomShader';
import { sceneState, subscribeScene } from '../sceneState';

function makeMaterial(halo: number): THREE.ShaderMaterial {
  const uniforms: Record<string, THREE.IUniform> = {
    uGrowth: { value: 0 },
    uTime: { value: 0 },
    uSize: { value: 30 },
    uVis: { value: 0 },
    uHue: { value: 0 },
    uHalo: { value: halo },
  };
  BLOOM_PALETTE.forEach(([a, b], i) => {
    uniforms[`uA${i}`] = { value: new THREE.Color(a) };
    uniforms[`uB${i}`] = { value: new THREE.Color(b) };
  });
  return new THREE.ShaderMaterial({
    vertexShader: bloomVertex,
    fragmentShader: bloomFragment,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

/** Algae colonies that grow, change colour and bloom as the focus section is scrolled. */
export function BloomField({ count, reduced }: { count: number; reduced: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const invalidate = useThree((s) => s.invalidate);
  const cur = useRef({ vis: 0, growth: 0, hue: 0, yaw: 0, side: 0 });

  const { geometry, core, halo } = useMemo(() => {
    const data = buildBloom(count);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(data.positions, 3));
    geo.setAttribute('aBirth', new THREE.BufferAttribute(data.birth, 1));
    geo.setAttribute('aRand', new THREE.BufferAttribute(data.random, 4));
    return { geometry: geo, core: makeMaterial(0), halo: makeMaterial(1) };
  }, [count]);

  useEffect(
    () => () => {
      geometry.dispose();
      core.dispose();
      halo.dispose();
    },
    [geometry, core, halo],
  );

  useEffect(() => subscribeScene(invalidate), [invalidate]);

  useFrame((state, delta) => {
    const c = cur.current;
    const kv = reduced ? 1 : 1 - Math.exp(-delta * 4);
    const kg = reduced ? 1 : 1 - Math.exp(-delta * 7);
    const kh = reduced ? 1 : 1 - Math.exp(-delta * 3);
    c.vis += (sceneState.bloom - c.vis) * kv;
    c.growth += (sceneState.growth - c.growth) * kg;
    c.hue += (sceneState.hue - c.hue) * kh;

    group.current.visible = c.vis > 0.004;
    if (!group.current.visible) return;

    const size = 46 * state.gl.getPixelRatio() * (state.size.height / 1000);
    for (const m of [core, halo]) {
      const u = m.uniforms;
      u.uGrowth.value = c.growth;
      u.uVis.value = c.vis;
      u.uHue.value = c.hue;
      u.uSize.value = size;
      if (!reduced) u.uTime.value += delta;
    }

    const narrow = state.size.width < 768;
    c.side += ((narrow ? 0 : 1) - c.side) * kv;
    if (!reduced) c.yaw += delta * 0.05;
    group.current.position.set(narrow ? 0 : c.side * 2.0, narrow ? 2.1 : 0, 0);
    group.current.scale.setScalar(narrow ? 0.7 : 1.3);
    group.current.rotation.y = c.yaw;
  });

  return (
    <group ref={group} visible={false}>
      <points geometry={geometry} material={halo} frustumCulled={false} />
      <points geometry={geometry} material={core} frustumCulled={false} />
    </group>
  );
}
