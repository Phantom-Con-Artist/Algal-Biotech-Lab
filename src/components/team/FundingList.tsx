import { getDictionary, type Locale } from '../../i18n/config';
import { GRANTS, RECOGNITION } from '../../data/recognition';
import { BentoTile } from '../common/BentoTile';

export function FundingList({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).people;
  return (
    <div className="grid gap-2 sm:gap-3 lg:grid-cols-2">
      <BentoTile>
        <h3 className="label mb-4">{t.grants}</h3>
        <ul className="border-t border-line">
          {GRANTS.map((g) => (
            <li key={g.title} className="border-b border-line py-4 last:border-b-0">
              <div className="flex items-baseline justify-between gap-6">
                <p className="text-base font-medium">{g.title}</p>
                <span className="shrink-0 font-mono text-xs text-mute">{g.period}</span>
              </div>
              <p className="mt-1 text-sm text-mute">{g.agency}</p>
              <p className="mt-1 text-sm text-leaf">{t.grantRoles[g.role]}</p>
            </li>
          ))}
        </ul>
      </BentoTile>
      <BentoTile>
        <h3 className="label mb-4">{t.awards}</h3>
        <ul className="border-t border-line">
          {RECOGNITION.map((r) => (
            <li key={r.title + r.year} className="grid grid-cols-[4.5rem_1fr] gap-4 border-b border-line py-4 last:border-b-0">
              <span className="font-mono text-xs text-mute">{r.year}</span>
              <div>
                <p className="text-base font-medium">{r.title}</p>
                <p className="text-sm text-mute">{r.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </BentoTile>
    </div>
  );
}
