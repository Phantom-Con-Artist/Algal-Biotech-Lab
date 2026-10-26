import Link from 'next/link';
import { getDictionary, localePath, type Locale } from '../i18n/config';
import { LAB_INFO } from '../data/labData';
import { breadcrumbs } from '../utils/structuredData';
import { JsonLd } from '../components/common/JsonLd';
import { Leader } from '../components/common/ActionLink';
import { buildWall } from '../components/team/wall/buildTiles';
import { CylinderWall } from '../components/team/wall/CylinderWall';

/** The whole lab on one turning wall that fills the screen; every panel is a way into the site. */
export function ExploreView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const w = t.gallery.wall;
  const wall = buildWall(locale, 4);
  return (
    <>
      <h1 className="sr-only">{w.explore}</h1>
      <CylinderWall tiles={wall.tiles} columns={wall.columns} rows={wall.rows} copy={{ label: w.explore, hint: w.scrollHint, previous: w.previous, next: w.next }}>
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-6 px-4 pt-5 sm:px-8 lg:px-[clamp(2.5rem,4vw,4.5rem)]">
          <p className="hud flex flex-col gap-1 text-mute">
            <span className="text-ink">{LAB_INFO.shortName}</span>
            <span>{w.explore}</span>
          </p>
          <Link href={localePath(locale)} className="hud group pointer-events-auto inline-flex min-h-11 items-center gap-3 text-ink">
            <span className="rotate-180"><Leader /></span>
            <span className="ruled">{w.home}</span>
          </Link>
        </div>
      </CylinderWall>
      <JsonLd data={breadcrumbs(locale, [{ name: t.nav.explore, path: '/explore' }])} />
    </>
  );
}
