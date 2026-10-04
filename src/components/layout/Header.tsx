import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { LAB_INFO, NAV_ITEMS } from '../../data/labData';
import { useScrolled } from '../../hooks/useScrolled';
import { cn } from '../../utils/cn';
import { Container } from './Container';
import { MobileMenu } from './MobileMenu';
import markSrc from '../../assets/brand/abl-mark.png';

export function Header() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300',
        scrolled || open ? 'border-line bg-ink/85 backdrop-blur-md' : 'border-transparent',
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" className="flex min-h-11 items-center gap-3" aria-label={`${LAB_INFO.shortName}, home`}>
          <img src={markSrc} alt="" width={30} height={26} className="h-[26px] w-auto" />
          <span className="text-[15px] font-medium tracking-tight">{LAB_INFO.shortName}</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-9">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'relative flex h-11 items-center gap-2 text-sm transition-colors hover:text-paper',
                      isActive
                        ? 'text-paper after:absolute after:inset-x-0 after:bottom-2 after:h-px after:bg-leaf'
                        : 'text-mute',
                    )
                  }
                >
                  <span className="font-mono text-[11px] text-mute/70">{item.number}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="-mr-2 grid h-11 w-11 place-items-center text-paper md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>
    </header>
    {open && <MobileMenu />}
    </>
  );
}
