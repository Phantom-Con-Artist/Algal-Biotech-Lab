import { glowFragment, interactionGlsl } from './interactionGlsl';

export const vertexShader = /* glsl */ `
  attribute vec3 aP1; attribute vec3 aP2; attribute vec3 aP3; attribute vec3 aP4;
  attribute vec3 aP5; attribute vec3 aP6; attribute vec3 aP7;
  attribute vec4 aRand;
  attribute float aAccent;

  uniform float uStage;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uDim;
  uniform float uMotion;
  ${interactionGlsl}

  varying vec3 vColor;
  varying float vAlpha;

  float bit(float mask, float i) { return mod(floor(mask / exp2(i)), 2.0); }
  float w(float s, float i) { return max(0.0, 1.0 - abs(s - i)); }

  void main() {
    float base = floor(uStage);
    float f = uStage - base;
    float delay = aRand.x * 0.35;
    float t = smoothstep(0.0, 1.0, clamp((f - delay) / 0.65, 0.0, 1.0));
    float s = base + t;

    float w0 = w(s, 0.0); float w1 = w(s, 1.0); float w2 = w(s, 2.0); float w3 = w(s, 3.0);
    float w4 = w(s, 4.0); float w5 = w(s, 5.0); float w6 = w(s, 6.0); float w7 = w(s, 7.0);

    vec3 p = position * w0 + aP1 * w1 + aP2 * w2 + aP3 * w3 + aP4 * w4 + aP5 * w5 + aP6 * w6 + aP7 * w7;
    float acc = bit(aAccent, 0.0) * w0 + bit(aAccent, 1.0) * w1 + bit(aAccent, 2.0) * w2 + bit(aAccent, 3.0) * w3
              + bit(aAccent, 4.0) * w4 + bit(aAccent, 5.0) * w5 + bit(aAccent, 6.0) * w6 + bit(aAccent, 7.0) * w7;

    // In transit each point swings out on its own arc, so a morph reads as a burst, not a slide.
    float mid = sin(3.14159265 * t);
    p += vec3(sin(aRand.w * 37.0 + uTime * 0.8), cos(aRand.w * 23.0 + uTime * 0.6), sin(aRand.w * 51.0 + uTime * 0.7)) * mid * 1.6;
    p += 0.035 * uMotion * vec3(sin(uTime * 0.6 + aRand.w * 40.0), cos(uTime * 0.5 + aRand.w * 31.0), sin(uTime * 0.4 + aRand.w * 23.0));

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 centre = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    gl_Position = projectionMatrix * mv;

    // Cursor: points are lit, pushed aside and swirled; a click sends a shockwave through them.
    vec2 ndc = gl_Position.xy / gl_Position.w;
    vec2 d = (ndc - uPointer) * vec2(uAspect, 1.0);
    float r = length(d);
    vec2 dir = d / max(r, 0.0001);
    float push = exp(-r * r / 0.03) * uPresence;
    vec3 wave = shockwave(ndc);
    vec2 offset = (dir * 0.09 + vec2(-dir.y, dir.x) * 0.05) * push + wave.xy * wave.z * 0.1;
    gl_Position.xy += offset / vec2(uAspect, 1.0) * gl_Position.w * uMotion;
    float lit = cursorLight(ndc, 0.14) + wave.z * 0.6;

    // A key light from the upper left, using the direction from the shape's centre as a stand-in normal.
    float dist = -mv.z;
    vec3 normal = normalize(mv.xyz - centre.xyz + vec3(0.0, 0.0, 0.001));
    float key = 0.72 + 0.5 * dot(normal, normalize(vec3(-0.55, 0.6, 0.6)));
    float depth = mix(0.3, 1.15, smoothstep(-centre.z + 4.0, -centre.z - 4.0, dist));

    float size = 0.5 + pow(aRand.y, 3.0) * 2.4;
    gl_PointSize = clamp(size * (1.0 + 0.5 * acc + 0.8 * lit) * uSize / dist, 1.3 * uPixelRatio, 11.0 * uPixelRatio);

    vec3 green = mix(vec3(0.08, 0.62, 0.40), vec3(0.45, 0.98, 0.60), aRand.z);
    green = mix(green, vec3(0.82, 1.0, 0.90), step(0.93, aRand.z));
    vColor = mix(green, vec3(1.0, 0.42, 0.20), acc);
    vColor = mix(vColor, vec3(0.92, 1.0, 0.95), min(1.0, lit) * 0.6);

    float twinkle = 0.82 + 0.18 * sin(uTime * 1.3 + aRand.w * 60.0);
    vAlpha = uDim * twinkle * depth * key * (0.7 + 0.3 * aRand.y) * (1.0 + 0.9 * lit);
  }
`;

export const fragmentShader = glowFragment;
