/**
 * Shared, non-React state that drives the persistent 3D scene.
 * `target` is the (fractional) morph stage; `dim` is overall particle opacity;
 * `side` (-1..1) overrides the per-stage horizontal placement when not null.
 */
type Listener = () => void;

export const sceneState = {
  target: 0,
  dim: 1,
  side: null as number | null,
  /** 0..1 visibility of the algae-bloom growth scene (replaces the morph field). */
  bloom: 0,
  /** 0..1 growth progress of the bloom colonies. */
  growth: 0,
  /** Continuous palette position: 0 biofuel, 1 carbon, 2 nutraceutical, 3 wastewater. */
  hue: 0,
};

/** Where the foreground shape currently sits on screen (NDC), written by the scene every frame. */
export const sceneFocus = { x: 0, y: 0, strength: 1 };

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
