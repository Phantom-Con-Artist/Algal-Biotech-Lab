import Image from 'next/image';
import Link from 'next/link';
import { Leader } from '../common/ActionLink';
import { fmt, getDictionary, localePath, type Locale } from '../../i18n/config';
import { ALUMNI } from '../../data/members';
import { memberPath } from '../../utils/lab';

export function AlumniList({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).people;
  const common = getDictionary(locale).common;
  return (
    <ul className="border-t border-line">
      {ALUMNI.map((m) => (
        <li key={m.slug} className="reveal border-b border-line">
          <Link href={localePath(locale, memberPath(m))} className="group grid grid-cols-[4rem_1fr_auto] items-center gap-4 py-5 sm:grid-cols-[5rem_1fr_1.4fr_auto] sm:gap-8">
            <Image
              src={m.photo}
              alt={fmt(common.portraitOf, { name: m.name })}
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
              <span className="hud mr-2 text-ink">{t.now}</span>
              {m.now}
            </p>
            <span className="col-start-3 row-start-1 text-mute group-hover:text-ink sm:col-start-4"><Leader /></span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
