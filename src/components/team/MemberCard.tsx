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
  /** Position in the roster, shown as a readout index. */
  index?: number;
}

/** A portrait in viewfinder ticks, graded into the mist until hovered, with the role as a readout. */
export function MemberCard({ member, locale, compact, index }: Props) {
  const t = getDictionary(locale);
  return (
    <article className="reveal group relative">
      <div className="ticks p-1.5 text-ink/60 transition-colors group-hover:text-ink">
        <div className="relative aspect-[4/5] overflow-hidden bg-mist-lo">
          <Image
            src={member.photo}
            alt={fmt(t.common.portraitOf, { name: fullName(member) })}
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw"
            style={{ objectPosition: member.photoPosition }}
            className="object-cover grayscale-[55%] contrast-[1.04] transition duration-700 ease-out-quart group-hover:scale-[1.03] group-hover:grayscale-0"
          />
        </div>
      </div>
      <div className={cn('pt-3', !compact && 'pt-4')}>
        <p className="hud flex justify-between gap-3 text-mute">
          <span className="truncate">{compact ? t.people.roles[member.role].split(' · ')[0] : t.people.roles[member.role]}</span>
          {index !== undefined && <span className="text-ink">{String(index).padStart(2, '0')}</span>}
        </p>
        <h3 className="mt-1.5 text-[0.9375rem] font-medium leading-snug">
          <Link href={localePath(locale, memberPath(member))} className="after:absolute after:inset-0">
            <span className="ruled">{fullName(member)}</span>
          </Link>
        </h3>
        {!compact && <p className="mt-1.5 line-clamp-2 text-[0.8125rem] text-mute">{member.interests.slice(0, 3).join(' · ')}</p>}
      </div>
    </article>
  );
}
