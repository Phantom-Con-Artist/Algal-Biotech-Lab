import type { Locale } from '../i18n/config';
import { Hero } from '../components/home/Hero';
import { StatsStrip } from '../components/home/StatsStrip';
import { FocusBento } from '../components/home/FocusBento';
import { PeopleStrip } from '../components/home/PeopleStrip';
import { RecentPublications } from '../components/home/RecentPublications';
import { GalleryGrid } from '../components/home/GalleryGrid';
import { JoinBand } from '../components/home/JoinBand';

/** Six beats: statement, figures, the work, the people, the papers, the place, then the invitation. */
export function HomeView({ locale }: { locale: Locale }) {
  return (
    <>
      <Hero locale={locale} />
      <StatsStrip locale={locale} />
      <FocusBento locale={locale} />
      <PeopleStrip locale={locale} />
      <RecentPublications locale={locale} />
      <GalleryGrid locale={locale} />
      <JoinBand locale={locale} />
    </>
  );
}
