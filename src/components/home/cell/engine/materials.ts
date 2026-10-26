import {
  Color,
  DoubleSide,
  FrontSide,
  MeshPhysicalMaterial,
  type Texture,
  type WebGLProgramParametersWithUniforms,
} from 'three';

export type DetailKind = 'granular' | 'fibrous' | 'membrane' | 'none';

interface Look {
  /** The stain colour, shown when the structure is in focus. */
  color: string;
  detail: DetailKind;
  /** Detail repeats per micrometre. */
  scale: number;
  /** Normal-map strength, 0 to about 1.5. */
  bump: number;
  roughness: number;
  /** How much the variation map darkens crevices and lifts roughness. */
  wear: number;
  /** Weight of the AO baked into the vertex colours. */
  ao: number;
  clearcoat?: number;
  metal?: number;
  emissive?: string;
  /** Real refractive glass: transmission through a thickness, with an optional tint. */
  glass?: { ior: number; thickness: number; tint?: string };
  /** Brushed metal: anisotropic highlights along the grain. */
  aniso?: number;
  /** Environment reflection strength; lab surfaces want more than the cell's soft tissue. */
  env?: number;
  /** Translucent shells: face-on opacity; edges thicken toward opaque, as membranes do under the microscope. */
  opacity?: number;
  rim?: number;
  order?: number;
}

/** Keyed by the Blender material name. */
const LOOKS: Record<string, Look> = {
  M_Wall: { color: '#bccaa8', detail: 'fibrous', scale: 1.1, bump: 1.1, roughness: 0.55, wear: 0.45, ao: 0.5, opacity: 0.3, rim: 0.85, order: 6 },
  M_Membrane: { color: '#dba66c', detail: 'membrane', scale: 0.9, bump: 0.9, roughness: 0.38, wear: 0.3, ao: 0.4, clearcoat: 0.5, opacity: 0.34, rim: 0.8, order: 5 },
  M_ChloroEnvelope: { color: '#86ad66', detail: 'membrane', scale: 1.2, bump: 0.7, roughness: 0.42, wear: 0.35, ao: 0.5, opacity: 0.55, rim: 0.6, order: 4 },
  M_Thylakoid: { color: '#2c6e36', detail: 'membrane', scale: 2.2, bump: 0.8, roughness: 0.46, wear: 0.5, ao: 0.55 },
  M_ThylakoidLumen: { color: '#4b8a3e', detail: 'membrane', scale: 2.2, bump: 0.8, roughness: 0.5, wear: 0.5, ao: 0.55 },
  M_PyrMatrix: { color: '#c9a84a', detail: 'granular', scale: 3.2, bump: 1.2, roughness: 0.78, wear: 0.7, ao: 0.8 },
  M_StarchSheath: { color: '#4a3f7a', detail: 'granular', scale: 1.6, bump: 0.45, roughness: 0.32, wear: 0.4, ao: 0.9, clearcoat: 0.7 },
  M_PyrTubule: { color: '#2f8a3c', detail: 'membrane', scale: 3, bump: 0.5, roughness: 0.45, wear: 0.3, ao: 0.6 },
  M_NucEnvelope: { color: '#c0405a', detail: 'membrane', scale: 1.6, bump: 0.8, roughness: 0.44, wear: 0.4, ao: 0.6 },
  M_NucPore: { color: '#f0a8b6', detail: 'granular', scale: 6, bump: 0.6, roughness: 0.5, wear: 0.4, ao: 0.6 },
  M_Nucleolus: { color: '#7a1836', detail: 'granular', scale: 3.5, bump: 1.3, roughness: 0.7, wear: 0.7, ao: 0.8 },
  M_Chromatin: { color: '#992a4a', detail: 'granular', scale: 4, bump: 1.2, roughness: 0.72, wear: 0.6, ao: 0.8 },
  M_Flagellum: { color: '#d9d1b4', detail: 'fibrous', scale: 3, bump: 0.5, roughness: 0.5, wear: 0.3, ao: 0.3 },
  M_BasalBody: { color: '#d3b673', detail: 'granular', scale: 8, bump: 0.6, roughness: 0.5, wear: 0.4, ao: 0.6 },
  M_Rootlet: { color: '#d3b673', detail: 'granular', scale: 8, bump: 0.4, roughness: 0.5, wear: 0.3, ao: 0.4 },
  M_ContractileVacuole: { color: '#a6cfe2', detail: 'membrane', scale: 2, bump: 0.6, roughness: 0.12, wear: 0.2, ao: 0.4, clearcoat: 1, opacity: 0.4, rim: 0.75, order: 1 },
  M_Eyespot: { color: '#e04a18', detail: 'granular', scale: 10, bump: 0.25, roughness: 0.28, wear: 0.3, ao: 0.9, clearcoat: 0.8 },
  M_Mitochondrion: { color: '#2e968d', detail: 'membrane', scale: 3, bump: 1, roughness: 0.55, wear: 0.5, ao: 0.6 },
  M_Golgi: { color: '#5c4733', detail: 'membrane', scale: 3, bump: 0.7, roughness: 0.5, wear: 0.4, ao: 0.6 },
  M_LipidDroplet: { color: '#eeac2a', detail: 'membrane', scale: 1.5, bump: 0.12, roughness: 0.1, wear: 0.1, ao: 0.6, clearcoat: 1 },
  M_Acidocalcisome: { color: '#e2bde0', detail: 'membrane', scale: 2, bump: 0.4, roughness: 0.15, wear: 0.2, ao: 0.4, clearcoat: 1, opacity: 0.42, rim: 0.7, order: 1 },
  M_Polyphosphate: { color: '#a03a8b', detail: 'granular', scale: 6, bump: 1, roughness: 0.6, wear: 0.6, ao: 0.7 },
  // The culture: whole cells seen from a distance.
  M_SwarmCell: { color: '#5a9d48', detail: 'membrane', scale: 0.6, bump: 0.6, roughness: 0.4, wear: 0.4, ao: 0, clearcoat: 0.4 },
  // The lab, in centimetres: real glass, polished steel, coated instrument bodies. Liquids are opaque
  // bodies seen through the glass: a refractive object only shows opaque things through itself.
  M_Glass: { color: '#f4f8fa', detail: 'none', scale: 1, bump: 0, roughness: 0.04, wear: 0, ao: 0, clearcoat: 1, glass: { ior: 1.5, thickness: 0.35 }, env: 1.6, order: 3 },
  M_VialGlass: { color: '#f4f8fa', detail: 'none', scale: 1, bump: 0, roughness: 0.04, wear: 0, ao: 0, clearcoat: 1, glass: { ior: 1.5, thickness: 0.25 }, env: 1.6, order: 3 },
  M_TubePlastic: { color: '#f2f5f7', detail: 'none', scale: 1, bump: 0, roughness: 0.18, wear: 0, ao: 0, glass: { ior: 1.45, thickness: 0.2 }, env: 1.2, order: 3 },
  M_Culture: { color: '#3a8a37', detail: 'granular', scale: 1.2, bump: 0.05, roughness: 0.1, wear: 0.15, ao: 0, clearcoat: 1, env: 1.3, order: 1 },
  M_Supernatant: { color: '#c6d99a', detail: 'none', scale: 1, bump: 0, roughness: 0.08, wear: 0, ao: 0, clearcoat: 1, env: 1.3, order: 1 },
  M_OilLiquid: { color: '#d38b14', detail: 'none', scale: 1, bump: 0, roughness: 0.05, wear: 0, ao: 0, clearcoat: 1, env: 1.5, order: 1 },
  M_PigmentLiquid: { color: '#d4471a', detail: 'none', scale: 1, bump: 0, roughness: 0.05, wear: 0, ao: 0, clearcoat: 1, env: 1.5, order: 1 },
  M_CleanWater: { color: '#a9cfdb', detail: 'none', scale: 1, bump: 0, roughness: 0.03, wear: 0, ao: 0, clearcoat: 1, env: 1.7, order: 1 },
  M_Pellet: { color: '#24581f', detail: 'granular', scale: 3, bump: 0.8, roughness: 0.62, wear: 0.5, ao: 0 },
  M_Cotton: { color: '#f1eee6', detail: 'fibrous', scale: 2.2, bump: 1.6, roughness: 0.95, wear: 0.5, ao: 0, env: 0.6 },
  M_Instrument: { color: '#eceef0', detail: 'none', scale: 1, bump: 0, roughness: 0.32, wear: 0, ao: 0, clearcoat: 0.8, env: 1.3 },
  M_InstrumentDark: { color: '#24292f', detail: 'none', scale: 1, bump: 0, roughness: 0.22, wear: 0, ao: 0, clearcoat: 1, env: 1.4 },
  M_Steel: { color: '#d4d9de', detail: 'fibrous', scale: 1.4, bump: 0.12, roughness: 0.2, wear: 0.1, ao: 0, metal: 1, env: 1.8 },
  M_Rotor: { color: '#d8dde2', detail: 'fibrous', scale: 1.2, bump: 0.1, roughness: 0.16, wear: 0.1, ao: 0, metal: 1, env: 1.9 },
  M_LED: { color: '#fff8ec', detail: 'none', scale: 1, bump: 0, roughness: 0.3, wear: 0, ao: 0, emissive: '#fff2d8', env: 0.5 },
  M_TubeCap: { color: '#2a6cb0', detail: 'none', scale: 1, bump: 0, roughness: 0.35, wear: 0, ao: 0, clearcoat: 0.6, env: 1.1 },
  M_OilCap: { color: '#1f2328', detail: 'none', scale: 1, bump: 0, roughness: 0.3, wear: 0, ao: 0, clearcoat: 0.8, env: 1.2 },
  M_PigmentCap: { color: '#1f2328', detail: 'none', scale: 1, bump: 0, roughness: 0.3, wear: 0, ao: 0, clearcoat: 0.8, env: 1.2 },
  M_Biomass: { color: '#3c4a22', detail: 'granular', scale: 4, bump: 1.1, roughness: 0.82, wear: 0.5, ao: 0 },
  M_Plinth: { color: '#a8b1ba', detail: 'granular', scale: 0.45, bump: 0.35, roughness: 0.55, wear: 0.45, ao: 0, clearcoat: 0.3, env: 1.1 },
};

const FALLBACK: Look = { color: '#cccccc', detail: 'none', scale: 1, bump: 0, roughness: 0.5, wear: 0, ao: 0.5 };

/** Frost: the colour every structure takes while it is not the one being read, like Igloo's ice. */
const FROST = new Color('#9eaab5');

export interface DetailMaps {
  granular: Texture;
  fibrous: Texture;
  membrane: Texture;
  variation: Texture;
}

/** Hinge of a peeling gore, in the node's own space (three axes): it bends outward about its base. */
export interface PeelSpec {
  /** Azimuth of the gore centre around the cell axis, radians, Blender XY. */
  a: number;
  z0: number;
  z1: number;
  /** Largest bend at the tip, radians. */
  max: number;
}

const CHANNEL: Record<DetailKind, string> = { granular: 'r', fibrous: 'g', membrane: 'b', none: 'r' };

export function makeMaterial(name: string, maps: DetailMaps, hasAO: boolean, peel?: PeelSpec) {
  const look = LOOKS[name] ?? FALLBACK;
  const translucent = look.opacity !== undefined;
  const material = new MeshPhysicalMaterial({
    name,
    color: new Color(look.color),
    roughness: look.roughness,
    metalness: look.metal ?? 0,
    emissive: new Color(look.emissive ?? '#000000'),
    emissiveIntensity: look.emissive ? 2.4 : 0,
    envMapIntensity: look.env ?? 1,
    anisotropy: look.aniso ?? 0,
    transmission: look.glass ? 1 : 0,
    ior: look.glass?.ior ?? 1.5,
    thickness: look.glass?.thickness ?? 0,
    attenuationColor: new Color(look.glass?.tint ?? '#ffffff'),
    attenuationDistance: look.glass?.tint ? 3 : Infinity,
    clearcoat: look.clearcoat ?? 0,
    clearcoatRoughness: 0.3,
    transparent: translucent,
    opacity: look.opacity ?? 1,
    depthWrite: !translucent,
    side: translucent || peel ? DoubleSide : FrontSide,
  });

  const uniforms = {
    uDetailN: { value: look.detail === 'none' ? maps.membrane : maps[look.detail] },
    uVariation: { value: maps.variation },
    uScale: { value: look.scale },
    uBump: { value: look.detail === 'none' ? 0 : look.bump },
    uWear: { value: look.wear },
    uAO: { value: hasAO ? look.ao : 0 },
    uRim: { value: look.rim ?? 0 },
    /** 0 frosted, 1 in its stain colour. */
    uStain: { value: 0 },
    uFrost: { value: FROST },
    uPeel: { value: 0 },
    uPeelA: { value: peel?.a ?? 0 },
    uPeelZ: { value: [peel?.z0 ?? 0, peel?.z1 ?? 1] },
    uPeelMax: { value: peel?.max ?? 0 },
    /** 1 shows the surface; below 1 it dissolves through noise, with a frost glow on the edge. */
    uReveal: { value: 1 },
    uRevealScale: { value: 0.25 },
  };

  material.onBeforeCompile = (shader: WebGLProgramParametersWithUniforms) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
varying vec3 vObjPos;
varying vec3 vObjNormal;
attribute vec4 color;
varying float vAOc;
uniform float uPeel, uPeelA, uPeelMax;
uniform vec2 uPeelZ;
vec3 rotK(vec3 v, vec3 k, float a) { return v * cos(a) + cross(k, v) * sin(a) + k * dot(k, v) * (1.0 - cos(a)); }
float peelAngle(vec3 p) {
  float h = clamp((p.y - uPeelZ.x) / (uPeelZ.y - uPeelZ.x), 0.0, 1.0);
  return uPeelMax * uPeel * mix(0.45, 1.0, h);
}`,
      )
      .replace(
        '#include <beginnormal_vertex>',
        `#include <beginnormal_vertex>
vec3 peelR = vec3(cos(uPeelA), 0.0, -sin(uPeelA));
vec3 peelK = vec3(-sin(uPeelA), 0.0, -cos(uPeelA));
float peelA = uPeel > 0.0 ? peelAngle(position) : 0.0;
objectNormal = rotK(objectNormal, peelK, peelA);`,
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
if (uPeel > 0.0) {
  vec3 pivot = vec3(0.0, uPeelZ.x, 0.0);
  transformed = pivot + rotK(transformed - pivot, peelK, peelA) + peelR * uPeel * 0.9;
}`,
      )
      .replace('#include <defaultnormal_vertex>', '#include <defaultnormal_vertex>\nvObjNormal = objectNormal;')
      .replace(
        '#include <project_vertex>',
        `#include <project_vertex>\nvObjPos = position;\n${hasAO ? 'vAOc = color.r;' : 'vAOc = 1.0;'}`,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
uniform sampler2D uDetailN;
uniform sampler2D uVariation;
uniform float uScale, uBump, uWear, uAO, uRim, uStain, uReveal, uRevealScale;
float rhash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float rnoise(vec3 x) {
  vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(rhash(i), rhash(i + vec3(1,0,0)), f.x), mix(rhash(i + vec3(0,1,0)), rhash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(rhash(i + vec3(0,0,1)), rhash(i + vec3(1,0,1)), f.x), mix(rhash(i + vec3(0,1,1)), rhash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
uniform vec3 uFrost;
uniform mat3 normalMatrix;
varying vec3 vObjPos;
varying vec3 vObjNormal;
varying float vAOc;
vec3 tri(vec2 uv) { vec3 t = texture2D(uDetailN, uv).xyz * 2.0 - 1.0; t.xy *= uBump; return t; }`,
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
float dissolve = rnoise(vObjPos * uRevealScale) * 0.65 + rnoise(vObjPos * uRevealScale * 3.7) * 0.35;
if (dissolve > uReveal * 1.08) discard;
float frostEdge = uReveal < 1.0 ? smoothstep(uReveal * 1.08 - 0.07, uReveal * 1.08, dissolve) : 0.0;
vec3 on = normalize(vObjNormal);
vec3 tw = pow(abs(on), vec3(4.0)); tw /= (tw.x + tw.y + tw.z);
vec3 tp = vObjPos * uScale;
float vary = texture2D(uVariation, tp.zy).${CHANNEL[look.detail]} * tw.x + texture2D(uVariation, tp.xz).${CHANNEL[look.detail]} * tw.y + texture2D(uVariation, tp.xy).${CHANNEL[look.detail]} * tw.z;
float ao = mix(1.0, vAOc, uAO);
vec3 frosted = mix(uFrost, diffuseColor.rgb, 0.62);
diffuseColor.rgb = mix(frosted, diffuseColor.rgb, uStain);
diffuseColor.rgb *= mix(1.0, 0.72 + 0.5 * vary, max(uWear, 0.35 * (1.0 - uStain))) * mix(1.0, ao, mix(0.75, 0.5, uStain));`,
      )
      .replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
roughnessFactor = clamp(mix(0.62, roughnessFactor, uStain) + (0.5 - vary) * 0.35 * uWear, 0.04, 1.0);`,
      )
      .replace(
        '#include <normal_fragment_maps>',
        `#include <normal_fragment_maps>
if (uBump > 0.0) {
  vec3 tx = tri(tp.zy); vec3 ty = tri(tp.xz); vec3 tz = tri(tp.xy);
  tx = vec3(tx.xy + on.zy, abs(tx.z) * on.x);
  ty = vec3(ty.xy + on.xz, abs(ty.z) * on.y);
  tz = vec3(tz.xy + on.xy, abs(tz.z) * on.z);
  vec3 nObj = normalize(tx.zyx * tw.x + ty.xzy * tw.y + tz.xyz * tw.z);
  normal = normalize(normalMatrix * nObj) * faceDirection;
}`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        '#include <emissivemap_fragment>\ntotalEmissiveRadiance += vec3(0.82, 0.93, 1.0) * frostEdge * 3.0;',
      )
      .replace(
        '#include <aomap_fragment>',
        `#include <aomap_fragment>
reflectedLight.indirectDiffuse *= ao;
reflectedLight.indirectSpecular *= mix(1.0, ao, 0.7);`,
      )
      // A cold rim on every surface, the frost catching the light at grazing angles.
      .replace(
        '#include <opaque_fragment>',
        `float fres = pow(1.0 - abs(dot(normalize(vViewPosition), normal)), 2.4);
outgoingLight += vec3(0.86, 0.93, 1.0) * fres * mix(0.16, 0.08, uStain);
${translucent ? 'diffuseColor.a = mix(diffuseColor.a, 0.95, fres * uRim);' : ''}
#include <opaque_fragment>`,
      );
  };
  material.customProgramCacheKey = () => `${name}:${hasAO}:${peel ? 1 : 0}`;

  return { material, uniforms, order: look.order ?? 0 };
}
