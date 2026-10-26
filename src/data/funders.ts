import type { StaticImageData } from 'next/image';
import dst from '../assets/funders/dst.png';
import anrf from '../assets/funders/anrf.png';
import inspire from '../assets/funders/inspire.png';
import horizon from '../assets/funders/horizon-2020-eu.png';
import wallenberg from '../assets/funders/wallenberg.png';
import biologists from '../assets/funders/company-of-biologists.png';
import umea from '../assets/funders/umea-university.png';
import cutn from '../assets/funders/cutn.png';
import dstColour from '../assets/funders/dst-colour.png';
import anrfColour from '../assets/funders/anrf-colour.png';
import inspireColour from '../assets/funders/inspire-colour.png';
import horizonColour from '../assets/funders/horizon-2020-eu-colour.png';
import wallenbergColour from '../assets/funders/wallenberg-colour.png';
import biologistsColour from '../assets/funders/company-of-biologists-colour.png';
import umeaColour from '../assets/funders/umea-university-colour.png';
import cutnColour from '../assets/funders/cutn-colour.png';

/** Funding and recognition bodies, with artwork sourced in assets/funders/sources.json. */
export interface Funder {
  /** Short name, also shown beside symbols without a readable wordmark. */
  mark: string;
  /** Full name, for the tooltip and screen readers. */
  name: string;
  href: string;
  logo: StaticImageData;
  colourLogo: StaticImageData;
  showLabel?: boolean;
}

export const FUNDERS: Funder[] = [
  { mark: 'DST', name: 'Department of Science and Technology, Government of India', href: 'https://dst.gov.in', logo: dst, colourLogo: dstColour },
  { mark: 'ANRF', name: 'Anusandhan National Research Foundation (formerly SERB)', href: 'https://anrfonline.in', logo: anrf, colourLogo: anrfColour, showLabel: true },
  { mark: 'INSPIRE', name: 'DST-INSPIRE, Department of Science and Technology', href: 'https://online-inspire.gov.in', logo: inspire, colourLogo: inspireColour },
  { mark: 'Horizon 2020', name: 'European Union Horizon 2020', href: 'https://research-and-innovation.ec.europa.eu', logo: horizon, colourLogo: horizonColour, showLabel: true },
  { mark: 'Wallenberg', name: 'Wallenberg Foundation, Sweden', href: 'https://kaw.wallenberg.org', logo: wallenberg, colourLogo: wallenbergColour },
  { mark: 'Company of Biologists', name: 'The Company of Biologists, UK', href: 'https://www.biologists.com', logo: biologists, colourLogo: biologistsColour },
  { mark: 'Umeå University', name: 'Umeå University, Sweden', href: 'https://www.umu.se', logo: umea, colourLogo: umeaColour },
  { mark: 'Central University of Tamil Nadu', name: 'Central University of Tamil Nadu', href: 'https://cutn.ac.in', logo: cutn, colourLogo: cutnColour, showLabel: true },
];
