import {
  CapsuleGeometry,
  Color,
  CylinderGeometry,
  DoubleSide,
  type BufferGeometry,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  LatheGeometry,
  Mesh,
  type Material,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  TorusGeometry,
  Vector2,
} from 'three';

/** A specimen: a small scene that animates itself and develops from clay into colour. */
export interface Specimen {
  group: Group;
  update: (time: number) => void;
  /** 0 is clay, 1 is full colour. */
  develop: (amount: number) => void;
  dispose: () => void;
}

const CLAY = new Color('#dcddd8');

/**
 * Collects a specimen's materials and geometry. Coloured materials remember their colour and develop
 * from clay toward it, the way the lab's instruments arrive on the tour.
 */
function kit() {
  const coloured: { m: MeshStandardMaterial; colour: Color }[] = [];
  const owned: (Material | BufferGeometry)[] = [];
  const o = new Object3D();
  return {
    paint<T extends MeshStandardMaterial>(m: T) {
      coloured.push({ m, colour: m.color.clone() });
      owned.push(m);
      return m;
    },
    own<T extends Material | BufferGeometry>(x: T) {
      owned.push(x);
      return x;
    },
    /** A mesh placed at a position, with an optional rotation. */
    mesh(geometry: BufferGeometry, material: Material, x = 0, y = 0, z = 0, rx = 0, rz = 0) {
      owned.push(geometry);
      const m = new Mesh(geometry, material);
      m.position.set(x, y, z);
      m.rotation.set(rx, 0, rz);
      return m;
    },
    /** A reusable transform for instance matrices. */
    o,
    develop(amount: number) {
      for (const { m, colour } of coloured) m.color.copy(CLAY).lerp(colour, amount);
    },
    dispose() {
      for (const x of owned) x.dispose();
    },
  };
}

const glass = () =>
  new MeshPhysicalMaterial({ color: '#f3f8f8', roughness: 0.04, transparent: true, opacity: 0.22, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.4, side: DoubleSide, depthWrite: false });

/** Profile of an Erlenmeyer flask, base to lip. */
const FLASK = [[0, 0], [0.6, 0], [0.62, 0.04], [0.6, 0.12], [0.24, 1.05], [0.2, 1.2], [0.2, 1.48], [0.23, 1.52], [0.23, 1.55]].map(([x, y]) => new Vector2(x, y));
/** Inner radius of the flask's cone at height y. */
const coneR = (y: number) => 0.6 - (0.36 * y) / 0.93 - 0.02;
const coneSlice = (y0: number, y1: number) => new LatheGeometry([new Vector2(0, y0), new Vector2(coneR(y0), y0), new Vector2(coneR(y1), y1), new Vector2(0, y1)], 48);

/** Biofuel: a flask of culture whose oil has risen to the top, lipid droplets still climbing through it. */
function biofuel(): Specimen {
  const k = kit();
  const group = new Group();
  const shell = new Group();
  const culture = k.paint(new MeshPhysicalMaterial({ color: '#3f8f36', roughness: 0.25, clearcoat: 0.6, transparent: true, opacity: 0.92 }));
  const oil = k.paint(new MeshPhysicalMaterial({ color: '#e0a21c', roughness: 0.08, clearcoat: 1, transparent: true, opacity: 0.9, emissive: new Color('#5a3200'), emissiveIntensity: 0.15 }));
  const cotton = k.paint(new MeshStandardMaterial({ color: '#f2efe6', roughness: 1 }));
  shell.add(
    k.mesh(coneSlice(0.05, 0.55), culture),
    k.mesh(coneSlice(0.55, 0.68), oil),
    k.mesh(new CylinderGeometry(0.19, 0.17, 0.2, 24), cotton, 0, 1.55),
    k.mesh(new LatheGeometry(FLASK, 48), k.own(glass())),
  );
  const N = 26;
  const drops = new InstancedMesh(k.own(new IcosahedronGeometry(1, 2)), oil, N);
  shell.add(drops);
  group.add(shell);
  group.position.y = -0.75;
  return {
    group,
    update(t) {
      shell.rotation.y = t * 0.18;
      for (let i = 0; i < N; i++) {
        const a = (i * 2.39996) % (Math.PI * 2);
        const y = 0.1 + (((i * 0.137) % 1 + t * (0.06 + ((i * 7) % 5) / 60)) % 1) * 0.45;
        const r = Math.min(0.08 + ((i * 37) % 23) / 60, coneR(y) - 0.05);
        k.o.position.set(Math.cos(a + t * 0.2) * r, y, Math.sin(a + t * 0.2) * r);
        k.o.scale.setScalar((0.012 + ((i * 13) % 7) / 300) * (0.8 + y));
        k.o.updateMatrix();
        drops.setMatrixAt(i, k.o.matrix);
      }
      drops.instanceMatrix.needsUpdate = true;
    },
    develop: k.develop,
    dispose: k.dispose,
  };
}

/** Carbon capture: bubble columns, CO2 streaming up through green culture between steel caps. */
function carbon(): Specimen {
  const k = kit();
  const group = new Group();
  const g = k.own(glass());
  const steel = k.paint(new MeshStandardMaterial({ color: '#c9ced2', metalness: 1, roughness: 0.25 }));
  const bubbleMat = k.paint(new MeshPhysicalMaterial({ color: '#eef8f2', roughness: 0.05, transparent: true, opacity: 0.55, clearcoat: 1 }));
  const columns = [{ x: -0.62, h: 1.55, c: '#3c8c33' }, { x: 0, h: 1.85, c: '#5aa33f' }, { x: 0.62, h: 1.4, c: '#2f7a3a' }];
  for (const { x, h, c } of columns) {
    const fill = k.paint(new MeshPhysicalMaterial({ color: c, roughness: 0.2, clearcoat: 0.7, transparent: true, opacity: 0.88, depthWrite: false }));
    group.add(
      k.mesh(new CylinderGeometry(0.2, 0.2, h - 0.12, 40), fill, x, (h - 0.12) / 2 + 0.02),
      k.mesh(new CylinderGeometry(0.22, 0.22, h, 40, 1, true), g, x, h / 2),
      k.mesh(new CylinderGeometry(0.25, 0.25, 0.08, 40), steel, x, h + 0.04),
      k.mesh(new CylinderGeometry(0.25, 0.25, 0.08, 40), steel, x, -0.02),
    );
  }
  // The gas line that feeds every column.
  group.add(k.mesh(new CylinderGeometry(0.035, 0.035, 1.6, 16), steel, 0, -0.06, 0.3, 0, Math.PI / 2));
  const PER = 22;
  const bubbles = new InstancedMesh(k.own(new IcosahedronGeometry(1, 1)), bubbleMat, PER * columns.length);
  // The bubbles draw after the culture, so they show through it.
  bubbles.renderOrder = 3;
  group.add(bubbles);
  group.position.y = -0.9;
  return {
    group,
    update(t) {
      group.rotation.y = Math.sin(t * 0.25) * 0.35;
      columns.forEach(({ x, h }, c) => {
        for (let j = 0; j < PER; j++) {
          const seed = c * 31 + j * 7;
          const life = (t * (0.22 + (seed % 5) * 0.03) + (seed % 17) / 17) % 1;
          k.o.position.set(x + Math.sin(t * 3 + seed) * 0.05 + Math.cos(seed) * 0.08, 0.06 + life * (h - 0.2), Math.sin(seed) * 0.08);
          k.o.scale.setScalar((0.018 + (seed % 4) * 0.008) * (0.6 + life * 0.8));
          k.o.updateMatrix();
          bubbles.setMatrixAt(c * PER + j, k.o.matrix);
        }
      });
      bubbles.instanceMatrix.needsUpdate = true;
    },
    develop: k.develop,
    dispose: k.dispose,
  };
}

/** Nutraceuticals: astaxanthin softgels, oil capsules and spirulina tablets, tumbling slowly in the air. */
function nutraceutical(): Specimen {
  const k = kit();
  const group = new Group();
  const capsule = k.own(new CapsuleGeometry(0.16, 0.42, 8, 24));
  const disc = k.own(new CylinderGeometry(0.24, 0.24, 0.1, 40));
  const sets = [
    { mesh: new InstancedMesh(capsule, k.paint(new MeshPhysicalMaterial({ color: '#d2401c', roughness: 0.12, clearcoat: 1, transparent: true, opacity: 0.86, emissive: new Color('#5a0e00'), emissiveIntensity: 0.25 })), 7), base: 0 },
    { mesh: new InstancedMesh(capsule, k.paint(new MeshPhysicalMaterial({ color: '#e7a92a', roughness: 0.12, clearcoat: 1, transparent: true, opacity: 0.88 })), 4), base: 20 },
    { mesh: new InstancedMesh(disc, k.paint(new MeshStandardMaterial({ color: '#2f5a33', roughness: 0.85 })), 6), base: 40 },
  ];
  for (const s of sets) group.add(s.mesh);
  return {
    group,
    update(t) {
      for (const { mesh, base } of sets) {
        for (let i = 0; i < mesh.count; i++) {
          const s = base + i * 1.9;
          const a = s * 2.4;
          const r = 0.45 + (s % 3) * 0.28;
          k.o.position.set(Math.cos(a + t * 0.12) * r, Math.sin(s * 3.1) * 0.7 + Math.sin(t * 0.6 + s) * 0.08, Math.sin(a + t * 0.12) * r * 0.6);
          k.o.rotation.set(t * 0.3 + s, t * 0.2 + s * 2, s);
          k.o.updateMatrix();
          mesh.setMatrixAt(i, k.o.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
      }
    },
    develop: k.develop,
    dispose: k.dispose,
  };
}

/** Wastewater: a beaker where green alginate beads of algae settle through the water and lift again. */
function wastewater(): Specimen {
  const k = kit();
  const group = new Group();
  const profile = [[0, 0], [0.72, 0], [0.75, 0.04], [0.75, 1.5], [0.8, 1.56]].map(([x, y]) => new Vector2(x, y));
  const water = k.paint(new MeshPhysicalMaterial({ color: '#bfe0e6', roughness: 0.05, transparent: true, opacity: 0.35, clearcoat: 1, depthWrite: false }));
  const ink = k.paint(new MeshStandardMaterial({ color: '#9aa2a6', roughness: 0.6 }));
  const N = 60;
  const beads = new InstancedMesh(k.own(new IcosahedronGeometry(1, 2)), k.paint(new MeshPhysicalMaterial({ color: '#3d8a32', roughness: 0.3, clearcoat: 0.8 })), N);
  group.add(beads, k.mesh(new CylinderGeometry(0.71, 0.71, 1.2, 56), water, 0, 0.62), k.mesh(new LatheGeometry(profile, 56), k.own(glass())));
  // Graduation rings on the glass.
  for (const y of [0.4, 0.8, 1.2]) group.add(k.mesh(new TorusGeometry(0.752, 0.008, 6, 64), ink, 0, y, 0, Math.PI / 2));
  group.position.y = -0.8;
  return {
    group,
    update(t) {
      group.rotation.y = t * 0.1;
      for (let i = 0; i < N; i++) {
        const a = i * 2.39996;
        const r = 0.12 + ((i * 17) % 11) / 20;
        const cycle = (t * 0.07 + (i % 13) / 13) % 1;
        // Most of a bead's life is spent settling; then a gentle current lifts it.
        const y = cycle < 0.8 ? 1.15 - (cycle / 0.8) * 1.05 : 0.1 + ((cycle - 0.8) / 0.2) * 1.05;
        k.o.position.set(Math.cos(a + t * 0.15) * r, y, Math.sin(a + t * 0.15) * r);
        k.o.scale.setScalar(0.045 + (i % 5) * 0.006);
        k.o.updateMatrix();
        beads.setMatrixAt(i, k.o.matrix);
      }
      beads.instanceMatrix.needsUpdate = true;
    },
    develop: k.develop,
    dispose: k.dispose,
  };
}

/** One builder per focus area, keyed by its id. */
export const SPECIMENS: Record<string, () => Specimen> = { biofuel, carbon, nutraceutical, wastewater };
