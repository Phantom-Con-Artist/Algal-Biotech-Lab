import { ArrowUpRight } from 'lucide-react';
import { getDictionary, localePath, type Locale } from '../../i18n/config';
import { PUBLICATIONS } from '../../data/publications';
import { doiUrl, shortAuthors } from '../../utils/citation';
import { ArrowLink } from '../common/ArrowLink';
import { SectionHeader } from '../common/SectionHeader';
import { Container } from '../layout/Container';

/** The three newest works on the Swiss grid: year in the margin, title large, venue beside. */
export function RecentPublications({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <Container as="section" aria-labelledby="pubs-title" className="pb-24 md:pb-40">
      <SectionHeader
        number="03"
        label={t.home.pubsLabel}
        title={t.home.pubsTitle}
        id="pubs-title"
        action={<ArrowLink href={localePath(locale, '/publications')}>{t.home.allPubs}</ArrowLink>}
      />
      <ul>
        {PUBLICATIONS.slice(0, 3).map((p) => (
          <li key={p.id} className="reveal border-b border-line first:border-t">
            <a
              href={doiUrl(p)}
              target="_blank"
              rel="noopener"
              className="group grid gap-x-12 gap-y-2 py-8 lg:grid-cols-12 lg:py-10"
            >
              <span className="label lg:col-span-3 lg:pt-1.5">
                {p.year} · {t.publications.types[p.type]}
              </span>
              <span className="lg:col-span-6">
                <span className="text-h3 block font-medium transition-colors group-hover:text-leaf">{p.title}</span>
                <span className="mt-3 block text-ink-2">{shortAuthors(p)} · <em>{p.venue}</em></span>
              </span>
              <span className="hidden justify-self-end lg:col-span-3 lg:block">
                <ArrowUpRight size={24} aria-hidden="true" className="text-mute transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-leaf" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Container>
  );
}
