import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface Props {
  href: string;
  children: ReactNode;
  className?: string;
  /** The one action a section exists for: framed in viewfinder ticks and marked with the eyespot point. */
  primary?: boolean;
}

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

/** A leader: a hairline ending in a point. It lengthens on hover, pointing at where the link goes. */
export function Leader({ external = false }: { external?: boolean }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 12" className={cn('h-3 w-6 shrink-0 overflow-visible', external && '-rotate-[30deg]')}>
      <line x1="0" y1="6" x2="17" y2="6" stroke="currentColor" strokeWidth="1" className="origin-left transition-transform duration-500 ease-out-quart group-hover:scale-x-[1.35] group-focus-visible:scale-x-[1.35]" />
      <circle cx="20.5" cy="6" r="2.2" fill="currentColor" className="transition-transform duration-500 ease-out-quart group-hover:translate-x-[6px] group-focus-visible:translate-x-[6px]" />
    </svg>
  );
}

export function ActionLink({ href, children, className, primary }: Props) {
  const external = /^https?:/.test(href);
  const classes = cn(
    'hud group relative inline-flex min-h-12 items-center gap-3 text-current',
    primary && 'ticks px-5 transition-colors hover:bg-ink hover:text-frost',
    className,
  );
  const body = (
    <>
      {primary && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-eyespot" />}
      <span className={primary ? undefined : 'ruled'}>{children}</span>
      <Leader external={external} />
    </>
  );

  if (isExternal(href)) {
    return (
      <a href={href} className={classes} {...(external ? { target: '_blank', rel: 'noopener' } : {})}>
        {body}
      </a>
    );
  }
  return <Link href={href} className={classes}>{body}</Link>;
}
