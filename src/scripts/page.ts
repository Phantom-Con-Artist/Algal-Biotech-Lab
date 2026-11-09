/* ==========================================================================
   Page behaviours. Opt-in through data attributes and scoped to one Barba
   container, so a page can be mounted and fully torn down.
     data-lines     headings rise line by line out of masks
     data-reveal    supporting copy fades up
     data-stagger   children fade up in sequence
     data-clip      a photograph opens from a rounded inset
     data-parallax  a photograph drifts slightly inside its frame
     data-band      the black band opens from inside out, and folds back
     data-flow      a process flowchart draws itself (see flow.ts)
     data-tabs      programme tabs on the home page
   ========================================================================== */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { playFlow, mountTabs } from './flow';
import { mountPubs } from './pubs';
import { mountHome } from './home';

gsap.registerPlugin(ScrollTrigger, SplitText);

const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode) => [...root.querySelectorAll<T>(sel)];

export interface MountOptions { introDelay?: number }

export function mountPage(root: HTMLElement, opts: MountOptions = {}): () => void {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const introDelay = opts.introDelay ?? 0.1;
  const cleanups: Array<() => void> = [];

  $$('[data-tabs]', root).forEach((el) => cleanups.push(mountTabs(el, reduce)));
  if (root.dataset.barbaNamespace === 'home') cleanups.push(mountHome(root));
  $$('[data-pubs]', root).forEach((el) => cleanups.push(mountPubs(el)));
  cleanups.push(mountCopy(root));

  const mm = gsap.matchMedia();
  const ctx = gsap.context(() => {
    const once = (trigger: Element, start = 'top 88%') => ({ trigger, start, once: true });
    const isIntro = (el: Element) => !!el.closest('[data-intro]');

    /* ---------- Flowcharts (also under reduced motion: they settle instantly) ---------- */
    $$('[data-flow]', root).forEach((fig) => {
      if (fig.closest('[hidden]')) return; // tab panels play when shown
      if (reduce) { playFlow(fig, true); return; }
      ScrollTrigger.create({ ...once(fig, 'top 82%'), onEnter: () => playFlow(fig, false) });
    });

    /* ---------- Process clips: play only while visible ---------- */
    const videos = $$<HTMLVideoElement>('[data-clip-video]', root);
    if (reduce) {
      videos.forEach((v) => { v.removeAttribute('autoplay'); v.pause(); v.controls = true; v.loop = false; });
    } else if (videos.length) {
      const io = new IntersectionObserver((entries) => entries.forEach((e) => {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting && !v.closest('[hidden]')) { v.preload = 'auto'; v.play().catch(() => {}); }
        else v.pause();
      }), { threshold: 0.35 });
      videos.forEach((v) => io.observe(v));
      cleanups.push(() => { io.disconnect(); videos.forEach((v) => v.pause()); });
    }

    /* ---------- Publication bars grow from the baseline ---------- */
    $$('[data-bars]', root).forEach((fig) => {
      const bars = fig.querySelectorAll('.pstats__bar i');
      if (reduce) { gsap.set(bars, { scaleY: 1 }); return; }
      gsap.fromTo(bars, { scaleY: 0 }, { scaleY: 1, duration: 1, ease: 'expo.out', stagger: 0.05, scrollTrigger: once(fig, 'top 85%') });
    });

    if (reduce) return;

    /* ---------- Headings: lines rise out of their masks ---------- */
    $$('[data-lines]', root).forEach((el) => {
      const intro = isIntro(el);
      const delay = Number(el.dataset.delay ?? 0) + (intro ? introDelay : 0);
      SplitText.create(el, {
        type: 'lines', mask: 'lines', linesClass: 'line', autoSplit: true,
        onSplit(self) {
          gsap.set(el, { visibility: 'visible' });
          return gsap.from(self.lines, {
            yPercent: 110, duration: 1.1, stagger: 0.08, ease: 'expo.out', delay,
            scrollTrigger: intro ? undefined : once(el),
          });
        },
      });
    });

    /* ---------- Supporting copy ---------- */
    $$('[data-reveal]', root).forEach((el) => {
      const intro = isIntro(el);
      gsap.fromTo(el, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'expo.out',
        delay: Number(el.dataset.delay ?? 0) + (intro ? introDelay + 0.2 : 0),
        scrollTrigger: intro ? undefined : once(el, 'top 92%'),
      });
    });
    $$('[data-stagger]', root).forEach((el) => {
      gsap.fromTo(el.children, { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06,
        delay: isIntro(el) ? introDelay + 0.3 : 0,
        scrollTrigger: isIntro(el) ? undefined : once(el, 'top 90%'),
      });
    });

    /* ---------- Photographs ---------- */
    $$('[data-clip]', root).forEach((el) => {
      gsap.fromTo(el, { clipPath: 'inset(8% 6% 8% 6% round 32px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.3, ease: 'expo.out', clearProps: 'clipPath',
        scrollTrigger: once(el, 'top 88%'),
      });
    });
    $$('[data-parallax]', root).forEach((el) => {
      const img = el.querySelector('img');
      if (!img) return;
      gsap.fromTo(img, { yPercent: -5, scale: 1.1 }, {
        yPercent: 5, scale: 1.1, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    /* ---------- Hero settles back as the page moves on ---------- */
    $$('[data-hero]', root).forEach((hero) => {
      const inner = hero.querySelector('[data-hero-inner]');
      if (!inner) return;
      gsap.to(inner, {
        yPercent: -6, opacity: 0.25, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      });
    });

    /* ---------- Footer wordmark rises ---------- */
    $$('[data-word]', root).forEach((el) => {
      gsap.fromTo(el.children, { yPercent: 105 }, {
        yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.06, scrollTrigger: once(el, 'top 96%'),
      });
    });

    /* ---------- Magnetic primary buttons ---------- */
    if (fine) {
      $$('[data-magnetic]', root).forEach((b) => {
        const mx = gsap.quickTo(b, 'x', { duration: 0.5, ease: 'power3.out' });
        const my = gsap.quickTo(b, 'y', { duration: 0.5, ease: 'power3.out' });
        const move = (e: PointerEvent) => {
          const r = b.getBoundingClientRect();
          mx((e.clientX - (r.left + r.width / 2)) * 0.12);
          my((e.clientY - (r.top + r.height / 2)) * 0.24);
        };
        const leave = () => { mx(0); my(0); };
        b.addEventListener('pointermove', move);
        b.addEventListener('pointerleave', leave);
        cleanups.push(() => { b.removeEventListener('pointermove', move); b.removeEventListener('pointerleave', leave); });
      });
    }
  }, root);

  /* ---------- Black band opens from inside out (scrubbed, never pinned) ---------- */
  if (!reduce) {
    mm.add({ desk: '(min-width: 768px)', mob: '(max-width: 767px)' }, (c) => {
      const rest = c.conditions?.desk ? 'inset(0% 3% 0% 3% round 48px)' : 'inset(0% 3% 0% 3% round 32px)';
      const full = 'inset(0% 0% 0% 0% round 0px)';
      $$('[data-band]', root).forEach((band) => {
        const bg = band.querySelector('.band__bg');
        if (!bg) return;
        gsap.fromTo(bg, { clipPath: rest }, {
          clipPath: full, ease: 'none',
          scrollTrigger: { trigger: band, start: 'top 85%', end: 'top 30%', scrub: true },
        });
        gsap.fromTo(bg, { clipPath: full }, {
          clipPath: rest, ease: 'none', immediateRender: false,
          scrollTrigger: { trigger: band, start: 'bottom 70%', end: 'bottom 15%', scrub: true },
        });
      });
    });
  }

  return () => {
    cleanups.forEach((fn) => fn());
    mm.revert();
    ctx.revert();
  };
}

/* ---------- Copy a citation ---------- */
function mountCopy(root: HTMLElement): () => void {
  const live = document.getElementById('announcer');
  const onClick = async (e: Event) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-copy]');
    if (!btn) return;
    const text = btn.dataset.copy ?? '';
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    const label = btn.querySelector('[data-copy-label]');
    const original = label?.textContent ?? '';
    btn.classList.add('is-copied');
    if (label) label.textContent = 'Copied';
    if (live) live.textContent = 'Citation copied';
    window.setTimeout(() => { btn.classList.remove('is-copied'); if (label) label.textContent = original; }, 2000);
  };
  root.addEventListener('click', onClick);
  return () => root.removeEventListener('click', onClick);
}
