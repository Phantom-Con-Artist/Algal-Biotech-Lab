/* ==========================================================================
   Publications: search and type filter. Works on the server-rendered list,
   so the full record is readable without JavaScript.
   ========================================================================== */
export function mountPubs(root: HTMLElement): () => void {
  const input = root.querySelector<HTMLInputElement>('[data-q]');
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-type-filter]')];
  const items = [...root.querySelectorAll<HTMLElement>('[data-pub]')];
  const groups = [...root.querySelectorAll<HTMLElement>('[data-year-group]')];
  const count = root.querySelector<HTMLElement>('[data-count-out]');
  const empty = root.querySelector<HTMLElement>('[data-empty]');
  let type = 'all';

  const params = new URLSearchParams(location.search);
  if (input && params.get('q')) input.value = params.get('q')!;
  if (params.get('type')) type = params.get('type')!;

  const apply = () => {
    const q = (input?.value ?? '').trim().toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);
    let shown = 0;
    items.forEach((el) => {
      const okType = type === 'all' || el.dataset.type === type;
      const hay = el.dataset.text ?? '';
      const okText = terms.every((t) => hay.includes(t));
      const on = okType && okText;
      el.hidden = !on;
      if (on) shown++;
    });
    groups.forEach((g) => {
      const any = g.querySelector('[data-pub]:not([hidden])');
      g.hidden = !any;
      const n = g.querySelectorAll('[data-pub]:not([hidden])').length;
      const out = g.querySelector('[data-group-count]');
      if (out) out.textContent = `${n} ${n === 1 ? 'paper' : 'papers'}`;
    });
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.typeFilter === type)));
    if (count) count.textContent = `${shown} of ${items.length} shown`;
    if (empty) empty.hidden = shown > 0;

    const url = new URL(location.href);
    q ? url.searchParams.set('q', q) : url.searchParams.delete('q');
    type !== 'all' ? url.searchParams.set('type', type) : url.searchParams.delete('type');
    history.replaceState(history.state, '', url);
  };

  const onInput = () => apply();
  const onBtn = (e: Event) => {
    type = (e.currentTarget as HTMLButtonElement).dataset.typeFilter ?? 'all';
    apply();
  };
  input?.addEventListener('input', onInput);
  buttons.forEach((b) => b.addEventListener('click', onBtn));
  apply();

  return () => {
    input?.removeEventListener('input', onInput);
    buttons.forEach((b) => b.removeEventListener('click', onBtn));
  };
}
