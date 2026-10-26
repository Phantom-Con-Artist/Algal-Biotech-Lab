import { Box3, Sphere, Vector3, type Object3D } from 'three';

/**
 * Solid bodies for the loose structures. Each one is a sphere fitted to its mesh; every frame a few
 * relaxation passes push overlapping spheres apart, so droplets, vacuoles and plates rest against one
 * another instead of passing through. Positions are recomputed from rest each frame, so the result is
 * deterministic and never jitters.
 */

interface Body {
  object: Object3D;
  /** Centre of the sphere relative to the node's origin. */
  offset: Vector3;
  radius: number;
  /** 0 for immovable solids (the pyrenoid matrix, the nucleus), 1 for everything that can be pushed. */
  invMass: number;
}

/** Node-name prefixes that collide, and how tightly the sphere hugs the mesh (elongated shapes get less). */
const SOLIDS: [prefix: string, fit: number, invMass: number][] = [
  ['LipidDroplet_', 1, 1],
  ['Acidocalcisome_', 1, 1],
  ['ContractileVacuole_', 1, 1],
  ['StarchPlate_', 0.62, 1],
  ['Mitochondrion_', 0.55, 1],
  ['Golgi_', 0.6, 1],
  ['Eyespot', 0.8, 1],
  ['PyrenoidMatrix', 1.05, 0],
  ['Nucleolus', 1, 0],
];

export function createCollisions(objects: Object3D[], nucleus: { centre: Vector3; radius: number }) {
  const bodies: Body[] = [];
  const box = new Box3();
  const sphere = new Sphere();
  for (const object of objects) {
    const solid = SOLIDS.find(([prefix]) => object.name.startsWith(prefix));
    if (!solid) continue;
    box.setFromObject(object).getBoundingSphere(sphere);
    bodies.push({ object, offset: sphere.center.clone().sub(object.position), radius: sphere.radius * solid[1], invMass: solid[2] });
  }

  const a = new Vector3();
  const b = new Vector3();
  const push = new Vector3();

  return {
    /** Separates overlapping bodies. `nucleusOpen` lets contents near the nucleus pass once its envelope is gone. */
    resolve(iterations = 3) {
      for (let it = 0; it < iterations; it++) {
        for (let i = 0; i < bodies.length; i++) {
          const p = bodies[i];
          a.copy(p.object.position).add(p.offset);
          // The nucleus is a solid sphere the loose contents rest against.
          if (p.invMass) {
            push.copy(a).sub(nucleus.centre);
            const d = push.length();
            const min = nucleus.radius + p.radius;
            if (d < min && d > 1e-4) p.object.position.addScaledVector(push, (min - d) / d);
          }
          for (let j = i + 1; j < bodies.length; j++) {
            const q = bodies[j];
            const total = p.invMass + q.invMass;
            if (!total) continue;
            a.copy(p.object.position).add(p.offset);
            b.copy(q.object.position).add(q.offset);
            push.copy(b).sub(a);
            const d = push.length();
            const min = p.radius + q.radius;
            if (d >= min || d < 1e-4) continue;
            push.multiplyScalar((min - d) / d / total);
            p.object.position.addScaledVector(push, -p.invMass);
            q.object.position.addScaledVector(push, q.invMass);
          }
        }
      }
    },
  };
}
