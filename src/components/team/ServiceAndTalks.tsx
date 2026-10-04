import { TALKS } from '../../data/recognition';
import { useT } from '../../i18n/I18nProvider';

export function ServiceAndTalks() {
  const t = useT().about;
  return (
    <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
      <div>
        <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-mute">{t.leadership}</h3>
        <ul className="border-t border-line">
          {t.service.map((s) => (
            <li key={s} className="border-b border-line py-5 text-[15px] leading-relaxed text-soft">{s}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-mute">{t.presentedAt}</h3>
        <ul className="border-t border-line">
          {TALKS.map((t) => (
            <li key={t.title} className="border-b border-line py-5">
              <p className="font-mono text-xs text-leaf">{t.venue}</p>
              <p className="mt-1 text-[15px] leading-snug text-paper">{t.title}</p>
              <p className="mt-1 text-sm text-mute">{t.authors}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
