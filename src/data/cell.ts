import type { CellPart } from '../types';

/**
 * The plate key of the hero. Order is the order of separation as the visitor scrolls.
 * Anchors are in the model's own units (1 = 1 µm), Blender axes, before separation.
 * Copy lives in src/i18n/locales under home.cell.parts.
 */
export const CELL_PARTS: CellPart[] = [
  { id: 'flagella', key: 1, stain: 'glycoprotein', nodes: ['FlagRig_', 'BasalBody_'], anchor: [3.2, 0, 9.5], paperIds: [] },
  { id: 'wall', key: 2, stain: 'glycoprotein', nodes: ['CellWall'], anchor: [2.96, -2.96, 2.0], program: 'stress-biology', paperIds: ['nacl-2026'] },
  {
    id: 'membrane', key: 3, stain: 'membrane',
    nodes: ['PlasmaMembrane', 'Rootlet_', 'ContractileVacuole_', 'CVVesicles_', 'Mitochondrion_', 'Golgi'],
    anchor: [2.79, -2.79, 1.5], program: 'stress-biology', paperIds: ['metacaspase-2024', 'cold-2024'],
  },
  { id: 'eyespot', key: 4, stain: 'eyespot', nodes: ['Eyespot'], anchor: [-2.2, -3.1, 1.7], program: 'bioactives-bioeconomy', paperIds: ['maa-2021'] },
  { id: 'chloroplast', key: 5, stain: 'chlorophyll', nodes: ['Chloroplast_'], anchor: [3.51, -1.45, 0], program: 'carbon-concentrating', paperIds: ['ccm-lipids-2020'] },
  { id: 'pyrenoid', key: 6, stain: 'lugol', nodes: ['StarchPlate_', 'PyrTubule', 'PyrenoidMatrix'], anchor: [-0.6, -0.9, -3.0], program: 'carbon-concentrating', paperIds: ['nuclear-proteome-2020'] },
  { id: 'storage', key: 7, stain: 'nile', nodes: ['LipidDroplet_'], anchor: [-1.6, 0.4, 0.2], program: 'biofuels', paperIds: ['fuels-2026'] },
  { id: 'polyphosphate', key: 8, stain: 'toluidine', nodes: ['Acidocalcisome_', 'PolyPGranule_'], anchor: [1.4, 0.6, 0.6], program: 'polyphosphate', paperIds: ['polyp-2025'] },
  { id: 'nucleus', key: 9, stain: 'carmine', nodes: ['Nucleolus', 'NucEnvelope_', 'Chromatin_'], anchor: [-0.25, 0.3, 1.1], program: 'transcriptional-engineering', paperIds: ['psr1-2016'] },
];
