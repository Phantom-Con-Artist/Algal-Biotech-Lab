/** The part of three-nebula (which ships no typings) that the scene uses. */
declare module 'three-nebula' {
  import type * as THREE from 'three';

  export class Span {
    constructor(a: number, b?: number, center?: boolean);
  }
  export class Vector3D {
    constructor(x?: number, y?: number, z?: number);
  }

  export class Initializer {}
  export class Rate extends Initializer {
    constructor(numPan: Span | number, timePan: Span | number);
  }
  export class Mass extends Initializer {
    constructor(min: number, max?: number);
  }
  export class Life extends Initializer {
    constructor(min: number, max?: number);
  }
  export class Radius extends Initializer {
    constructor(width: number, height?: number);
  }
  export class Body extends Initializer {
    constructor(body: THREE.Object3D | THREE.Object3D[]);
  }
  export class RadialVelocity extends Initializer {
    constructor(radius: Span | number, direction: Vector3D, theta: number);
  }

  export class Behaviour {}
  export class Alpha extends Behaviour {
    constructor(alphaA: number, alphaB?: number);
  }
  export class Scale extends Behaviour {
    constructor(scaleA: number, scaleB?: number);
  }
  export class Force extends Behaviour {
    constructor(fx: number, fy: number, fz: number);
  }
  export class RandomDrift extends Behaviour {
    constructor(driftX: number, driftY: number, driftZ: number, delay?: number);
  }

  export class Emitter {
    particles: unknown[];
    setRate(rate: Rate): this;
    setPosition(position: { x?: number; y?: number; z?: number }): this;
    addInitializers(initializers: Initializer[]): this;
    addBehaviours(behaviours: Behaviour[]): this;
    emit(totalEmitTimes?: number, life?: number): this;
    createParticle(): unknown;
  }

  export class SpriteRenderer {
    constructor(container: THREE.Object3D, three: typeof THREE);
  }

  export default class System {
    addEmitter(emitter: Emitter): this;
    addRenderer(renderer: SpriteRenderer): this;
    update(delta?: number): Promise<void>;
    destroy(): void;
  }
}
