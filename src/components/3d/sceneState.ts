/**
 * Shared, non-React state that drives the persistent 3D scene.
 * `target` is the (fractional) morph stage; `dim` is overall particle opacity;
 * `side` (-1..1) overrides the per-stage horizontal placement when not null.
 */
type Listener = () => void;

export const sceneState = { target: 0, dim: 1, side: null as number | null };

const listeners = new Set<Listener>();

export function setScene(next: Partial<typeof sceneState>): void {
  Object.assign(sceneState, next);
  listeners.forEach((l) => l());
}

export function subscribeScene(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
