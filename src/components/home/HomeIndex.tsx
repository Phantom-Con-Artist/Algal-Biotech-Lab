import Link from 'next/link';
import { getDictionary, localePath, type Locale } from '../../i18n/config';
import { NAV_ITEMS } from '../../data/labData';
import { Leader } from '../common/ActionLink';
import { Container } from '../layout/Container';
import { FunderStrip } from '../common/FunderStrip';

/** The close of the home scroll, after the lab room: the way into the rest of the site. */
export function HomeIndex({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const lead = t.home.cell.lead;
  const descriptions = { research: t.meta.research.description, people: t.meta.people.description, lab: t.meta.lab.description, publications: t.meta.publications.description, contact: t.meta.contact.description, explore: t.meta.explore.description };

  return (
    <section aria-labelledby="home-index-title" className="relative py-24 md:py-32">
      <FunderStrip label={t.common.supportedBy} className="mb-20 md:mb-28" />
      <Container>
        <nav aria-labelledby="home-index-title" className="lg:ml-[33%]">
          <h2 id="home-index-title" className="hud mb-4 text-mute">{lead.explore}</h2>
          <ul className="border-t border-line-strong">
            {NAV_ITEMS.map((item) => (
              <li key={item.key} className="border-b border-line">
                <Link href={localePath(locale, item.path)} className="group grid min-h-11 gap-x-6 gap-y-1 py-6 sm:grid-cols-[3rem_12rem_1fr_auto] sm:items-baseline">
                  <span className="hud text-mute">{item.number}</span>
                  <span className="font-display text-[1.25rem] font-light">{t.nav[item.key]}</span>
                  <span className="text-[0.875rem] text-ink-2">{descriptions[item.key]}</span>
                  <span className="hidden text-mute transition-colors group-hover:text-ink sm:block"><Leader /></span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}
