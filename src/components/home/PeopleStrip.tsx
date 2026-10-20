import { getDictionary, localePath, type Locale } from '../../i18n/config';
import { PI, RESEARCHERS } from '../../data/members';
import { ArrowLink } from '../common/ArrowLink';
import { SectionHeader } from '../common/SectionHeader';
import { Container } from '../layout/Container';
import { MemberCard } from '../team/MemberCard';

export function PeopleStrip({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <Container as="section" aria-labelledby="people-title" className="pb-24 md:pb-40">
      <SectionHeader
        number="02"
        label={t.home.peopleLabel}
        title={t.people.title}
        id="people-title"
        action={<ArrowLink href={localePath(locale, '/people')}>{t.home.meetAll}</ArrowLink>}
      />
      <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 lg:gap-x-4">
        {[PI, ...RESEARCHERS].map((m) => (
          <MemberCard key={m.slug} member={m} locale={locale} compact />
        ))}
      </div>
    </Container>
  );
}
