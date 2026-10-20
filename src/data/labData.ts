import type { NavItem } from '../types';

/**
 * Canonical origin used in the sitemap, canonical links and structured data.
 * Set NEXT_PUBLIC_SITE_URL at build time once the production domain is final.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://algal-biotech-lab.pages.dev').replace(/\/$/, '');

export const LAB_INFO = {
  name: 'Algal Biotechnology Laboratory',
  shortName: 'Algal Biotech Lab',
  founded: 2020,
  institution: 'Central University of Tamil Nadu',
  institutionShort: 'CUTN',
  campus: 'Neelakudi Campus',
  address: ['Neelakudi Campus, Thiruvarur', 'Tamil Nadu 610 005, India'],
  postal: { street: 'Neelakudi Campus', locality: 'Thiruvarur', region: 'Tamil Nadu', postalCode: '610005', country: 'IN' },
  email: 'amitkumar@cutn.ac.in',
  phone: '+91 4366 277230',
  phoneHref: 'tel:+914366277230',
  website: 'https://cutn.ac.in',
  mapHref:
    'https://www.google.com/maps/search/?api=1&query=Central+University+of+Tamil+Nadu+Neelakudi+Thiruvarur',
} as const;

export const NAV_ITEMS: NavItem[] = [
  { path: '/research', key: 'research', number: '01' },
  { path: '/people', key: 'people', number: '02' },
  { path: '/publications', key: 'publications', number: '03' },
  { path: '/contact', key: 'contact', number: '04' },
];

export const DEVELOPER = {
  name: 'Subhradeep Sarkar',
};
