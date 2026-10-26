import { CELL_PARTS } from '../../../data/cell';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import { JOURNEY, JOURNEY_START, JOURNEY_TAGS, LEAD_BLOCK } from '../../../data/journey';
import { fullName, PI } from '../../../data/members';
import { piPath } from '../../../utils/lab';
import { PUBLICATIONS } from '../../../data/publications';
import { fmt, getDictionary, localePath, type Locale } from '../../../i18n/config';
import { shortAuthors, doiUrl } from '../../../utils/citation';
import { stainStyle } from '../../../utils/stain';
import { ActionLink } from '../../common/ActionLink';
import { ProfileLinks } from '../../common/ProfileLinks';
import { CellStage } from './CellStage';

const gutter = 'px-4 sm:px-8 lg:px-[clamp(2.5rem,4vw,4.5rem)]';
/** A readout over the scene: frosted, so the 3D reads through it, and narrow, so the 3D leads. */
const plate = 'w-full max-w-[23rem] bg-frost/70 px-4 py-4 backdrop-blur-md max-md:-mx-2';

/** The paragraph behind a readout, opened on demand; it stays in the page for readers and search. */
function More({ label, children }: { label: string; children: ReactNode }) {
  return (
    <details className="group mt-1">
      <summary className="hud flex min-h-11 cursor-pointer list-none items-center gap-2 text-ink-2 hover:text-ink [&::-webkit-details-marker]:hidden">
        <Plus aria-hidden="true" size={12} strokeWidth={1.5} className="transition-transform duration-300 ease-out-quart group-open:rotate-45" />
        {label}
      </summary>
      <div className="pb-1 text-[0.875rem] text-ink-2">{children}</div>
    </details>
  );
}

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
  const lead = c.lead;
  const tags = [
    ...JOURNEY_TAGS.map((tag) => ({ ...tag, name: tagNames[tag.id] })),
    { id: 'lead', chapter: 'lead' as const, node: '', offset: [0, 0, 0] as [number, number, number], name: fullName(PI) },
  ];

  return (
    <section id="cell" aria-labelledby="hero-title" className="relative -mt-20">
      <CellStage parts={CELL_PARTS} labels={labels} tags={tags} copy={{ keyLabel: c.keyLabel, scale: c.scale, fallback: c.fallback }} />

      <div className="relative z-10 -mt-[100svh]">
        <header data-block="0" className={`flex min-h-svh flex-col justify-end pb-10 pt-28 md:pb-16 ${gutter}`}>
          <div className="max-w-[36rem]">
            <h1 id="hero-title" className="text-[2.25rem] leading-[1.02] tracking-[-0.03em] md:text-display">{c.title}</h1>
            {/* On a phone the cell and the title carry the first screen; the sentence stays for readers and search. */}
            <p className="text-lede mt-4 max-w-[34rem] text-ink-2 max-md:sr-only md:mt-6">{c.lede}</p>
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
              <li key={part.id} id={`cell-${part.id}`} data-block={part.key} style={stainStyle(part.stain)} className={`flex min-h-[125svh] items-end pb-[26svh] md:pb-[14svh] ${gutter}`}>
                <article className={plate} aria-labelledby={`cell-${part.id}-name`}>
                  <p className="hud flex items-center gap-3 text-mute">
                    <span className="swatch" aria-hidden="true" />
                    <span>{String(part.key).padStart(2, '0')} / 09</span>
                    <span aria-hidden="true" className="h-px flex-1 bg-line-strong" />
                    <span className="normal-case">{copy.measure}</span>
                  </p>
                  <h2 id={`cell-${part.id}-name`} className="mt-3 text-[1.375rem] md:text-[1.75rem]">{copy.name}</h2>
                  <More label={c.read}>
                    <p>{copy.body}</p>
                    {(part.program || paper) && (
                      <dl className="hud mt-4 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-mute">
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
                  </More>
                </article>
              </li>
            );
          })}
        </ol>

        <div data-block="10" className={`flex min-h-[130svh] items-end pb-[24svh] md:pb-20 ${gutter}`}>
          <div className={`${plate} max-w-[28rem]`}>
            <h2 className="text-[1.5rem] md:text-h2">{c.finalTitle}</h2>
            <More label={c.read}>
              <p>{c.finalBody}</p>
              <p className="caption mt-4 text-mute"><b>{c.figure}</b>{c.caption}</p>
            </More>
            <div className="mt-2">
              <ActionLink href={localePath(locale, '/research')}>{c.finalCta}</ActionLink>
            </div>
          </div>
        </div>

        <ol className="list-none" aria-label={j.label}>
          {JOURNEY.map((id, i) => {
            const chapter = j[id];
            return (
              <li key={id} id={`work-${id}`} data-block={JOURNEY_START + i} className={`flex min-h-[135svh] items-end pb-[28svh] md:pb-[14svh] ${gutter}`}>
                <article className={plate} aria-labelledby={`work-${id}-name`}>
                  <p className="hud flex items-center gap-3 text-mute">
                    <span className="text-ink max-md:hidden">{j.label}</span>
                    <span>{String(i + 1).padStart(2, '0')} / {String(JOURNEY.length).padStart(2, '0')}</span>
                    <span aria-hidden="true" className="h-px flex-1 bg-line-strong" />
                    <span className="normal-case">{chapter.measure}</span>
                  </p>
                  <h2 id={`work-${id}-name`} className="mt-3 text-[1.375rem] md:text-[1.75rem]">{chapter.name}</h2>
                  <More label={c.read}>
                    <p>{chapter.body}</p>
                  </More>
                </article>
              </li>
            );
          })}
        </ol>

        {/* The close: the camera has entered the lab room, and the person who leads it is read here. */}
        <div id="lead" data-block={LEAD_BLOCK} className={`flex min-h-[150svh] items-end pb-14 md:pb-20 ${gutter}`}>
          <article className={`${plate} max-w-[26rem]`} aria-labelledby="lead-name">
            <div className="flex items-start gap-4">
              <div className="ticks shrink-0 p-1 text-ink/70">
                <Image src={PI.photo} alt={fmt(t.common.portraitOf, { name: fullName(PI) })} sizes="96px" placeholder="blur" className="aspect-[4/5] w-20 object-cover md:w-24" />
              </div>
              <div className="min-w-0">
                <h2 id="lead-name" className="text-[1.375rem] leading-[1.1] md:text-[1.75rem]">{fullName(PI)}</h2>
                <p className="hud mt-2 normal-case tracking-normal text-ink-2">{t.people.pi.role}</p>
              </div>
            </div>
            <More label={c.read}>
              <p>{t.people.pi.bio}</p>
              <div className="mt-3">
                <ProfileLinks links={PI.links} profileLabel={t.people.profileLink} />
              </div>
            </More>
            <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2">
              <ActionLink href={localePath(locale, '/lab')} primary>{lead.tour}</ActionLink>
              <ActionLink href={localePath(locale, piPath)}>{lead.profile}</ActionLink>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
