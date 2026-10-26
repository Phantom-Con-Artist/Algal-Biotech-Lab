import { Color, Group, Mesh, type Object3D, Vector3 } from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { CONDITION_TINT, CONDITIONS, JOURNEY_START } from '../../../../data/journey';
import type { JourneyTag } from '../../../../types';
import { toThree } from './assets';
import { smooth, stageAmount } from './choreography';
import { makeMaterial, type DetailMaps } from './materials';

/** Camera stops for the lab chapters, in centimetres and three.js axes. Azimuth 0 faces the bench front. */
export interface LabKey {
  target: [number, number, number];
  distance: number;
  azimuth: number;
  elevation: number;
}

/** Arrival out of the mist, then culturing, conditions, harvest and products. */
export const LAB_KEYS: LabKey[] = [
  { target: [0, 22, 0], distance: 330, azimuth: -40, elevation: 26 },
  { target: [0, 24, 0], distance: 158, azimuth: -28, elevation: 16 },
  { target: [90, 10, 0], distance: 150, azimuth: 4, elevation: 12 },
  { target: [189, 8, 0], distance: 112, azimuth: -22, elevation: 32 },
  { target: [271, 6, 0], distance: 92, azimuth: 8, elevation: 14 },
];

/** Index into LAB_KEYS at scroll progress p: arrival at the culture block, then one station per block. */
export const labKeyAt = (p: number) => Math.max(0, p - JOURNEY_START);

/** Station centres along the bench (three.js x, centimetres): culturing, conditions, harvest, products. */
const STATIONS = [0, 90, 185, 270];
const stationOf = (x: number) => STATIONS.reduce((best, c, i) => (Math.abs(x - c) < Math.abs(x - STATIONS[best]) ? i : best), 0);

/**
 * How present a station is at progress p: it crystallises out of the mist as the camera arrives and
 * dissolves behind it as the camera leaves. The last station stays.
 */
function presence(station: number, p: number) {
  const b = JOURNEY_START + 1 + station;
  const enter = smooth(b - 0.9, b - 0.35, p);
  const leave = station < STATIONS.length - 1 ? 1 - smooth(b + 0.5, b + 0.95, p) : 1;
  return Math.min(enter, leave);
}

const SHAKEN = ['ShakerPlatform', 'ShakerClamps', 'Flask0', 'Flask1', 'Flask2', 'Flask3', 'Flask4', 'Flask5'];
const PRODUCTS = ['Oil_', 'Dish_', 'Pigment_', 'Beaker_'];

export function createLab(gltf: GLTF, maps: DetailMaps, reducedMotion: boolean) {
  const root = new Group();
  const nodes = new Map<string, { object: Object3D; rest: Vector3 }>();
  const stressColours: { uniforms: { uStain: { value: number } }; colour: Color; tint: Color }[] = [];
  const shared = new Map<string, ReturnType<typeof makeMaterial>>();
  const reveals: { uReveal: { value: number } }[][] = STATIONS.map(() => []);
  const stationMeshes: Mesh[][] = STATIONS.map(() => []);
  const worldPos = new Vector3();
  const control = new Color(CONDITION_TINT.control);

  gltf.scene.updateMatrixWorld(true);
  gltf.scene.traverse((o) => {
    if (o.parent === gltf.scene) nodes.set(o.name, { object: o, rest: o.position.clone() });
    if (!(o instanceof Mesh)) return;
    const source = Array.isArray(o.material) ? o.material[0] : o.material;
    const station = stationOf(o.getWorldPosition(worldPos).x);
    // Each flask in the stress row gets its own culture, so it can shift colour on its own.
    const stress = /^Stress(\d)_Culture/.exec(o.name);
    const key = `${station}:${source.name}`;
    let made = stress ? undefined : shared.get(key);
    if (!made) {
      made = makeMaterial(source.name, maps, false);
      made.uniforms.uStain.value = 1;
      made.uniforms.uRevealScale.value = 0.32;
      reveals[station].push(made.uniforms);
      if (!stress) shared.set(key, made);
      else stressColours.push({ uniforms: made.uniforms, colour: made.material.color, tint: new Color(CONDITION_TINT[CONDITIONS[Number(stress[1])]]) });
    }
    source.dispose();
    o.material = made.material;
    o.renderOrder = made.order;
    // Solid things cast soft contact shadows on the plinths; glass and liquids only receive them.
    o.castShadow = made.material.transmission === 0;
    stationMeshes[station].push(o);
    o.receiveShadow = true;
  });
  root.add(gltf.scene);
  const rotor = nodes.get('Rotor')?.object;
  let rotorAngle = 0;

  function update(p: number, t: number, delta: number) {
    const live = reducedMotion ? 0 : 1;
    // The shaker orbits a centimetre; the cultures swirl with it.
    const ox = Math.cos(t * 7.5) * 0.7 * live;
    const oz = Math.sin(t * 7.5) * 0.7 * live;
    for (const [name, n] of nodes) {
      if (SHAKEN.some((s) => name.startsWith(s))) n.object.position.set(n.rest.x + ox, n.rest.y, n.rest.z + oz);
      if (/^Flask\d_Culture/.test(name)) n.object.rotation.set(oz * 0.04, 0, -ox * 0.04);
      const product = PRODUCTS.findIndex((s) => name.startsWith(s));
      if (product >= 0) {
        n.object.position.y = n.rest.y + 1.2 + Math.sin(t * 0.8 + product * 1.7) * 0.45 * live;
        n.object.rotation.y = Math.sin(t * 0.3 + product) * 0.25 * live;
      }
    }
    STATIONS.forEach((_, i) => {
      const r = presence(i, p);
      for (const u of reveals[i]) u.uReveal.value = r;
      // A station fully dissolved is not drawn at all.
      for (const m of stationMeshes[i]) m.visible = r > 0.002;
    });
    // One change at a time: each culture drifts from control green toward its condition.
    const drift = stageAmount(JOURNEY_START + 2, p);
    for (const s of stressColours) s.colour.copy(control).lerp(s.tint, drift);
    // The rotor spins up through the harvest chapter and coasts down at its end.
    const spin = Math.sin(Math.PI * smooth(0, 1, (p - (JOURNEY_START + 2.35)) / 1.1));
    rotorAngle += spin * 26 * delta * (reducedMotion ? 0 : 1);
    if (rotor) rotor.rotation.y = rotorAngle;
  }

  const offset = new Vector3();
  function anchor(tag: JourneyTag, out: Vector3) {
    const node = nodes.get(tag.node)?.object ?? gltf.scene.getObjectByName(tag.node);
    if (!node) return null;
    node.getWorldPosition(out);
    return out.add(offset.copy(toThree(...tag.offset)));
  }

  return { root, update, anchor };
}

export type Lab = ReturnType<typeof createLab>;
