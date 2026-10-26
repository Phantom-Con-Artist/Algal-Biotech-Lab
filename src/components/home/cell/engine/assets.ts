import { LinearSRGBColorSpace, RepeatWrapping, type Texture, TextureLoader, Vector3, type WebGLRenderer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import type { DetailMaps } from './materials';

/** Blender axes (Z up) to three.js axes (Y up), as the glTF exporter converts them. */
export const toThree = (x: number, y: number, z: number) => new Vector3(x, z, -y);

/** One glTF loader with Draco for every model in the scene. */
export function createLoader() {
  const draco = new DRACOLoader().setDecoderPath('/draco/');
  const gltf = new GLTFLoader().setDRACOLoader(draco);
  return { gltf, dispose: () => draco.dispose() };
}

/** The seamless surface-detail maps shared by every material. */
export async function loadDetailMaps(renderer: WebGLRenderer): Promise<DetailMaps> {
  const loader = new TextureLoader();
  const load = (url: string) =>
    new Promise<Texture>((resolve, reject) =>
      loader.load(
        url,
        (t) => {
          t.wrapS = t.wrapT = RepeatWrapping;
          t.colorSpace = LinearSRGBColorSpace;
          t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
          resolve(t);
        },
        undefined,
        reject,
      ),
    );
  const [granular, fibrous, membrane, variation] = await Promise.all([
    load('/models/detail-granular-n.webp'),
    load('/models/detail-fibrous-n.webp'),
    load('/models/detail-membrane-n.webp'),
    load('/models/detail-variation.webp'),
  ]);
  return { granular, fibrous, membrane, variation };
}
