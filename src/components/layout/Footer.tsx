import Image from 'next/image';
import Link from 'next/link';
import { DEVELOPER, LAB_INFO, NAV_ITEMS } from '../../data/labData';
import { getDictionary, localePath, type Locale } from '../../i18n/config';
import { Container } from './Container';
import cutnLogo from '../../assets/brand/cutn.webp';

const link = 'measure inline-flex min-h-11 items-center text-sm text-deep-ink sm:min-h-0 sm:py-1';

export function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-deep text-deep-ink">
      <Container className="grid gap-12 py-16 md:grid-cols-12 md:gap-8 md:py-20">
        <div className="md:col-span-5">
          <div className="flex items-start gap-4">
            <Image src={cutnLogo} alt={LAB_INFO.institution} width={44} height={59} className="h-14 w-auto rounded-sm bg-deep-ink/95 p-1" />
            <div>
              <p className="text-xl font-semibold tracking-tight">{LAB_INFO.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-deep-mute">
                {t.lab.department}, {t.lab.school}
                <br />
                {LAB_INFO.institution}
              </p>
            </div>
          </div>
        </div>

        <nav aria-label={t.footer.quick} className="md:col-span-3 md:col-start-7">
          <p className="label mb-3 !text-deep-mute">{t.footer.quick}</p>
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link href={localePath(locale, item.path)} className={link}>{t.nav[item.key]}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="label mb-3 !text-deep-mute">{t.footer.write}</p>
          <ul>
            <li><a href={`mailto:${LAB_INFO.email}`} className={link}>{LAB_INFO.email}</a></li>
            <li><a href={LAB_INFO.phoneHref} className={link}>{LAB_INFO.phone}</a></li>
            <li><a href={LAB_INFO.mapHref} target="_blank" rel="noopener" className={link}>{t.footer.map} ↗</a></li>
            <li><a href={LAB_INFO.website} target="_blank" rel="noopener" className={link}>{t.footer.cutn} ↗</a></li>
          </ul>
        </div>
      </Container>

      {/* The name returns at full width: the page's close, set as large as the measure allows. */}
      <Container>
        <p
          aria-hidden="true"
          className="select-none whitespace-nowrap pb-[4.6vw] text-[12.4vw] font-medium leading-[0.82] tracking-[-0.06em] text-deep-ink/90"
        >
          {LAB_INFO.shortName}
        </p>
      </Container>

      <Container className="flex flex-col gap-2 border-t border-deep-ink/15 py-6 font-mono text-[11px] text-deep-mute sm:flex-row sm:justify-between">
        <p>© {year} {t.lab.department}, {LAB_INFO.institution}</p>
        <p>{t.footer.developedBy} {DEVELOPER.name}</p>
      </Container>
      {t.machineNote && (
        <Container className="pb-6 font-mono text-[11px] text-deep-mute">
          <p>{t.machineNote}</p>
        </Container>
      )}
    </footer>
  );
}
