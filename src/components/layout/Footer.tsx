import { Link } from 'react-router-dom';
import { DEVELOPER, LAB_INFO, NAV_ITEMS } from '../../data/labData';
import { Container } from './Container';
import { Eyebrow } from '../common/Eyebrow';
import markSrc from '../../assets/brand/abl-mark.png';
import cutnSrc from '../../assets/brand/cutn.png';

const linkClass = 'inline-flex min-h-11 items-center text-sm text-soft transition-colors hover:text-leaf';

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-ink">
      <Container className="grid gap-12 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <div className="flex items-center gap-4">
            <img src={markSrc} alt="" width={36} height={32} className="h-8 w-auto" />
            <p className="font-serif text-2xl leading-tight">{LAB_INFO.name}</p>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-mute">
            {LAB_INFO.department}, {LAB_INFO.school}
            <br />
            {LAB_INFO.institution}
            <br />
            {LAB_INFO.address.join(', ')}
          </p>
          <a href={LAB_INFO.website} target="_blank" rel="noreferrer" aria-label="Central University of Tamil Nadu website" className="mt-6 inline-block bg-paper p-2">
            <img src={cutnSrc} alt="Central University of Tamil Nadu" width={56} height={54} className="h-14 w-auto" />
          </a>
        </div>

        <nav aria-label="Quick links" className="md:col-span-3 md:col-start-7">
          <Eyebrow>Quick links</Eyebrow>
          <ul className="mt-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={linkClass}>{item.label}</Link>
              </li>
            ))}
            <li>
              <a href={LAB_INFO.website} target="_blank" rel="noreferrer" className={linkClass}>CUTN website</a>
            </li>
          </ul>
        </nav>

        <div className="md:col-span-3">
          <Eyebrow>Write or call</Eyebrow>
          <ul className="mt-3">
            <li><a href={`mailto:${LAB_INFO.email}`} className={linkClass}>{LAB_INFO.email}</a></li>
            <li><a href={LAB_INFO.phoneHref} className={linkClass}>{LAB_INFO.phone}</a></li>
            <li><a href={LAB_INFO.mapHref} target="_blank" rel="noreferrer" className={linkClass}>Find us on the map</a></li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-2 py-5 text-xs text-mute sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {LAB_INFO.name}, {LAB_INFO.institutionShort}</p>
          <p>
            Developed by <span className="text-paper">{DEVELOPER.name}</span>
          </p>
        </Container>
      </div>
    </footer>
  );
}
