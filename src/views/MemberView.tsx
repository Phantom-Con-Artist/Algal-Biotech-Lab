import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { fmt, getDictionary, localePath, type Locale } from '../i18n/config';
import { fullName, PI_PATH } from '../data/members';
import { LAB_INFO } from '../data/labData';
import type { LabMember } from '../types';
import { breadcrumbs, personLd } from '../utils/structuredData';
import { memberPath } from '../utils/lab';
import { Container } from '../components/layout/Container';
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
        <Link href={localePath(locale, '/people')} className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink-2 hover:text-ink">
          <ArrowLeft size={16} aria-hidden="true" className="transition-transform group-hover:-translate-x-0.5" />
          <span className="measure">{p.back}</span>
        </Link>
      </Container>

      <Container className="grid gap-10 pb-28 pt-6 md:pb-44 md:pt-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-[4px] bg-line lg:max-w-none">
              <Image
                src={member.photo}
                alt={fmt(t.common.portraitOf, { name: fullName(member) })}
                fill
                priority
                placeholder="blur"
                sizes="(min-width: 1024px) 33vw, 28rem"
                style={{ objectPosition: member.photoPosition }}
                className="object-cover"
              />
            </div>
            <div className="mt-4">
              <ProfileLinks links={member.links} profileLabel={p.profileLink} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <p className="label">{role}</p>
          <h1 className="text-page mt-4 font-medium">{fullName(member)}</h1>
          <p className="label mt-6">
            {member.status === 'alumni' ? `${p.alumniLabel} · ` : ''}
            {fmt(p.joined, { year: member.joined })}
          </p>

          {member.now && (
            <p className="mt-6 max-w-[56ch] rounded-[4px] bg-leaf-soft px-5 py-4 text-base">
              <span className="label mr-2 !text-leaf">{p.now}</span>
              {member.now}
            </p>
          )}

          {bio && <p className="text-lede mt-8 max-w-[60ch] text-ink-2">{bio}</p>}
          {!isPi && locale !== 'en' && <p className="mt-3 text-sm text-mute">{p.bioNote}</p>}

          <div className="mt-8">
            <p className="label mb-3">{p.interests}</p>
            <Tags items={isPi ? p.pi.focus : member.interests} />
          </div>

          <div className="mt-12">
            <MemberDetails member={member} locale={locale} />
            {isPi && (
              <div className="border-t border-line py-6">
                <p className="label mb-4">{p.path}</p>
                <Timeline items={PI_PATH} titles={p.pi.pathTitles} notes={p.pi.pathNotes} />
              </div>
            )}
          </div>

          <p className="mt-6 border-t border-line pt-6 text-base text-ink-2">
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
