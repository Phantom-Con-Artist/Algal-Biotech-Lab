import { getDictionary, localePath, type Locale } from '../../i18n/config';
import { LAB_INFO } from '../../data/labData';
import { PROSPECTIVE_MAILTO } from '../../data/inquiries';
import { ArrowLink } from '../common/ArrowLink';
import { Container } from '../layout/Container';

/** Full-bleed closing band: the one place the page leaves the grid of tiles. */
export function JoinBand({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const h = t.home;
  return (
    <section aria-labelledby="join-title" className="border-t border-line-strong bg-leaf-soft">
      <Container className="grid gap-10 py-20 lg:grid-cols-12 lg:gap-12 md:py-32">
        <p className="label lg:col-span-3">
          <span className="text-ink">05</span>
          <span className="mx-2">/</span>
          {h.joinLabel}
        </p>
        <div className="lg:col-span-6">
          <h2 id="join-title" className="text-h2 font-medium">{h.joinTitle}</h2>
          <p className="text-lede mt-6 max-w-[44ch] text-ink-2">{h.joinBody}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ArrowLink href={PROSPECTIVE_MAILTO} solid>{h.joinCta}</ArrowLink>
            <ArrowLink href={localePath(locale, '/contact')}>{t.nav.contact}</ArrowLink>
          </div>
        </div>
        <address className="not-italic lg:col-span-3 lg:self-end">
          <p className="label mb-2">{t.contact.visit}</p>
          <p className="text-sm leading-relaxed text-ink-2">
            {t.lab.department}
            <br />
            {LAB_INFO.institution}
            <br />
            {LAB_INFO.address.join(', ')}
          </p>
          <a href={`mailto:${LAB_INFO.email}`} className="measure mt-3 inline-flex min-h-11 items-center text-sm font-medium">{LAB_INFO.email}</a>
        </address>
      </Container>
    </section>
  );
}
