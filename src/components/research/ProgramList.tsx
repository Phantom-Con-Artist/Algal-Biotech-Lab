import { getDictionary, type Locale } from '../../i18n/config';
import { PROGRAMS } from '../../data/research';
import { BentoTile } from '../common/BentoTile';
import { Tags } from '../common/Tags';
import { PaperRefs } from './PaperRefs';

/** Six programmes as a two-column bento; each tile carries its summary, keywords and key papers. */
export function ProgramList({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).research;
  return (
    <div className="grid gap-2 sm:gap-3 md:grid-cols-2">
      {PROGRAMS.map((p) => {
        const copy = t.programs[p.id];
        return (
          <BentoTile key={p.id} as="article" id={p.id} className="scroll-mt-24 gap-5">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-h3 font-medium">{copy.title}</h3>
              <span className="font-mono text-xs text-mute">{p.number}</span>
            </div>
            <p className="text-base leading-relaxed text-ink-2">{copy.summary}</p>
            <Tags items={copy.keywords} />
            <div className="mt-auto pt-2">
              <PaperRefs ids={p.paperIds} label={t.papers} />
            </div>
          </BentoTile>
        );
      })}
    </div>
  );
}
