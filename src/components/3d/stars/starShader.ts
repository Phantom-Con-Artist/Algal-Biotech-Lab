import { interactionGlsl } from '../interactionGlsl';

export const starVertex = /* glsl */ `
  attribute vec4 aRand;

  uniform float uTime;
  uniform float uScroll;
  uniform float uPixelRatio;
  uniform float uScale;
  uniform vec2 uBox;
  uniform vec3 uFocus;
  ${interactionGlsl}

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    p.x = mod(p.x + uTime * 0.12 + uBox.x * 0.5, uBox.x) - uBox.x * 0.5;
    p.y = mod(p.y + uScroll + uBox.y * 0.5, uBox.y) - uBox.y * 0.5;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vec2 ndc = gl_Position.xy / gl_Position.w;

    float mag = aRand.x;
    float lit = cursorLight(ndc, 0.06) + shockwave(ndc).z * 0.8;
    gl_PointSize = (1.1 + mag * 15.0) * (1.0 + 0.7 * lit) * uPixelRatio * uScale;

    vec3 cool = vec3(0.72, 0.84, 1.0);
    vec3 warm = vec3(1.0, 0.76, 0.54);
    vec3 mint = vec3(0.62, 1.0, 0.82);
    vec3 tone = aRand.y < 0.6 ? cool : aRand.y < 0.84 ? warm : aRand.y < 0.94 ? vec3(1.0) : mint;
    vColor = mix(vec3(0.82, 0.88, 0.9), tone, 0.35 + 0.65 * smoothstep(0.0, 0.25, mag));

    // Space falls dark behind the foreground shape, so the shape separates from the sky.
    vec2 f = (ndc - uFocus.xy) * vec2(uAspect, 1.0);
    float pocket = 1.0 - 0.8 * uFocus.z * exp(-dot(f, f) / 0.32);

    float twinkle = 0.78 + 0.22 * sin(uTime * (0.4 + 2.2 * aRand.w) + aRand.z * 60.0);
    vAlpha = (0.3 + 0.7 * smoothstep(0.0, 0.2, mag)) * twinkle * pocket * (1.0 + 1.6 * lit);
  }
`;

/** A hard core with a wide, faint halo: the bigger the star, the more of it is halo. */
export const starFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float core = smoothstep(0.34, 0.0, d);
    float halo = pow(1.0 - d, 3.0) * 0.38;
    vec3 col = mix(vColor, vec3(1.0), core * 0.75);
    gl_FragColor = vec4(col, (core + halo) * vAlpha);
  }
`;
