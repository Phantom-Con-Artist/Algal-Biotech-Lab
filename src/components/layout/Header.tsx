'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { LAB_INFO, NAV_ITEMS } from '../../data/labData';
import { localePath, stripLocale, type Dictionary, type Locale } from '../../i18n/config';
import { cn } from '../../utils/cn';
import { Container } from './Container';
import { LanguageSwitcher } from './LanguageSwitcher';
import wordmark from '../../assets/brand/abl-wordmark.webp';

interface Props {
  locale: Locale;
  nav: Dictionary['nav'];
  machineNote: string;
}

export function Header({ locale, nav, machineNote }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? '/';
  const current = stripLocale(pathname);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const links = NAV_ITEMS.map((item) => ({
    ...item,
    href: localePath(locale, item.path),
    active: current === item.path || current.startsWith(`${item.path}/`),
  }));

  return (
    <>
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-mist/85 to-transparent">
      <Container className="flex h-20 items-center justify-between gap-3 lg:gap-6">
        <Link href={localePath(locale)} className="flex min-h-11 min-w-0 max-w-[220px] flex-1 items-center sm:max-w-[260px] lg:max-w-[280px]" aria-label={`${LAB_INFO.name}, ${nav.home}`}>
          <Image src={wordmark} alt="" priority sizes="(min-width: 1024px) 280px, (min-width: 640px) 260px, 220px" className="h-auto w-full" />
        </Link>

        <nav aria-label={nav.primary} className="hidden items-center gap-8 lg:flex">
          <ul className="flex items-center gap-6 lg:gap-8">
            {links.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={item.active ? 'page' : undefined}
                  className={cn(
                    'hud relative flex h-11 items-center gap-2 transition-colors',
                    item.active ? 'text-ink after:absolute after:inset-x-0 after:bottom-2 after:h-px after:bg-ink' : 'text-ink-2 hover:text-ink',
                  )}
                >
                  {nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
          <LanguageSwitcher variant="menu" locale={locale} label={nav.language} note={machineNote} />
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? nav.closeMenu : nav.openMenu}
          className="-mr-2 grid h-11 w-11 shrink-0 place-items-center lg:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>
    </header>

    {/* A sibling of the header, not a child: the header's backdrop blur would otherwise become the containing
        block for this fixed panel and collapse it to the header's height. */}
    {open && (
      <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-20 z-40 overflow-y-auto bg-mist lg:hidden">
        <Container as="nav" aria-label={nav.primary} className="flex min-h-full flex-col justify-between gap-10 py-8">
          <ul className="border-t border-line">
            {links.map((item) => (
              <li key={item.key} className="border-b border-line">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={item.active ? 'page' : undefined}
                  className={cn('flex min-h-16 items-center gap-4 font-display text-2xl font-light', item.active && 'text-ink')}
                >
                  <span className="hud text-mute">{item.number}</span>
                  {nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
          <LanguageSwitcher variant="list" locale={locale} label={nav.language} note={machineNote} />
        </Container>
      </div>
    )}
    </>
  );
}
