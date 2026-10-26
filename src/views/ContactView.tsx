import { getDictionary, type Locale } from '../i18n/config';
import { breadcrumbs } from '../utils/structuredData';
import { Container } from '../components/layout/Container';
import { PageIntro } from '../components/common/PageIntro';
import { JsonLd } from '../components/common/JsonLd';
import { InquiryLinks } from '../components/contact/InquiryLinks';
import { ContactDetails } from '../components/contact/ContactDetails';

export function ContactView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const c = t.contact;
  return (
    <>
      <PageIntro number="04" label={c.label} title={c.title} lede={c.lede} />
      <Container as="section" aria-label={c.label} className="grid gap-12 pb-28 md:pb-44 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5 lg:col-start-4">
          <InquiryLinks locale={locale} />
        </div>
        <div className="lg:col-span-4">
          <ContactDetails locale={locale} />
        </div>
      </Container>
      <JsonLd data={breadcrumbs(locale, [{ name: t.nav.contact, path: '/contact' }])} />
    </>
  );
}
