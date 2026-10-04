import { PROGRAMS } from '../../data/research';
import { getPublication } from '../../data/publications';
import { doiUrl, shortAuthors } from '../../utils/citation';
import { Reveal } from '../common/Reveal';
import { useT } from '../../i18n/I18nProvider';

export function ProgramList() {
  const t = useT().explore.programs;
  return (
    <ol className="border-t border-line">
      {PROGRAMS.map((p) => (
        <li key={p.id} className="border-b border-line">
          <Reveal className="grid gap-6 py-10 md:grid-cols-12 md:gap-8 md:py-14">
            <span className="font-mono text-xs text-leaf md:col-span-1 md:pt-3">{p.number}</span>
            <div className="md:col-span-5">
              <h3 className="font-serif text-[clamp(1.7rem,3.2vw,2.5rem)] leading-[1.05] tracking-[-0.01em]">{t[p.id].title}</h3>
              <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-mute">
                {t[p.id].keywords.map((k) => (
                  <li key={k}>#{k.toLowerCase().replace(/\s+/g, '-')}</li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-6">
              <p className="text-[15px] leading-relaxed text-soft md:text-base">{t[p.id].summary}</p>
              <ul className="mt-5">
                {p.paperIds.map((id) => {
                  const pub = getPublication(id);
                  return (
                    <li key={id}>
                      <a
                        href={doiUrl(pub)}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex min-h-11 items-baseline gap-3 py-2 text-sm text-mute transition-colors hover:text-paper"
                      >
                        <span className="shrink-0 font-mono text-xs">{pub.year}</span>
                        <span className="leading-snug">
                          <span className="text-soft group-hover:text-leaf">{pub.title}</span>
                          <span className="ml-2 font-mono text-xs">{shortAuthors(pub)}</span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
