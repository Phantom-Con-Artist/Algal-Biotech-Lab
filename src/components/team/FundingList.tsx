import { GRANTS, RECOGNITION } from '../../data/recognition';
import { useT } from '../../i18n/I18nProvider';

export function FundingList() {
  const t = useT().about;
  return (
    <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
      <div>
        <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-mute">{t.grants}</h3>
        <ul className="border-t border-line">
          {GRANTS.map((g) => (
            <li key={g.title} className="border-b border-line py-5">
              <div className="flex items-baseline justify-between gap-6">
                <p className="text-[15px] text-paper">{g.title}</p>
                <span className="shrink-0 font-mono text-xs text-mute">{g.period}</span>
              </div>
              <p className="mt-1 text-sm text-mute">{g.agency}</p>
              <p className="mt-1 text-sm text-leaf">{t.roles[g.role]}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-mute">{t.awards}</h3>
        <ul className="border-t border-line">
          {RECOGNITION.map((r) => (
            <li key={r.title + r.year} className="grid grid-cols-[4.5rem_1fr] gap-4 border-b border-line py-5">
              <span className="font-mono text-xs text-mute">{r.year}</span>
              <div>
                <p className="text-[15px] text-paper">{r.title}</p>
                <p className="text-sm text-mute">{r.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
