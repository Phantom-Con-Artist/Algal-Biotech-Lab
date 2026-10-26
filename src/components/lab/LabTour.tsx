import { Plus } from 'lucide-react';
import { LOOP_TO, TOUR } from '../../data/labTour';
import { getDictionary, localePath, type Locale } from '../../i18n/config';
import { ActionLink } from '../common/ActionLink';
import { TourStage } from './TourStage';

const gutter = 'px-4 sm:px-8 lg:px-[clamp(2.5rem,4vw,4.5rem)]';

/**
 * The lab room as one scroll: a sticky 3D stage walks the corridor and the stations while the readouts
 * below pass over it. Each readout shows its name; its paragraph opens on demand, and every word is in the
 * page without WebGL or JavaScript.
 */
export function LabTour({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const tour = t.tour;

  return (
    <section aria-labelledby="tour-title" className="relative -mt-20">
      <TourStage stops={TOUR} labels={tour.labels} copy={{ fallback: tour.fallback, note: tour.note }} />

      <div className="relative z-10 -mt-[100svh]">
        <ol className="list-none" aria-label={tour.stopsLabel}>
          {TOUR.map((stop, i) => {
            // The loop stop wears the threshold's copy, so the seam where the walk restarts is invisible.
            const echo = stop.id === 'loop';
            const copy = tour.stops[stop.id === 'loop' ? 'threshold' : stop.id];
            const first = i === 0;
            return (
              <li key={stop.id} id={echo ? undefined : `tour-${stop.id}`} aria-hidden={echo || undefined} data-block={i} className={`flex items-end ${first ? 'min-h-svh pb-12 pt-28 md:pb-16' : 'min-h-[118svh] pb-[24svh] md:pb-[12svh]'} ${gutter}`}>
                {first ? (
                  <header className="max-w-[34rem]">
                    <h1 id="tour-title" className="text-[2.25rem] leading-[1.02] tracking-[-0.03em] md:text-display">{tour.title}</h1>
                    <p className="text-lede mt-5 max-w-[30rem] text-ink-2">{tour.lede}</p>
                    <p className="hud mt-10 flex items-center gap-3 text-mute">
                      <span aria-hidden="true" className="h-8 w-px origin-top animate-[tour-hint_2.4s_ease-in-out_infinite] bg-ink motion-reduce:animate-none" />
                      {tour.hint}
                    </p>
                  </header>
                ) : (
                  <article className="w-full max-w-[22rem] bg-frost/70 px-4 py-4 backdrop-blur-md max-md:-mx-2" aria-labelledby={`tour-${stop.id}-name`}>
                    <p className="hud flex items-center gap-3 text-mute">
                      <span className="text-ink">{String(echo ? LOOP_TO : i).padStart(2, '0')}</span>
                      <span aria-hidden="true" className="h-px flex-1 bg-line-strong" />
                      <span className="normal-case">{copy.measure}</span>
                    </p>
                    <h2 id={`tour-${stop.id}-name`} className="mt-3 text-[1.375rem] md:text-[1.625rem]">{copy.name}</h2>
                    <details className="group mt-2">
                      <summary className="hud flex min-h-11 cursor-pointer list-none items-center gap-2 text-ink-2 hover:text-ink [&::-webkit-details-marker]:hidden">
                        <Plus aria-hidden="true" size={12} strokeWidth={1.5} className="transition-transform duration-300 ease-out-quart group-open:rotate-45" />
                        {tour.read}
                      </summary>
                      <p className="pb-1 text-[0.875rem] text-ink-2">{copy.body}</p>
                    </details>
                    {stop.id === 'overview' && (
                      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                        <ActionLink href={localePath(locale, '/contact')} primary>{tour.end.contact}</ActionLink>
                        <ActionLink href={localePath(locale, '/people')}>{tour.end.people}</ActionLink>
                      </div>
                    )}
                  </article>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
