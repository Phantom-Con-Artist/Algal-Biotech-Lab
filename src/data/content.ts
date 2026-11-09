/**
 * Copy for the site. Programme and focus-area text is written from the lab's own
 * publications (see paperIds); nothing here claims results the papers do not report.
 */
import type { FocusId, MemberRole, ProgramId, PublicationType } from '../types';

export type Organelle = 'nucleus' | 'membrane' | 'pyrenoid' | 'polyp' | 'lipid' | 'chloroplast';

export interface ProgramCopy {
  title: string;
  short: string;
  organelle: Organelle;
  organelleLabel: string;
  body: string;
}

export const PROGRAM_COPY: Record<ProgramId, ProgramCopy> = {
  'transcriptional-engineering': {
    title: 'Transcriptional engineering',
    short: 'Rewiring the regulators that switch whole sets of genes.',
    organelle: 'nucleus',
    organelleLabel: 'Nucleus',
    body:
      'A single transcription factor can switch hundreds of genes at once. Dr. Bajhaiya identified PSR1 as a global regulator of phosphorus-starvation responses and carbon storage in Chlamydomonas. The lab now engineers regulators like it to steer microalgae toward lipids, starch and high-value chemicals.',
  },
  'stress-biology': {
    title: 'Stress biology',
    short: 'How microalgae respond to salt, cold and nutrient limits.',
    organelle: 'membrane',
    organelleLabel: 'Cell membrane & wall',
    body:
      'Salt, cold and nutrient limitation reshape what a microalga makes, and whether it survives. The lab follows that response from metacaspase activity under salt stress to the remodelling of metabolites inside and outside the cell, and the transcriptome of a cold-tolerant Nordic strain.',
  },
  'carbon-concentrating': {
    title: 'Carbon-concentrating mechanism',
    short: 'How the cell gathers CO₂ around Rubisco when carbon runs low.',
    organelle: 'pyrenoid',
    organelleLabel: 'Pyrenoid',
    body:
      'When CO₂ runs low, Chlamydomonas concentrates inorganic carbon around Rubisco in the pyrenoid. The lab has studied how the nuclear proteome, and lipid and carotenoid metabolism, change as this mechanism is induced.',
  },
  polyphosphate: {
    title: 'Polyphosphate storage',
    short: 'How phosphate supply drives the cell’s phosphorus reserve.',
    organelle: 'polyp',
    organelleLabel: 'Acidocalcisomes',
    body:
      'Microalgae can take up more phosphate than they need and store it as polyphosphate in acidocalcisomes. The lab measures how phosphate availability drives that store, with a view to recovering nutrients and producing phosphate biofertilisers.',
  },
  biofuels: {
    title: 'Algal biofuels',
    short: 'Engineering growth and lipid synthesis for fuel.',
    organelle: 'lipid',
    organelleLabel: 'Lipid droplets',
    body:
      'Under stress, microalgae fill lipid droplets with oils that can become biodiesel. The lab engineers growth and lipid biosynthesis, including inducible two-step cultivation, and reviews the technical and economic routes from algal biomass to fuel.',
  },
  'bioactives-bioeconomy': {
    title: 'Bioactives & bioeconomy',
    short: 'Pigments, UV screens, bioplastics and cleaner water.',
    organelle: 'chloroplast',
    organelleLabel: 'Chloroplast',
    body:
      'Beyond fuel, microalgae make pigments, UV-screening mycosporine-like amino acids and the precursors of bioplastics. The lab studies these products, and how algae can remove metals and emerging contaminants from wastewater.',
  },
};

export const FOCUS_COPY: Record<FocusId, { title: string; body: string; alt: string[] }> = {
  biofuel: {
    title: 'Biofuels & bioenergy',
    body: 'Algal lipids, biohydrogen and macroalgal biomass as feedstocks for renewable fuel.',
    alt: [
      'Illustration: golden algal oil pouring from a steel press into a vessel',
      'Illustration: a green droplet falling from a pipette tip',
      'Illustration: three bottles of algal oil products on a stone plinth',
    ],
  },
  carbon: {
    title: 'Carbon capture',
    body: 'Putting the cell’s carbon-concentrating machinery to work fixing CO₂ into biomass.',
    alt: [
      'Illustration: rows of flat-panel photobioreactors filled with green culture',
      'Illustration: open raceway ponds at sunrise',
      'Illustration: a building facade lit with green algal panels at dusk',
    ],
  },
  nutraceutical: {
    title: 'Nutraceuticals',
    body: 'Carotenoids, mycosporine-like amino acids and other bioactives for food and health.',
    alt: [
      'Illustration: a dish of green algal powder beside a bowl of amber oil',
      'Illustration: a bowl of spirulina powder with a wooden scoop and dropper bottle',
    ],
  },
  wastewater: {
    title: 'Phycoremediation',
    body: 'Microalgae that take up nutrients, heavy metals and emerging contaminants from wastewater.',
    alt: [
      'Illustration: a paddle wheel turning in an algal treatment pond',
      'Illustration: immobilised green algal beads on a steel mesh',
      'Illustration: a clear tank divided between dense green culture and treated water',
    ],
  },
};

/** Same order as LAB_GALLERY / LAB_PHOTO_SLUGS. */
export const LAB_PHOTOS = [
  { title: 'Main laboratory', alt: 'The main laboratory: black-topped benches with reagent shelving under wide windows' },
  { title: 'Laminar air-flow cabinet', alt: 'A laminar air-flow cabinet for sterile culture work, seen through a glass partition' },
  { title: 'Sterile work area', alt: 'A partitioned sterile work area beside the main benches' },
  { title: 'Central work bench', alt: 'The central work bench with glassware and shelving above' },
  { title: 'Instrument bench', alt: 'An instrument bench with a researcher at work among balances and analysers' },
  { title: 'Reagent shelving', alt: 'Shelving stocked with reagents and consumables above a bench' },
];

export const ROLE_LABEL: Record<MemberRole, string> = {
  pi: 'Principal Investigator',
  srf: 'Senior Research Fellow',
  phd: 'Ph.D. Scholar',
  jrf: 'Junior Research Fellow',
  anrf: 'ANRF Junior Research Fellow',
  inspire: 'DST-INSPIRE Fellow',
  urf: 'University Research Fellow',
  mentee: 'Research Mentee',
  trainee: 'Research Trainee',
  student: 'Research Student',
};

export const PUB_TYPE_LABEL: Record<PublicationType, string> = {
  article: 'Journal article',
  chapter: 'Book chapter',
  preprint: 'Preprint',
};

export const GRANT_ROLE_LABEL = { pi: 'Principal Investigator', copi: 'Co-Investigator', copiFunk: 'Co-Applicant' } as const;

/* ---------------------------------------------------------------------------
   Process flows. Each programme and application is shown as the process it
   studies: inputs on the left, outcomes on the right. Steps describe standard
   microalgal biology and the lab's own published work (see paperIds).
   --------------------------------------------------------------------------- */
export interface FlowStep { title: string; note?: string }
export interface Flow { steps: FlowStep[]; outcomes?: string[] }

export const PROGRAM_FLOWS: Record<ProgramId, Flow> = {
  'transcriptional-engineering': {
    steps: [
      { title: 'Nutrient signal', note: 'e.g. phosphorus starvation' },
      { title: 'Transcription factor', note: 'e.g. PSR1' },
      { title: 'Gene network', note: 'hundreds of genes switched together' },
    ],
    outcomes: ['Starch storage', 'Lipid storage', 'High-value chemicals'],
  },
  'stress-biology': {
    steps: [
      { title: 'Stress', note: 'salt, cold, nutrient limitation' },
      { title: 'Cellular response', note: 'metacaspase activity, gene expression' },
      { title: 'Metabolite remodelling', note: 'inside and outside the cell' },
    ],
    outcomes: ['Acclimation', 'Programmed cell death'],
  },
  'carbon-concentrating': {
    steps: [
      { title: 'Low CO₂', note: 'limiting inorganic carbon' },
      { title: 'Carbon uptake', note: 'transport toward the chloroplast' },
      { title: 'Pyrenoid', note: 'CO₂ concentrated around Rubisco' },
    ],
    outcomes: ['Carbon fixation', 'Shifts in lipids and carotenoids'],
  },
  polyphosphate: {
    steps: [
      { title: 'Phosphate supply', note: 'medium or wastewater' },
      { title: 'Uptake', note: 'beyond immediate need' },
      { title: 'Polyphosphate', note: 'stored in acidocalcisomes' },
    ],
    outcomes: ['Nutrient recovery', 'Phosphate biofertiliser'],
  },
  biofuels: {
    steps: [
      { title: 'Growth phase', note: 'build biomass' },
      { title: 'Induction', note: 'stress triggers storage' },
      { title: 'Lipid accumulation', note: 'oil in lipid droplets' },
      { title: 'Harvest and extraction' },
    ],
    outcomes: ['Biodiesel', 'Biohydrogen'],
  },
  'bioactives-bioeconomy': {
    steps: [
      { title: 'Culture', note: 'selected or engineered strains' },
      { title: 'Biosynthesis', note: 'pigments, MAAs, vitamin D₃' },
      { title: 'Recovery', note: 'extraction and purification' },
    ],
    outcomes: ['Nutraceuticals', 'UV protection', 'Food fortification'],
  },
};

export const FOCUS_FLOWS: Record<FocusId, Flow> = {
  biofuel: {
    steps: [{ title: 'Algal biomass' }, { title: 'Lipids and sugars' }, { title: 'Conversion' }],
    outcomes: ['Biodiesel', 'Biohydrogen'],
  },
  carbon: {
    steps: [{ title: 'CO₂' }, { title: 'Photosynthesis', note: 'concentrated at the pyrenoid' }, { title: 'Biomass' }],
    outcomes: ['Fixed carbon', 'Feedstock'],
  },
  nutraceutical: {
    steps: [{ title: 'Culture' }, { title: 'Bioactive compounds', note: 'carotenoids, MAAs' }, { title: 'Formulation' }],
    outcomes: ['Food', 'Health'],
  },
  wastewater: {
    steps: [{ title: 'Wastewater' }, { title: 'Algal treatment', note: 'nutrient and metal uptake' }, { title: 'Harvest' }],
    outcomes: ['Treated water', 'Reusable biomass'],
  },
};
