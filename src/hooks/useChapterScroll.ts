import { useEffect, useState, type MutableRefObject } from 'react';
import { setScene } from '../components/3d/sceneState';

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Maps the viewport centre to a fractional stage between section centres and
 * feeds it to the 3D scene. A plateau around each centre keeps the shape
 * legible while its chapter is being read. Returns the nearest section index.
 *
 * The last section is special: a long pinned section sits before it, where the
 * scene shows something else. So the shape first loosens into an interlude
 * stage as that section begins, and the final morph is tied to the last section
 * sliding into view, where it can actually be watched.
 */
export function useChapterScroll(sections: MutableRefObject<(HTMLElement | null)[]>): number {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const els = sections.current.filter((el): el is HTMLElement => el !== null);
      if (els.length === 0) return;
      if (els.length < 2) return;
      const mid = window.innerHeight / 2;
      const centers = els.map((el) => {
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2;
      });
      const last = centers.length - 1;

      const vh = window.innerHeight;
      let stage = 0;
      if (mid > centers[last - 1]) {
        const loosen = smoothstep(0.2, 1, (mid - centers[last - 1]) / vh);
        const arrive = smoothstep(0, 1, (vh * 0.7 - els[last].getBoundingClientRect().top) / (vh * 0.65));
        stage = last - 1 + loosen + arrive;
      } else if (mid > centers[0]) {
        let i = 0;
        while (i < last - 2 && mid >= centers[i + 1]) i++;
        stage = i + smoothstep(0.25, 0.75, (mid - centers[i]) / (centers[i + 1] - centers[i]));
      }
      setScene({ target: stage, dim: 1, side: null });
      setActive(stage > last - 0.5 ? last : Math.min(Math.round(stage), last - 1));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sections]);

  return active;
}
