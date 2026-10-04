import type { ResearchProgram } from '../types';

/** Programme order and linked papers. Copy lives in src/i18n/locales. */
export const PROGRAMS: ResearchProgram[] = [
  { id: 'transcriptional-engineering', number: '01', paperIds: ['psr1-2016', 'transcriptional-engineering-2017', 'genetic-engineering-2022'] },
  { id: 'stress-biology', number: '02', paperIds: ['metacaspase-2024', 'cold-2024', 'nacl-2026'] },
  { id: 'carbon-concentrating', number: '03', paperIds: ['nuclear-proteome-2020', 'ccm-lipids-2020'] },
  { id: 'polyphosphate', number: '04', paperIds: ['polyp-2025', 'multiomics-2023'] },
  { id: 'biofuels', number: '05', paperIds: ['fuels-2026', 'algal-lipids-2023', 'biofuels-review-2023'] },
  { id: 'bioactives-bioeconomy', number: '06', paperIds: ['maa-2021', 'bioplastics-2022', 'phycoremediation-2023'] },
];
