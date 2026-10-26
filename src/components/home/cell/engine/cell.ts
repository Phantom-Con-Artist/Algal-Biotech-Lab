import { AnimationMixer, Box3, Euler, Group, Mesh, type Object3D, Quaternion, Sphere, Vector3 } from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { CellPart, CellPartId } from '../../../../types';
import { toThree } from './assets';
import { FINAL, LIFTS, PEEL, peelAmount, PLATE_LIFT, plateLift, SPLIT, splitAmount, SPREAD, stageAmount, STAGES } from './choreography';
import { createCollisions } from './collisions';
import { makeMaterial, type DetailMaps, type PeelSpec } from './materials';

interface GoreData {
  a: number;
  z0: number;
  z1: number;
  i: number;
  n: number;
}

interface Node {
  object: Object3D;
  rest: Vector3;
  restQuat: Quaternion;
  /** Phase of the node's own drift, so no two pieces float in step. */
  phase: number;
  part: CellPartId | null;
  key: number;
  layer?: string;
  split?: string;
  gore?: GoreData & { uniforms: { uPeel: { value: number } }[] };
  plate?: { i: number; n: number; dir: Vector3 };
  spread?: { stage: number; amount: number; dir: Vector3 };
}

const rotK = (v: Vector3, k: Vector3, a: number) =>
  v
    .clone()
    .multiplyScalar(Math.cos(a))
    .add(k.clone().cross(v).multiplyScalar(Math.sin(a)))
    .add(k.clone().multiplyScalar(k.dot(v) * (1 - Math.cos(a))));

/** The Chlamydomonas model: peels, splits, lifts and drift, with solid contents and stain focus. */
export function createCell(gltf: GLTF, maps: DetailMaps, parts: CellPart[], reducedMotion: boolean) {
  const root = new Group();
  const nodes: Node[] = [];
  const stains = new Map<CellPartId, { current: number; target: number; uniforms: { uStain: { value: number } }[] }>();
  const shared = new Map<string, ReturnType<typeof makeMaterial>>();
  const prefixOf = (keys: string[], name: string) => keys.find((k) => name.startsWith(k));

  for (const child of [...gltf.scene.children]) {
    const part = parts.find((p) => p.nodes.some((prefix) => child.name.startsWith(prefix))) ?? null;
    const layer = prefixOf(Object.keys(PEEL), child.name);
    const data = child.userData as { peel?: string; lift?: string };
    const gore = data.peel ? (JSON.parse(data.peel) as GoreData) : undefined;
    const node: Node = {
      object: child,
      rest: child.position.clone(),
      restQuat: child.quaternion.clone(),
      phase: nodes.length * 2.399,
      part: part?.id ?? null,
      key: part?.key ?? 0,
      layer,
      split: prefixOf(Object.keys(SPLIT), child.name),
    };
    if (gore) node.gore = { ...gore, uniforms: [] };
    if (data.lift) {
      const lift = JSON.parse(data.lift) as { d: number[]; i: number; n: number };
      node.plate = { i: lift.i, n: lift.n, dir: toThree(lift.d[0], lift.d[1], lift.d[2]).normalize() };
    }
    const spread = prefixOf(Object.keys(SPREAD), child.name);
    if (spread) node.spread = { ...SPREAD[spread], dir: new Vector3() };
    nodes.push(node);

    const spec: PeelSpec | undefined = gore && layer ? { a: gore.a, z0: gore.z0, z1: gore.z1, max: PEEL[layer].max } : undefined;
    child.traverse((o) => {
      if (!(o instanceof Mesh)) return;
      const source = Array.isArray(o.material) ? o.material[0] : o.material;
      const hasAO = Boolean(o.geometry.getAttribute('color'));
      const cacheKey = `${part?.id}:${source.name}:${hasAO}`;
      let made = spec ? undefined : shared.get(cacheKey);
      if (!made) {
        made = makeMaterial(source.name, maps, hasAO, spec);
        if (!spec) shared.set(cacheKey, made);
        node.gore?.uniforms.push(made.uniforms);
        if (part) {
          const entry = stains.get(part.id) ?? { current: 0, target: 0, uniforms: [] };
          entry.uniforms.push(made.uniforms);
          stains.set(part.id, entry);
        }
      }
      source.dispose();
      o.material = made.material;
      o.renderOrder = made.order;
      // Peeling gores bend past their bounds in the shader; skinned flagella beat past theirs.
      o.frustumCulled = !spec && !('isSkinnedMesh' in o);
    });
  }

  for (const name of Object.keys(SPREAD)) {
    const group = nodes.filter((n) => n.object.name.startsWith(name));
    const centre = group.reduce((c, n) => c.add(n.rest), new Vector3()).divideScalar(Math.max(1, group.length));
    for (const n of group) n.spread?.dir.copy(n.rest).sub(centre);
  }

  const collisions = createCollisions(nodes.map((n) => n.object), { centre: toThree(0, 0, 0.95), radius: 1.62 });
  // Each polyphosphate granule rides inside its own acidocalcisome.
  const followers = nodes.flatMap((n) => {
    if (!n.object.name.startsWith('PolyPGranule_')) return [];
    const host = nodes.find((h) => h.object.name === n.object.name.replace('PolyPGranule_', 'Acidocalcisome_'));
    return host ? [{ node: n, host, offset: n.rest.clone().sub(host.rest) }] : [];
  });

  root.add(gltf.scene);
  const anchorRest = new Map(parts.map((p) => [p.id, toThree(...p.anchor)]));
  const mixer = gltf.animations.length ? new AnimationMixer(gltf.scene) : null;
  for (const clip of gltf.animations) mixer?.clipAction(clip).play();
  if (reducedMotion) mixer?.setTime(0.05);

  const splitAxis = new Vector3();
  const splitQ = new Quaternion();
  const wobble = new Euler();
  const wobbleQ = new Quaternion();

  function place(p: number, t: number) {
    for (const n of nodes) {
      const pos = n.object.position.copy(n.rest);
      // How far this piece has come free of the cell: assembled pieces barely stir, loose ones float.
      let free = 0;
      for (const [prefix, stage, x, y, z] of LIFTS) {
        if (!n.object.name.startsWith(prefix)) continue;
        const s = stageAmount(stage, p);
        pos.add(toThree(x, y, z).multiplyScalar(s));
        free = Math.max(free, s);
      }
      if (n.plate) {
        const lift = plateLift(n.plate.i, n.plate.n, p);
        pos.addScaledVector(n.plate.dir, lift);
        free = Math.max(free, lift / PLATE_LIFT);
      }
      if (n.spread) {
        const s = stageAmount(n.spread.stage, p);
        pos.addScaledVector(n.spread.dir, n.spread.amount * s);
        free = Math.max(free, s);
      }
      if (n.gore && n.layer) {
        const amount = peelAmount(n.layer, n.gore.i, n.gore.n, p);
        for (const u of n.gore.uniforms) u.uPeel.value = amount;
        free = Math.max(free, amount);
      }
      let open = 0;
      if (n.gore && n.split) {
        const spec = SPLIT[n.split];
        open = splitAmount(n.split, n.gore.i, n.gore.n, p);
        pos.addScaledVector(toThree(Math.cos(n.gore.a), Math.sin(n.gore.a), 0), spec.distance * open).add(toThree(0, 0, spec.rise * open));
        // Tilt open about the tangent, so the segment turns its inner face toward the light as it leaves.
        splitAxis.set(-Math.sin(n.gore.a), 0, -Math.cos(n.gore.a));
        splitQ.setFromAxisAngle(splitAxis, spec.tilt * open);
        free = Math.max(free, open);
      }
      n.object.quaternion.copy(n.restQuat);
      if (open) n.object.quaternion.premultiply(splitQ);
      if (reducedMotion) continue;
      const amp = 0.04 + free * 0.38;
      const ph = n.phase;
      pos.x += Math.sin(t * 0.53 + ph) * amp;
      pos.y += Math.sin(t * 0.41 + ph * 1.7) * amp * 1.3;
      pos.z += Math.cos(t * 0.47 + ph * 0.6) * amp;
      const tilt = 0.006 + free * 0.035;
      wobble.set(Math.sin(t * 0.37 + ph) * tilt, Math.sin(t * 0.29 + ph * 1.3) * tilt, Math.cos(t * 0.33 + ph) * tilt);
      n.object.quaternion.multiply(wobbleQ.setFromEuler(wobble));
    }
    collisions.resolve();
    for (const f of followers) f.node.object.position.copy(f.host.object.position).add(f.offset);
    if (!reducedMotion) {
      // The whole cell breathes in the medium.
      root.position.y = Math.sin(t * 0.32) * 0.35;
      root.rotation.set(Math.sin(t * 0.21) * 0.025, Math.sin(t * 0.13) * 0.08, Math.cos(t * 0.17) * 0.02);
    }
  }

  /** Bounding sphere per scroll block: whatever is still closed, plus the layer opening now. */
  const frames: { center: Vector3; radius: number }[] = [];
  const sphere = new Sphere();
  for (let k = 0; k <= FINAL; k++) {
    place(Math.min(k, STAGES), 0);
    root.updateMatrixWorld(true);
    const box = new Box3();
    for (const n of nodes) {
      const closed = n.key >= k || (n.key === 0 && k < 5);
      if (k === 0 || k === 1 || (k === FINAL ? n.key !== 1 : closed)) box.expandByObject(n.object);
    }
    box.getBoundingSphere(sphere);
    frames.push({ center: sphere.center.clone(), radius: k === FINAL ? sphere.radius * 1.7 : sphere.radius });
  }

  /** Where a part's tag points. On a peeling shell the point rides the front gore as it curls away. */
  const anchorNodes = new Map<CellPartId, Node | undefined>();
  function anchor(part: CellPart, p: number, out: Vector3) {
    const rest = anchorRest.get(part.id);
    if (!rest) return null;
    if (!anchorNodes.has(part.id)) {
      anchorNodes.set(part.id, nodes.find((n) => n.part === part.id && n.object.name.startsWith(part.nodes[0]) && (!n.gore || n.gore.i === 0)));
    }
    const node = anchorNodes.get(part.id);
    if (!node) return null;
    if (node.gore && node.layer) {
      const g = node.gore;
      const local = rest.clone().sub(node.rest);
      const amount = peelAmount(node.layer, 0, g.n, p);
      const h = Math.min(1, Math.max(0, (local.y - g.z0) / (g.z1 - g.z0)));
      const angle = PEEL[node.layer].max * amount * (0.45 + 0.55 * h);
      const r = new Vector3(Math.cos(g.a), 0, -Math.sin(g.a));
      const k = new Vector3(-Math.sin(g.a), 0, -Math.cos(g.a));
      const pivot = new Vector3(0, g.z0, 0);
      const bent = pivot.clone().add(rotK(local.sub(pivot), k, angle)).addScaledVector(r, amount * 0.9);
      return out.copy(bent).add(node.object.position).applyMatrix4(root.matrixWorld);
    }
    return out.copy(rest).add(node.object.position).sub(node.rest).applyMatrix4(root.matrixWorld);
  }

  return {
    root,
    frames,
    place,
    anchor,
    /** Eases each structure toward its stain target; returns true while any is still moving. */
    tick(delta: number) {
      if (mixer && !reducedMotion) mixer.update(delta * 0.9);
      let moving = false;
      for (const entry of stains.values()) {
        if (Math.abs(entry.current - entry.target) < 0.002) continue;
        entry.current += (entry.target - entry.current) * (reducedMotion ? 1 : Math.min(1, delta * 5));
        for (const u of entry.uniforms) u.uStain.value = entry.current;
        moving = true;
      }
      return moving;
    },
    setStained(ids: CellPartId[] | 'all') {
      for (const [part, entry] of stains) entry.target = ids === 'all' || ids.includes(part) ? 1 : 0;
    },
  };
}

export type Cell = ReturnType<typeof createCell>;
