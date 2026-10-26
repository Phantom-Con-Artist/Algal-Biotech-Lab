import { getDictionary, type Locale } from '../../i18n/config';
import type { FocusArea as Area } from '../../types';
import { cn } from '../../utils/cn';
import { PaperRefs } from './PaperRefs';

/** One focus area: its 3D specimen on one side; the field, the lab's angle and its papers on the other. */
export function FocusArea({ area, locale, flip }: { area: Area; locale: Locale; flip: boolean }) {
  const t = getDictionary(locale).research;
  const copy = t.areas[area.id];
  return (
    <article id={area.id} aria-labelledby={`${area.id}-title`} className="reveal grid scroll-mt-24 gap-8 lg:grid-cols-12 lg:gap-12">
      {/* The specimen: a 3D object drawn into this frame by the page's one shared canvas. */}
      <figure className={cn('lg:col-span-7', flip && 'lg:order-2')}>
        <div className="ticks p-2 text-ink/70">
          <div data-specimen={area.id} role="img" aria-label={copy.alts[0]} className="aspect-square bg-[radial-gradient(60%_55%_at_50%_45%,var(--color-mist-hi),transparent)] sm:aspect-[4/3]" />
        </div>
        <figcaption className="hud mt-3 flex items-baseline justify-between gap-4 text-mute">
          <span>{copy.label}</span>
          <span className="text-ink">{`${area.number} / 04`}</span>
        </figcaption>
      </figure>

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
