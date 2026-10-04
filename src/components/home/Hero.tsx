import type { Ref } from 'react';
import { Container } from '../layout/Container';
import { ArrowLink } from '../common/ArrowLink';
import { Reveal } from '../common/Reveal';
import { LAB_INFO } from '../../data/labData';
import { useT } from '../../i18n/I18nProvider';

interface Props {
  sectionRef: Ref<HTMLElement>;
  onBegin: () => void;
}

export function Hero({ sectionRef, onBegin }: Props) {
  const t = useT();
  return (
    <section ref={sectionRef} aria-labelledby="hero-title" className="relative flex min-h-svh flex-col justify-end pb-12 pt-28 md:pb-16">
      <Container>
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-mute">
            {LAB_INFO.name}
            <span className="mx-2 text-line">/</span>
            {LAB_INFO.institution}
          </p>
          <h1 id="hero-title" className="mt-5 max-w-[20ch] font-serif text-[clamp(2.5rem,7vw,6rem)] leading-[0.94] tracking-[-0.025em]">
            {t.hero.title1}
            <span className="block text-mute">{t.hero.title2}</span>
          </h1>
        </Reveal>
        <Reveal delay={150}>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-soft md:text-lg">
            {t.hero.lede}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2">
            <ArrowLink variant="solid" onClick={onBegin}>{t.hero.begin}</ArrowLink>
            <ArrowLink to="/explore">{t.hero.straight}</ArrowLink>
          </div>
        </Reveal>
      </Container>
      <div aria-hidden="true" className="scroll-cue pointer-events-none absolute bottom-10 right-6 hidden text-center font-mono text-[11px] uppercase tracking-[0.2em] text-mute md:block lg:right-12">
        {t.hero.scroll}
      </div>
    </section>
  );
}
