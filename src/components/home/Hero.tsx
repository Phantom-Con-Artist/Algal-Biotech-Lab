import type { Ref } from 'react';
import { Container } from '../layout/Container';
import { ArrowLink } from '../common/ArrowLink';
import { Reveal } from '../common/Reveal';

interface Props {
  sectionRef: Ref<HTMLElement>;
  onBegin: () => void;
}

export function Hero({ sectionRef, onBegin }: Props) {
  return (
    <section ref={sectionRef} aria-labelledby="hero-title" className="relative flex min-h-svh flex-col justify-end pb-12 pt-28 md:pb-16">
      <Container>
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-mute">
            Algal Biotechnology Laboratory
            <span className="mx-2 text-line">/</span>
            Central University of Tamil Nadu
          </p>
          <h1 id="hero-title" className="mt-5 max-w-[15ch] font-serif text-[clamp(2.9rem,8.2vw,7rem)] leading-[0.94] tracking-[-0.025em] md:max-w-[17ch]">
            Ten micrometres wide.
            <span className="block text-mute">A whole factory inside.</span>
          </h1>
        </Reveal>
        <Reveal delay={150}>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-soft md:text-lg">
            We study how microalgae sense stress, store carbon and phosphorus, and how that biology can be engineered into
            fuels, fertilisers and bioactive compounds.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2">
            <ArrowLink variant="solid" onClick={onBegin}>Begin the story</ArrowLink>
            <ArrowLink to="/explore">Go straight to the research</ArrowLink>
          </div>
        </Reveal>
      </Container>
      <div aria-hidden="true" className="scroll-cue pointer-events-none absolute bottom-10 right-6 hidden text-center font-mono text-[11px] uppercase tracking-[0.2em] text-mute md:block lg:right-12">
        Scroll
      </div>
    </section>
  );
}
