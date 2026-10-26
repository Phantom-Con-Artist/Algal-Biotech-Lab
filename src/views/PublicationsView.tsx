import { getDictionary, localeInfo, type Locale } from '../i18n/config';
import { PUBLICATIONS } from '../data/publications';
import { breadcrumbs, publicationsLd } from '../utils/structuredData';
import { Container } from '../components/layout/Container';
import { PageIntro } from '../components/common/PageIntro';
import { JsonLd } from '../components/common/JsonLd';
import { PublicationList } from '../components/publications/PublicationList';

export function PublicationsView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const p = t.publications;
  return (
    <>
      <PageIntro number="03" label={p.label} title={p.title} lede={p.lede} />
      <Container as="section" aria-label={p.label} className="pb-28 md:pb-44">
        <PublicationList t={p} htmlLang={localeInfo(locale).htmlLang} />
      </Container>
      <JsonLd data={publicationsLd(PUBLICATIONS)} />
      <JsonLd data={breadcrumbs(locale, [{ name: t.nav.publications, path: '/publications' }])} />
    </>
  );
}
