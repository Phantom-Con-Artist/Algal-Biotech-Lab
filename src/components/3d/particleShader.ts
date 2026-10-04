export const vertexShader = /* glsl */ `
  attribute vec3 aP1; attribute vec3 aP2; attribute vec3 aP3; attribute vec3 aP4;
  attribute vec3 aP5; attribute vec3 aP6; attribute vec3 aP7;
  attribute vec4 aRand;
  attribute float aAccent;

  uniform float uStage;
  uniform float uTime;
  uniform float uSize;
  uniform float uDim;
  uniform float uMotion;

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

    float mid = sin(3.14159265 * t);
    p += vec3(sin(aRand.w * 37.0 + uTime * 0.8), cos(aRand.w * 23.0 + uTime * 0.6), sin(aRand.w * 51.0 + uTime * 0.7)) * mid * 1.1;
    p += 0.05 * uMotion * vec3(sin(uTime * 0.6 + aRand.w * 40.0), cos(uTime * 0.5 + aRand.w * 31.0), sin(uTime * 0.4 + aRand.w * 23.0));

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float dist = -mv.z;
    float size = 0.45 + pow(aRand.y, 3.0) * 2.2;
    gl_PointSize = clamp(size * (1.0 + 0.4 * acc) * uSize / dist, 1.6, 14.0);

    vec3 green = mix(vec3(0.10, 0.55, 0.38), vec3(0.50, 0.93, 0.58), aRand.z);
    green = mix(green, vec3(0.80, 1.0, 0.90), step(0.93, aRand.z));
    vColor = mix(green, vec3(1.0, 0.42, 0.22), acc);

    float twinkle = 0.8 + 0.2 * sin(uTime * 1.3 + aRand.w * 60.0);
    float depth = clamp(1.4 - dist / 16.0, 0.35, 1.0);
    vAlpha = uDim * twinkle * depth * (0.75 + 0.25 * aRand.y);
  }
`;

export const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = pow(smoothstep(0.5, 0.05, d), 1.6);
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;
