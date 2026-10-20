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
import mark from '../../assets/brand/abl-mark.webp';

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
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href={localePath(locale)} className="flex min-h-11 items-center gap-3" aria-label={`${LAB_INFO.shortName}, ${nav.home}`}>
          <Image src={mark} alt="" width={30} height={26} priority className="h-[26px] w-auto" />
          <span className="text-base font-semibold tracking-tight">{LAB_INFO.shortName}</span>
          <span className="label hidden border-l border-line-strong pl-3 sm:inline">{LAB_INFO.institutionShort}</span>
        </Link>

        <nav aria-label={nav.primary} className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-6 lg:gap-8">
            {links.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={item.active ? 'page' : undefined}
                  className={cn(
                    'relative flex h-11 items-center gap-2 text-sm transition-colors',
                    item.active ? 'text-ink after:absolute after:inset-x-0 after:bottom-2 after:h-px after:bg-leaf' : 'text-ink-2 hover:text-ink',
                  )}
                >
                  <span className="font-mono text-[10px] text-mute">{item.number}</span>
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
          className="-mr-2 grid h-11 w-11 place-items-center md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>
    </header>

    {/* A sibling of the header, not a child: the header's backdrop blur would otherwise become the containing
        block for this fixed panel and collapse it to the header's height. */}
    {open && (
      <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-paper md:hidden">
        <Container as="nav" aria-label={nav.primary} className="flex min-h-full flex-col justify-between gap-10 py-8">
          <ul className="border-t border-line">
            {links.map((item) => (
              <li key={item.key} className="border-b border-line">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={item.active ? 'page' : undefined}
                  className={cn('flex min-h-16 items-center gap-4 text-3xl font-medium tracking-tight', item.active && 'text-leaf')}
                >
                  <span className="font-mono text-xs text-mute">{item.number}</span>
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
