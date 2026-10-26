'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import { LOCALES, localePath, stripLocale, type Locale } from '../../i18n/config';
import { cn } from '../../utils/cn';

interface Props {
  locale: Locale;
  label: string;
  note: string;
  /** 'menu' is the dropdown in the header; 'list' is the inline grid in the mobile menu. */
  variant: 'menu' | 'list';
}

/** Links to the same page in every language; each language has its own indexable URL. */
function useLanguageLinks() {
  const path = stripLocale(usePathname() ?? '/');
  return LOCALES.map((l) => ({ ...l, href: localePath(l.code, path) }));
}

export function LanguageSwitcher({ locale, label, note, variant }: Props) {
  const links = useLanguageLinks();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const items = (
    <ul className={variant === 'list' ? 'grid grid-cols-3 gap-x-3' : ''}>
      {links.map((l) => (
        <li key={l.code}>
          <a
            href={l.href}
            hrefLang={l.htmlLang}
            lang={l.htmlLang}
            aria-current={l.code === locale ? 'true' : undefined}
            className={cn(
              'flex min-h-11 items-center justify-between gap-3 text-[0.875rem] transition-colors',
              variant === 'menu' && 'px-3 hover:bg-mist-hi',
              l.code === locale ? 'text-ink' : 'text-ink-2 hover:text-ink',
            )}
          >
            {l.name}
            {variant === 'menu' && l.code === locale && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-eyespot" />}
          </a>
        </li>
      ))}
    </ul>
  );

  if (variant === 'list') {
    return (
      <div>
        <p className="label mb-2">{label}</p>
        {items}
        {note && <p className="mt-2 text-xs text-mute">{note}</p>}
      </div>
    );
  }

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className="hud flex h-11 items-center gap-2 text-ink-2 transition-colors hover:text-ink"
      >
        <Globe size={15} aria-hidden="true" />
        {locale}
      </button>
      {open && (
        <div className="ticks absolute right-0 top-full mt-1 w-56 bg-mist p-1.5 text-ink shadow-[0_16px_40px_-20px_oklch(0.24_0.018_245/0.4)]">
          {items}
          {note && <p className="border-t border-line px-3 pb-1 pt-3 text-xs leading-snug text-mute">{note}</p>}
        </div>
      )}
    </div>
  );
}
