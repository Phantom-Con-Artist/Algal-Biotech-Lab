import Link from 'next/link';
import { fmt, getDictionary, localePath, type Locale } from '../i18n/config';
import { LAB_GALLERY, LAB_PHOTO_SLUGS, labPhotoPath } from '../data/gallery';
import { breadcrumbs } from '../utils/structuredData';
import { Container } from '../components/layout/Container';
import { JsonLd } from '../components/common/JsonLd';
import { Leader } from '../components/common/ActionLink';
import { Specimen } from '../components/common/Specimen';

/** One photograph of the laboratory on its own page, opened from the wall on the People page. */
export function LabPhotoView({ index, locale }: { index: number; locale: Locale }) {
  const t = getDictionary(locale);
  const g = t.gallery;
  const total = LAB_GALLERY.length;
  const prev = (index + total - 1) % total;
  const next = (index + 1) % total;

  return (
    <article>
      <Container className="pt-8 md:pt-12">
        <Link href={localePath(locale, '/explore')} className="hud group inline-flex min-h-11 items-center gap-3 text-ink-2 hover:text-ink">
          <span className="rotate-180"><Leader /></span>
          <span className="ruled">{g.photo.back}</span>
        </Link>
      </Container>

      <Container className="grid gap-10 pb-28 pt-6 md:pb-40 lg:grid-cols-12 lg:gap-12">
        <Specimen
          src={LAB_GALLERY[index]}
          alt={g.alts[index]}
          priority
          sizes="(min-width: 1024px) 66vw, 100vw"
          caption={g.photo.label}
          index={fmt(g.photo.of, { n: index + 1, total })}
          className="lg:col-span-8"
          imageClassName="aspect-[4/3]"
        />
        <div className="flex flex-col gap-6 lg:col-span-4 lg:pt-6">
          <div className="hud flex items-center gap-4 text-mute">
            <span className="text-ink">{String(index + 1).padStart(2, '0')}</span>
            <span>{g.photo.label}</span>
            <span aria-hidden="true" className="h-px flex-1 bg-line-strong" />
          </div>
          <h1 className="text-page">{g.captions[index]}</h1>
          <p className="text-lede text-ink-2">{g.alts[index]}.</p>
          <p className="text-[0.875rem] text-mute">{g.photo.where}</p>
          <nav aria-label={g.listLabel} className="mt-auto grid grid-cols-2 gap-4 border-t border-line-strong pt-6">
            <Link href={localePath(locale, labPhotoPath(prev))} className="group flex flex-col gap-1">
              <span className="hud flex items-center gap-2 text-mute"><span className="rotate-180"><Leader /></span>{g.photo.previous}</span>
              <span className="ruled">{g.captions[prev]}</span>
            </Link>
            <Link href={localePath(locale, labPhotoPath(next))} className="group flex flex-col items-end gap-1 text-right">
              <span className="hud flex items-center gap-2 text-mute">{g.photo.next}<Leader /></span>
              <span className="ruled">{g.captions[next]}</span>
            </Link>
          </nav>
        </div>
      </Container>

      <JsonLd
        data={breadcrumbs(locale, [
          { name: t.nav.people, path: '/people' },
          { name: g.captions[index], path: `/lab/${LAB_PHOTO_SLUGS[index]}` },
        ])}
      />
    </article>
  );
}
