/** Uniforms and helpers shared by every point shader that reacts to the pointer. */
export const interactionGlsl = /* glsl */ `
  uniform vec2 uPointer;
  uniform float uPresence;
  uniform float uAspect;
  uniform vec3 uPulse;

  /** Light falling on a point from the cursor, 0..1. */
  float cursorLight(vec2 ndc, float radius) {
    vec2 d = (ndc - uPointer) * vec2(uAspect, 1.0);
    return exp(-dot(d, d) / radius) * uPresence;
  }

  /** The expanding shockwave ring left by a click. xy = outward direction, z = strength. */
  vec3 shockwave(vec2 ndc) {
    vec2 d = (ndc - uPulse.xy) * vec2(uAspect, 1.0);
    float r = length(d);
    float age = uPulse.z;
    float band = (r - age * 1.5) / 0.13;
    float ring = exp(-band * band) * max(0.0, 1.0 - age / 1.5);
    return vec3(d / max(r, 0.0001), ring);
  }
`;

export const glowFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float core = smoothstep(0.5, 0.0, d);
    float glow = pow(1.0 - d, 2.4);
    vec3 col = mix(vColor, vec3(1.0), core * 0.5);
    gl_FragColor = vec4(col, (core + glow * 0.5) * vAlpha);
  }
`;
