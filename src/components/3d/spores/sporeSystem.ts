import * as THREE from 'three';
import System, {
  Alpha, Body, Emitter, Force, Life, Mass, RadialVelocity, Radius, RandomDrift, Rate, Scale, Span, SpriteRenderer, Vector3D,
} from 'three-nebula';

/** A soft round glow, drawn once and shared by every spore sprite. */
function glowTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.18, 'rgba(255,255,255,0.75)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.14)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(canvas);
}

function sporeSprite(map: THREE.Texture, color: string): THREE.Sprite {
  return new THREE.Sprite(
    new THREE.SpriteMaterial({ map, color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
}

/** Nebula measures velocity and force in hundredths of a world unit. */
function sporeEmitter(bodies: THREE.Sprite[], speed: Span, life: [number, number], size: [number, number]): Emitter {
  const emitter = new Emitter();
  emitter
    .setRate(new Rate(0, 3600))
    .addInitializers([
      new Mass(1),
      new Life(life[0], life[1]),
      new Body(bodies),
      new Radius(size[0], size[1]),
      new RadialVelocity(speed, new Vector3D(0, 1, 0), 180),
    ])
    .addBehaviours([new Alpha(0.95, 0), new Scale(1, 0.25), new RandomDrift(0.012, 0.012, 0.012, 0.05), new Force(0, 0.004, 0)])
    .emit();
  return emitter;
}

export interface SporeSystem {
  system: System;
  /** Spores shed along the pointer's path. */
  trail: Emitter;
  /** Spores thrown out by a click. */
  burst: Emitter;
  dispose: () => void;
}

export function createSporeSystem(container: THREE.Object3D): SporeSystem {
  const map = glowTexture();
  const bodies = [sporeSprite(map, '#6fe3a0'), sporeSprite(map, '#c9ffe0'), sporeSprite(map, '#6fe3a0'), sporeSprite(map, '#ff7a4d')];
  const trail = sporeEmitter(bodies, new Span(0.002, 0.008), [0.9, 2.2], [0.1, 0.34]);
  const burst = sporeEmitter(bodies, new Span(0.012, 0.045), [0.8, 1.8], [0.12, 0.42]);
  const system = new System();
  system.addEmitter(trail).addEmitter(burst).addRenderer(new SpriteRenderer(container, THREE));
  return {
    system,
    trail,
    burst,
    dispose: () => {
      system.destroy();
      container.clear();
      map.dispose();
      bodies.forEach((b) => b.material.dispose());
    },
  };
}
