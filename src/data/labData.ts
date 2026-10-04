import type { NavItem } from '../types';

export const LAB_INFO = {
  name: 'Algal Biotechnology Laboratory',
  shortName: 'Algal Biotech Lab',
  institution: 'Central University of Tamil Nadu',
  institutionShort: 'CUTN',
  campus: 'Neelakudi Campus',
  address: ['Neelakudi Campus, Thiruvarur', 'Tamil Nadu 610 005, India'],
  email: 'amitkumar@cutn.ac.in',
  phone: '+91 4366 277230',
  phoneHref: 'tel:+914366277230',
  website: 'https://cutn.ac.in',
  mapHref:
    'https://www.google.com/maps/search/?api=1&query=Central+University+of+Tamil+Nadu+Neelakudi+Thiruvarur',
} as const;

export const NAV_ITEMS: NavItem[] = [
  { to: '/', key: 'home', number: '01' },
  { to: '/explore', key: 'explore', number: '02' },
  { to: '/about', key: 'about', number: '03' },
  { to: '/contact', key: 'contact', number: '04' },
];

export const DEVELOPER = {
  name: 'Subhradeep Sarkar',
};
