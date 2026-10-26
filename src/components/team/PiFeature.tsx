import Image from 'next/image';
import { fmt, getDictionary, localePath, type Locale } from '../../i18n/config';
import { fullName, PI, PI_PATH } from '../../data/members';
import { piPath } from '../../utils/lab';
import { ActionLink } from '../common/ActionLink';
import { ProfileLinks } from '../common/ProfileLinks';
import { Thaw } from '../common/Thaw';
import { Timeline } from './Timeline';

/**
 * The principal investigator as a held specimen: the portrait under frost that clears as it comes into
 * view, the readouts set around it, then the path that led here.
 */
export function PiFeature({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const copy = t.people.pi;
  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-20">
      <Thaw className="lg:col-span-5">
        <figure>
          <div className="ticks p-2 text-ink/70">
            <div className="relative aspect-[4/5] overflow-hidden bg-mist-lo">
              <Image
                src={PI.photo}
                alt={fmt(t.common.portraitOf, { name: fullName(PI) })}
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 38vw, 100vw"
                style={{ objectPosition: PI.photoPosition }}
                className="scale-[1.04] object-cover blur-md saturate-50 transition-[filter,transform] duration-[1600ms] ease-out-quart group-data-[thawed]:scale-100 group-data-[thawed]:blur-none group-data-[thawed]:saturate-100 motion-reduce:blur-none motion-reduce:saturate-100"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-frost/45 transition-opacity duration-[1600ms] ease-out-quart group-data-[thawed]:opacity-0 motion-reduce:opacity-0" />
            </div>
          </div>
          <figcaption className="hud mt-3 flex items-baseline justify-between gap-4 text-mute">
            <span>{copy.role}</span>
            <span className="text-ink">CUTN · 2020</span>
          </figcaption>
        </figure>
      </Thaw>

      <div className="flex flex-col gap-8 lg:col-span-7 lg:pt-4">
        <p className="text-lede max-w-[58ch] text-ink-2">{copy.bio}</p>
        <ol className="border-t border-line">
          {copy.focus.map((f, i) => (
            <li key={f} className="grid grid-cols-[2.5rem_1fr] items-baseline border-b border-line py-3">
              <span className="hud text-mute">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-[0.9375rem]">{f}</span>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <ActionLink href={localePath(locale, piPath)}>{t.home.viewProfile}</ActionLink>
          <ProfileLinks links={PI.links} profileLabel={t.people.profileLink} />
        </div>
      </div>

      <div className="lg:col-span-12">
        <h3 className="hud mb-4 text-mute">{t.people.path}</h3>
        <Timeline items={PI_PATH} titles={copy.pathTitles} notes={copy.pathNotes} />
      </div>
    </div>
  );
}
