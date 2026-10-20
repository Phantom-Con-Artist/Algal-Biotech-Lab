import Image from 'next/image';
import Link from 'next/link';
import { fmt, getDictionary, localePath, type Locale } from '../../i18n/config';
import { fullName } from '../../data/members';
import { memberPath } from '../../utils/lab';
import type { LabMember } from '../../types';
import { cn } from '../../utils/cn';

interface Props {
  member: LabMember;
  locale: Locale;
  /** 'compact' drops the interests line, for the home-page strip. */
  compact?: boolean;
}

export function MemberCard({ member, locale, compact }: Props) {
  const t = getDictionary(locale);
  return (
    <article className="reveal group relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] border border-line bg-line">
        <Image
          src={member.photo}
          alt={fmt(t.common.portraitOf, { name: fullName(member) })}
          fill
          placeholder="blur"
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw"
          style={{ objectPosition: member.photoPosition }}
          className="object-cover grayscale-[30%] transition duration-700 ease-out-quart group-hover:scale-[1.03] group-hover:grayscale-0"
        />
      </div>
      <div className={cn('pt-3', !compact && 'pt-4')}>
        <p className="label">{compact ? t.people.roles[member.role].split(' · ')[0] : t.people.roles[member.role]}</p>
        <h3 className="mt-1.5 text-base font-medium leading-snug tracking-tight sm:text-lg">
          <Link href={localePath(locale, memberPath(member))} className="after:absolute after:inset-0">
            <span className="measure">{fullName(member)}</span>
          </Link>
        </h3>
        {!compact && (
          <p className="mt-1.5 line-clamp-2 text-sm text-mute">{member.interests.slice(0, 3).join(' · ')}</p>
        )}
      </div>
    </article>
  );
}
