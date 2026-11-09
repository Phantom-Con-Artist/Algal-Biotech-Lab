import type { LabMember, Publication } from '../types';
import { MEMBERS } from './members';
import { PUBLICATIONS } from './publications';

const norm = (s: string) => s.toLowerCase().replace(/[.,]/g, '').replace(/\s+/g, ' ').trim();

/** Every spelling under which a lab member appears in author lists. */
const LAB_AUTHORS = new Map<string, LabMember>();
for (const m of MEMBERS) {
  for (const n of [m.name, ...m.authorNames]) LAB_AUTHORS.set(norm(n), m);
}

export const labMemberFor = (author: string) => LAB_AUTHORS.get(norm(author));

export const doiUrl = (doi: string) => `https://doi.org/${doi}`;

/** "Amit K. Bajhaiya" → "Bajhaiya, A. K." */
function apaName(full: string) {
  const parts = full.replace(/\./g, '. ').split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0];
  const last = parts.pop()!;
  const initials = parts.map((p) => `${p[0].toUpperCase()}.`).join(' ');
  return `${last}, ${initials}`;
}

export function citation(p: Publication) {
  const names = p.authors.map(apaName);
  const authors = names.length > 1 ? `${names.slice(0, -1).join(', ')}, & ${names[names.length - 1]}` : names[0];
  const detail = p.detail ? `, ${p.detail}` : '';
  return `${authors} (${p.year}). ${p.title}. ${p.venue}${detail}. ${doiUrl(p.doi)}`;
}

export function papersBy(member: LabMember): Publication[] {
  const names = new Set([member.name, ...member.authorNames].map(norm));
  return PUBLICATIONS.filter((p) => p.authors.some((a) => names.has(norm(a))));
}

export const searchText = (p: Publication) =>
  norm([p.title, p.venue, p.year, p.authors.join(' '), p.doi].join(' '));

export const YEARS_ACTIVE = (() => {
  const ys = PUBLICATIONS.map((p) => p.year);
  return { first: Math.min(...ys), last: Math.max(...ys) };
})();
