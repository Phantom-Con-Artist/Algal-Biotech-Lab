import type { ProfileLinks as Links } from '../../types';

const LABELS: [keyof Links, string][] = [
  ['profile', ''],
  ['cv', 'CV'],
  ['orcid', 'ORCID'],
  ['scholar', 'Google Scholar'],
  ['researchGate', 'ResearchGate'],
  ['linkedin', 'LinkedIn'],
];

export function ProfileLinks({ links, profileLabel }: { links: Links; profileLabel: string }) {
  const present = LABELS.filter(([key]) => links[key]);
  if (!present.length) return null;
  return (
    <ul className="flex flex-wrap gap-x-5">
      {present.map(([key, label]) => (
        <li key={key}>
          <a
            href={links[key]}
            target="_blank"
            rel="noopener"
            className="hud inline-flex min-h-11 items-center text-ink-2 transition-colors hover:text-ink"
          >
            <span className="ruled">{label || profileLabel}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
