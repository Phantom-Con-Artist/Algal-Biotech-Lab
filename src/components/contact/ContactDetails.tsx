import { LAB_INFO } from '../../data/labData';
import { Eyebrow } from '../common/Eyebrow';
import { ArrowLink } from '../common/ArrowLink';
import { useT } from '../../i18n/I18nProvider';

const link = 'inline-flex min-h-11 items-center text-[17px] text-paper underline decoration-line underline-offset-4 transition-colors hover:text-leaf hover:decoration-leaf';

export function ContactDetails() {
  const t = useT();
  const c = t.contact;
  return (
    <div className="space-y-9">
      <div>
        <Eyebrow>{c.email}</Eyebrow>
        <div className="mt-1"><a href={`mailto:${LAB_INFO.email}`} className={link}>{LAB_INFO.email}</a></div>
      </div>
      <div>
        <Eyebrow>{c.telephone}</Eyebrow>
        <div className="mt-1"><a href={LAB_INFO.phoneHref} className={link}>{LAB_INFO.phone}</a></div>
      </div>
      <div>
        <Eyebrow>{c.visit}</Eyebrow>
        <div className="mt-2 text-[17px] leading-relaxed text-soft">
          {LAB_INFO.name}<br />
          {t.lab.department}, {t.lab.school}<br />
          {LAB_INFO.institution}<br />
          {LAB_INFO.address.map((l) => (<span key={l}>{l}<br /></span>))}
        </div>
        <div className="mt-3"><ArrowLink href={LAB_INFO.mapHref}>{c.openMaps}</ArrowLink></div>
      </div>
    </div>
  );
}
