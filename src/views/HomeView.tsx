import { getDictionary, type Locale } from '../i18n/config';
import { HOME_CRITICAL, HOME_DEFERRED } from '../data/assets3d';
import { Preloader } from '../components/common/Preloader';
import { CellHero } from '../components/home/cell/CellHero';
import { HomeIndex } from '../components/home/HomeIndex';

/** One continuous scroll: the cell taken apart, how the lab works, the lab room and who leads it, then the way on. */
export function HomeView({ locale }: { locale: Locale }) {
  return (
    <>
      <Preloader critical={HOME_CRITICAL} deferred={HOME_DEFERRED} label={getDictionary(locale).common.preparing} />
      <CellHero locale={locale} />
      <HomeIndex locale={locale} />
    </>
  );
}
