import { SRFS } from '../data/team';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useSceneTarget } from '../hooks/useSceneTarget';
import { Container } from '../components/layout/Container';
import { PageIntro } from '../components/common/PageIntro';
import { SectionHeader } from '../components/common/SectionHeader';
import { Reveal } from '../components/common/Reveal';
import { LabGallery } from '../components/about/LabGallery';
import { PiProfile } from '../components/team/PiProfile';
import { ResearcherCard } from '../components/team/ResearcherCard';
import { FundingList } from '../components/team/FundingList';
import { useT } from '../i18n/I18nProvider';
import { ServiceAndTalks } from '../components/team/ServiceAndTalks';

export default function About() {
  const t = useT();
  const a = t.about;
  useDocumentTitle(t.titles.about);
  useSceneTarget(1, 0.3);

  return (
    <>
      <PageIntro number="03" label={a.label} title={a.title} lede={a.lede} />

      <Container as="section" className="pb-24 md:pb-32">
        <SectionHeader number="01" label={a.sections.gallery.label} title={a.sections.gallery.title} />
        <LabGallery />
      </Container>

      <Container as="section" className="pb-24 md:pb-32">
        <SectionHeader number="02" label={a.sections.pi.label} title={a.sections.pi.title} />
        <Reveal><PiProfile /></Reveal>
      </Container>

      <Container as="section" className="pb-24 md:pb-32">
        <SectionHeader number="03" label={a.sections.srf.label} title={a.sections.srf.title} />
        <div className="grid gap-16 md:grid-cols-2 md:gap-12 lg:gap-20">
          {SRFS.map((m, i) => (
            <Reveal key={m.id} delay={i * 120}><ResearcherCard member={m} index={i + 1} /></Reveal>
          ))}
        </div>
      </Container>

      <Container as="section" className="pb-24 md:pb-32">
        <SectionHeader number="04" label={a.sections.funding.label} title={a.sections.funding.title} />
        <FundingList />
      </Container>

      <Container as="section" className="pb-28 md:pb-40">
        <SectionHeader number="05" label={a.sections.service.label} title={a.sections.service.title} />
        <ServiceAndTalks />
      </Container>
    </>
  );
}
