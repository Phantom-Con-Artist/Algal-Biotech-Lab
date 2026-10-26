import type { Locale } from '../i18n/config';
import { CellHero } from '../components/home/cell/CellHero';
import { PiClose } from '../components/home/PiClose';

/** One continuous scroll: the cell taken apart, then how the lab works, then the person who leads it. */
export function HomeView({ locale }: { locale: Locale }) {
  return (
    <>
      <CellHero locale={locale} />
      <PiClose locale={locale} />
    </>
  );
}
