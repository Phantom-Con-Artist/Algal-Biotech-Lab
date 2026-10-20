import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
              className="aspect-[4/5] w-full rounded-[2px] object-cover grayscale transition duration-500 group-hover:grayscale-0"
            />
            <div>
              <p className="text-lg font-medium tracking-tight transition-colors group-hover:text-leaf">{m.name}</p>
              <p className="text-sm text-mute">{t.roles[m.role]} · {m.joined}</p>
            </div>
            <p className="col-span-3 col-start-1 text-sm leading-relaxed sm:col-span-1 sm:col-start-3">
              <span className="label mr-2 !text-leaf">{t.now}</span>
              {m.now}
            </p>
            <ArrowRight size={18} aria-hidden="true" className="col-start-3 row-start-1 text-mute transition-transform group-hover:translate-x-1 group-hover:text-leaf sm:col-start-4" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
