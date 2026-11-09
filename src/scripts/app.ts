/* ==========================================================================
   App shell: inertia scroll (Lenis), page transitions (Barba), navigation.
   ========================================================================== */
import barba from '@barba/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { mountPage } from './page';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
(window as unknown as { __ablReady: boolean }).__ablReady = true;

/* ---------- Inertia scroll ----------
   lerp mode: every frame the page closes ~9% of the gap to the target, so the
   wheel glides and settles instead of stepping. Touch keeps native momentum. */
let lenis: Lenis | null = null;
if (!reduce) {
  lenis = new Lenis({
    lerp: 0.09,
    wheelMultiplier: 0.9,
    smoothWheel: true,
    syncTouch: false,
    anchors: { offset: -96 },
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis!.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---------- Navigation ---------- */
const nav = document.querySelector<HTMLElement>('[data-nav]')!;
const burger = nav.querySelector<HTMLButtonElement>('[data-burger]')!;
const sheet = document.querySelector<HTMLElement>('[data-sheet]')!;
const progress = document.querySelector<HTMLElement>('[data-progress]');
let darkBands: HTMLElement[] = [];
let lastY = 0;

const setMenu = (open: boolean) => {
  nav.classList.toggle('is-open', open);
  sheet.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.querySelector('[data-burger-label]')!.textContent = open ? 'Close' : 'Menu';
  sheet.toggleAttribute('inert', !open);
  if (open) { lenis?.stop(); nav.classList.remove('is-hidden'); } else lenis?.start();
};
burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); burger.focus(); } });
sheet.toggleAttribute('inert', true);

const onScroll = (y: number) => {
  const open = nav.classList.contains('is-open');
  const mid = 42;
  nav.classList.toggle('is-dark', !open && darkBands.some((b) => { const r = b.getBoundingClientRect(); return r.top <= mid && r.bottom >= mid; }));
  const d = y - lastY;
  if (Math.abs(d) > 4) {
    if (y > 480 && d > 0 && !open) nav.classList.add('is-hidden');
    else if (d < 0 || y <= 480) nav.classList.remove('is-hidden');
    lastY = y;
  }
  if (progress) {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
  }
};
if (lenis) lenis.on('scroll', (l: Lenis) => onScroll(l.scroll));
else addEventListener('scroll', () => onScroll(scrollY), { passive: true });
nav.addEventListener('focusin', () => nav.classList.remove('is-hidden'));

const setActive = () => {
  const path = location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll<HTMLAnchorElement>('a[data-nav-link]').forEach((a) => {
    const href = a.getAttribute('href')!.replace(/\/$/, '') || '/';
    const on = href !== '/' && (path === href || path.startsWith(href + '/'));
    on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
  });
};

/* ---------- Startup film (first visit in a session) ----------
   A loading count while the film buffers, then ~7 s of fast cuts with one
   word per beat, the lab's name over the last long shot, and the frame
   shrinks into the first hero card. Any click, key or wheel skips it. */
const FILM_WORDS: Array<[number, string]> = [
  [0, 'Microalgae'], [0.97, 'Cultures'], [1.73, 'Cells'], [2.4, 'Genes'],
  [3.0, 'Stress'], [3.53, 'Carbon'], [4.2, 'Biofuels'],
];
const FILM_TITLE_AT = 5.07;

function playStartup(screen: HTMLElement, replay = false) {
  lenis?.stop();
  // reset anything a previous run left behind
  screen.classList.remove('is-playing');
  gsap.set(screen, { clearProps: 'opacity,clipPath' });
  screen.style.clipPath = '';
  const film = screen.querySelector<HTMLVideoElement>('[data-startup-film]');
  const word = screen.querySelector<HTMLElement>('[data-startup-word]')!;
  const title = screen.querySelectorAll<HTMLElement>('[data-startup-title] span');
  const count = document.createElement('span'); // the visible counter was removed; kept for timing
  word.textContent = '';
  const n = { v: 0 };
  const counter = gsap.to(n, { v: 90, duration: 2.4, ease: 'power2.out', onUpdate: () => (count.textContent = String(Math.round(n.v))) });
  let done = false;
  let raf = 0;

  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  const skipKeys = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;

  const finish = () => {
    if (done) return;
    done = true;
    cancelAnimationFrame(raf);
    skipKeys.forEach((k) => removeEventListener(k, finish));
    counter.kill();
    // land the film in the first hero card, or lift it away on other pages
    const card = document.querySelector<HTMLElement>('.carousel__card');
    const r = card?.getBoundingClientRect();
    const box = { t: 0, r: 0, b: 0, l: 0, rad: 0 };
    const to = r && r.top < innerHeight && r.bottom > 0
      ? { t: r.top, r: innerWidth - r.right, b: Math.max(0, innerHeight - r.bottom), l: r.left, rad: 24 }
      : { t: innerHeight * 0.5, r: innerWidth * 0.5, b: innerHeight * 0.5, l: innerWidth * 0.5, rad: 24 };
    if (!replay) mount(first, 0.55);
    const clip = () => (screen.style.clipPath = `inset(${box.t}px ${box.r}px ${box.b}px ${box.l}px round ${box.rad}px)`);
    gsap.timeline({
      onComplete: () => {
        root.removeAttribute('data-startup');
        film?.pause();
        screen.classList.remove('is-playing');
        gsap.set(screen.querySelectorAll('[data-startup-word], [data-startup-title] span, .startup__copy, .startup__skip'), { clearProps: 'all' });
        lenis?.start();
        try { sessionStorage.setItem('abl-intro', '1'); } catch {}
      },
    })
      .to([word, ...title, screen.querySelectorAll('.startup__copy, .startup__skip')], { opacity: 0, duration: 0.3 }, 0)
      .to(box, { ...to, duration: 1.1, ease: 'expo.inOut', onUpdate: clip }, 0.05)
      .to(screen, { opacity: 0, duration: 0.35, ease: 'power1.out' }, 0.95);
  };

  const fallback = () => {
    // no film (save-data, slow network or a playback error): finish the count and go
    gsap.to(n, { v: 100, duration: 0.4, onUpdate: () => (count.textContent = String(Math.round(n.v))), onComplete: () => setTimeout(finish, 150) });
  };

  if (!film || saveData) { Promise.all([document.fonts?.ready, new Promise((r) => setTimeout(r, 1200))]).then(fallback); return; }

  const giveUp = setTimeout(() => { if (film.paused) fallback(); }, 3500);
  film.addEventListener('error', () => { clearTimeout(giveUp); fallback(); }, { once: true });
  const start = () => {
    if (done) return;
    clearTimeout(giveUp);
    counter.kill();
    screen.classList.add('is-playing');
    skipKeys.forEach((k) => addEventListener(k, finish, { passive: true }));
    let shown = -1;
    let titled = false;
    const tick = () => {
      const t = film.currentTime;
      let i = -1;
      FILM_WORDS.forEach(([at], k) => { if (t >= at) i = k; });
      if (t >= FILM_TITLE_AT) i = -2;
      if (i !== shown) {
        shown = i;
        word.textContent = i >= 0 ? FILM_WORDS[i][1] : '';
        if (i >= 0) gsap.fromTo(word, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' });
      }
      if (t >= FILM_TITLE_AT && !titled) {
        titled = true;
        gsap.fromTo(title, { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08 });
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
  };
  film.addEventListener('ended', finish, { once: true });
  film.poster = '/clips/cut/intro.webp';
  film.preload = 'auto';
  if (film.readyState === 0) film.load();
  film.currentTime = 0;
  film.play().then(() => {
    // wait for the first frame to paint before showing the film
    if (film.readyState >= 3) start();
    else film.addEventListener('playing', start, { once: true });
  }).catch(fallback);
}

/* ---------- Page lifecycle ---------- */
let unmount: (() => void) | null = null;
const mount = (container: HTMLElement, introDelay?: number) => {
  darkBands = [...container.querySelectorAll<HTMLElement>('[data-theme="dark"]')];
  unmount = mountPage(container, { introDelay });
  setActive();
  requestAnimationFrame(() => { ScrollTrigger.refresh(); onScroll(lenis ? lenis.scroll : scrollY); });
};

const first = document.querySelector<HTMLElement>('[data-barba="container"]')!;
const startup = document.querySelector<HTMLElement>('[data-startup-screen]');
/* "Watch the intro film" in the footer plays it again */
document.addEventListener('click', (e) => {
  const b = (e.target as Element).closest?.('[data-replay-intro]');
  if (!b || !startup || reduce || root.dataset.startup === 'on') return;
  e.stopPropagation();
  root.dataset.startup = 'on';
  // let the click finish before listening for skip input
  setTimeout(() => playStartup(startup, true), 0);
});
if (root.dataset.startup === 'on' && startup) {
  playStartup(startup);
} else {
  mount(first, 0.15);
}
if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());

/* ---------- Page transition (after studiokalex) ----------
   The outgoing page stays where it was and blurs away; the incoming page
   sweeps in on top through a 45° mask while it comes into focus. 1 s. */
const announcer = document.getElementById('announcer');
const MASK = 'linear-gradient(45deg, #000 42%, rgba(0,0,0,0) 58%)';

const updateHead = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  document.title = doc.title;
  for (const sel of ['meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'link[rel="canonical"]']) {
    const next = doc.head.querySelector(sel);
    const cur = document.head.querySelector(sel);
    if (next && cur) cur.replaceWith(next.cloneNode(true));
  }
};

const jumpToHash = (next: HTMLElement) => {
  const target = location.hash ? next.querySelector<HTMLElement>(decodeURIComponent(location.hash)) : null;
  if (!target) return;
  const y = target.getBoundingClientRect().top + scrollY - 96;
  window.scrollTo(0, y);
  lenis?.scrollTo(y, { immediate: true, force: true });
  ScrollTrigger.refresh();
};

if (!reduce) {
  barba.init({
    preventRunning: true,
    timeout: 8000,
    prevent: ({ el, href }) => {
      if (!(el instanceof HTMLAnchorElement)) return true;
      if (el.hasAttribute('data-no-barba') || el.target === '_blank' || el.hasAttribute('download')) return true;
      const url = new URL(href, location.href);
      if (url.origin !== location.origin) return true;
      if (url.pathname === location.pathname && url.hash) return true;
      return false;
    },
    transitions: [
      {
        name: 'sweep',
        sync: true,
        async enter(data) {
          const cur = data.current.container as HTMLElement;
          const next = data.next.container as HTMLElement;
          setMenu(false);
          lenis?.stop();
          updateHead(data.next.html);
          root.classList.add('is-sweeping');

          // hold the outgoing page exactly where it was
          const y = lenis ? lenis.scroll : scrollY;
          unmount?.();
          unmount = null;
          gsap.set(cur, { position: 'fixed', top: -y, left: 0, width: '100%', zIndex: 1, transformOrigin: `50% ${y + innerHeight / 2}px` });

          // the incoming page starts at its top, masked, above the old one
          window.scrollTo(0, 0);
          lenis?.scrollTo(0, { immediate: true, force: true });
          gsap.set(next, {
            position: 'relative', zIndex: 2, background: 'var(--paper)',
            maskImage: MASK, webkitMaskImage: MASK, maskSize: '300% 300%', webkitMaskSize: '300% 300%',
            maskRepeat: 'no-repeat', webkitMaskRepeat: 'no-repeat', maskPosition: '88% 12%', webkitMaskPosition: '88% 12%',
          });
          mount(next, 0.35);
          jumpToHash(next);

          const tl = gsap.timeline();
          tl.to(cur, { filter: 'blur(24px)', scale: 1.06, duration: 1, ease: 'power2.out' }, 0)
            .fromTo(next, { filter: 'blur(24px)', xPercent: -2, yPercent: 2, scale: 1.04 },
              { filter: 'blur(0px)', xPercent: 0, yPercent: 0, scale: 1, duration: 1, ease: 'power2.inOut' }, 0)
            .to(next, { maskPosition: '0% 100%', webkitMaskPosition: '0% 100%', duration: 1, ease: 'sine.inOut' }, 0);
          await tl.then();

          gsap.set(next, { clearProps: 'position,zIndex,background,maskImage,webkitMaskImage,maskSize,webkitMaskSize,maskRepeat,webkitMaskRepeat,maskPosition,webkitMaskPosition,filter,transform' });
          root.classList.remove('is-sweeping');
          lenis?.start();
          ScrollTrigger.refresh();
          const h1 = next.querySelector<HTMLElement>('h1');
          if (h1) { h1.tabIndex = -1; h1.focus({ preventScroll: true }); }
          if (announcer) announcer.textContent = document.title;
        },
      },
    ],
  });

  /* Prefetch on intent, so the next page is usually cached before the click lands */
  const prefetched = new Set<string>();
  const intent = (e: Event) => {
    const a = (e.target as Element).closest?.('a[href]') as HTMLAnchorElement | null;
    if (!a || a.target === '_blank' || a.hasAttribute('data-no-barba')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || prefetched.has(url.pathname)) return;
    prefetched.add(url.pathname);
    barba.prefetch(url.href);
  };
  document.addEventListener('pointerenter', intent, { capture: true, passive: true });
  document.addEventListener('touchstart', intent, { capture: true, passive: true });
  document.addEventListener('focusin', intent);
} else {
  setActive();
}

root.classList.add('is-ready');
