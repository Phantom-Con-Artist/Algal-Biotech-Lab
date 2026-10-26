import { getDictionary, type Locale } from '../i18n/config';
import { breadcrumbs } from '../utils/structuredData';
import { JsonLd } from '../components/common/JsonLd';
import { LabTour } from '../components/lab/LabTour';
import { Preloader } from '../components/common/Preloader';
import { TOUR_ASSETS } from '../data/assets3d';

/** The lab room, walked by scroll: corridor, door, then each station coming into colour. */
export function LabTourView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <>
      <Preloader critical={TOUR_ASSETS} label={t.common.preparing} />
      <LabTour locale={locale} />
      <JsonLd data={breadcrumbs(locale, [{ name: t.nav.lab, path: '/lab' }])} />
    </>
  );
}
