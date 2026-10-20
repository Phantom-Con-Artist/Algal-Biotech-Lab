import type { StaticImageData } from 'next/image';

export type PublicationType = 'article' | 'chapter' | 'preprint';

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  month?: string;
  detail?: string;
  doi: string;
  pmid?: string;
  type: PublicationType;
}

export interface ProfileLinks {
  orcid?: string;
  scholar?: string;
  researchGate?: string;
  linkedin?: string;
  profile?: string;
  cv?: string;
}

/** Institution and dates of a career step; its title and note are translated in the dictionaries. */
export interface Milestone {
  place: string;
  period: string;
}

export type MemberRole = 'pi' | 'srf' | 'phd' | 'jrf' | 'mentee' | 'trainee';
export type MemberStatus = 'pi' | 'current' | 'alumni';

/** A work listed by a member that is not in the lab's publication list. */
export interface OtherWork {
  citation: string;
  href?: string;
}

export interface LabMember {
  slug: string;
  name: string;
  /** Shown before the name, for example "Dr." */
  honorific?: string;
  status: MemberStatus;
  role: MemberRole;
  joined: number;
  photo: StaticImageData;
  photoPosition?: string;
  education: string[];
  interests: string[];
  /** English biography. The PI's is translated and lives in the dictionaries instead. */
  bio?: string;
  fellowships: string[];
  /** Spellings of this person's name in src/data/publications.ts, used to link their papers. */
  authorNames: string[];
  otherWorks: OtherWork[];
  links: ProfileLinks;
  /** Alumni only: their current position. */
  now?: string;
  /** Shown publicly only for the PI; students are reached through the lab address. */
  email?: string;
}

export type FocusId = 'biofuel' | 'carbon' | 'nutraceutical' | 'wastewater';
export type ProgramId =
  | 'transcriptional-engineering'
  | 'stress-biology'
  | 'carbon-concentrating'
  | 'polyphosphate'
  | 'biofuels'
  | 'bioactives-bioeconomy';
export type NavKey = 'research' | 'people' | 'publications' | 'contact';
export type GrantRole = 'pi' | 'copi' | 'copiFunk';

export interface ResearchProgram {
  id: ProgramId;
  number: string;
  paperIds: string[];
}

export interface Grant {
  title: string;
  agency: string;
  period: string;
  role: GrantRole;
}

export interface Recognition {
  year: string;
  title: string;
  body: string;
}

export interface Talk {
  venue: string;
  year: string;
  title: string;
  authors: string;
}

export interface NavItem {
  path: string;
  key: NavKey;
  number: string;
}

export interface FocusArea {
  id: FocusId;
  number: string;
  images: StaticImageData[];
  paperIds: string[];
}
