import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { CellField } from './CellField';
import { BloomField } from './bloom/BloomField';
import { StarField } from './stars/StarField';
import { SporeField } from './spores/SporeField';
import { attachPointer } from './pointer';

function particleCount(narrow: boolean): number {
  if (narrow) return 10000;
  const cores = navigator.hardwareConcurrency ?? 8;
  return cores <= 4 ? 14000 : 26000;
}

export default function SceneCanvas() {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const narrow = useMediaQuery('(max-width: 767px)');

  useEffect(() => (reduced ? undefined : attachPointer()), [reduced]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        frameloop={reduced ? 'demand' : 'always'}
        camera={{ position: [0, 0, 11], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        flat
      >
        <StarField count={narrow ? 5000 : 12000} reduced={reduced} />
        <CellField count={particleCount(narrow)} reduced={reduced} />
        <BloomField count={narrow ? 4500 : 10000} reduced={reduced} />
        {!reduced && <SporeField limit={narrow ? 60 : 160} />}
      </Canvas>
    </div>
  );
}
