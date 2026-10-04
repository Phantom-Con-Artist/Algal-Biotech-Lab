import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { pointer } from '../pointer';
import { createSporeSystem, type SporeSystem } from './sporeSystem';

interface Props {
  /** Most spores alive at once; each one is its own sprite. */
  limit: number;
}

/**
 * Spores shed by the pointer (three-nebula): a drifting trail as it moves and a
 * burst when it clicks. Not mounted when reduced motion is requested.
 */
export default function SporeField({ limit }: Props) {
  const group = useRef<THREE.Group>(null!);
  const spores = useRef<SporeSystem | null>(null);
  const seenPulses = useRef(pointer.pulses);
  const owed = useRef(0);
  const viewport = useThree((s) => s.viewport);

  useEffect(() => {
    const created = createSporeSystem(group.current);
    spores.current = created;
    return () => {
      spores.current = null;
      created.dispose();
    };
  }, []);

  useFrame((_, delta) => {
    const s = spores.current;
    if (!s) return;
    const alive = s.trail.particles.length + s.burst.particles.length;
    // Spores sit 1.5 units in front of the shape, where the view is that much narrower.
    const near = (11 - 1.5) / 11;
    const at = (x: number, y: number) => ({ x: (x * viewport.width * near) / 2, y: (y * viewport.height * near) / 2, z: 1.5 });

    owed.current = Math.min(6, owed.current + pointer.travel * 26);
    pointer.travel = 0;
    s.trail.setPosition(at(pointer.x, pointer.y));
    while (owed.current >= 1 && alive + 1 < limit) {
      s.trail.createParticle();
      owed.current -= 1;
    }

    if (seenPulses.current !== pointer.pulses) {
      seenPulses.current = pointer.pulses;
      s.burst.setPosition(at(pointer.pulseX, pointer.pulseY));
      for (let i = 0; i < Math.min(36, limit - alive); i++) s.burst.createParticle();
    }
    void s.system.update(Math.min(delta, 0.05));
  });

  return <group ref={group} />;
}
