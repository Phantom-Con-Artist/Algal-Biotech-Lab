import { FOCUS_AREAS } from '../../data/focus';
import { useT } from '../../i18n/I18nProvider';
import { Container } from '../layout/Container';
import { Eyebrow } from '../common/Eyebrow';
import { Reveal } from '../common/Reveal';

export function FocusIntro({ number }: { number: string }) {
  const t = useT().focus;
  return (
    <section aria-labelledby="focus-title" className="relative flex min-h-[80svh] items-end pb-12 pt-24 md:items-center md:pb-0">
      <Container>
        <Reveal className="max-w-[36rem]">
          <Eyebrow number={number}>{t.eyebrow}</Eyebrow>
          <h2 id="focus-title" className="mt-4 font-serif text-[clamp(1.9rem,4.8vw,3.5rem)] leading-[1.02] tracking-[-0.015em]">
            {t.title}
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-soft md:text-base">{t.body}</p>
          <ol className="mt-7 grid grid-cols-2 gap-x-6 border-t border-line">
            {FOCUS_AREAS.map((a) => (
              <li key={a.id} className="flex min-h-11 items-center gap-3 border-b border-line text-sm text-paper">
                <span className="font-mono text-xs text-leaf">{a.number}</span>
                {t.areas[a.id].label}
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </section>
  );
}
