import { getDictionary, type Locale } from '../i18n/config';
import { fullName, PI, RESEARCHERS } from '../data/members';
import { breadcrumbs } from '../utils/structuredData';
import { Container } from '../components/layout/Container';
import { PageIntro } from '../components/common/PageIntro';
import { SectionHeader } from '../components/common/SectionHeader';
import { JsonLd } from '../components/common/JsonLd';
import { PiFeature } from '../components/team/PiFeature';
import { MemberCard } from '../components/team/MemberCard';
import { AlumniList } from '../components/team/AlumniList';
import { FundingList } from '../components/team/FundingList';
import { ServiceAndTalks } from '../components/team/ServiceAndTalks';

export function PeopleView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const p = t.people;
  return (
    <>
      <PageIntro number="02" label={p.label} title={p.title} lede={p.lede} />

      <Container as="section" aria-labelledby="pi-title" className="pb-24 md:pb-40">
        <SectionHeader number="01" label={p.piLabel} title={fullName(PI)} id="pi-title" />
        <PiFeature locale={locale} />
      </Container>

      <Container as="section" aria-labelledby="team-title" className="pb-24 md:pb-40">
        <SectionHeader number="02" label={p.teamLabel} title={p.teamTitle} id="team-title" />
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-4">
          {RESEARCHERS.map((m) => (
            <MemberCard key={m.slug} member={m} locale={locale} />
          ))}
        </div>
      </Container>

      <Container as="section" aria-labelledby="alumni-title" className="pb-24 md:pb-40">
        <SectionHeader number="03" label={p.alumniLabel} title={p.alumniTitle} id="alumni-title" />
        <AlumniList locale={locale} />
      </Container>

      <Container as="section" id="funding" aria-labelledby="funding-title" className="scroll-mt-24 pb-24 md:pb-40">
        <SectionHeader number="04" label={p.fundingLabel} title={p.fundingTitle} id="funding-title" />
        <FundingList locale={locale} />
      </Container>

      <Container as="section" aria-labelledby="service-title" className="pb-28 md:pb-44">
        <SectionHeader number="05" label={p.serviceLabel} title={p.serviceTitle} id="service-title" />
        <ServiceAndTalks locale={locale} />
      </Container>

      <JsonLd data={breadcrumbs(locale, [{ name: t.nav.people, path: '/people' }])} />
    </>
  );
}
