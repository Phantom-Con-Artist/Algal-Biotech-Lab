import type { Ref } from 'react';
import type { StoryChapter as Chapter } from '../../types';
import { getPublication } from '../../data/publications';
import { doiUrl, shortAuthors } from '../../utils/citation';
import { cn } from '../../utils/cn';
import { Container } from '../layout/Container';
import { Eyebrow } from '../common/Eyebrow';
import { Reveal } from '../common/Reveal';

interface Props {
  chapter: Chapter;
  number: string;
  side: 'left' | 'right';
  sectionRef: Ref<HTMLElement>;
}

export function StoryChapter({ chapter, number, side, sectionRef }: Props) {
  const paper = getPublication(chapter.paperId);
  const titleId = `chapter-${chapter.id}`;

  return (
    <section ref={sectionRef} aria-labelledby={titleId} className="relative flex min-h-svh items-end pb-12 pt-24 md:items-center md:pb-0">
      <Container>
        <Reveal className={cn('max-w-[33rem]', side === 'right' && 'md:ml-auto')}>
          <Eyebrow number={number}>{chapter.label}</Eyebrow>
          <h2 id={titleId} className="mt-4 font-serif text-[clamp(2.1rem,5.2vw,3.7rem)] leading-[1.02] tracking-[-0.015em]">
            {chapter.headline}
          </h2>
          <div className="mt-7 flex items-baseline gap-4 border-t border-line pt-5">
            <span className="font-serif text-4xl leading-none md:text-5xl">{chapter.figure.value}</span>
            <span className="max-w-[20ch] text-sm leading-snug text-mute">{chapter.figure.caption}</span>
          </div>
          <p className="mt-5 text-[15px] leading-relaxed text-soft md:text-base">{chapter.body}</p>
          <a
            href={doiUrl(paper)}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex min-h-11 items-center gap-2 font-mono text-xs text-mute transition-colors hover:text-leaf"
          >
            {shortAuthors(paper)} · {paper.venue} · {paper.year}
            <span aria-hidden="true">↗</span>
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
