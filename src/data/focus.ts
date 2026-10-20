import type { FocusArea } from '../types';
import bioHero from '../assets/focus/biofuel-hero-studio.webp';
import bioDroplet from '../assets/focus/biofuel-macro-droplet.webp';
import bioLine from '../assets/focus/biofuel-product-line.webp';
import carbonArray from '../assets/focus/carbon-capture-pbr-array.webp';
import carbonRaceway from '../assets/focus/carbon-capture-raceway-sunrise.webp';
import carbonFacade from '../assets/focus/carbon-capture-building-facade.webp';
import nutraCapsules from '../assets/focus/nutraceuticals-capsules-water-ripple.webp';
import nutraSpirulina from '../assets/focus/nutraceuticals-spirulina-flatlay.webp';
import waterSplit from '../assets/focus/wastewater-split-cylinders.webp';
import waterBeads from '../assets/focus/wastewater-biobeads-macro.webp';
import waterCascade from '../assets/focus/wastewater-quartz-cascade.webp';

/** Image sets and linked papers per focus area. Copy lives in src/i18n/locales. */
export const FOCUS_AREAS: FocusArea[] = [
  { id: 'biofuel', number: '01', images: [bioHero, bioDroplet, bioLine], paperIds: ['fuels-2026', 'biohydrogen-2026'] },
  { id: 'carbon', number: '02', images: [carbonArray, carbonRaceway, carbonFacade], paperIds: ['nuclear-proteome-2020', 'ccm-lipids-2020'] },
  { id: 'nutraceutical', number: '03', images: [nutraCapsules, nutraSpirulina], paperIds: ['maa-2021', 'nutraceutical-2024'] },
  { id: 'wastewater', number: '04', images: [waterSplit, waterBeads, waterCascade], paperIds: ['phycoremediation-2023', 'heavy-metal-2019'] },
];
