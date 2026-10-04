import { LAB_GALLERY } from '../../data/gallery';
import { useCoverflow } from '../../hooks/useCoverflow';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { CoverflowControls } from '../common/CoverflowControls';
import { useT } from '../../i18n/I18nProvider';

/** Swipeable coverflow of lab photographs, each frame tilted in 3D by its distance from centre. */
export function LabGallery() {
  const t = useT().about.gallery;
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const { track, current, goTo } = useCoverflow<HTMLUListElement>(LAB_GALLERY.length, { reduced });

  return (
    <div>
      <ul
        ref={track}
        aria-label={t.listLabel}
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[11vw] pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:-mx-8 md:gap-8 md:px-[calc(50%-320px)] lg:-mx-12 lg:gap-10 lg:px-[calc(50%-430px)] xl:px-[calc(50%-520px)] [&::-webkit-scrollbar]:hidden"
      >
        {LAB_GALLERY.map((src, i) => (
          <li key={src} className="w-[78vw] shrink-0 snap-center will-change-transform md:w-[640px] lg:w-[860px] xl:w-[1040px]">
            <img
              src={src}
              alt={t.alts[i]}
              width={1400}
              height={875}
              loading={i < 2 ? 'eager' : 'lazy'}
              decoding="async"
              className="aspect-[16/10] w-full border border-line object-cover"
            />
          </li>
        ))}
      </ul>
      <CoverflowControls current={current} count={LAB_GALLERY.length} caption={t.captions[current]} previousLabel={t.previous} nextLabel={t.next} onGo={goTo} />
    </div>
  );
}
