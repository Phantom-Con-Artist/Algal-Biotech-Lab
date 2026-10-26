import { getDictionary, type Locale } from '../../i18n/config';
import { LAB_INFO } from '../../data/labData';
import { ArrowLink } from '../common/ArrowLink';
import { BentoTile } from '../common/BentoTile';

const link = 'ruled inline-flex min-h-11 items-center font-display text-[1.0625rem] font-light break-all';

export function ContactDetails({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const c = t.contact;
  return (
    <BentoTile as="address" className="gap-8 not-italic">
      <div>
        <p className="label mb-1">{c.email}</p>
        <a href={`mailto:${LAB_INFO.email}`} className={link}>{LAB_INFO.email}</a>
      </div>
      <div>
        <p className="label mb-1">{c.telephone}</p>
        <a href={LAB_INFO.phoneHref} className={link}>{LAB_INFO.phone}</a>
      </div>
      <div>
        <p className="label mb-2">{c.visit}</p>
        <p className="leading-relaxed text-ink-2">
          {LAB_INFO.name}
          <br />
          {t.lab.department}, {t.lab.school}
          <br />
          {LAB_INFO.institution}
          <br />
          {LAB_INFO.address.join(', ')}
        </p>
        <div className="mt-3"><ArrowLink href={LAB_INFO.mapHref}>{c.openMaps}</ArrowLink></div>
      </div>
    </BentoTile>
  );
}
