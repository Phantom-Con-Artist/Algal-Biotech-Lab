/**
 * The bodies that have funded or recognised the lab's work, from src/data/recognition.ts. Shown as
 * typographic wordmarks; an official logo file can replace a name by adding `logo` (an SVG import).
 */
export interface Funder {
  /** Short mark, set large. */
  mark: string;
  /** Full name, for the tooltip and screen readers. */
  name: string;
  href: string;
}

export const FUNDERS: Funder[] = [
  { mark: 'DST', name: 'Department of Science and Technology, Government of India', href: 'https://dst.gov.in' },
  { mark: 'ANRF', name: 'Anusandhan National Research Foundation (formerly SERB)', href: 'https://anrfonline.in' },
  { mark: 'INSPIRE', name: 'DST-INSPIRE, Department of Science and Technology', href: 'https://online-inspire.gov.in' },
  { mark: 'Horizon 2020', name: 'European Union Horizon 2020', href: 'https://research-and-innovation.ec.europa.eu' },
  { mark: 'Wallenberg', name: 'Wallenberg Foundation, Sweden', href: 'https://kaw.wallenberg.org' },
  { mark: 'Company of Biologists', name: 'The Company of Biologists, UK', href: 'https://www.biologists.com' },
  { mark: 'Umeå University', name: 'Umeå University, Sweden', href: 'https://www.umu.se' },
  { mark: 'CUTN', name: 'Central University of Tamil Nadu', href: 'https://cutn.ac.in' },
];
