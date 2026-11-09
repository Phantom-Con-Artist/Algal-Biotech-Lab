/* ==========================================================================
   Home motion, after studiokalex:
   - the photo strip drifts on its own and runs faster while the page scrolls
   - the pinned statement recedes (scale, blur, fade) as cards pass over it
   - a window opens from the centre onto the laboratory while two words part
   ========================================================================== */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function mountHome(root: HTMLElement): () => void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  const cleanups: Array<() => void> = [];

  root.querySelectorAll<HTMLElement>('[data-carousel]').forEach((el) => cleanups.push(mountCarousel(el)));

  root.querySelectorAll<HTMLVideoElement>('[data-lab-film]').forEach((v) => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { v.preload = 'auto'; v.play().catch(() => {}); } else v.pause();
    }, { threshold: 0.1 });
    io.observe(v);
    cleanups.push(() => { io.disconnect(); v.pause(); });
  });

  const ctx = gsap.context(() => {
    root.querySelectorAll<HTMLElement>('[data-statement]').forEach((sec) => {
      const sticky = sec.querySelector('[data-statement-sticky]');
      const grid = sec.querySelector('[data-statement-grid]');
      if (!sticky || !grid) return;
      gsap.fromTo(sticky, { scale: 1, opacity: 1, filter: 'blur(0px)' }, {
        scale: 0.92, opacity: 0.08, filter: 'blur(8px)', ease: 'none',
        scrollTrigger: { trigger: grid, start: 'top 75%', end: 'top 15%', scrub: true },
      });
    });

    /* "Inside [pill] the laboratory": the pill grows into a rounded card while the words part and pale */
    root.querySelectorAll<HTMLElement>('[data-intro-window]').forEach((sec) => {
      const stage = sec.querySelector<HTMLElement>('.k-intro__stage');
      const media = sec.querySelector<HTMLElement>('.k-intro__media');
      const img = media?.querySelector('img, video');
      const left = sec.querySelector('.k-intro__word--l');
      const right = sec.querySelector('.k-intro__word--r');
      const cap = sec.querySelector('.k-intro__cap');
      if (!stage || !media || !left || !right) return;
      /* Clip-path strings are normalised by the browser ("inset(a b a b)" reads back as
         "inset(a b)"), which breaks string tweening. Tween one number, 0 -> 1, and
         derive the inset from the live size of the media box. */
      const state = { p: 0 };
      const draw = () => {
        const mobile = innerWidth < 768;
        const pw = mobile ? 72 : 200, ph = mobile ? 36 : 90;
        const W = media.offsetWidth, H = media.offsetHeight;
        const p = state.p;
        const ix = ((W - pw) / 2) * (1 - p);
        const iy = ((H - ph) / 2) * (1 - p);
        const r = ph / 2 + ((mobile ? 20 : 24) - ph / 2) * p;
        // centre the whole phrase, not just the pill: the two words differ in length.
        // The offset fades out as the pill grows, so the finished card is centred.
        const shift = (((right as HTMLElement).offsetWidth - (left as HTMLElement).offsetWidth) / 2) * (1 - p);
        media.style.clipPath = `inset(${iy}px ${ix + shift}px ${iy}px ${ix - shift}px round ${r}px)`;
        const travel = (W / 2 - pw / 2) * p;
        gsap.set(left, { x: -travel - shift });
        gsap.set(right, { x: travel - shift });
      };
      draw();
      gsap.timeline({
        scrollTrigger: { trigger: stage, start: 'center center', end: '+=120%', scrub: 0.6, pin: true, invalidateOnRefresh: true, onRefresh: draw },
      })
        .to(state, { p: 1, ease: 'power2.inOut', duration: 1, onUpdate: draw }, 0)
        .fromTo(img, { scale: 1.25 }, { scale: 1, ease: 'power2.inOut', duration: 1 }, 0)
        .to([left, right], { color: '#cfcfcf', ease: 'none', duration: 0.6 }, 0.2)
        .fromTo(cap, { opacity: 0, y: 24 }, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.25 }, 0.8);
    });
  }, root);

  return () => { cleanups.forEach((f) => f()); ctx.revert(); };
}

/* ==========================================================================
   Hero carousel (after studiokalex): edge-to-edge 3:4 clip cards.
   Steps one card every 3 s with a 0.7 s expo ease, loops seamlessly over a
   duplicated set, drags with mouse or touch, has previous/next buttons, and
   plays only the clips that are on screen.
   ========================================================================== */
function mountCarousel(el: HTMLElement): () => void {
  const track = el.querySelector<HTMLElement>('[data-carousel-track]')!;
  const cards = [...track.children] as HTMLElement[];
  const loop = el.dataset.carouselLoop !== 'false';
  const auto = el.dataset.carouselAuto !== 'false';
  const n = loop ? cards.length / 2 : cards.length;
  const maxIndex = n - 1;
  let suppressClick = false;
  const videos = cards.map((c) => c.querySelector<HTMLVideoElement>('video'));
  let index = 0;
  let step = 0;
  let timer = 0;
  let hovering = false;
  let visible = true;
  let drag: { x0: number; base: number; moved: boolean } | null = null;

  const measure = () => {
    const a = cards[0].getBoundingClientRect();
    const b = cards[1].getBoundingClientRect();
    step = b.left - a.left;
  };
  const place = (animate: boolean) => {
    if (!loop) index = Math.max(0, Math.min(maxIndex, index));
    gsap.to(track, { x: -index * step, duration: animate ? 0.7 : 0, ease: 'expo.out', overwrite: true,
      onComplete: () => {
        // wrap silently once we are into the duplicate set
        if (!loop) return;
        if (index >= n) { index -= n; gsap.set(track, { x: -index * step }); }
        if (index < 0) { index += n; gsap.set(track, { x: -index * step }); }
      } });
  };
  const go = (d: number) => {
    if (loop && index + d < 0) { index += n; gsap.set(track, { x: -index * step }); }
    index += d;
    place(true);
  };
  const schedule = () => {
    window.clearInterval(timer);
    if (!auto) return;
    timer = window.setInterval(() => { if (!hovering && visible && !drag && !document.hidden) go(1); }, 3000);
  };

  // play only what is on screen
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    const v = (e.target as HTMLElement).querySelector('video');
    if (!v) return;
    if (e.isIntersecting) { v.preload = 'auto'; v.play().catch(() => {}); } else v.pause();
  }), { root: null, threshold: 0.2 });
  cards.forEach((c) => io.observe(c));
  const seen = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  seen.observe(el);

  // drag
  const down = (e: PointerEvent) => {
    if (e.button !== 0) return;
    drag = { x0: e.clientX, base: Number(gsap.getProperty(track, 'x')), moved: false };
    gsap.killTweensOf(track);
  };
  const move = (e: PointerEvent) => {
    if (!drag) return;
    const dx = e.clientX - drag.x0;
    if (!drag.moved && Math.abs(dx) > 4) {
      // capture only once it is a real drag, so a plain click still reaches links
      drag.moved = true;
      track.classList.add('is-dragging');
      track.setPointerCapture(e.pointerId);
    }
    if (!drag.moved) return;
    gsap.set(track, { x: drag.base + dx });
  };
  const up = () => {
    if (!drag) return;
    const x = Number(gsap.getProperty(track, 'x'));
    index = Math.round(-x / step);
    suppressClick = drag.moved;
    drag = null;
    track.classList.remove('is-dragging');
    place(true);
    schedule();
  };
  track.addEventListener('pointerdown', down);
  track.addEventListener('pointermove', move);
  track.addEventListener('pointerup', up);
  window.addEventListener('pointerup', up);
  track.addEventListener('pointercancel', up);
  track.addEventListener('lostpointercapture', up);
  track.addEventListener('dragstart', (e) => e.preventDefault());
  // a drag that ends over a link must not follow it
  track.addEventListener('click', (e) => {
    if (suppressClick) { e.preventDefault(); e.stopPropagation(); suppressClick = false; }
  }, true);

  const prev = el.querySelector('[data-carousel-prev]');
  const next = el.querySelector('[data-carousel-next]');
  const onPrev = () => { go(-1); schedule(); };
  const onNext = () => { go(1); schedule(); };
  prev?.addEventListener('click', onPrev);
  next?.addEventListener('click', onNext);
  const enter = () => (hovering = true);
  const leave = () => (hovering = false);
  el.addEventListener('pointerenter', enter);
  el.addEventListener('pointerleave', leave);
  const key = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); onNext(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); onPrev(); }
  };
  el.addEventListener('keydown', key);
  const onResize = () => { measure(); place(false); };
  window.addEventListener('resize', onResize);

  measure();
  place(false);
  schedule();
  if (auto) gsap.from(cards.slice(0, 6), { y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.06, delay: 0.5 });

  return () => {
    window.clearInterval(timer);
    io.disconnect(); seen.disconnect();
    videos.forEach((v) => v?.pause());
    window.removeEventListener('resize', onResize);
    window.removeEventListener('pointerup', up);
    prev?.removeEventListener('click', onPrev);
    next?.removeEventListener('click', onNext);
    el.removeEventListener('keydown', key);
    gsap.killTweensOf(track);
  };
}
