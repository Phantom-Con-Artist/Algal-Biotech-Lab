import {
  HalfFloatType,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderTarget,
  type WebGLRenderer,
} from 'three';

/**
 * The lens and the cut. One full-screen pass grades the frame (contrast, colour, vignette, grain, edge
 * fringes) and, during a scale jump, dissolves one world into the next: a frost front grows out from
 * the centre through drifting noise, with a glowing ice edge, a radial zoom blur and a flash at its peak.
 */
export function createPost(renderer: WebGLRenderer) {
  const make = () => new WebGLRenderTarget(1, 1, { type: HalfFloatType, samples: 2 });
  const targetA = make();
  const targetB = make();
  const material = new ShaderMaterial({
    uniforms: {
      tA: { value: targetA.texture },
      tB: { value: targetB.texture },
      uRes: { value: new Vector2(1, 1) },
      uTime: { value: 0 },
      uMix: { value: 0 },
      uBlur: { value: 0 },
      uFlash: { value: 0 },
    },
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: `
      uniform sampler2D tA, tB;
      uniform vec2 uRes;
      uniform float uTime, uMix, uBlur, uFlash;
      varying vec2 vUv;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      float vnoise(vec2 p) {
        vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
      }
      float fbm(vec2 p) { return vnoise(p) * 0.55 + vnoise(p * 2.3 + 7.1) * 0.3 + vnoise(p * 5.1 + 3.7) * 0.15; }
      // Radial zoom blur with chromatic fringes that widen toward the frame edge.
      vec3 lens(sampler2D t, vec2 uv, float blur) {
        vec2 c = uv - 0.5;
        float r = length(c * vec2(uRes.x / uRes.y, 1.0));
        vec2 fringe = c * pow(r, 2.0) * (0.012 + blur * 0.05);
        if (blur < 0.01) return vec3(texture2D(t, uv + fringe).r, texture2D(t, uv).g, texture2D(t, uv - fringe).b);
        vec3 acc = vec3(0.0);
        for (int i = 0; i < 10; i++) {
          float s = 1.0 - float(i) / 10.0 * blur * 0.22;
          vec2 q = 0.5 + c * s;
          acc += vec3(texture2D(t, q + fringe).r, texture2D(t, q).g, texture2D(t, q - fringe).b);
        }
        return acc / 10.0;
      }
      void main() {
        vec2 c = vUv - 0.5;
        vec2 aspect = vec2(uRes.x / uRes.y, 1.0);
        float r = length(c * aspect);
        vec3 col = lens(tA, vUv, uBlur);
        if (uMix > 0.0) {
          vec3 next = lens(tB, vUv, uBlur);
          // The frost front: noise drifting with time, biased to open from the centre outward.
          float n = fbm(c * aspect * 3.2 + vec2(uTime * 0.05, -uTime * 0.03));
          float field = n * 0.7 + r * 0.9;
          float front = uMix * 1.75 - 0.15;
          float keep = smoothstep(front - 0.06, front, field);
          float edge = 1.0 - smoothstep(0.0, 0.06, abs(field - front + 0.03));
          col = mix(next, col, keep) + vec3(0.85, 0.94, 1.0) * edge * 0.9 * step(0.001, uMix) * step(uMix, 0.999);
        }
        col += vec3(0.95, 0.97, 1.0) * uFlash * (1.0 - smoothstep(0.0, 0.9, r));
        // Grade: a little more contrast and colour, so the stains read through the mist.
        float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
        col = mix(vec3(luma), col, 1.22);
        col = max((col - 0.18) * 1.08 + 0.18, 0.0);
        col *= mix(1.0, 0.82, smoothstep(0.35, 1.05, r));
        col += (hash(vUv * uRes + fract(uTime) * 91.0) - 0.5) * 0.028;
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    depthTest: false,
    depthWrite: false,
  });
  const quad = new Mesh(new PlaneGeometry(2, 2), material);
  const scene = new Scene();
  scene.add(quad);
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const u = material.uniforms;

  return {
    targetA,
    targetB,
    setSize(w: number, h: number, dpr: number) {
      targetA.setSize(Math.round(w * dpr), Math.round(h * dpr));
      targetB.setSize(Math.round(w * dpr), Math.round(h * dpr));
      u.uRes.value.set(w * dpr, h * dpr);
    },
    /** `mix` 0 shows A alone; between 0 and 1 the frost front carries the frame from A to B. */
    render(time: number, mix = 0, blur = 0, flash = 0) {
      u.uTime.value = time;
      u.uMix.value = mix;
      u.uBlur.value = blur;
      u.uFlash.value = flash;
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
    },
    dispose() {
      targetA.dispose();
      targetB.dispose();
      material.dispose();
      quad.geometry.dispose();
    },
  };
}
