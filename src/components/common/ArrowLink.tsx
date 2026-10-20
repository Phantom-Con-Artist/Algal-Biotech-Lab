import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface Props {
  href: string;
  children: ReactNode;
  className?: string;
  /** Solid button style for primary calls to action. */
  solid?: boolean;
}

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

export function ArrowLink({ href, children, className, solid }: Props) {
  const external = /^https?:/.test(href);
  const Icon = external ? ArrowUpRight : ArrowRight;
  const classes = cn(
    'group inline-flex min-h-11 items-center gap-2 text-sm font-medium transition-colors',
    solid ? 'rounded-[3px] bg-ink px-5 text-paper hover:bg-leaf' : 'text-ink hover:text-leaf',
    className,
  );
  const body = (
    <>
      <span className={solid ? undefined : 'measure'}>{children}</span>
      <Icon size={16} aria-hidden="true" className="transition-transform duration-300 ease-out-quart group-hover:translate-x-0.5" />
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
