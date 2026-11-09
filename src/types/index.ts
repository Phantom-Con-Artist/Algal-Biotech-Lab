import type { ImageMetadata } from 'astro';

/** Images are imported through Astro's asset pipeline. */
export type StaticImageData = ImageMetadata;

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

export interface Milestone {
  place: string;
  period: string;
}

export type MemberRole = 'pi' | 'srf' | 'phd' | 'jrf' | 'anrf' | 'inspire' | 'urf' | 'mentee' | 'trainee' | 'student';
export type MemberStatus = 'pi' | 'current' | 'alumni';

export interface OtherWork {
  citation: string;
  href?: string;
}

export interface LabMember {
  slug: string;
  name: string;
  honorific?: string;
  status: MemberStatus;
  role: MemberRole;
  joined: number;
  photo: StaticImageData;
  photoPosition?: string;
  education: string[];
  interests: string[];
  bio?: string;
  fellowships: string[];
  authorNames: string[];
  otherWorks: OtherWork[];
  links: ProfileLinks;
  now?: string;
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
export type NavKey = 'research' | 'people' | 'lab' | 'publications' | 'contact' | 'explore';
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
