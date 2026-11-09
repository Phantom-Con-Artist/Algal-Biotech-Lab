/* ==========================================================================
   Flowcharts: steps appear in order, each arrow draws toward the next step,
   then a short highlight keeps travelling along the arrows to show direction.
   ========================================================================== */
import gsap from 'gsap';

export function playFlow(fig: HTMLElement, reduce: boolean) {
  const nodes = [...fig.querySelectorAll<HTMLElement>('.flow__node')];
  const links = [...fig.querySelectorAll<HTMLElement>('.flow__link')];
  fig.classList.remove('is-flowing');
  gsap.killTweensOf([...nodes, ...links]);

  if (reduce) {
    gsap.set(nodes, { opacity: 1, y: 0 });
    gsap.set(links, { clearProps: 'transform' });
    return;
  }

  const tl = gsap.timeline({ onComplete: () => fig.classList.add('is-flowing') });
  nodes.forEach((node, i) => {
    tl.fromTo(node, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, i * 0.16);
    const link = links[i];
    if (link) {
      const horizontal = link.offsetWidth > link.offsetHeight;
      tl.fromTo(link, horizontal ? { scaleX: 0, scaleY: 1 } : { scaleY: 0, scaleX: 1 },
        { scaleX: 1, scaleY: 1, duration: 0.5, ease: 'power2.inOut' }, i * 0.16 + 0.22);
    }
  });
  return tl;
}

/** Tabs (home): one programme visible at a time, its flow replays when shown. */
export function mountTabs(root: HTMLElement, reduce: boolean): () => void {
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')!)!);
  let current = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');

  const select = (i: number, focus = false) => {
    if (i === current) return;
    current = i;
    tabs.forEach((t, j) => {
      const on = j === i;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      panels[j].hidden = !on;
    });
    if (focus) tabs[i].focus();
    const panel = panels[i];
    if (!reduce) gsap.fromTo(panel.querySelector('.tabpanel__text'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' });
    const fig = panel.querySelector<HTMLElement>('[data-flow]');
    if (fig) playFlow(fig, reduce);
    // the hidden programme's clip stops; the shown one starts from its first frame
    panels.forEach((p, j) => {
      const v = p.querySelector<HTMLVideoElement>('video');
      if (!v) return;
      if (j === i && !reduce) { v.preload = 'auto'; v.currentTime = 0; v.play().catch(() => {}); }
      else v.pause();
    });
  };

  const onClick = (e: Event) => select(tabs.indexOf(e.currentTarget as HTMLButtonElement));
  const onKey = (e: KeyboardEvent) => {
    const i = tabs.indexOf(e.currentTarget as HTMLButtonElement);
    const map: Record<string, number> = {
      ArrowRight: (i + 1) % tabs.length, ArrowDown: (i + 1) % tabs.length,
      ArrowLeft: (i - 1 + tabs.length) % tabs.length, ArrowUp: (i - 1 + tabs.length) % tabs.length,
      Home: 0, End: tabs.length - 1,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    select(map[e.key], true);
  };
  tabs.forEach((t) => { t.addEventListener('click', onClick); t.addEventListener('keydown', onKey); });
  return () => tabs.forEach((t) => { t.removeEventListener('click', onClick); t.removeEventListener('keydown', onKey); });
}
