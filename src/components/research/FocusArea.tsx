import { getDictionary, type Locale } from '../../i18n/config';
import type { FocusArea as Area } from '../../types';
import { cn } from '../../utils/cn';
import { Specimen } from '../common/Specimen';
import { PaperRefs } from './PaperRefs';

/** One focus area: its specimens on one side; the field, the lab's angle and its papers on the other. */
export function FocusArea({ area, locale, flip }: { area: Area; locale: Locale; flip: boolean }) {
  const t = getDictionary(locale).research;
  const copy = t.areas[area.id];
  const [lead, ...rest] = area.images;

  return (
    <article id={area.id} aria-labelledby={`${area.id}-title`} className="reveal grid scroll-mt-24 gap-8 lg:grid-cols-12 lg:gap-12">
      <div className={cn('grid grid-cols-2 gap-4 lg:col-span-7', flip && 'lg:order-2')}>
        <Specimen src={lead} alt={copy.alts[0]} sizes="(min-width: 1024px) 55vw, 100vw" className="col-span-2" imageClassName="aspect-[16/9]" caption={copy.label} index={`${area.number} / 04`} />
        {rest.map((src, i) => (
          <Specimen key={src.src} src={src} alt={copy.alts[i + 1]} sizes="(min-width: 1024px) 27vw, 50vw" className={cn(rest.length === 1 && 'col-span-2')} imageClassName={rest.length === 1 ? 'aspect-[16/7]' : 'aspect-[4/3]'} />
        ))}
      </div>

      <div className={cn('flex flex-col gap-8 lg:col-span-5', flip && 'lg:order-1')}>
        <h3 id={`${area.id}-title`} className="text-h2">{copy.title}</h3>
        <dl className="grid gap-6">
          <div>
            <dt className="hud mb-2 text-mute">{t.general}</dt>
            <dd className="text-ink-2">{copy.general}</dd>
          </div>
          <div>
            <dt className="hud mb-2 flex items-center gap-3 text-ink">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-eyespot" />
              {t.inLab}
            </dt>
            <dd>{copy.lab}</dd>
          </div>
        </dl>
        <PaperRefs ids={area.paperIds} label={t.papers} />
      </div>
    </article>
  );
}
