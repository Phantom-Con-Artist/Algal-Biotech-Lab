import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useSceneTarget } from '../hooks/useSceneTarget';
import { Container } from '../components/layout/Container';
import { PageIntro } from '../components/common/PageIntro';
import { SectionHeader } from '../components/common/SectionHeader';
import { ContactDetails } from '../components/contact/ContactDetails';
import { InquiryLinks } from '../components/contact/InquiryLinks';
import { useT } from '../i18n/I18nProvider';
import { DirectLines } from '../components/contact/DirectLines';

export default function Contact() {
  const t = useT();
  const c = t.contact;
  useDocumentTitle(t.titles.contact);
  useSceneTarget(7, 0.35);

  return (
    <>
      <PageIntro number="04" label={c.label} title={c.title} lede={c.lede} />

      <Container as="section" className="grid gap-16 pb-24 lg:grid-cols-12 lg:gap-12 lg:pb-32">
        <div className="lg:col-span-7">
          <InquiryLinks />
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <ContactDetails />
        </div>
      </Container>

      <Container as="section" className="pb-28 md:pb-40">
        <SectionHeader number="01" label={c.directLabel} title={c.directTitle} />
        <DirectLines />
      </Container>
    </>
  );
}
