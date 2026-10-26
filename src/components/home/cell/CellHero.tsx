import { CELL_PARTS } from '../../../data/cell';
import { JOURNEY, JOURNEY_START, JOURNEY_TAGS } from '../../../data/journey';
import { PUBLICATIONS } from '../../../data/publications';
import { getDictionary, localePath, type Locale } from '../../../i18n/config';
import { shortAuthors, doiUrl } from '../../../utils/citation';
import { stainStyle } from '../../../utils/stain';
import { ActionLink } from '../../common/ActionLink';
import { CellStage } from './CellStage';

const gutter = 'px-4 sm:px-8 lg:px-[clamp(2.5rem,4vw,4.5rem)]';

/**
 * The home page's one continuous scene. A sticky 3D stage fills the screen; scrolling through the
 * readouts below peels the cell layer by layer, then pulls back through a culture into the lab where the
 * work is done. Every readout is ordinary text, so the story reads without WebGL or JavaScript.
 */
export function CellHero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const c = t.home.cell;
  const labels = Object.fromEntries(CELL_PARTS.map((p) => [p.id, { name: c.parts[p.id].name, measure: c.parts[p.id].measure }]));
  const j = c.journey;
  const tagNames: Record<string, string> = {
    light: j.cultivate.light,
    shaker: j.cultivate.shaker,
    ...j.stress.conditions,
    rotor: j.harvest.rotor,
    pellet: j.harvest.pellet,
    oil: j.products.oil,
    fertiliser: j.products.fertiliser,
    pigment: j.products.pigment,
    water: j.products.water,
  };
  const tags = JOURNEY_TAGS.map((tag) => ({ ...tag, name: tagNames[tag.id] }));

  return (
    <section id="cell" aria-labelledby="hero-title" className="relative -mt-20">
      <CellStage parts={CELL_PARTS} labels={labels} tags={tags} copy={{ keyLabel: c.keyLabel, scale: c.scale, loading: c.loading, fallback: c.fallback }} />

      <div className="relative z-10 -mt-[100svh]">
        <header data-block="0" className={`flex min-h-svh flex-col justify-end pb-10 pt-28 md:pb-16 ${gutter}`}>
          <div className="max-w-[36rem]">
            <h1 id="hero-title" className="text-[2.25rem] leading-[1.02] tracking-[-0.03em] md:text-display">{c.title}</h1>
            <p className="text-lede mt-4 line-clamp-4 max-w-[34rem] text-ink-2 md:mt-6 md:line-clamp-none">{c.lede}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
              <ActionLink href={localePath(locale, '/contact')} primary>{c.ctaWrite}</ActionLink>
              <ActionLink href={localePath(locale, '/research')}>{c.ctaResearch}</ActionLink>
            </div>
            <p className="hud mt-10 hidden text-mute md:block">{c.scrollHint}</p>
          </div>
        </header>

        <ol className="list-none">
          {CELL_PARTS.map((part) => {
            const copy = c.parts[part.id];
            const paper = PUBLICATIONS.find((p) => p.id === part.paperIds[0]);
            return (
              <li key={part.id} id={`cell-${part.id}`} data-block={part.key} style={stainStyle(part.stain)} className={`flex min-h-[125svh] items-end pb-[10svh] md:pb-[14svh] ${gutter}`}>
                <article className="w-full max-w-[25rem] max-md:-mx-2 max-md:bg-mist/85 max-md:px-3 max-md:py-4" aria-labelledby={`cell-${part.id}-name`}>
                  <p className="hud flex items-center gap-3 text-mute">
                    <span className="swatch" aria-hidden="true" />
                    <span>{String(part.key).padStart(2, '0')} / 09</span>
                    <span aria-hidden="true" className="h-px flex-1 bg-line-strong" />
                    <span className="normal-case">{copy.measure}</span>
                  </p>
                  <h2 id={`cell-${part.id}-name`} className="mt-3 text-[1.375rem] md:text-h2 md:mt-4">{copy.name}</h2>
                  <p className="mt-2 line-clamp-4 text-[0.8125rem] text-ink-2 md:mt-4 md:line-clamp-none md:text-[0.9375rem]">{copy.body}</p>
                  {(part.program || paper) && (
                    <dl className="hud mt-6 hidden md:grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-mute">
                      {part.program && (
                        <>
                          <dt>{c.program}</dt>
                          <dd className="normal-case tracking-normal">
                            <a className="ruled text-ink" href={`${localePath(locale, '/research')}#${part.program}`}>
                              {t.research.programs[part.program].title}
                            </a>
                          </dd>
                        </>
                      )}
                      {paper && (
                        <>
                          <dt>{c.paper}</dt>
                          <dd className="normal-case tracking-normal">
                            <a className="ruled text-ink" href={doiUrl(paper)} target="_blank" rel="noopener">
                              {shortAuthors(paper)}, {paper.venue.split(',')[0]} {paper.year}
                            </a>
                          </dd>
                        </>
                      )}
                    </dl>
                  )}
                </article>
              </li>
            );
          })}
        </ol>

        <div data-block="10" className={`flex min-h-[130svh] items-end pb-14 md:pb-20 ${gutter}`}>
          <div className="max-w-[30rem] max-md:-mx-2 max-md:bg-mist/85 max-md:px-3 max-md:py-4">
            <p className="caption text-mute"><b>{c.figure}</b>{c.caption}</p>
            <h2 className="text-h2 mt-8">{c.finalTitle}</h2>
            <p className="mt-4 text-ink-2">{c.finalBody}</p>
            <div className="mt-8">
              <ActionLink href={localePath(locale, '/research')}>{c.finalCta}</ActionLink>
            </div>
          </div>
        </div>

        <ol className="list-none" aria-label={j.label}>
          {JOURNEY.map((id, i) => {
            const chapter = j[id];
            return (
              <li key={id} id={`work-${id}`} data-block={JOURNEY_START + i} className={`flex min-h-[135svh] items-end pb-[10svh] md:pb-[14svh] ${gutter}`}>
                <article className="w-full max-w-[25rem] max-md:-mx-2 max-md:bg-mist/85 max-md:px-3 max-md:py-4" aria-labelledby={`work-${id}-name`}>
                  <p className="hud flex items-center gap-3 text-mute">
                    <span className="text-ink">{j.label}</span>
                    <span>{String(i + 1).padStart(2, '0')} / {String(JOURNEY.length).padStart(2, '0')}</span>
                    <span aria-hidden="true" className="h-px flex-1 bg-line-strong" />
                    <span className="normal-case">{chapter.measure}</span>
                  </p>
                  <h2 id={`work-${id}-name`} className="mt-3 text-[1.375rem] md:text-h2 md:mt-4">{chapter.name}</h2>
                  <p className="mt-2 line-clamp-4 text-[0.8125rem] text-ink-2 md:mt-4 md:line-clamp-none md:text-[0.9375rem]">{chapter.body}</p>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
