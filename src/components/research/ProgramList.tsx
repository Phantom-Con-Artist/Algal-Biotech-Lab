import { CELL_PARTS } from '../../data/cell';
import { getDictionary, localePath, type Locale } from '../../i18n/config';
import { PROGRAMS } from '../../data/research';
import { stainStyle } from '../../utils/stain';
import { Tags } from '../common/Tags';
import { PaperRefs } from './PaperRefs';

/** Six programmes as ruled rows; each names the structure of the cell it studies and links back to it. */
export function ProgramList({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const r = t.research;
  return (
    <ol className="border-t border-line-strong">
      {PROGRAMS.map((p) => {
        const copy = r.programs[p.id];
        const structures = CELL_PARTS.filter((c) => c.program === p.id);
        return (
          <li key={p.id} id={p.id} className="reveal grid scroll-mt-24 gap-6 border-b border-line py-10 md:grid-cols-12 md:gap-10 md:py-14">
            <div className="flex flex-col gap-3 md:col-span-3">
              <span className="key text-[2.5rem] leading-none">{p.number}</span>
              {structures.map((s) => (
                <a key={s.id} href={`${localePath(locale, '/')}#cell-${s.id}`} style={stainStyle(s.stain)} className="hud group inline-flex min-h-8 items-center gap-2 text-mute hover:text-ink">
                  <span className="swatch" aria-hidden="true" />
                  <span className="ruled">{t.home.cell.parts[s.id].name}</span>
                </a>
              ))}
            </div>
            <div className="md:col-span-5">
              <h3 className="text-h3">{copy.title}</h3>
              <p className="mt-4 text-ink-2">{copy.summary}</p>
              <Tags items={copy.keywords} className="mt-5" />
            </div>
            <div className="md:col-span-4">
              <PaperRefs ids={p.paperIds} label={r.papers} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
