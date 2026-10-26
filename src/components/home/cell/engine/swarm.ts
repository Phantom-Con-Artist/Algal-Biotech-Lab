import {
  CylinderGeometry,
  Euler,
  Group,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  MeshStandardMaterial,
  Quaternion,
  SphereGeometry,
  Vector3,
  type WebGLProgramParametersWithUniforms,
} from 'three';
import { makeMaterial, type DetailMaps } from './materials';

const BOX = new Vector3(150, 90, 150);
const UP = new Vector3(0, 1, 0);

/**
 * A living culture: a few hundred cells swimming anterior-first on slow helical paths, flagella beating
 * in the vertex shader. Units are micrometres, the same as the dissected cell it grows out of.
 */
export function createSwarm(maps: DetailMaps, count: number, reducedMotion: boolean) {
  const group = new Group();
  const body = makeMaterial('M_SwarmCell', maps, false);
  body.uniforms.uStain.value = 1;
  const cells = new InstancedMesh(new SphereGeometry(1, 24, 16), body.material, count);

  const flagellumMaterial = new MeshStandardMaterial({ color: '#d9d1b4', roughness: 0.5 });
  const time = { value: 0 };
  flagellumMaterial.onBeforeCompile = (shader: WebGLProgramParametersWithUniforms) => {
    shader.uniforms.uTime = time;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;\nattribute float aPhase;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
float s = position.y;
// A bend that travels from base to tip, the breaststroke seen from far away.
transformed.x += sin(uTime * 7.0 + aPhase - s * 4.0) * 0.22 * s * s;
transformed.z += cos(uTime * 7.0 + aPhase - s * 3.0) * 0.05 * s;`,
      );
  };
  // A unit-length flagellum along +Y; instances scale it to twelve micrometres.
  const flagGeometry = new CylinderGeometry(0.009, 0.012, 1, 6, 24, true).translate(0, 0.5, 0);
  const flagella = new InstancedMesh(flagGeometry, flagellumMaterial, count * 2);
  const phases = new Float32Array(count * 2);

  const pos: Vector3[] = [];
  const dir: Vector3[] = [];
  const speed: number[] = [];
  for (let i = 0; i < count; i++) {
    let p: Vector3;
    // Keep the middle clear at first, where the dissected cell stood.
    do p = new Vector3((Math.random() * 2 - 1) * BOX.x, (Math.random() * 2 - 1) * BOX.y, (Math.random() * 2 - 1) * BOX.z);
    while (p.length() < 26);
    pos.push(p);
    dir.push(new Vector3(Math.random() - 0.5, (Math.random() - 0.5) * 0.6, Math.random() - 0.5).normalize());
    speed.push(6 + Math.random() * 8);
    phases[i * 2] = Math.random() * 6.28;
    phases[i * 2 + 1] = phases[i * 2] + Math.PI;
  }
  flagGeometry.setAttribute('aPhase', new InstancedBufferAttribute(phases, 1));

  const m = new Matrix4();
  const q = new Quaternion();
  const roll = new Quaternion();
  const tilt = new Quaternion();
  const e = new Euler();
  const scale = new Vector3(4.2, 5.2, 4.2);
  const flagScale = new Vector3(12, 12, 12);
  const tip = new Vector3();
  const tmpScale = new Vector3();
  const tmpFlag = new Vector3();
  const heading = new Vector3();

  /** `eye` is the camera; cells that drift right up to the lens shrink away rather than fill the frame. */
  function update(t: number, delta: number, eye?: Vector3) {
    time.value = t;
    for (let i = 0; i < count; i++) {
      const p = pos[i];
      // Swim with a slow helical wobble; wrap at the edges of the volume.
      heading.copy(dir[i]);
      heading.x += Math.sin(t * 0.9 + i) * 0.25;
      heading.z += Math.cos(t * 0.9 + i) * 0.25;
      heading.normalize();
      if (!reducedMotion) p.addScaledVector(heading, speed[i] * delta);
      for (const axis of ['x', 'y', 'z'] as const) {
        if (p[axis] > BOX[axis]) p[axis] -= BOX[axis] * 2;
        if (p[axis] < -BOX[axis]) p[axis] += BOX[axis] * 2;
      }
      q.setFromUnitVectors(UP, heading);
      roll.setFromAxisAngle(UP, t * 1.4 + i);
      q.multiply(roll);
      const near = eye ? Math.min(1, Math.max(0, (p.distanceTo(eye) - 30) / 45)) : 1;
      cells.setMatrixAt(i, m.compose(p, q, tmpScale.copy(scale).multiplyScalar(near)));
      for (let s = 0; s < 2; s++) {
        tip.set(0, 5.3, 0).applyQuaternion(q).add(p);
        tilt.setFromEuler(e.set(0, 0, s ? 0.75 : -0.75));
        flagella.setMatrixAt(i * 2 + s, m.compose(tip, q.clone().multiply(tilt), tmpFlag.copy(flagScale).multiplyScalar(near)));
      }
    }
    cells.instanceMatrix.needsUpdate = true;
    flagella.instanceMatrix.needsUpdate = true;
  }

  group.add(cells, flagella);
  update(0, 0);

  return {
    group,
    update,
    dispose() {
      cells.geometry.dispose();
      body.material.dispose();
      flagGeometry.dispose();
      flagellumMaterial.dispose();
    },
  };
}
