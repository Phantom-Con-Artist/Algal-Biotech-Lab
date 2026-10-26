import Image from 'next/image';
import Link from 'next/link';
import { Leader } from '../common/ActionLink';
import { fmt, getDictionary, localePath, type Locale } from '../../i18n/config';
import { ALUMNI } from '../../data/members';
import { memberPath } from '../../utils/lab';

/** Where people went next, read like a departures board: who, when they were here, where they are now. */
export function AlumniList({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const t = d.people;
  return (
    <div>
      <p aria-hidden="true" className="hud hidden grid-cols-[4rem_1fr_1.4fr_1.5rem] gap-8 border-b border-line-strong pb-3 text-mute sm:grid">
        <span />
        <span>{t.alumniLabel}</span>
        <span>{t.now}</span>
        <span />
      </p>
      <ul>
        {ALUMNI.map((m) => (
          <li key={m.slug} className="border-b border-line">
            <Link href={localePath(locale, memberPath(m))} className="group grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 py-5 transition-colors duration-300 hover:bg-frost/60 sm:grid-cols-[4rem_1fr_1.4fr_1.5rem] sm:gap-8">
              <Image
                src={m.photo}
                alt={fmt(d.common.portraitOf, { name: m.name })}
                width={80}
                height={100}
                style={{ objectPosition: m.photoPosition }}
                className="aspect-[4/5] w-full object-cover grayscale transition duration-500 group-hover:grayscale-0"
              />
              <div>
                <p className="font-display text-[1.0625rem] font-light">{m.name}</p>
                <p className="hud mt-1 text-mute">{t.roles[m.role]} · {m.joined}</p>
              </div>
              <p className="col-span-3 col-start-1 text-[0.875rem] leading-relaxed sm:col-span-1 sm:col-start-3">
                <span className="hud mr-2 text-ink sm:hidden">{t.now}</span>
                {m.now}
              </p>
              <span className="col-start-3 row-start-1 text-mute transition-colors group-hover:text-ink sm:col-start-4"><Leader /></span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
