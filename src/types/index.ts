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
  title: string;
  place: string;
  period: string;
  note?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  shortName: string;
  role: string;
  group: 'pi' | 'srf';
  photo: string;
  photoPosition?: string;
  email: string;
  links: ProfileLinks;
  bio: string;
  focus: string[];
  path: Milestone[];
  honours: string[];
}

export interface ResearchProgram {
  id: string;
  number: string;
  title: string;
  summary: string;
  keywords: string[];
  paperIds: string[];
}

export interface StoryChapter {
  id: string;
  label: string;
  headline: string;
  body: string;
  figure: { value: string; caption: string };
  paperId: string;
}

export interface Grant {
  title: string;
  agency: string;
  period: string;
  role: string;
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
  label: string;
  number: string;
}
