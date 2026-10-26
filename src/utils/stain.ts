import type { CSSProperties } from 'react';
import type { Stain } from '../types';

/** CSS colour of a stain, from the tokens in globals.css. */
export const stainColor = (stain: Stain) => `var(--color-${stain})`;

/** Inline style that hands a stain to `.swatch` and to `text-[var(--stain)]` utilities. */
export const stainStyle = (stain: Stain) => ({ '--stain': stainColor(stain) }) as CSSProperties;
