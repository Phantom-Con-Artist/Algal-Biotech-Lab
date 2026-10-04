import { Canvas } from '@react-three/fiber';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { CellField } from './CellField';

function particleCount(narrow: boolean): number {
  if (narrow) return 7000;
  const cores = navigator.hardwareConcurrency ?? 8;
  return cores <= 4 ? 10000 : 16000;
}

export default function SceneCanvas() {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const narrow = useMediaQuery('(max-width: 767px)');

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        frameloop={reduced ? 'demand' : 'always'}
        camera={{ position: [0, 0, 11], fov: 45 }}
        dpr={narrow ? [1, 1.5] : [1, 2]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        flat
      >
        <CellField count={particleCount(narrow)} reduced={reduced} />
      </Canvas>
    </div>
  );
}
