import type { ResearchProgram } from '../types';

export const PROGRAMS: ResearchProgram[] = [
  {
    id: 'transcriptional-engineering',
    number: '01',
    title: 'Transcriptional engineering',
    summary:
      'Global regulators such as PSR1 coordinate how a cell responds to nutrient limitation and where it routes carbon. We characterise these regulators in Chlamydomonas and ask whether tuning them can steer metabolism toward lipids, carbohydrates and high-value chemicals.',
    keywords: ['PSR1', 'Chlamydomonas', 'Secondary metabolites', 'Carbon storage'],
    paperIds: ['psr1-2016', 'transcriptional-engineering-2017', 'genetic-engineering-2022'],
  },
  {
    id: 'stress-biology',
    number: '02',
    title: 'Stress biology and programmed cell death',
    summary:
      'Salinity, cold and nutrient limitation force microalgae to reorganise their proteome and metabolome, and past a threshold to trigger cell death. We profile what type I and type II metacaspases cleave, and how cells remodel the metabolites they keep and the ones they release.',
    keywords: ['Metacaspases', 'NaCl stress', 'Proteomics', 'Metabolite remodelling'],
    paperIds: ['metacaspase-2024', 'cold-2024', 'nacl-2026'],
  },
  {
    id: 'carbon-concentrating',
    number: '03',
    title: 'Carbon-concentrating mechanisms',
    summary:
      'When CO₂ is scarce, algae switch on a carbon-concentrating mechanism. We follow what changes in the nucleus, in membrane lipids and in carotenoids during that switch, with the aim of building more efficient microbial cell factories.',
    keywords: ['CCM', 'Low CO₂', 'Nuclear proteome', 'Lipids and carotenoids'],
    paperIds: ['nuclear-proteome-2020', 'ccm-lipids-2020'],
  },
  {
    id: 'polyphosphate',
    number: '04',
    title: 'Polyphosphate and biofertilisers',
    summary:
      'Microalgae store phosphate as polyphosphate granules. We measure how that store builds and drains as phosphate availability varies, and develop algal biomass as an eco-friendly, slow-release phosphate biofertiliser for sustainable agriculture.',
    keywords: ['Polyphosphate', 'Phosphate starvation', 'Biofertiliser', 'Plant–microbe omics'],
    paperIds: ['polyp-2025', 'multiomics-2023'],
  },
  {
    id: 'biofuels',
    number: '05',
    title: 'Biofuels and biorefinery',
    summary:
      'Growth and lipid synthesis compete, so we separate them: inducible two-step cultivation first builds biomass, then switches lipid production on. Related work covers biohydrogen, pretreatment of algal biomass and the economics of renewable fuels from microalgae.',
    keywords: ['Two-step cultivation', 'Lipid biosynthesis', 'Biohydrogen', 'Biorefinery'],
    paperIds: ['fuels-2026', 'algal-lipids-2023', 'biofuels-review-2023'],
  },
  {
    id: 'bioactives-bioeconomy',
    number: '06',
    title: 'Bioactives and the circular bioeconomy',
    summary:
      'Mycosporine-like amino acids as natural UV screens, vitamin D3 for food fortification, bioplastics from algal biomass, and microalgae that remove heavy metals and emerging contaminants from wastewater: products and services that feed one another.',
    keywords: ['MAAs', 'Vitamin D3', 'Bioplastics', 'Phycoremediation'],
    paperIds: ['maa-2021', 'bioplastics-2022', 'phycoremediation-2023'],
  },
];
