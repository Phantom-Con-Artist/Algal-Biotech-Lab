import { getDictionary, type Locale } from '../i18n/config';
import { fullName, PI, RESEARCHERS } from '../data/members';
import { fmt, localePath } from '../i18n/config';
import { memberPath } from '../utils/lab';
import { breadcrumbs } from '../utils/structuredData';
import { Container } from '../components/layout/Container';
import { PageIntro } from '../components/common/PageIntro';
import { SectionHeader } from '../components/common/SectionHeader';
import { JsonLd } from '../components/common/JsonLd';
import { PiFeature } from '../components/team/PiFeature';
import { Roster } from '../components/team/Roster';
import { AlumniList } from '../components/team/AlumniList';
import { FundingList } from '../components/team/FundingList';
import { ServiceAndTalks } from '../components/team/ServiceAndTalks';
import { FunderStrip } from '../components/common/FunderStrip';

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
        <Roster
          rows={RESEARCHERS.map((m) => ({
            slug: m.slug,
            href: localePath(locale, memberPath(m)),
            name: fullName(m),
            role: p.roles[m.role],
            joined: m.joined,
            joinedText: fmt(p.joined, { year: m.joined }),
            focus: m.interests.slice(0, 3).join(' · '),
            photo: m.photo,
            position: m.photoPosition,
            alt: fmt(t.common.portraitOf, { name: fullName(m) }),
          }))}
        />
      </Container>

      <Container as="section" aria-labelledby="alumni-title" className="pb-24 md:pb-40">
        <SectionHeader number="03" label={p.alumniLabel} title={p.alumniTitle} id="alumni-title" />
        <AlumniList locale={locale} />
      </Container>

      <Container as="section" id="funding" aria-labelledby="funding-title" className="scroll-mt-24 pb-24 md:pb-40">
        <SectionHeader number="04" label={p.fundingLabel} title={p.fundingTitle} id="funding-title" />
        <FunderStrip label={t.common.supportedBy} className="mb-14" />
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
