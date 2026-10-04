import type { ProfileLinks as Links } from '../../types';
import { useT } from '../../i18n/I18nProvider';

const LABELS: [keyof Links, string][] = [
  ['profile', ''],
  ['cv', 'CV'],
  ['orcid', 'ORCID'],
  ['scholar', 'Google Scholar'],
  ['researchGate', 'ResearchGate'],
  ['linkedin', 'LinkedIn'],
];

export function ProfileLinks({ links }: { links: Links }) {
  const profileLabel = useT().about.profileLink;
  return (
    <ul className="flex flex-wrap gap-x-5">
      {LABELS.filter(([key]) => links[key]).map(([key, label]) => (
        <li key={key}>
          <a
            href={links[key]}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-[0.1em] text-soft transition-colors hover:text-leaf"
          >
            {label || profileLabel}
            <span aria-hidden="true" className="ml-1 text-mute">↗</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
