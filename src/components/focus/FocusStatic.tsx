import { FOCUS_AREAS } from '../../data/focus';
import { Container } from '../layout/Container';
import { FocusCopy } from './FocusCopy';
import { useT } from '../../i18n/I18nProvider';

/** Reduced-motion fallback: the same content as plain, stacked sections. */
export function FocusStatic() {
  const t = useT().focus;
  return (
    <>
      {FOCUS_AREAS.map((area) => (
        <Container as="section" key={area.id} className="grid gap-8 py-16 md:grid-cols-2 md:gap-14 md:py-24">
          <div className="max-w-[34rem]">
            <FocusCopy area={area} />
          </div>
          <div className="space-y-4">
            {area.images.map((src, k) => (
              <figure key={src}>
                <img src={src} alt={t.areas[area.id].alts[k] ?? ''} width={1200} height={670} loading="lazy" className="aspect-[16/9] w-full border border-line object-cover" />
                <figcaption className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-mute">{t.illustrative}</figcaption>
              </figure>
            ))}
          </div>
        </Container>
      ))}
    </>
  );
}
