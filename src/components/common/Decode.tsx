'use client';

import { useEffect, useRef } from 'react';

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const DIGIT = '0123456789';

/** A random glyph of the same kind, so the line keeps roughly its width while it decodes. */
function noise(ch: string) {
  const set = /[A-Z]/.test(ch) ? UPPER : /[a-z]/.test(ch) ? LOWER : /[0-9]/.test(ch) ? DIGIT : '';
  return set ? set[(Math.random() * set.length) | 0] : ch;
}

/**
 * Text that decodes into place the first time it is seen, left to right, like a readout settling.
 * The real text is in the page from the start for readers and search; reduced motion shows it as is.
 */
export function Decode({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let start = 0;
    const chars = [...text];
    // Settles quickly, however long the line: a readout locking on, not a show.
    const duration = Math.min(650, 280 + chars.length * 10);
    const run = (now: number) => {
      start ||= now;
      const t = (now - start) / duration;
      el.textContent = chars.map((ch, i) => (t > 0.2 + (i / chars.length) * 0.8 ? ch : noise(ch))).join('');
      if (t < 1) raf = requestAnimationFrame(run);
      else el.textContent = text;
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        raf = requestAnimationFrame(run);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = text;
    };
  }, [text]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true" className={className}>
        {text}
      </span>
    </>
  );
}
