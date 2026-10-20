import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getDictionary, localePath, type Locale } from '../../i18n/config';
import { FOCUS_AREAS } from '../../data/focus';
import { cn } from '../../utils/cn';
import { BentoTile } from '../common/BentoTile';
import { SectionHeader } from '../common/SectionHeader';
import { Container } from '../layout/Container';

/** Alternating 7/5 then 5/7 spans: a quiet bento that still breaks the row of equal cards. */
const SPANS = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-5', 'lg:col-span-7'];

export function FocusBento({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const areas = t.research.areas;

  return (
    <Container as="section" aria-labelledby="focus-title" className="pb-24 md:pb-40">
      <SectionHeader number="01" label={t.home.focusLabel} title={t.home.focusTitle} id="focus-title" />
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-12 lg:gap-4">
        {FOCUS_AREAS.map((area, i) => {
          const copy = areas[area.id];
          return (
            <BentoTile key={area.id} as="article" className={cn('group overflow-hidden !p-0', SPANS[i])}>
              <div className="relative aspect-[16/10] overflow-hidden bg-line">
                <Image
                  src={area.images[0]}
                  alt={copy.alts[0]}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 55vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out-quart group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col gap-4 p-6 sm:p-8 lg:p-10">
                <p className="label">
                  <span className="text-ink">{area.number}</span>
                  <span className="mx-2">/</span>
                  {copy.label}
                </p>
                <h3 className="text-h3 font-medium">{copy.title}</h3>
                <p className="max-w-[52ch] leading-relaxed text-ink-2">{copy.lab}</p>
                <Link
                  href={`${localePath(locale, '/research')}#${area.id}`}
                  aria-label={`${t.research.inLab}: ${copy.label}`}
                  className="mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-2 text-base font-medium text-leaf after:absolute after:inset-0"
                >
                  <span className="measure">{t.research.inLab}</span>
                  <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </BentoTile>
          );
        })}
      </div>
    </Container>
  );
}
