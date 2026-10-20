import Image from 'next/image';
import { getDictionary, type Locale } from '../../i18n/config';
import { LAB_GALLERY } from '../../data/gallery';
import { cn } from '../../utils/cn';
import { SectionHeader } from '../common/SectionHeader';
import { Container } from '../layout/Container';

/** Three photographs: the main laboratory wide, two details narrow, all one height on large screens. */
const SHOWN = [0, 1, 3];
const SPANS = ['col-span-2 lg:col-span-6', 'lg:col-span-3', 'lg:col-span-3'];

export function GalleryGrid({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <Container as="section" aria-labelledby="gallery-title" className="pb-24 md:pb-40">
      <SectionHeader number="04" label={t.home.galleryLabel} title={t.home.galleryTitle} id="gallery-title" />
      <ul aria-label={t.gallery.listLabel} className="grid grid-cols-2 gap-3 lg:grid-cols-12 lg:gap-4">
        {SHOWN.map((index, i) => (
          <li key={index} className={cn('reveal', SPANS[i])}>
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-line lg:aspect-auto lg:h-[min(34rem,42vw)]">
                <Image src={LAB_GALLERY[index]} alt={t.gallery.alts[index]} fill placeholder="blur" sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>
              <figcaption className="label mt-3">{t.gallery.captions[index]}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Container>
  );
}
