import type { Publication } from '../types';

const surname = (author: string) => author.trim().split(/\s+/).slice(-1)[0];

/** "Bajhaiya et al." / "Raj and Sreenikethanam" for compact in-text references. */
export function shortAuthors(pub: Publication): string {
  const [first, second] = pub.authors;
  if (pub.authors.length === 1) return surname(first);
  if (pub.authors.length === 2) return `${surname(first)} and ${surname(second)}`;
  return `${surname(first)} et al.`;
}

export function formatCitation(pub: Publication): string {
  const where = [pub.venue, pub.detail, pub.month ? `${pub.month} ${pub.year}` : String(pub.year)]
    .filter(Boolean)
    .join(', ');
  return `${pub.authors.join(', ')}. ${pub.title}. ${where}. https://doi.org/${pub.doi}`;
}

export const doiUrl = (pub: Publication) => `https://doi.org/${pub.doi}`;
