import { getDictionary, type Locale } from '../i18n/config';
import { FOCUS_AREAS } from '../data/focus';
import { breadcrumbs } from '../utils/structuredData';
import { Container } from '../components/layout/Container';
import { PageIntro } from '../components/common/PageIntro';
import { SectionHeader } from '../components/common/SectionHeader';
import { JsonLd } from '../components/common/JsonLd';
import { FocusArea } from '../components/research/FocusArea';
import { ProgramList } from '../components/research/ProgramList';

export function ResearchView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const r = t.research;
  return (
    <>
      <PageIntro number="01" label={r.label} title={r.title} lede={r.lede} />

      <Container as="section" aria-labelledby="focus-title" className="pb-24 md:pb-40">
        <SectionHeader number="01" label={r.focusLabel} title={r.focusTitle} id="focus-title" />
        <div className="space-y-16 md:space-y-24">
          {FOCUS_AREAS.map((area, i) => (
            <FocusArea key={area.id} area={area} locale={locale} flip={i % 2 === 1} />
          ))}
        </div>
      </Container>

      <Container as="section" aria-labelledby="programmes-title" className="pb-28 md:pb-44">
        <SectionHeader number="02" label={r.programmesLabel} title={r.programmesTitle} id="programmes-title" />
        <ProgramList locale={locale} />
      </Container>

      <JsonLd data={breadcrumbs(locale, [{ name: t.nav.research, path: '/research' }])} />
    </>
  );
}
