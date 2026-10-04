import type { FocusArea } from '../types';
import bioHero from '../assets/focus/biofuel-hero-studio.jpg';
import bioDroplet from '../assets/focus/biofuel-macro-droplet.jpg';
import bioLine from '../assets/focus/biofuel-product-line.jpg';
import carbonArray from '../assets/focus/carbon-capture-pbr-array.jpg';
import carbonRaceway from '../assets/focus/carbon-capture-raceway-sunrise.jpg';
import carbonFacade from '../assets/focus/carbon-capture-building-facade.jpg';
import nutraCapsules from '../assets/focus/nutraceuticals-capsules-water-ripple.jpg';
import nutraSpirulina from '../assets/focus/nutraceuticals-spirulina-flatlay.jpg';
import waterSplit from '../assets/focus/wastewater-split-cylinders.jpg';
import waterBeads from '../assets/focus/wastewater-biobeads-macro.jpg';
import waterCascade from '../assets/focus/wastewater-quartz-cascade.jpg';

/** Image sets, linked papers and glow colour per focus area. Copy lives in src/i18n/locales. */
export const FOCUS_AREAS: FocusArea[] = [
  { id: 'biofuel', number: '01', images: [bioHero, bioDroplet, bioLine], paperIds: ['fuels-2026', 'biohydrogen-2026'], accent: '#ffbd40' },
  { id: 'carbon', number: '02', images: [carbonArray, carbonRaceway, carbonFacade], paperIds: ['nuclear-proteome-2020', 'ccm-lipids-2020'], accent: '#4fe8d4' },
  { id: 'nutraceutical', number: '03', images: [nutraCapsules, nutraSpirulina], paperIds: ['maa-2021', 'nutraceutical-2024'], accent: '#ff6b7d' },
  { id: 'wastewater', number: '04', images: [waterSplit, waterBeads, waterCascade], paperIds: ['phycoremediation-2023', 'heavy-metal-2019'], accent: '#56a8ff' },
];
