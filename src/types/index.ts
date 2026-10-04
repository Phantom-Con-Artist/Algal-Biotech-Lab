export interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  month?: string;
  doi?: string;
  pmid?: string;
  type: 'journal' | 'book-chapter' | 'preprint';
  isHighlighted?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  alternativeNames?: string[];
  role: string;
  affiliation: string;
  department: string;
  institution: string;
  email: string;
  phone?: string;
  orcid?: string;
  googleScholar?: string;
  researchGate?: string;
  linkedin?: string;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    details?: string;
  }>;
  researchInterests: string[];
  awardsAndFellowships: string[];
}

export interface ResearchThrust {
  id: string;
  title: string;
  shortDescription: string;
  icon: string;
  keywords: string[];
}

export interface Grant {
  title: string;
  agency: string;
  duration: string;
  role: string;
}
