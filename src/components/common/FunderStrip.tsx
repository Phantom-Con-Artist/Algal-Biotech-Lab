import Image from 'next/image';
import { FUNDERS } from '../../data/funders';
import { cn } from '../../utils/cn';

/**
 * The funders as one quiet, slowly travelling line of wordmarks, the way a product shows who uses it.
 * The list is drawn twice so the loop never shows a seam; it pauses under the pointer and stands still
 * for reduced motion.
 */
export function FunderStrip({ label, className }: { label: string; className?: string }) {
  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className={cn(
        'flex shrink-0 items-center gap-12 pr-12 md:gap-20 md:pr-20',
        hidden ? 'motion-reduce:hidden' : 'motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-8 motion-reduce:pr-0',
      )}
    >
      {FUNDERS.map((f) => (
        <li key={f.mark}>
          <a
            href={f.href}
            target="_blank"
            rel="noopener"
            tabIndex={hidden ? -1 : undefined}
            title={f.name}
            aria-label={f.name}
            className="group/brand flex min-h-20 min-w-11 items-center gap-4 whitespace-nowrap font-display text-[clamp(1.125rem,0.9rem+0.8vw,1.625rem)] font-light tracking-[-0.02em] text-ink/45 transition-colors duration-300 hover:text-ink focus-visible:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink motion-reduce:transition-none"
          >
            <span className="relative shrink-0">
              <Image
                src={f.logo}
                alt=""
                className="h-16 w-auto transition-opacity duration-300 group-hover/brand:opacity-0 group-focus-visible/brand:opacity-0 motion-reduce:transition-none md:h-20"
              />
              <Image
                src={f.colourLogo}
                alt=""
                loading="eager"
                className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-300 group-hover/brand:opacity-100 group-focus-visible/brand:opacity-100 motion-reduce:transition-none"
              />
            </span>
            {f.showLabel && <span className="max-w-52 whitespace-normal leading-snug md:max-w-64">{f.mark}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label={label} className={cn('border-y border-line py-10 md:py-12', className)}>
      <p className="hud mb-8 text-center text-mute">{label}</p>
      <div className="group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)] motion-reduce:[mask-image:none]">
        <div className="flex animate-[funders_48s_linear_infinite] group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
