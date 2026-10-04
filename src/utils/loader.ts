/** Shortest time the loading screen stays up, so a fast load does not flash it. */
const MIN_VISIBLE_MS = 900;

/** Fades out the loading screen that index.html paints before the app arrives, then removes it. */
export function dismissLoader(): void {
  const loader = document.getElementById('loader');
  if (!loader || loader.dataset.done !== undefined) return;
  const wait = Math.max(0, MIN_VISIBLE_MS - performance.now());
  window.setTimeout(() => {
    loader.dataset.done = '';
    window.setTimeout(() => loader.remove(), 800);
  }, wait);
}
