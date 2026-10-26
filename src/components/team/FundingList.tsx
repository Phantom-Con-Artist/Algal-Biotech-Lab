import { getDictionary, type Locale } from '../../i18n/config';
import { GRANTS, RECOGNITION } from '../../data/recognition';

/** Grants and awards as two ledgers: period or year on the left, what and from whom on the right. */
export function FundingList({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).people;
  return (
    <div className="grid gap-16 lg:grid-cols-2 lg:gap-12">
      <section aria-labelledby="grants-title">
        <h3 id="grants-title" className="hud mb-4 text-mute">{t.grants}</h3>
        <ul className="border-t border-line-strong">
          {GRANTS.map((g) => (
            <li key={g.title} className="grid gap-1 border-b border-line py-5 sm:grid-cols-[7.5rem_1fr] sm:gap-6">
              <span className="hud text-mute sm:pt-1">{g.period}</span>
              <div>
                <p className="font-display text-[1.0625rem] font-light leading-snug">{g.title}</p>
                <p className="mt-1 text-[0.875rem] text-ink-2">{g.agency}</p>
                <p className="hud mt-2 text-ink">{t.grantRoles[g.role]}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="awards-title">
        <h3 id="awards-title" className="hud mb-4 text-mute">{t.awards}</h3>
        <ul className="border-t border-line-strong">
          {RECOGNITION.map((r) => (
            <li key={r.title + r.year} className="grid gap-1 border-b border-line py-5 sm:grid-cols-[7.5rem_1fr] sm:gap-6">
              <span className="hud text-mute sm:pt-1">{r.year}</span>
              <div>
                <p className="font-display text-[1.0625rem] font-light leading-snug">{r.title}</p>
                {r.body && <p className="mt-1 text-[0.875rem] text-ink-2">{r.body}</p>}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
