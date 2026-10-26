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

export type MemberRole = 'pi' | 'srf' | 'phd' | 'jrf' | 'mentee' | 'trainee' | 'student';
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
export type NavKey = 'research' | 'people' | 'publications' | 'contact' | 'explore';
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

/** Structures of the Chlamydomonas cell, in the order the hero takes them apart. */
export type CellPartId =
  | 'flagella'
  | 'wall'
  | 'membrane'
  | 'eyespot'
  | 'chloroplast'
  | 'pyrenoid'
  | 'storage'
  | 'polyphosphate'
  | 'nucleus';

/** The stain that shows a structure under the microscope; each maps to a colour token. */
export type Stain = 'chlorophyll' | 'carmine' | 'lugol' | 'nile' | 'toluidine' | 'janus' | 'eyespot' | 'glycoprotein' | 'membrane';

export interface CellPart {
  id: CellPartId;
  key: number;
  stain: Stain;
  /** Node-name prefixes in public/models/chlamydomonas.glb that belong to this structure. */
  nodes: string[];
  /** Point the leader line touches, in micrometres, cell coordinates (Z towards the flagella). */
  anchor: [number, number, number];
  program?: ProgramId;
  paperIds: string[];
}

/** Chapters of the second half of the home scroll: how the lab works. */
export type JourneyId = 'culture' | 'cultivate' | 'stress' | 'harvest' | 'products';

/** A readout pinned to an object in the lab scene, shown while its chapter is on screen. */
export interface JourneyTag {
  id: string;
  chapter: JourneyId;
  /** Lab node the tag points at (glTF node name), and an offset from its origin in centimetres, Blender axes. */
  node: string;
  offset: [number, number, number];
}

/** One panel of the 360-degree wall on the People page. */
export interface WallTile {
  id: string;
  kind: 'person' | 'award' | 'grant' | 'photo' | 'count' | 'page' | 'programme' | 'focus' | 'paper';
  /** Stain colour token of a programme's structure, shown as a swatch. */
  stain?: Stain;
  href: string;
  image?: StaticImageData;
  imagePosition?: string;
  title: string;
  sub: string;
  meta: string;
  /** Columns and rows the panel spans on the wall. */
  w: 1 | 2;
  h: 1 | 2 | 3 | 4;
}

/** A panel placed on the cylinder: its first column and row. */
export interface PlacedTile extends WallTile {
  col: number;
  row: number;
}
