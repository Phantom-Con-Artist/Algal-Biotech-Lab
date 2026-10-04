import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useSceneTarget } from '../hooks/useSceneTarget';
import { Container } from '../components/layout/Container';
import { PageIntro } from '../components/common/PageIntro';
import { SectionHeader } from '../components/common/SectionHeader';
import { ProgramList } from '../components/research/ProgramList';
import { PublicationList } from '../components/publications/PublicationList';

export default function Explore() {
  useDocumentTitle('Explore');
  useSceneTarget(2, 0.3);

  return (
    <>
      <PageIntro
        number="02"
        label="Explore"
        title="Six lines of inquiry, one organism family."
        lede="From the regulators that switch a cell’s metabolism to the reactors and loops where that metabolism is put to work. Each programme links to the papers behind it."
      />

      <Container as="section" className="pb-24 md:pb-32">
        <SectionHeader number="01" label="Research programmes" title="What we investigate" />
        <ProgramList />
      </Container>

      <Container as="section" id="publications" className="pb-28 md:pb-40">
        <SectionHeader number="02" label="Publications" title="What we have published" />
        <PublicationList />
      </Container>
    </>
  );
}
