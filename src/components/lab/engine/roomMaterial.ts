import { Color, Matrix4, ShaderMaterial, type Texture, UniformsLib, UniformsUtils, Vector3 } from 'three';

/**
 * Surface families in the room. Under the paint each shows its own imperfections: speckled granite,
 * brushed and scratched steel, scuffed gloss floor, smudged paint, grimy wall feet, woven fabric.
 */
export const KIND = { paint: 0, granite: 1, steel: 2, floor: 3, wall: 4, plastic: 5, fabric: 6, liquid: 7 } as const;
export type Kind = (typeof KIND)[keyof typeof KIND];

/** Uniforms every room material shares, so one write moves the splatter across the whole room. */
export function createRoomUniforms() {
  return {
    uFocus: { value: new Vector3() },
    /** Reach of the splatter at full strength, in metres. */
    uRadius: { value: 0 },
    /** How far loose droplets fly, as a multiple of the radius. */
    uSplash: { value: 1.7 },
    /** The throw: 0 before impact, 1 once the paint has landed. */
    uSplat: { value: 1 },
    /** How far the drips have run down vertical faces since impact, 0 to 1. */
    uDrip: { value: 1 },
    uTime: { value: 0 },
    uAsh: { value: new Color('#e7e7e3') },
    uKeyDir: { value: new Vector3(-0.35, 0.8, 0.45).normalize() },
    uKeyColor: { value: new Color('#fff1dc') },
    uLightGain: { value: 2.0 },
    uReflection: { value: null as Texture | null },
    uReflectionMatrix: { value: new Matrix4() },
    uReflectionStrength: { value: 0 },
  };
}
export type RoomUniforms = ReturnType<typeof createRoomUniforms>;

const vertex = /* glsl */ `
  #include <common>
  #include <fog_pars_vertex>
  attribute vec2 uv1;
  uniform mat4 uReflectionMatrix;
  uniform mat4 uRest;
  uniform float uHasRest;
  varying vec2 vLmUv;
  varying vec3 vWorld;
  varying vec3 vPat;
  varying vec3 vNormal;
  varying vec3 vPatNormal;
  varying vec4 vReflect;
  void main() {
    vLmUv = uv1;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    // The paint is fixed to the object where it rests, so it never slides while the object floats.
    vPat = uHasRest > 0.5 ? (uRest * vec4(position, 1.0)).xyz : world.xyz;
    vPatNormal = uHasRest > 0.5 ? normalize(mat3(uRest) * normal) : vNormal;
    vReflect = uReflectionMatrix * world;
    vec4 mvPosition = viewMatrix * world;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

const fragment = /* glsl */ `
  #include <common>
  #include <fog_pars_fragment>
  uniform vec3 uColor;
  uniform float uKind;
  uniform float uRough;
  uniform float uSeam;
  uniform sampler2D uLightMap;
  uniform float uHasLightMap;
  uniform vec3 uFocus;
  uniform float uRadius;
  uniform float uSplash;
  uniform float uSplat;
  uniform float uDrip;
  uniform float uTime;
  uniform vec3 uAsh;
  uniform vec3 uKeyDir;
  uniform vec3 uKeyColor;
  uniform float uLightGain;
  uniform sampler2D uReflection;
  uniform float uReflectionStrength;
  varying vec2 vLmUv;
  varying vec3 vWorld;
  varying vec3 vPat;
  varying vec3 vNormal;
  varying vec3 vPatNormal;
  varying vec4 vReflect;

  float hash3(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float noise3(vec3 x) {
    vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash3(i), hash3(i + vec3(1,0,0)), f.x), mix(hash3(i + vec3(0,1,0)), hash3(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(hash3(i + vec3(0,0,1)), hash3(i + vec3(1,0,1)), f.x), mix(hash3(i + vec3(0,1,1)), hash3(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  float fbm(vec3 p) { return noise3(p) * 0.5 + noise3(p * 2.03 + 1.7) * 0.28 + noise3(p * 4.11 + 3.1) * 0.14 + noise3(p * 8.3 + 5.3) * 0.08; }

  /** Loose drops: at most one round drop per cell, kept clear of the cell walls so none is clipped. */
  float drops(vec3 p, float density, out float id) {
    vec3 i = floor(p);
    id = hash3(i + 8.3);
    if (hash3(i) > density) return 0.0;
    vec3 c = vec3(hash3(i + 1.3), hash3(i + 2.7), hash3(i + 4.1)) * 0.4 + 0.3;
    float rad = 0.07 + 0.17 * hash3(i + 5.9);
    float dd = length(fract(p) - c);
    // The filter width comes from p itself: fract() jumps at cell walls, and a derivative taken across
    // the jump would draw the cells as squares.
    float w = max(max(fwidth(p.x), fwidth(p.y)), fwidth(p.z));
    return 1.0 - smoothstep(rad - w, rad + w, dd);
  }

  /** A surface's own albedo with the wear of daily use. World units are metres, Y up. */
  vec3 surface(vec3 base, vec3 p, vec3 n) {
    float k = uKind;
    float blot = fbm(p * 1.7);
    vec3 c = base * (0.9 + 0.16 * blot);
    // Dust settles on what faces up; fine scratches catch everything.
    float dust = smoothstep(0.55, 0.85, fbm(p * 14.0)) * max(n.y, 0.0) * 0.04;
    float scratch = smoothstep(0.93, 0.99, noise3(vec3(p.x * 4.0, p.y * 200.0, p.z * 4.0))) * 0.18;
    if (k < 0.5) {                       // painted panels: smudges and fingerprints near handle height
      c *= 0.95 + 0.07 * noise3(p * vec3(40.0, 4.0, 40.0));
      c *= 1.0 - 0.1 * smoothstep(0.55, 0.85, fbm(p * 9.0)) * (1.0 - smoothstep(0.4, 1.4, abs(p.y - 1.0)));
    } else if (k < 1.5) {                // granite: dense mineral speckle with mica glints
      // Fine grain fades with distance before it can alias.
      float near = 1.0 - smoothstep(1.5, 5.0, distance(cameraPosition, vWorld));
      float s = mix(0.5, noise3(p * 120.0), near);
      c = base * (0.78 + 0.5 * smoothstep(0.5, 0.9, s)) + vec3(0.08) * step(0.95, noise3(p * 190.0 + 9.0)) * near;
    } else if (k < 2.5) {                // steel: brushed grain and scratches
      float b = noise3(vec3(p.x * 2.0, p.y * 300.0, p.z * 2.0)) * 0.6 + noise3(vec3(p.x * 300.0, p.y * 2.0, p.z * 2.0)) * 0.4;
      c *= 0.82 + 0.3 * b;
      c *= 1.0 - scratch * 1.5;
    } else if (k < 3.5) {                // floor: tiles, grout, scuffs
      vec2 t = fract(p.xz / 0.6);
      float grout = 1.0 - smoothstep(0.0, 0.012, min(min(t.x, 1.0 - t.x), min(t.y, 1.0 - t.y)));
      float tile = hash3(floor(vec3(p.x / 0.6, 0.0, p.z / 0.6)));
      float scuff = smoothstep(0.6, 0.78, noise3(vec3(p.x * 6.0, 0.0, p.z * 0.8))) * 0.12;
      c *= (0.95 + 0.08 * tile) * (1.0 - 0.22 * grout) * (1.0 - scuff);
    } else if (k < 4.5) {                // wall: grime gathers at the foot
      c *= 1.0 - 0.16 * (1.0 - smoothstep(0.0, 0.6, p.y)) * blot;
    } else if (k < 5.5) {                // plastics and coated bodies: mottling and handling marks
      c *= 0.96 + 0.07 * noise3(p * 30.0);
      c *= 1.0 - 0.08 * smoothstep(0.6, 0.85, fbm(p * 14.0));
    } else if (k < 6.5) {                // fabric: weave
      c *= 0.86 + 0.18 * noise3(p * 220.0);
    }
    return mix(c * (1.0 - scratch * 0.4), vec3(0.78, 0.77, 0.74), dust);
  }

  void main() {
    vec3 n = normalize(vNormal);
    vec3 pn = normalize(vPatNormal);
    vec3 lm = uHasLightMap > 0.5 ? texture2D(uLightMap, vLmUv).rgb * uLightGain : vec3(0.82 + 0.18 * n.y);
    vec3 p = vPat;

    // Clay everywhere else: each surface keeps its value, so dark things read as dark, and nothing more.
    float value = dot(uColor, vec3(0.2126, 0.7152, 0.0722));
    vec3 ash = uAsh * (0.32 + 0.68 * sqrt(value));
    float d = distance(p, uFocus);
    float reveal = 0.0;
    vec3 albedo = ash;
    // Most of the room is nowhere near the splash: it skips all the noise below and stays plain clay.
    float zone = uRadius > 0.0 ? uRadius * max(uSplash, 1.5) * 1.25 + 0.3 : -1.0;
    if (d < zone) {
      // The splash. Thrown at the focus, it covers the object and bursts outward: blobs stretched away from
      // the centre, loose drops further out, runs down walls and fronts. Wherever it lands the room's real
      // surface shows through the clay. The throw grows with uSplat; the runs lengthen with uDrip.
      float reachR = uRadius * (0.15 + 0.85 * uSplat);
      float r = d / max(reachR, 1e-3);
      vec3 away = (p - uFocus) / max(d, 1e-3);
      vec3 q = p * 3.0;
      q -= away * dot(q, away) * 0.62;
      float field = fbm(q + 7.0) + 0.16 * fbm(p * 12.0 + 3.0);
      float need = uRadius > 0.0 ? smoothstep(0.25, 1.45, r) * 1.15 : 3.0;
      // Drips: on vertical faces paint runs down in thin columns from wherever it landed above.
      vec3 side = normalize(cross(pn, vec3(0.0, 1.0, 0.0)) + 1e-4);
      float across = dot(p, side) * 38.0;
      float column = hash3(vec3(floor(across), 0.0, 0.0));
      float thin = 1.0 - smoothstep(0.18, 0.32, abs(fract(across) - 0.5));
      // Runs belong to the objects: never down walls, and never into the skirting.
      float notWall = 1.0 - step(3.5, uKind) * (1.0 - step(4.5, uKind));
      float vertical = (1.0 - smoothstep(0.2, 0.45, abs(pn.y))) * notWall * step(0.2, p.y);
      float run = uDrip * (0.03 + 0.16 * column) * step(0.8, column) * thin * vertical;
      vec3 above = p + vec3(0.0, run, 0.0);
      float da = distance(above, uFocus) / max(reachR, 1e-3);
      float fieldA = fbm((above * 3.0 - away * dot(above * 3.0, away) * 0.62) + 7.0) + 0.16 * fbm(above * 12.0 + 3.0);
      float wet = max(field + 0.14 - need, (fieldA + 0.14 - (uRadius > 0.0 ? smoothstep(0.25, 1.45, da) * 1.15 : 3.0)) * step(0.001, run));
      float aa = max(fwidth(wet) * 1.4, 1e-4);
      float body = smoothstep(-aa, aa, wet);

      // Drops fly out with the throw: they land only where the burst has already reached.
      float flight = uSplash * uSplat;
      float dropId;
      float drop = uRadius > 0.0 ? drops(p * 8.0, 0.4, dropId) * (1.0 - smoothstep(flight * 0.7, flight, r)) * step(0.5, r) : 0.0;
      float specId;
      float speck = uRadius > 0.0 ? drops(p * 26.0, 0.25, specId) * (1.0 - smoothstep(flight * 0.5, flight * 0.9, r)) * step(0.35, r) : 0.0;

      // Where the splash lands, the surface shows what it really is: its own colour, texture and wear.
      reveal = max(body, max(drop, speck));

      vec3 real = surface(uColor, p, pn);
      // A faint line where the splash meets the clay keeps its thrown shape legible.
      float edge = (1.0 - smoothstep(0.0, 0.06, wet)) * body;
      albedo = mix(ash, real * (1.0 - 0.1 * edge), reveal);

    }

    // Seams fade into their surface with distance, so the ceiling grid never shimmers.
    albedo = mix(albedo, ash * 1.12, uSeam * (1.0 - reveal) * smoothstep(2.5, 9.0, distance(cameraPosition, vWorld)));

    vec3 col = albedo * lm;
    // Revealed surfaces take their own light: a warm key, and the sheen their material really has.
    vec3 v = normalize(cameraPosition - vWorld);
    float lambert = max(dot(n, uKeyDir), 0.0);
    vec3 h = normalize(uKeyDir + v);
    float gloss = 1.0 - uRough;
    float spec = pow(max(dot(n, h), 0.0), mix(8.0, 140.0, gloss)) * gloss;
    float fres = pow(1.0 - max(dot(n, v), 0.0), 5.0);
    col += reveal * (albedo * uKeyColor * lambert * 0.3 + uKeyColor * spec * 0.6 + vec3(0.9, 0.95, 1.0) * fres * gloss * 0.25);

    // The gloss floor mirrors the room, softly.
    if (uKind > 2.5 && uKind < 3.5 && uReflectionStrength > 0.0) {
      vec2 ruv = vReflect.xy / vReflect.w;
      vec2 px = vec2(0.004, 0.0);
      vec3 rf = texture2D(uReflection, ruv).rgb * 0.4 + (texture2D(uReflection, ruv + px).rgb + texture2D(uReflection, ruv - px).rgb + texture2D(uReflection, ruv + px.yx).rgb + texture2D(uReflection, ruv - px.yx).rgb) * 0.15;
      float amount = uReflectionStrength * (0.18 + 0.5 * fres);
      col = mix(col, rf, amount);
    }

    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`;

interface Options {
  color: Color;
  kind: Kind;
  rough: number;
  lightMap: Texture | null;
  shared: RoomUniforms;
  /** Hairline seams fade out with distance. */
  seam?: boolean;
  /** For an object that moves: where it rests, so the paint stays fixed to it. */
  rest?: Matrix4;
}

/** One room material. The shared uniforms are passed by reference, so they update every material at once. */
export function makeRoomMaterial({ color, kind, rough, lightMap, shared, seam = false, rest }: Options) {
  return new ShaderMaterial({
    uniforms: {
      ...UniformsUtils.clone(UniformsLib.fog),
      ...shared,
      uColor: { value: color },
      uKind: { value: kind },
      uRough: { value: rough },
      uSeam: { value: seam ? 1 : 0 },
      uLightMap: { value: lightMap },
      uHasLightMap: { value: lightMap ? 1 : 0 },
      uRest: { value: rest ?? new Matrix4() },
      uHasRest: { value: rest ? 1 : 0 },
    },
    vertexShader: vertex,
    fragmentShader: fragment,
    fog: true,
  });
}

/** Which surface family a Blender material belongs to, by name. */
export function kindOf(name: string): Kind {
  if (name === 'Granite') return KIND.granite;
  if (/Steel|Duct/.test(name)) return KIND.steel;
  if (/Floor/.test(name)) return KIND.floor;
  if (/Wall|Ceiling|Seam/.test(name)) return KIND.wall;
  if (/Fabric/.test(name)) return KIND.fabric;
  if (/Culture|Media|Stain|Water/.test(name)) return KIND.liquid;
  if (/Tub|Bottle|Cap|Box|Tip|Stirrer|Laminar|Graphite|Black/.test(name)) return KIND.plastic;
  return KIND.paint;
}
