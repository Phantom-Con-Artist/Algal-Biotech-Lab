import {
  Color,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  type MeshStandardMaterial,
  type Object3D,
  SRGBColorSpace,
  type Texture,
  TextureLoader,
  Vector3,
  type WebGLRenderer,
} from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MODELS, ROOM_LIGHTMAPS } from '../../../data/assets3d';
import type { RoomPoint } from '../../../types';
import { kindOf, makeRoomMaterial, type RoomUniforms } from './roomMaterial';

export const ROOM_URL = MODELS.room;
type LightmapSet = keyof typeof ROOM_LIGHTMAPS;

/** Blender axes (Z up, metres) to three.js axes (Y up), as the glTF exporter converts them. */
export const roomPoint = ([x, y, z]: RoomPoint, out = new Vector3()) => out.set(x, z, -y);

const setOf = (name: string): LightmapSet | null =>
  name === 'Shell' ? 'shell' : name === 'Furniture' ? 'furniture' : name.startsWith('Inst_') ? 'instruments' : null;

/** Loads the three baked lightmaps. Irradiance is stored halved; the material multiplies it back. */
export async function loadLightmaps(renderer: WebGLRenderer) {
  const loader = new TextureLoader();
  const entries = await Promise.all(
    (Object.keys(ROOM_LIGHTMAPS) as LightmapSet[]).map(
      (key) =>
        new Promise<[LightmapSet, Texture]>((resolve, reject) =>
          loader.load(
            ROOM_LIGHTMAPS[key],
            (t) => {
              t.colorSpace = SRGBColorSpace;
              t.flipY = false;
              t.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
              resolve([key, t]);
            },
            undefined,
            reject,
          ),
        ),
    ),
  );
  return Object.fromEntries(entries) as Record<LightmapSet, Texture>;
}

/**
 * Builds the room from its glTF: every lit surface gets the ash-to-colour room material with its baked
 * lightmap; lamps, displays and the view outside glow; glass is a faint sheet.
 */
export function createRoom(gltf: GLTF, lightmaps: Record<LightmapSet, Texture>, shared: RoomUniforms) {
  const root = new Group();
  const anchors = new Map<string, Vector3>();
  const floors: Mesh[] = [];
  const made = new Map<string, MeshBasicMaterial | ReturnType<typeof makeRoomMaterial>>();
  const glass = new MeshBasicMaterial({ color: '#dfeef0', transparent: true, opacity: 0.16, depthWrite: false, side: DoubleSide });

  gltf.scene.updateMatrixWorld(true);
  const top = (o: Object3D) => {
    let n = o;
    while (n.parent && n.parent !== gltf.scene) n = n.parent;
    return n;
  };

  gltf.scene.traverse((o) => {
    if (o.name.startsWith('Label_') && !(o instanceof Mesh)) anchors.set(o.name.slice(6), o.getWorldPosition(new Vector3()));
    if (!(o instanceof Mesh)) return;
    const source = o.material as MeshStandardMaterial;
    const name = source.name;
    const set = setOf(top(o).name);
    // Glowing things share one unlit material per name; lit surfaces get one room material per lightmap set.
    // Instruments float, so each keeps its own materials, which remember where it rests.
    const instrument = top(o).name.startsWith('Inst_');
    const key = name === 'Outside' || name === 'TubeLight' || name === 'Display' ? name : instrument ? `${top(o).name}:${name}` : `${set ?? 'none'}:${name}`;
    let material = name === 'Glass' ? glass : made.get(key);
    if (!material) {
      if (name === 'Outside') material = new MeshBasicMaterial({ map: source.emissiveMap ?? source.map, toneMapped: false });
      else if (name === 'TubeLight') material = new MeshBasicMaterial({ color: '#ffffff', toneMapped: false });
      else if (name === 'Display') material = new MeshBasicMaterial({ color: new Color('#9ee8c4').multiplyScalar(1.3), toneMapped: false });
      else material = makeRoomMaterial({ color: source.color.clone(), kind: kindOf(name), rough: source.roughness, lightMap: set ? lightmaps[set] : null, shared, seam: name === 'Seam', rest: instrument ? o.matrixWorld.clone() : undefined });
      made.set(key, material);
    }
    if (name === 'Glass') o.renderOrder = 2;
    if (name === 'FloorGloss') floors.push(o);
    source.dispose();
    o.material = material;
  });
  root.add(gltf.scene);

  // Instruments are their own nodes, pivoted at the foot, so a station can lift them off the bench.
  const instruments = new Map<string, { object: Object3D; y: number; ry: number }>();
  for (const child of gltf.scene.children) {
    if (child.name.startsWith('Inst_')) instruments.set(child.name.slice(5), { object: child, y: child.position.y, ry: child.rotation.y });
  }

  /** A readout's anchor, carried up with its instrument while it floats. */
  function anchorOf(id: string, out: Vector3) {
    const a = anchors.get(id);
    if (!a) return null;
    out.copy(a);
    const inst = instruments.get(id);
    if (inst) out.y += inst.object.position.y - inst.y;
    return out;
  }

  return {
    root,
    anchors,
    anchorOf,
    instruments,
    floors,
    dispose() {
      glass.dispose();
      for (const m of made.values()) m.dispose();
      for (const t of Object.values(lightmaps)) t.dispose();
    },
  };
}

export type Room = ReturnType<typeof createRoom>;
