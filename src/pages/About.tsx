import { SRFS } from '../data/team';
import { LAB_INFO } from '../data/labData';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useSceneTarget } from '../hooks/useSceneTarget';
import { Container } from '../components/layout/Container';
import { PageIntro } from '../components/common/PageIntro';
import { SectionHeader } from '../components/common/SectionHeader';
import { Reveal } from '../components/common/Reveal';
import { PiProfile } from '../components/team/PiProfile';
import { ResearcherCard } from '../components/team/ResearcherCard';
import { FundingList } from '../components/team/FundingList';
import { ServiceAndTalks } from '../components/team/ServiceAndTalks';

export default function About() {
  useDocumentTitle('About the lab');
  useSceneTarget(1, 0.3);

  return (
    <>
      <PageIntro
        number="03"
        label="About the lab"
        title="Microbiology, with algae as the machinery."
        lede={`The ${LAB_INFO.name} sits in the ${LAB_INFO.department}, ${LAB_INFO.school}, at the ${LAB_INFO.institution} in Thiruvarur. We read how microalgae regulate their genes and metabolism, then use that understanding to build better cell factories.`}
      />

      <Container as="section" className="pb-24 md:pb-32">
        <SectionHeader number="01" label="Principal Investigator" title="Who leads the work" />
        <Reveal><PiProfile /></Reveal>
      </Container>

      <Container as="section" className="pb-24 md:pb-32">
        <SectionHeader number="02" label="Senior research fellows" title="Who does it at the bench" />
        <div className="grid gap-16 md:grid-cols-2 md:gap-12 lg:gap-20">
          {SRFS.map((m, i) => (
            <Reveal key={m.id} delay={i * 120}><ResearcherCard member={m} /></Reveal>
          ))}
        </div>
      </Container>

      <Container as="section" className="pb-24 md:pb-32">
        <SectionHeader number="03" label="Funding and recognition" title="What has made it possible" />
        <FundingList />
      </Container>

      <Container as="section" className="pb-28 md:pb-40">
        <SectionHeader number="04" label="Service and talks" title="Beyond the bench" />
        <ServiceAndTalks />
      </Container>
    </>
  );
}
