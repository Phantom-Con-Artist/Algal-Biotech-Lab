import { NavLink } from 'react-router-dom';
import { LAB_INFO, NAV_ITEMS } from '../../data/labData';
import { cn } from '../../utils/cn';
import { Container } from './Container';

export function MobileMenu() {
  return (
    <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-ink md:hidden">
      <Container className="flex min-h-full flex-col justify-between pb-10 pt-6">
        <nav aria-label="Mobile">
          <ul className="border-t border-line">
            {NAV_ITEMS.map((item) => (
              <li key={item.to} className="border-b border-line">
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-16 items-baseline gap-4 py-4 font-serif text-4xl leading-none',
                      isActive ? 'text-leaf' : 'text-paper',
                    )
                  }
                >
                  <span className="font-mono text-xs text-mute">{item.number}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-10 space-y-1 text-sm text-mute">
          <p>{LAB_INFO.department}, {LAB_INFO.institutionShort}</p>
          <a href={`mailto:${LAB_INFO.email}`} className="inline-flex min-h-11 items-center text-paper underline decoration-line underline-offset-4">
            {LAB_INFO.email}
          </a>
        </div>
      </Container>
    </div>
  );
}
