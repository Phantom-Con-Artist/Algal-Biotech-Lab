import type { ProfileLinks as Links } from '../../types';

const LABELS: [keyof Links, string][] = [
  ['profile', 'CUTN profile'],
  ['cv', 'CV'],
  ['orcid', 'ORCID'],
  ['scholar', 'Google Scholar'],
  ['researchGate', 'ResearchGate'],
  ['linkedin', 'LinkedIn'],
];

export function ProfileLinks({ links }: { links: Links }) {
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
            {label}
            <span aria-hidden="true" className="ml-1 text-mute">↗</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
