export const bloomVertex = /* glsl */ `
  attribute float aBirth;
  attribute vec3 aOrigin;
  attribute vec4 aRand;

  uniform float uGrowth;
  uniform float uTime;
  uniform float uSize;
  uniform float uVis;
  uniform float uHue;
  uniform float uHalo;
  uniform vec3 uA0; uniform vec3 uA1; uniform vec3 uA2; uniform vec3 uA3;
  uniform vec3 uB0; uniform vec3 uB1; uniform vec3 uB2; uniform vec3 uB3;

  varying vec3 vColor;
  varying float vAlpha;

  float w(float h, float i) { return max(0.0, 1.0 - abs(h - i)); }

  void main() {
    float age = max(uGrowth - aBirth, 0.0);
    float born = smoothstep(aBirth, aBirth + 0.06, uGrowth);
    float front = exp(-age * 14.0) * step(aBirth, uGrowth);

    // Each point leaves its seed cell and travels out to its place as it is born.
    float reach = smoothstep(aBirth, aBirth + 0.16, uGrowth);
    reach = 1.0 - (1.0 - reach) * (1.0 - reach);
    vec3 p = mix(aOrigin, position, 0.3 + 0.7 * reach);

    // A slow ring keeps spreading from the centre, so the bloom still grows when the page is at rest.
    float radius = length(position);
    float ring = pow(0.5 + 0.5 * sin(radius * 1.7 - uTime * 0.9), 4.0);
    p += normalize(position + vec3(0.0, 0.0, 0.0001)) * 0.07 * ring * reach;
    p *= 0.9 + 0.1 * uGrowth;
    p += 0.06 * vec3(sin(uTime * 0.7 + aRand.w * 40.0), cos(uTime * 0.6 + aRand.w * 31.0), sin(uTime * 0.5 + aRand.w * 23.0));
    p *= 1.0 + 0.02 * sin(uTime * 0.5 + aRand.w * 6.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = (0.5 + pow(aRand.y, 3.0) * 1.8) * (0.4 + 0.6 * born) * (1.0 + 1.8 * front) * (1.0 + 0.5 * ring);
    size *= mix(1.0, 5.5, uHalo);
    gl_PointSize = clamp(size * uSize / -mv.z, 1.0, mix(14.0, 70.0, uHalo));

    vec3 A = uA0 * w(uHue, 0.0) + uA1 * w(uHue, 1.0) + uA2 * w(uHue, 2.0) + uA3 * w(uHue, 3.0);
    vec3 B = uB0 * w(uHue, 0.0) + uB1 * w(uHue, 1.0) + uB2 * w(uHue, 2.0) + uB3 * w(uHue, 3.0);
    float tone = clamp(aRand.z * 0.35 + clamp(age * 2.5, 0.0, 1.0) * 0.75, 0.0, 1.0);
    vColor = mix(mix(A, B, tone), vec3(1.0, 0.97, 0.85), min(1.0, front * 0.55 + ring * 0.22));

    float flicker = 0.85 + 0.15 * sin(uTime * 1.1 + aRand.w * 50.0);
    float haloAlpha = 0.05 + 0.07 * uGrowth + 0.1 * front;
    vAlpha = born * uVis * flicker * (0.8 + 0.5 * ring) * mix(0.9, haloAlpha, uHalo);
  }
`;

export const bloomFragment = /* glsl */ `
  uniform float uHalo;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = pow(smoothstep(0.5, 0.05, d), mix(1.6, 2.2, uHalo));
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

/** [core, mature] colours per focus area: biofuel, carbon capture, nutraceutical, wastewater. */
export const BLOOM_PALETTE: [string, string][] = [
  ['#33b259', '#ffbd40'],
  ['#1fbfa6', '#8cf2f2'],
  ['#f24059', '#ff9e4d'],
  ['#3394ff', '#73f2cc'],
];
