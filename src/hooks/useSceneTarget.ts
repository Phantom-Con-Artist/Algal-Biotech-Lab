import { useEffect } from 'react';
import { setScene } from '../components/3d/sceneState';

/** Pins the background scene to a stage on the right (for pages that are not scroll-driven). */
export function useSceneTarget(stage: number, dim: number): void {
  useEffect(() => {
    setScene({ target: stage, dim, side: 1 });
  }, [stage, dim]);
}
