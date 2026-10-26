import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, ShaderMaterial } from 'three';

/**
 * Fine particles suspended in the culture medium around the cell. They drift on slow, individual
 * paths and fade with distance, which gives the fog depth and the cell a sense of scale.
 */
/** Scale-dependent tuning, in the world's own units; the defaults suit the cell, which is in micrometres. */
interface MoteScale {
  /** How far each mote wanders from its home. */
  drift: number;
  /** Fade in between these view depths (too close reads as a smear). */
  near: [number, number];
  /** Fade out between these view depths. */
  far: [number, number];
}

export function createMotes(count: number, radius: number, scale: MoteScale = { drift: 1, near: [1.5, 6], far: [140, 20] }) {
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    // Uniform in a sphere, slightly flattened so the field reads as a layer of medium.
    const u = Math.random() * 2 - 1;
    const a = Math.random() * Math.PI * 2;
    const r = radius * Math.cbrt(Math.random());
    const s = Math.sqrt(1 - u * u);
    positions.set([Math.cos(a) * s * r, u * r * 0.8, Math.sin(a) * s * r], i * 3);
    seeds[i] = Math.random();
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('seed', new BufferAttribute(seeds, 1));

  const material = new ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPixel: { value: 1 }, uDrift: { value: scale.drift }, uNear: { value: scale.near }, uFar: { value: scale.far } },
    vertexShader: `
      attribute float seed;
      uniform float uTime, uPixel, uDrift;
      uniform vec2 uNear, uFar;
      varying float vFade;
      void main() {
        vec3 p = position;
        float t = uTime * (0.05 + seed * 0.07);
        p += vec3(sin(t + seed * 31.0), sin(t * 0.8 + seed * 17.0) * 1.4, cos(t * 0.9 + seed * 7.0)) * (1.2 + seed * 2.0) * uDrift;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float depth = -mv.z;
        gl_PointSize = max(1.0, uPixel * (1.2 + seed * seed * 7.0) * uDrift / depth);
        vFade = smoothstep(uFar.x, uFar.y, depth) * smoothstep(uNear.x, uNear.y, depth) * (0.35 + seed * 0.65);
      }`,
    fragmentShader: `
      varying float vFade;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.1, d) * vFade * 0.7;
        gl_FragColor = vec4(vec3(1.0), a);
      }`,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });

  const points = new Points(geometry, material);
  points.frustumCulled = false;
  points.renderOrder = 10;

  return {
    points,
    update(time: number, pixelRatio: number) {
      material.uniforms.uTime.value = time;
      material.uniforms.uPixel.value = pixelRatio * 60;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
