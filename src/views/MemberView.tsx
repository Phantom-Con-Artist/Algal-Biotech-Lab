import Image from 'next/image';
import Link from 'next/link';
import { fmt, getDictionary, localePath, type Locale } from '../i18n/config';
import { fullName, PI_PATH } from '../data/members';
import { LAB_INFO } from '../data/labData';
import type { LabMember } from '../types';
import { breadcrumbs, personLd } from '../utils/structuredData';
import { memberPath } from '../utils/lab';
import { Container } from '../components/layout/Container';
import { Leader } from '../components/common/ActionLink';
import { JsonLd } from '../components/common/JsonLd';
import { ProfileLinks } from '../components/common/ProfileLinks';
import { Tags } from '../components/common/Tags';
import { MemberDetails } from '../components/team/MemberDetails';
import { Timeline } from '../components/team/Timeline';

export function MemberView({ member, locale }: { member: LabMember; locale: Locale }) {
  const t = getDictionary(locale);
  const p = t.people;
  const isPi = member.status === 'pi';
  const role = isPi ? p.pi.role : p.roles[member.role];
  const bio = isPi ? p.pi.bio : member.bio;

  return (
    <article>
      <Container className="pt-8 md:pt-12">
        <Link href={localePath(locale, '/people')} className="hud group inline-flex min-h-11 items-center gap-3 text-ink-2 hover:text-ink">
          <span className="rotate-180"><Leader /></span>
          <span className="ruled">{p.back}</span>
        </Link>
      </Container>

      <Container className="grid gap-10 pb-28 pt-6 md:pb-44 md:pt-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <div className="ticks mx-auto max-w-md p-2 text-ink/70 lg:max-w-none"><div className="relative aspect-[4/5] overflow-hidden bg-mist-lo">
              <Image
                src={member.photo}
                alt={fmt(t.common.portraitOf, { name: fullName(member) })}
                fill
                priority
                placeholder="blur"
                sizes="(min-width: 1024px) 33vw, 28rem"
                style={{ objectPosition: member.photoPosition }}
                className="object-cover saturate-[0.85]"
              />
            </div></div>
            <div className="mt-4">
              <ProfileLinks links={member.links} profileLabel={p.profileLink} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <p className="label">{role}</p>
          <h1 className="text-page mt-4">{fullName(member)}</h1>
          <p className="label mt-6">
            {member.status === 'alumni' ? `${p.alumniLabel} · ` : ''}
            {fmt(p.joined, { year: member.joined })}
          </p>

          {member.now && (
            <p className="mt-6 max-w-[56ch] border-l border-ink py-1 pl-5">
              <span className="hud mr-2 text-ink">{p.now}</span>
              {member.now}
            </p>
          )}

          {bio && <p className="text-lede mt-8 max-w-[60ch] text-ink-2">{bio}</p>}
          {!isPi && locale !== 'en' && <p className="mt-3 text-[0.875rem] text-mute">{p.bioNote}</p>}

          {(isPi || member.interests.length > 0) && (
            <div className="mt-8">
              <p className="label mb-3">{p.interests}</p>
              <Tags items={isPi ? p.pi.focus : member.interests} />
            </div>
          )}

          <div className="mt-12">
            <MemberDetails member={member} locale={locale} />
            {isPi && (
              <div className="border-t border-line py-6">
                <p className="label mb-4">{p.path}</p>
                <Timeline items={PI_PATH} titles={p.pi.pathTitles} notes={p.pi.pathNotes} />
              </div>
            )}
          </div>

          <p className="mt-6 border-t border-line pt-6 text-ink-2">
            {isPi ? (
              <a href={`mailto:${member.email}`} className="measure font-medium text-ink">{member.email}</a>
            ) : (
              <>
                {fmt(p.reach, { name: member.name })}{' '}
                <a href={`mailto:${LAB_INFO.email}`} className="measure font-medium text-ink">{LAB_INFO.email}</a>
              </>
            )}
          </p>
        </div>
      </Container>

      <JsonLd data={personLd(member, role, locale)} />
      <JsonLd
        data={breadcrumbs(locale, [
          { name: t.nav.people, path: '/people' },
          { name: fullName(member), path: memberPath(member) },
        ])}
      />
    </article>
  );
}
