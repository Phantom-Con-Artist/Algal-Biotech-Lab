import type { StaticImageData } from 'next/image';
import lab1 from '../assets/lab/lab-01.webp';
import lab2 from '../assets/lab/lab-02.webp';
import lab3 from '../assets/lab/lab-03.webp';
import lab4 from '../assets/lab/lab-04.webp';
import lab5 from '../assets/lab/lab-05.webp';
import lab6 from '../assets/lab/lab-06.webp';

/** Graded lab photographs. Captions and alt text live in src/i18n/locales (same order). */
export const LAB_GALLERY: StaticImageData[] = [lab1, lab2, lab3, lab4, lab5, lab6];

/** Each photograph has its own page at /lab/{slug}; the order matches LAB_GALLERY and the captions. */
export const LAB_PHOTO_SLUGS = [
  'main-laboratory',
  'laminar-air-flow-cabinet',
  'sterile-work-area',
  'central-work-bench',
  'instrument-bench',
  'reagent-shelving',
] as const;

export type LabPhotoSlug = (typeof LAB_PHOTO_SLUGS)[number];

export const labPhotoIndex = (slug: string) => LAB_PHOTO_SLUGS.indexOf(slug as LabPhotoSlug);
export const labPhotoPath = (index: number) => `/lab/${LAB_PHOTO_SLUGS[index]}`;
