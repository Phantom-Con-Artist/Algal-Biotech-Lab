import type { MouseEventHandler, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface Props {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: 'solid' | 'line';
  className?: string;
}

const base = 'group inline-flex min-h-11 items-center gap-2.5 text-sm font-medium transition-colors';
const variants = {
  solid: 'reticle px-6 font-mono text-xs uppercase tracking-[0.14em] text-paper hover:text-leaf',
  line: 'measure text-paper hover:text-leaf',
};

export function ArrowLink({ children, to, href, onClick, variant = 'line', className }: Props) {
  const cls = cn(base, variants[variant], className);
  const arrow = (external: boolean) =>
    external ? (
      <ArrowUpRight size={16} aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    ) : (
      <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
    );

  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
        {arrow(false)}
      </Link>
    );
  }
  if (href) {
    const external = /^https?:/.test(href);
    return (
      <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
        {children}
        {arrow(external)}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
      {arrow(false)}
    </button>
  );
}
