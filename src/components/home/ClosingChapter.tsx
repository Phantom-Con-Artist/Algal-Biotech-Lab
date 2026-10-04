import type { Ref } from 'react';
import { TEAM } from '../../data/team';
import { LAB_INFO } from '../../data/labData';
import { Container } from '../layout/Container';
import { Eyebrow } from '../common/Eyebrow';
import { Reveal } from '../common/Reveal';
import { ArrowLink } from '../common/ArrowLink';

export function ClosingChapter({ sectionRef, number }: { sectionRef: Ref<HTMLElement>; number: string }) {
  return (
    <section ref={sectionRef} aria-labelledby="closing-title" className="relative flex min-h-svh items-end pb-12 pt-24 md:items-center md:pb-0">
      <Container>
        <Reveal className="max-w-[33rem]">
          <Eyebrow number={number}>The lab</Eyebrow>
          <h2 id="closing-title" className="mt-4 font-serif text-[clamp(2.1rem,5.2vw,3.7rem)] leading-[1.02] tracking-[-0.015em]">
            The people who keep the cultures growing.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-soft md:text-base">
            Led by Dr. Amit Kumar Bajhaiya, with senior research fellows Arathi Sreenikethanam and Subhisha Raj, in the{' '}
            {LAB_INFO.department} at {LAB_INFO.institution}.
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
            <ArrowLink variant="solid" to="/about">Meet the lab</ArrowLink>
            <ArrowLink to="/explore">Read the papers</ArrowLink>
            <ArrowLink to="/contact">Get in touch</ArrowLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
