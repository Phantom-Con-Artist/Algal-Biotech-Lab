import { NavLink } from 'react-router-dom';
import { LAB_INFO, NAV_ITEMS } from '../../data/labData';
import { cn } from '../../utils/cn';
import { Container } from './Container';
import { LanguageList } from './LanguageSwitcher';
import { useT } from '../../i18n/I18nProvider';

export function MobileMenu() {
  const t = useT();
  return (
    <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-ink md:hidden">
      <Container className="flex min-h-full flex-col justify-between pb-10 pt-6">
        <nav aria-label={t.nav.primary}>
          <ul className="border-t border-line">
            {NAV_ITEMS.map((item) => (
              <li key={item.to} className="border-b border-line">
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-14 items-baseline gap-4 py-3 font-serif text-3xl leading-none',
                      isActive ? 'text-leaf' : 'text-paper',
                    )
                  }
                >
                  <span className="font-mono text-xs text-mute">{item.number}</span>
                  {t.nav[item.key]}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 space-y-4 text-sm text-mute">
          <LanguageList />
          <p>{t.lab.department}, {LAB_INFO.institutionShort}</p>
          <a href={`mailto:${LAB_INFO.email}`} className="inline-flex min-h-11 items-center text-paper underline decoration-line underline-offset-4">
            {LAB_INFO.email}
          </a>
        </div>
      </Container>
    </div>
  );
}
