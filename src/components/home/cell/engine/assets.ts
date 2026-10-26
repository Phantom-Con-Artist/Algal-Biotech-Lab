import { LinearSRGBColorSpace, RepeatWrapping, type Texture, TextureLoader, Vector3, type WebGLRenderer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { DETAIL_MAPS, DRACO_PATH } from '../../../../data/assets3d';
import { assetsReady, releaseAssets } from '../../../../utils/preload';
import type { DetailMaps } from './materials';

/** Blender axes (Z up) to three.js axes (Y up), as the glTF exporter converts them. */
export const toThree = (x: number, y: number, z: number) => new Vector3(x, z, -y);

/** One glTF loader with Draco for every model in the scene. */
export function createLoader() {
  const draco = new DRACOLoader().setDecoderPath(DRACO_PATH);
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
  await assetsReady(...Object.values(DETAIL_MAPS));
  const [granular, fibrous, membrane, variation] = await Promise.all([
    load(DETAIL_MAPS.granular),
    load(DETAIL_MAPS.fibrous),
    load(DETAIL_MAPS.membrane),
    load(DETAIL_MAPS.variation),
  ]);
  releaseAssets(...Object.values(DETAIL_MAPS));
  return { granular, fibrous, membrane, variation };
}
