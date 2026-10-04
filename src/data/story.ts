import type { StoryChapter } from '../types';

export const STORY: StoryChapter[] = [
  {
    id: 'cell',
    label: 'The cell',
    headline: 'A green alga with two flagella and one chloroplast.',
    body: 'Chlamydomonas reinhardtii swims toward light, photosynthesises, and rewires its metabolism whenever its surroundings change. It is small, fast-growing and genetically tractable, which makes it the lab’s reference cell. Almost every project here begins by asking what this cell is doing, and why.',
    figure: { value: '≈10 µm', caption: 'across, the size of the lab’s model organism' },
    paperId: 'metabolomics-2016',
  },
  {
    id: 'switch',
    label: 'The switch',
    headline: 'When phosphorus runs out, one regulator answers.',
    body: 'PSR1 is a global transcription factor: under phosphorus deficiency it coordinates the cell’s response and its move toward carbon storage. Dr. Bajhaiya characterised it during his Ph.D. at Manchester. The lab’s question is now practical. If we understand the switch, can we set it ourselves and steer metabolism toward products worth making?',
    figure: { value: 'PSR1', caption: 'a global regulator of starvation and carbon storage' },
    paperId: 'psr1-2016',
  },
  {
    id: 'limit',
    label: 'The limit',
    headline: 'Salt, cold, hunger. Then a decision to live or die.',
    body: 'Stress forces algae to rebuild their metabolism and, beyond a threshold, to trigger programmed cell death. We trace both sides: which proteins metacaspases cut in salt-stressed Chlamydomonas, and how freshwater microalgae reshape the metabolites they hold and release as NaCl rises.',
    figure: { value: 'I + II', caption: 'metacaspase types profiled in vivo under salt stress' },
    paperId: 'metacaspase-2024',
  },
  {
    id: 'reserve',
    label: 'The reserve',
    headline: 'Phosphate, stored as a chain.',
    body: 'Cells pack phosphate into polyphosphate, long linear polymers held in granules. How much they store depends on how much phosphate they meet. We measured those dynamics in microalgae, groundwork for algal biomass that releases phosphate slowly as an eco-friendly fertiliser.',
    figure: { value: 'polyP', caption: 'accumulation tracked against phosphate availability' },
    paperId: 'polyp-2025',
  },
  {
    id: 'reactor',
    label: 'The reactor',
    headline: 'Grow first. Make later.',
    body: 'Growth and lipid production compete for the same resources. Inducible two-step cultivation lets a culture reach density first and only then switches lipid biosynthesis on, so growth and oil become separate, engineerable steps. Related work looks at biohydrogen and pretreated biomass in a biorefinery.',
    figure: { value: '2 steps', caption: 'biomass first, then induced lipid synthesis' },
    paperId: 'fuels-2026',
  },
  {
    id: 'loop',
    label: 'The loop',
    headline: 'Close the loop.',
    body: 'Algae can be material as well as fuel: bioplastics from algal biomass, mycosporine-like amino acids as natural UV screens, microalgae that pull heavy metals and emerging contaminants out of wastewater. Treated as one system, each output becomes another’s input.',
    figure: { value: 'Circular', caption: 'bioplastics, bioactives and phycoremediation as one bioeconomy' },
    paperId: 'bioplastics-2022',
  },
];
