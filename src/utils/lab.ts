import { PUBLICATIONS } from '../data/publications';
import { MEMBERS, RESEARCHERS, PI } from '../data/members';
import type { LabMember, Publication } from '../types';

/** Every spelling of a lab member's name that appears in an author list. */
export const LAB_AUTHORS = new Set(MEMBERS.flatMap((m) => m.authorNames));

export const isLabAuthor = (author: string) => LAB_AUTHORS.has(author);

export const memberPublications = (member: LabMember): Publication[] =>
  PUBLICATIONS.filter((p) => p.authors.some((a) => member.authorNames.includes(a)));

/** Counts shown on the home page, derived from the data so they never go stale. */
export const LAB_STATS = {
  publications: PUBLICATIONS.length,
  researchers: RESEARCHERS.length + 1,
};

export const LATEST_PUBLICATION = PUBLICATIONS[0];

export const memberPath = (member: LabMember) => `/people/${member.slug}`;

export const piPath = memberPath(PI);
