import type { ReactNode } from 'react';
import { Container } from '../layout/Container';
import { Eyebrow } from './Eyebrow';
import { Reveal } from './Reveal';

interface Props {
  number: string;
  label: string;
  title: ReactNode;
  lede: string;
}

export function PageIntro({ number, label, title, lede }: Props) {
  return (
    <Container as="section" className="pb-14 pt-32 md:pb-24 md:pt-44">
      <Reveal>
        <Eyebrow number={number}>{label}</Eyebrow>
        <h1 className="mt-6 max-w-[16ch] font-serif text-[clamp(2.8rem,8vw,6.5rem)] leading-[0.95] tracking-[-0.02em]">
          {title}
        </h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-soft md:text-lg">{lede}</p>
      </Reveal>
    </Container>
  );
}
