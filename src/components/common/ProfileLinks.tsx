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
            className="inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-[0.08em] text-ink-2 transition-colors hover:text-leaf"
          >
            <span className="measure">{label || profileLabel}</span>
            <span aria-hidden="true" className="ml-1 text-mute">↗</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
