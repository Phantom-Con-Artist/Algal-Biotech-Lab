import { getDictionary, localePath, type Locale } from '../../i18n/config';
import { ArrowLink } from '../common/ArrowLink';
import { Container } from '../layout/Container';
import { OrganismLazy } from './organism/OrganismLazy';

/** One statement, two actions, and a living organism whose branches reach across the whole hero, behind the words. */
export function Hero({ locale }: { locale: Locale }) {
  const h = getDictionary(locale).home;
  return (
    <Container
      as="section"
      aria-labelledby="hero-title"
      className="relative isolate grid gap-10 overflow-hidden pb-[min(92vw,30rem)] pt-12 md:pt-20 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-12 lg:items-center lg:gap-12 lg:pb-24"
    >
      <div className="flex flex-col gap-12 lg:col-span-7 lg:gap-16">
        <p className="label max-w-sm">{h.eyebrow}</p>
        <div>
          <h1 id="hero-title" className="text-display font-medium">{h.title}</h1>
          <p className="text-lede mt-8 max-w-[40ch] text-ink-2">{h.lede}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ArrowLink href={localePath(locale, '/research')} solid>{h.ctaResearch}</ArrowLink>
            <ArrowLink href={localePath(locale, '/contact')}>{h.ctaJoin}</ArrowLink>
          </div>
        </div>
      </div>

      <OrganismLazy />
    </Container>
  );
}
