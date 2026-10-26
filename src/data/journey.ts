import type { JourneyId, JourneyTag, RoomPoint } from '../types';

/** Chapter order after the cell's own nine stages; block indices continue from the full plate (10). */
export const JOURNEY: JourneyId[] = ['culture', 'cultivate', 'stress', 'harvest', 'products'];
export const JOURNEY_START = 11;

/** The last block of the home scroll: the lab room, coming into colour around the PI's desk. */
export const LEAD_BLOCK = JOURNEY_START + JOURNEY.length;
/** The PI's desk in the lab room (a chair at the north bench), in metres, Blender axes. */
export const LEAD_ANCHOR: RoomPoint = [1.0, 4.25, 1.25];
/** The home scroll's last shot of the room: from just inside the door, rising as the room develops. */
export const LEAD_SHOT = {
  from: { eye: [3.9, -4.6, 1.8] as RoomPoint, look: [0.4, 2.8, 1.1] as RoomPoint },
  to: { eye: [5.6, -4.5, 3.1] as RoomPoint, look: [0.2, 2.6, 0.9] as RoomPoint },
};

/** Condition order of the five flasks in the stress row, left to right. */
export const CONDITIONS = ['control', 'phosphate', 'salt', 'cold', 'co2'] as const;
export type Condition = (typeof CONDITIONS)[number];

/** Illustrative culture tints for each condition; the copy says they are illustrative. */
export const CONDITION_TINT: Record<Condition, string> = {
  control: '#3f8f3c',
  phosphate: '#a7a83c',
  salt: '#8db06b',
  cold: '#2c6a4f',
  co2: '#6c9b3a',
};

export const JOURNEY_TAGS: JourneyTag[] = [
  { id: 'light', chapter: 'cultivate', node: 'LightPanel', offset: [20, -15, 1] },
  { id: 'shaker', chapter: 'cultivate', node: 'ShakerBase', offset: [-20, -14, 3] },
  ...CONDITIONS.map((c, k): JourneyTag => ({ id: c, chapter: 'stress', node: `Stress${k}_Culture`, offset: [0, -2, 2.5] })),
  { id: 'rotor', chapter: 'harvest', node: 'Rotor', offset: [-8, -6, 3] },
  { id: 'pellet', chapter: 'harvest', node: 'Harvest_Pellet', offset: [0, -0.5, 0.6] },
  { id: 'oil', chapter: 'products', node: 'Oil_Liquid', offset: [0, -1, 2] },
  { id: 'fertiliser', chapter: 'products', node: 'Dish_Granules', offset: [0, -1, 0.6] },
  { id: 'pigment', chapter: 'products', node: 'Pigment_Liquid', offset: [0, -1, 1.5] },
  { id: 'water', chapter: 'products', node: 'Beaker_Water', offset: [0, -2.9, 3] },
];
