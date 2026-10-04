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

export interface TeamMember {
  id: string;
  name: string;
  photo: string;
  photoPosition?: string;
  email: string;
  links: ProfileLinks;
  path: Milestone[];
}

export type SrfKey = 'arathi' | 'subhisha';
export type StoryId = 'cell' | 'switch' | 'limit' | 'reserve' | 'reactor' | 'loop';
export type FocusId = 'biofuel' | 'carbon' | 'nutraceutical' | 'wastewater';
export type ProgramId =
  | 'transcriptional-engineering'
  | 'stress-biology'
  | 'carbon-concentrating'
  | 'polyphosphate'
  | 'biofuels'
  | 'bioactives-bioeconomy';
export type NavKey = 'home' | 'explore' | 'about' | 'contact';
export type GrantRole = 'pi' | 'copi' | 'copiFunk';

export interface ResearchProgram {
  id: ProgramId;
  number: string;
  paperIds: string[];
}

export interface StoryChapter {
  id: StoryId;
  paperId: string;
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
  to: string;
  key: NavKey;
  number: string;
}

export interface FocusArea {
  id: FocusId;
  number: string;
  images: string[];
  paperIds: string[];
  /** CSS colour used for the glow behind the image cards. */
  accent: string;
}
