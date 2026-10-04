import type { NavItem } from '../types';

export const LAB_INFO = {
  name: 'Algal Biotechnology Laboratory',
  shortName: 'Algal Biotech Lab',
  department: 'Department of Microbiology',
  school: 'School of Life Sciences',
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
  { to: '/', label: 'Home', number: '01' },
  { to: '/explore', label: 'Explore', number: '02' },
  { to: '/about', label: 'About Lab', number: '03' },
  { to: '/contact', label: 'Contact Us', number: '04' },
];

export const DEVELOPER = {
  name: 'Subhradeep Sarkar',
};
