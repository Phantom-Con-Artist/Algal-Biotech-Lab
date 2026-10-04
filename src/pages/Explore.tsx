import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useSceneTarget } from '../hooks/useSceneTarget';
import { Container } from '../components/layout/Container';
import { PageIntro } from '../components/common/PageIntro';
import { SectionHeader } from '../components/common/SectionHeader';
import { ProgramList } from '../components/research/ProgramList';
import { useT } from '../i18n/I18nProvider';
import { PublicationList } from '../components/publications/PublicationList';

export default function Explore() {
  const t = useT();
  const e = t.explore;
  useDocumentTitle(t.titles.explore);
  useSceneTarget(2, 0.3);

  return (
    <>
      <PageIntro number="02" label={e.label} title={e.title} lede={e.lede} />

      <Container as="section" className="pb-24 md:pb-32">
        <SectionHeader number="01" label={e.programmesLabel} title={e.programmesTitle} />
        <ProgramList />
      </Container>

      <Container as="section" id="publications" className="pb-28 md:pb-40">
        <SectionHeader number="02" label={e.pubsLabel} title={e.pubsTitle} />
        <PublicationList />
      </Container>
    </>
  );
}
