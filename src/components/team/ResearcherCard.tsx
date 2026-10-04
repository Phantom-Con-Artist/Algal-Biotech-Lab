import type { TeamMember } from '../../types';
import { Eyebrow } from '../common/Eyebrow';
import { ProfileLinks } from '../common/ProfileLinks';
import { Timeline } from './Timeline';

export function ResearcherCard({ member }: { member: TeamMember }) {
  return (
    <article className="flex flex-col">
      <img
        src={member.photo}
        alt={`Portrait of ${member.name}`}
        width={900}
        height={900}
        loading="lazy"
        style={{ objectPosition: member.photoPosition }}
        className="aspect-[4/3] w-full border border-line object-cover"
      />
      <Eyebrow className="mt-6">{member.role}</Eyebrow>
      <h3 className="mt-3 font-serif text-4xl leading-none">{member.name}</h3>
      <p className="mt-5 text-[15px] leading-relaxed text-soft">{member.bio}</p>
      <ul className="mt-5 space-y-1 text-sm text-mute">
        {member.focus.map((f) => (
          <li key={f} className="flex gap-3">
            <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-leaf" />
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <ProfileLinks links={member.links} />
      </div>
      <div className="mt-6">
        <Timeline items={member.path} />
      </div>
    </article>
  );
}
