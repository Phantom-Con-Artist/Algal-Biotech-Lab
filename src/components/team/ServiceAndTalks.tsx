import { getDictionary, type Locale } from '../../i18n/config';
import { TALKS } from '../../data/recognition';
import { BentoTile } from '../common/BentoTile';

export function ServiceAndTalks({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).people;
  return (
    <div className="grid gap-2 sm:gap-3 lg:grid-cols-12">
      <BentoTile tone="leaf" className="lg:col-span-5">
        <h3 className="label mb-4">{t.leadership}</h3>
        <ul className="border-t border-leaf/20">
          {t.service.map((s) => (
            <li key={s} className="border-b border-leaf/20 py-4 text-base leading-relaxed last:border-b-0">{s}</li>
          ))}
        </ul>
      </BentoTile>
      <BentoTile className="lg:col-span-7">
        <h3 className="label mb-4">{t.presentedAt}</h3>
        <ul className="border-t border-line">
          {TALKS.map((talk) => (
            <li key={talk.title} className="grid gap-1 border-b border-line py-4 last:border-b-0 sm:grid-cols-[7rem_1fr] sm:gap-6">
              <p className="font-mono text-xs text-leaf">{talk.venue}</p>
              <div>
                <p className="text-base leading-snug">{talk.title}</p>
                <p className="mt-1 text-sm text-mute">{talk.authors}</p>
              </div>
            </li>
          ))}
        </ul>
      </BentoTile>
    </div>
  );
}
