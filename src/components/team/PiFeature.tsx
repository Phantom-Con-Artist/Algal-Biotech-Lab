import Image from 'next/image';
import { fmt, getDictionary, localePath, type Locale } from '../../i18n/config';
import { fullName, PI, PI_PATH } from '../../data/members';
import { piPath } from '../../utils/lab';
import { ArrowLink } from '../common/ArrowLink';
import { BentoTile } from '../common/BentoTile';
import { ProfileLinks } from '../common/ProfileLinks';
import { Tags } from '../common/Tags';
import { Timeline } from './Timeline';

export function PiFeature({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const copy = t.people.pi;
  return (
    <div className="grid gap-2 sm:gap-3 lg:grid-cols-12">
      <BentoTile className="relative aspect-[4/5] overflow-hidden !p-2 sm:aspect-[16/10] lg:col-span-4 lg:aspect-auto lg:min-h-[28rem]">
        <div className="relative h-full w-full overflow-hidden">
        <Image
          src={PI.photo}
          alt={fmt(t.common.portraitOf, { name: fullName(PI) })}
          fill
          placeholder="blur"
          sizes="(min-width: 1024px) 33vw, 100vw"
          style={{ objectPosition: PI.photoPosition }}
          className="object-cover saturate-[0.85]"
        />
        </div>
      </BentoTile>
      <BentoTile as="article" className="gap-6 lg:col-span-8">
        <p className="label">{copy.role}</p>
        <p className="text-lede max-w-2xl text-ink-2">{copy.bio}</p>
        <Tags items={copy.focus} />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ProfileLinks links={PI.links} profileLabel={t.people.profileLink} />
          <ArrowLink href={localePath(locale, piPath)}>{t.home.viewProfile}</ArrowLink>
        </div>
      </BentoTile>
      <BentoTile className="lg:col-span-12">
        <p className="label mb-4">{t.people.path}</p>
        <Timeline items={PI_PATH} titles={copy.pathTitles} notes={copy.pathNotes} />
      </BentoTile>
    </div>
  );
}
