import { FUNDERS } from '../../data/funders';
import { cn } from '../../utils/cn';

/**
 * The funders as one quiet, slowly travelling line of wordmarks, the way a product shows who uses it.
 * The list is drawn twice so the loop never shows a seam; it pauses under the pointer and stands still
 * for reduced motion.
 */
export function FunderStrip({ label, className }: { label: string; className?: string }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-12 pr-12 md:gap-20 md:pr-20">
      {FUNDERS.map((f) => (
        <li key={f.mark}>
          <a
            href={f.href}
            target="_blank"
            rel="noopener"
            tabIndex={hidden ? -1 : undefined}
            title={f.name}
            className="block whitespace-nowrap font-display text-[clamp(1.125rem,0.9rem+0.8vw,1.625rem)] font-light tracking-[-0.02em] text-ink/45 transition-colors duration-300 hover:text-ink"
          >
            {f.mark}
            <span className="sr-only"> · {f.name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label={label} className={cn('border-y border-line py-8', className)}>
      <p className="hud mb-6 text-center text-mute">{label}</p>
      <div className="group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex animate-[funders_48s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
