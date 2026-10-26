import type { RoomPoint, TourLabelId, TourStop } from '../types';

/**
 * The scroll tour of the lab room (public/models/lab-room.glb, built by assets/blender/build_lab_room.py
 * from the lab's floor plan). The camera walks the white corridor, enters, and stops at each station; the
 * station's patch of the room develops from ash into colour. Paths keep to the aisles, or pass above the
 * reagent rack where they cross the island.
 */
export const TOUR: TourStop[] = [
  { id: 'corridor', eye: [3.9, -20.5, 1.62], look: [3.9, -5, 1.45], focus: [3.9, -5.5, 1.2], radius: 0, labels: [] },
  { id: 'threshold', eye: [3.9, -4.9, 1.75], look: [-0.6, 2.7, 1.1], focus: [2.0, -1.0, 1.0], radius: 0, labels: [] },
  { id: 'cultures', eye: [3.4, -1.3, 1.8], look: [3.9, -5.3, 1.05], focus: [3.9, -5.1, 1.1], radius: 1.8, labels: ['cultures'] },
  { id: 'cold', eye: [3.5, -1.3, 1.75], look: [0.7, -3.0, 1.15], focus: [1.2, -3.1, 1.1], radius: 1.5, labels: ['fridge', 'freezer', 'sterile'] },
  { id: 'laminar', eye: [2.1, -0.68, 1.62], look: [-5.4, -0.7, 1.35], focus: [-5.45, -0.7, 1.4], radius: 1.1, labels: ['laminar'] },
  { id: 'utility', eye: [1.95, -4.7, 2.45], look: [-3.2, -3.8, 0.9], focus: [-3.4, -3.8, 1.0], radius: 1.6, labels: ['utility', 'autoclave', 'incubator', 'hotairoven'] },
  { id: 'reagents', eye: [2.0, 1.25, 2.25], look: [-2.4, 2.7, 1.25], focus: [-2.4, 2.7, 1.3], radius: 2.0, labels: ['rack'] },
  { id: 'weighing', eye: [-3.6, 3.95, 1.95], look: [-5.9, 5.1, 1.1], focus: [-5.85, 5.1, 1.1], radius: 0.9, labels: ['balance', 'phmeter'] },
  { id: 'optics', eye: [-1.0, 3.6, 1.85], look: [-0.1, 5.1, 1.15], focus: [-0.5, 5.1, 1.15], radius: 1.1, labels: ['spectro', 'microscope'] },
  { id: 'window', eye: [4.6, 2.3, 2.05], look: [2.3, 5.1, 1.15], focus: [2.8, 5.1, 1.2], radius: 1.4, labels: ['vortex', 'waterbath', 'oven', 'windows'] },
  { id: 'prep', eye: [5.0, -1.4, 1.75], look: [6.5, -2.6, 1.0], focus: [6.5, -2.4, 1.1], radius: 1.0, labels: ['stirrer', 'pipettes'] },
  { id: 'molecular', eye: [4.6, -1.3, 1.85], look: [6.4, 1.4, 1.0], focus: [6.5, 1.3, 1.05], radius: 1.5, labels: ['geldoc', 'psu', 'centrifuge', 'pcr'] },
  { id: 'overview', eye: [6.4, -5.2, 3.45], look: [-1.4, 1.9, 0.6], focus: [0, 0, 1.0], radius: 0, labels: [] },
  // The walk is endless: after the overview it returns to the threshold, where the scroll quietly
  // jumps back to the real threshold stop, so the round can start again without a seam.
  { id: 'loop', eye: [3.9, -4.9, 1.75], look: [-0.6, 2.7, 1.1], focus: [2.0, -1.0, 1.0], radius: 0, labels: [] },
];

/** Nudges for readout anchors baked into the model, in metres (Blender axes), where a view needs the point lower or nearer. */
/** Index of the stop the loop returns to: the threshold, identical in camera and copy to the loop stop. */
export const LOOP_TO = TOUR.findIndex((s) => s.id === 'threshold');

export const LABEL_OFFSETS: Partial<Record<TourLabelId, RoomPoint>> = {
  cultures: [0, 0.3, -0.8],
};
