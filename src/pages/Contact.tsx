import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useSceneTarget } from '../hooks/useSceneTarget';
import { Container } from '../components/layout/Container';
import { PageIntro } from '../components/common/PageIntro';
import { SectionHeader } from '../components/common/SectionHeader';
import { ContactDetails } from '../components/contact/ContactDetails';
import { InquiryLinks } from '../components/contact/InquiryLinks';
import { DirectLines } from '../components/contact/DirectLines';

export default function Contact() {
  useDocumentTitle('Contact us');
  useSceneTarget(7, 0.35);

  return (
    <>
      <PageIntro
        number="04"
        label="Contact us"
        title="Write to the lab."
        lede="The fastest way in is email. Pick the closest subject below and your mail app opens with a short template to complete."
      />

      <Container as="section" className="grid gap-16 pb-24 lg:grid-cols-12 lg:gap-12 lg:pb-32">
        <div className="lg:col-span-7">
          <InquiryLinks />
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <ContactDetails />
        </div>
      </Container>

      <Container as="section" className="pb-28 md:pb-40">
        <SectionHeader number="01" label="Direct lines" title="Reach a researcher" />
        <DirectLines />
      </Container>
    </>
  );
}
