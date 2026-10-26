import Link from 'next/link';
import { fmt, getDictionary, localePath, type Locale } from '../../i18n/config';
import { NAV_ITEMS } from '../../data/labData';
import { fullName, PI } from '../../data/members';
import { piPath } from '../../utils/lab';
import { ActionLink, Leader } from '../common/ActionLink';
import { ProfileLinks } from '../common/ProfileLinks';
import { Specimen } from '../common/Specimen';
import { Container } from '../layout/Container';

/** The close of the home scroll: the person who leads the work, and the way into the rest of the site. */
export function PiClose({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const lead = t.home.cell.lead;
  const pi = t.people.pi;
  const descriptions = { research: t.meta.research.description, people: t.meta.people.description, publications: t.meta.publications.description, contact: t.meta.contact.description, explore: t.meta.explore.description };

  return (
    <section aria-labelledby="pi-close-title" className="relative py-24 md:py-36">
      <Container className="grid gap-12 md:grid-cols-12 md:gap-10">
        <Specimen
          src={PI.photo}
          alt={fmt(t.common.portraitOf, { name: fullName(PI) })}
          sizes="(min-width: 768px) 36vw, 100vw"
          caption={lead.label}
          index="CUTN"
          className="md:col-span-5 lg:col-span-4"
          imageClassName="aspect-[4/5]"
        />
        <div className="md:col-span-7 lg:col-span-7 lg:col-start-6">
          <div className="hud flex items-center gap-4 text-mute">
            <span className="text-ink">{pi.role}</span>
            <span aria-hidden="true" className="h-px flex-1 bg-line-strong" />
          </div>
          <h2 id="pi-close-title" className="text-page mt-8">{fullName(PI)}</h2>
          <p className="text-lede mt-8 max-w-[56ch] text-ink-2">{pi.bio}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2">
            <ActionLink href={localePath(locale, piPath)}>{lead.profile}</ActionLink>
            <ProfileLinks links={PI.links} profileLabel={t.people.profileLink} />
          </div>

          <nav aria-label={lead.explore} className="mt-16">
            <p className="hud mb-4 text-mute">{lead.explore}</p>
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
        </div>
      </Container>
    </section>
  );
}
