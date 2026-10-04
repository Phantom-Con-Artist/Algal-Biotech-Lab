import type { Ref } from 'react';
import { TEAM } from '../../data/team';
import { Container } from '../layout/Container';
import { Eyebrow } from '../common/Eyebrow';
import { Reveal } from '../common/Reveal';
import { ArrowLink } from '../common/ArrowLink';
import { useT } from '../../i18n/I18nProvider';

export function ClosingChapter({ sectionRef, number }: { sectionRef: Ref<HTMLElement>; number: string }) {
  const t = useT().closing;
  return (
    <section ref={sectionRef} aria-labelledby="closing-title" className="relative flex min-h-svh items-end pb-12 pt-24 md:items-center md:pb-0">
      <Container>
        <Reveal className="max-w-[33rem]">
          <Eyebrow number={number}>{t.label}</Eyebrow>
          <h2 id="closing-title" className="mt-4 font-serif text-[clamp(1.9rem,4.4vw,3.2rem)] leading-[1.02] tracking-[-0.015em]">
            {t.title}
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-soft md:text-base">
            {t.body}
          </p>
          <ul className="mt-7 flex gap-3">
            {TEAM.map((m) => (
              <li key={m.id}>
                <img
                  src={m.photo}
                  alt={m.name}
                  width={72}
                  height={72}
                  loading="lazy"
                  style={{ objectPosition: m.photoPosition }}
                  className="size-[72px] border border-line object-cover"
                />
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2">
            <ArrowLink variant="solid" to="/about">{t.meet}</ArrowLink>
            <ArrowLink to="/explore">{t.papers}</ArrowLink>
            <ArrowLink to="/contact">{t.touch}</ArrowLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
