import Image from 'next/image';
import { getDictionary, type Locale } from '../../i18n/config';
import type { FocusArea as Area } from '../../types';
import { cn } from '../../utils/cn';
import { PaperRefs } from './PaperRefs';

/** One focus area: an image bento on one side, the field, the lab's angle and its papers on the other. */
export function FocusArea({ area, locale, flip }: { area: Area; locale: Locale; flip: boolean }) {
  const t = getDictionary(locale).research;
  const copy = t.areas[area.id];
  const [lead, ...rest] = area.images;

  return (
    <article id={area.id} aria-labelledby={`${area.id}-title`} className="reveal grid scroll-mt-24 gap-6 border-t border-line pt-6 lg:grid-cols-12 lg:gap-8 lg:pt-8">
      <div className={cn('grid grid-cols-2 gap-2 sm:gap-3 lg:col-span-7', flip && 'lg:order-2')}>
        <div className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-[3px] bg-line">
          <Image src={lead} alt={copy.alts[0]} fill placeholder="blur" sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
        </div>
        {rest.map((src, i) => (
          <div key={src.src} className={cn('relative aspect-[4/3] overflow-hidden rounded-[3px] bg-line', rest.length === 1 && 'col-span-2 aspect-[16/7]')}>
            <Image src={src} alt={copy.alts[i + 1]} fill placeholder="blur" sizes="(min-width: 1024px) 27vw, 50vw" className="object-cover" />
          </div>
        ))}
      </div>

      <div className={cn('flex flex-col gap-6 lg:col-span-5', flip && 'lg:order-1')}>
        <div>
          <p className="label">
            <span className="text-ink">{area.number}</span>
            <span className="mx-2">/</span>
            {copy.label}
          </p>
          <h3 id={`${area.id}-title`} className="text-h2 mt-3 font-medium">{copy.title}</h3>
        </div>
        <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <div>
            <dt className="label mb-1.5">{t.general}</dt>
            <dd className="text-base leading-relaxed text-ink-2">{copy.general}</dd>
          </div>
          <div className="border-l-2 border-leaf pl-4">
            <dt className="label mb-1.5 !text-leaf">{t.inLab}</dt>
            <dd className="text-base leading-relaxed">{copy.lab}</dd>
          </div>
        </dl>
        <PaperRefs ids={area.paperIds} label={t.papers} />
      </div>
    </article>
  );
}
