import { getDictionary, type Locale } from '../../i18n/config';
import { LAB_INFO } from '../../data/labData';
import { FOCUS_AREAS } from '../../data/focus';
import { LAB_STATS } from '../../utils/lab';
import { Container } from '../layout/Container';

/** Four figures on hairline rules. Counts are derived from the data, so they stay current. */
export function StatsStrip({ locale }: { locale: Locale }) {
  const s = getDictionary(locale).home.stats;
  const stats = [
    { value: LAB_STATS.publications, label: s.publications },
    { value: LAB_STATS.researchers, label: s.researchers },
    { value: LAB_INFO.founded, label: s.founded },
    { value: FOCUS_AREAS.length, label: s.focus },
  ];
  return (
    <Container as="section" className="pb-24 md:pb-40">
      <dl className="grid grid-cols-2 border-t border-line-strong lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-col-reverse gap-3 border-b border-line py-6 pr-4 lg:border-b-0 lg:py-8 ${i % 2 ? 'pl-4 sm:pl-6' : ''} ${i > 0 ? 'lg:border-l lg:pl-8' : ''}`}
          >
            <dt className="label">{stat.label}</dt>
            <dd className="text-stat font-medium tabular-nums">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </Container>
  );
}
