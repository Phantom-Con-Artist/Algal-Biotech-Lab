import { getDictionary, type Locale } from '../../i18n/config';
import { TALKS } from '../../data/recognition';

/** Leadership roles, then talks: two ledgers in the same hand as the funding above them. */
export function ServiceAndTalks({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).people;
  return (
    <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
      <section aria-labelledby="leadership-title" className="lg:col-span-5">
        <h3 id="leadership-title" className="hud mb-4 text-mute">{t.leadership}</h3>
        <ul className="border-t border-line-strong">
          {t.service.map((s) => (
            <li key={s} className="border-b border-line py-5 text-[0.9375rem] leading-relaxed">{s}</li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="talks-title" className="lg:col-span-7">
        <h3 id="talks-title" className="hud mb-4 text-mute">{t.presentedAt}</h3>
        <ul className="border-t border-line-strong">
          {TALKS.map((talk) => (
            <li key={talk.title} className="grid gap-1 border-b border-line py-5 sm:grid-cols-[7.5rem_1fr] sm:gap-6">
              <p className="hud text-ink sm:pt-1">{talk.venue}</p>
              <div>
                <p className="font-display text-[1.0625rem] font-light leading-snug">{talk.title}</p>
                <p className="mt-1 text-[0.875rem] text-mute">{talk.authors}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
