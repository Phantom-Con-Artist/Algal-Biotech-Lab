import { lazy, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { CellField } from './CellField';
import { BloomField } from './bloom/BloomField';
import { StarField } from './stars/StarField';
import { Governor } from './Governor';
import { attachPointer } from './pointer';
import { getQuality } from './quality';
import { dismissLoader } from '../../utils/loader';

/** The spore engine (three-nebula) is only downloaded by devices that will run it. */
const SporeField = lazy(() => import('./spores/SporeField'));

export default function SceneCanvas() {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const narrow = useMediaQuery('(max-width: 767px)');
  const quality = getQuality(narrow);

  useEffect(() => (reduced || !quality ? undefined : attachPointer()), [reduced, quality]);

  // Without WebGL there is no scene to wait for.
  useEffect(() => {
    if (!quality) dismissLoader();
  }, [quality]);

  // No WebGL at all: a still, painted sky stands in for the scene.
  if (!quality) return <div aria-hidden="true" className="static-sky pointer-events-none fixed inset-0 z-0" />;

  const capped = reduced || quality.fps !== null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        frameloop={capped ? 'demand' : 'always'}
        camera={{ position: [0, 0, 11], fov: 45 }}
        dpr={[Math.min(1, quality.dpr), quality.dpr]}
        gl={{ antialias: false, alpha: true, powerPreference: quality.tier === 'software' ? 'low-power' : 'high-performance' }}
        flat
      >
        <Governor quality={quality} reduced={reduced} />
        <StarField count={quality.stars} reduced={reduced} />
        <CellField count={narrow ? Math.min(quality.cells, 10000) : quality.cells} reduced={reduced} />
        <BloomField count={quality.bloom} reduced={reduced} glow={quality.halo} />
        {!reduced && quality.spores > 0 && (
          <Suspense fallback={null}>
            <SporeField limit={quality.spores} />
          </Suspense>
        )}
      </Canvas>
    </div>
  );
}
