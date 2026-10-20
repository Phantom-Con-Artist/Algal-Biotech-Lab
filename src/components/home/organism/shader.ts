import { BALL_COUNT } from './body';

export const VERTEX = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

/**
 * One liquid: the body's metaball field and the tree texture are summed into a single field and thresholded at 1,
 * so branches leave the body with smooth gooey necks. Normals come from the field itself, so the body reads as a
 * drop and every branch as a glossy tube of the same gel. Colour follows the lab's pigments outward from the core:
 * chlorophyll, phycocyanin teal, then carotenoid gold at the tips.
 */
export const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 u_center;
uniform float u_unit;
uniform float u_time;
uniform float u_grow;
uniform vec3 u_balls[${BALL_COUNT}];
uniform sampler2D u_tree;
uniform vec3 u_light;
uniform float u_lightAngle;

const float GAIN = 2.4;

float body(vec2 p) {
  float f = 0.0;
  for (int i = 0; i < ${BALL_COUNT}; i++) {
    vec2 d = p - u_balls[i].xy;
    // Capped so the field plateaus inside each ball instead of spiking at its centre.
    float k = min(u_balls[i].z * u_balls[i].z / (dot(d, d) + 1.0), 3.0);
    f += k * k;
  }
  return f;
}

// How far the branches reach in direction a: a slow wave of eversion travels round the organism,
// and it reaches further toward the light, as algae swim toward light.
float reach(float a) {
  float w = 0.5 + 0.5 * sin(u_time * 0.42 + a + 1.7 * sin(a * 3.0 + u_time * 0.13));
  float r = mix(170.0, 540.0, w * w * (3.0 - 2.0 * w));
  float da = atan(sin(a - u_lightAngle), cos(a - u_lightAngle));
  r += u_light.z * 160.0 * exp(-da * da * 3.0);
  return mix(55.0, r, u_grow);
}

// The tree field (red channel), rotated by the sway, cut off past the growth front (a short ramp, so tips end round
// like a growing hypha) and faded in at the body's rim so the trunks emerge from it rather than show through it.
float tree(vec2 q, mat2 sway, float r) {
  vec2 s = (sway * q + 500.0) / 1000.0;
  float d = length(q);
  return GAIN * texture2D(u_tree, s).r * (1.0 - smoothstep(r - 40.0, r + 6.0, d)) * smoothstep(38.0, 72.0, d);
}

// Compressed so the inside of the body is one smooth dome rather than a bump per ball.
float height(float v) {
  return clamp(1.0 - 1.0 / max(v, 1.0), 0.0, 1.0);
}

vec3 pigment(float d) {
  vec3 c = mix(vec3(0.09, 0.35, 0.23), vec3(0.21, 0.55, 0.33), smoothstep(10.0, 120.0, d));
  c = mix(c, vec3(0.22, 0.58, 0.55), smoothstep(110.0, 230.0, d));
  c = mix(c, vec3(0.55, 0.75, 0.66), smoothstep(230.0, 390.0, d));
  return mix(c, vec3(0.89, 0.71, 0.27), smoothstep(370.0, 520.0, d));
}

void main() {
  vec2 p = vec2(gl_FragCoord.x - u_center.x, u_center.y - gl_FragCoord.y) * u_unit + 500.0;
  vec2 q = p - 500.0;
  float d = length(q);
  // Cheap exits first: outside the organism, or away from the body with no branch nearby (the green halo).
  if (d > 570.0) { gl_FragColor = vec4(0.0); return; }
  bool nearBody = d < 210.0;
  if (!nearBody && texture2D(u_tree, p / 1000.0).g < 0.004) { gl_FragColor = vec4(0.0); return; }

  float a = atan(q.y, q.x);
  float wave = 0.045 * sin(u_time * 0.8 - d * 0.016 + a * 2.0) * smoothstep(70.0, 420.0, d);
  mat2 sway = mat2(cos(wave), sin(wave), -sin(wave), cos(wave));
  float r = reach(a);
  float e = u_unit;

  float f = (nearBody ? body(p) : 0.0) + tree(q, sway, r);
  if (f < 0.6) { gl_FragColor = vec4(0.0); return; }
  float fx = (nearBody ? body(p + vec2(e, 0.0)) : 0.0) + tree(q + vec2(e, 0.0), sway, r);
  float fy = (nearBody ? body(p + vec2(0.0, e)) : 0.0) + tree(q + vec2(0.0, e), sway, r);

  vec2 g = vec2(fx - f, fy - f) / e;
  float edge = (f - 1.0) / max(length(g), 1e-4);
  float alpha = smoothstep(-0.8 * e, 0.8 * e, edge);
  if (alpha <= 0.001) { gl_FragColor = vec4(0.0); return; }

  // Normals tilt at the rim and settle flat inside, so the body reads as one drop, not a cluster of balls.
  float h = height(f);
  float tilt = 10.0 * (1.0 - 0.85 * smoothstep(2.0, 12.0, f));
  vec3 n = normalize(vec3(-(height(fx) - h) / e * tilt, -(height(fy) - h) / e * tilt, 1.0));
  vec2 toward = u_light.xy - p;
  vec2 ld = mix(vec2(-0.55, -0.72), toward / max(length(toward), 1.0) * 0.9, u_light.z);
  vec3 L = normalize(vec3(ld, 0.6));
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float diff = max(dot(n, L), 0.0);
  float spec = pow(max(dot(n, H), 0.0), 56.0);
  float rim = smoothstep(0.2, 0.9, 1.0 - n.z);

  vec3 base = pigment(d);
  vec3 col = base * (0.66 + 0.42 * diff);
  col = mix(col, base * 0.58, rim * 0.55);
  col += vec3(0.94, 1.0, 0.9) * spec * 0.7;
  col += vec3(0.16, 0.3, 0.18) * (1.0 - smoothstep(0.0, 95.0, d)) * 0.35;
  gl_FragColor = vec4(col * alpha, alpha);
}
`;
