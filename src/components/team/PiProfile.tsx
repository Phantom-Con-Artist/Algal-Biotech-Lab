import { PI } from '../../data/team';
import { Eyebrow } from '../common/Eyebrow';
import { ProfileLinks } from '../common/ProfileLinks';
import { Timeline } from './Timeline';
import { fmt } from '../../i18n/config';
import { useT } from '../../i18n/I18nProvider';

export function PiProfile() {
  const t = useT();
  const copy = t.about.pi;
  return (
    <article className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-4">
        <img
          src={PI.photo}
          alt={fmt(t.common.portraitOf, { name: PI.name })}
          width={640}
          height={640}
          style={{ objectPosition: PI.photoPosition }}
          className="aspect-[4/5] w-full max-w-sm border border-line object-cover"
        />
      </div>
      <div className="lg:col-span-8">
        <Eyebrow>{t.about.sections.pi.label}</Eyebrow>
        <h3 className="mt-3 font-serif text-4xl leading-none md:text-5xl">{PI.name}</h3>
        <p className="mt-3 text-sm text-mute">{copy.role}</p>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-soft md:text-base">{copy.bio}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {copy.focus.map((f) => (
            <li key={f} className="border border-line px-3 py-1.5 text-xs text-soft">{f}</li>
          ))}
        </ul>
        <div className="mt-4">
          <ProfileLinks links={PI.links} />
        </div>
        <div className="mt-10">
          <Eyebrow className="mb-4">{t.about.path}</Eyebrow>
          <Timeline items={PI.path} titles={copy.pathTitles} notes={copy.pathNotes} />
        </div>
      </div>
    </article>
  );
}
