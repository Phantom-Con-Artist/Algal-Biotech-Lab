import { useRef } from 'react';
import { STORY } from '../data/story';
import { useChapterScroll } from '../hooks/useChapterScroll';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Hero } from '../components/home/Hero';
import { StoryChapter } from '../components/home/StoryChapter';
import { ClosingChapter } from '../components/home/ClosingChapter';
import { FocusSection } from '../components/focus/FocusSection';
import { useT } from '../i18n/I18nProvider';
import { ChapterRail } from '../components/home/ChapterRail';

export default function Home() {
  useDocumentTitle();
  const t = useT();
  const railLabels = [t.story.railIntro, ...STORY.map((c) => t.story.chapters[c.id].label), t.closing.label];
  const sections = useRef<(HTMLElement | null)[]>([]);
  const active = useChapterScroll(sections);

  const register = (i: number) => (el: HTMLElement | null) => {
    sections.current[i] = el;
  };
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <>
      <Hero sectionRef={register(0)} onBegin={() => sections.current[1]?.scrollIntoView({ behavior: 'smooth', block: 'center' })} />
      {STORY.map((chapter, i) => (
        <StoryChapter
          key={chapter.id}
          chapter={chapter}
          number={pad(i + 1)}
          side={i % 2 === 0 ? 'right' : 'left'}
          sectionRef={register(i + 1)}
        />
      ))}
      <FocusSection number={pad(STORY.length + 1)} />
      <ClosingChapter sectionRef={register(STORY.length + 1)} number={pad(STORY.length + 2)} />
      <ChapterRail active={active} labels={railLabels} sections={sections} />
    </>
  );
}
