import type { LabMember } from '../types';
import krishnakumarPhoto from '../assets/team/krishnakumar-m.webp';
import rajaniPhoto from '../assets/team/badana-rajani.webp';
import muskaanPhoto from '../assets/team/muskaan-jain.webp';
import manasaPhoto from '../assets/team/k-manasa-leela.webp';
import dhananjayPhoto from '../assets/team/dhananjay-kumar.webp';
import sreehariPhoto from '../assets/team/sreehari-m.webp';
import gouravPhoto from '../assets/team/gourav-haritwal.webp';

const CUTN_MSC = 'M.Sc. Microbiology, Department of Microbiology, Central University of Tamil Nadu';

/** Matched to the supplied member spreadsheet by name and worksheet image row. */
export const NEW_RESEARCHERS: LabMember[] = [
  {
    slug: 'krishnakumar-m', name: 'Krishnakumar M', status: 'current', role: 'phd', joined: 2023,
    photo: krishnakumarPhoto, photoPosition: '50% 25%',
    education: ['M.Sc. Microbiology, Madurai Kamaraj University, Tamil Nadu'],
    interests: ['Algal biotechnology', 'Microalgal stress dynamics', 'Algal carbon metabolism', 'Transcription factor engineering', 'Algal bioplastics production'],
    bio: 'Krishnakumar is a Ph.D. scholar whose research interests include microalgal stress dynamics, carbon metabolism, transcription factor engineering and algal bioplastics production.',
    fellowships: [],
    authorNames: ['Krishnakumar Mohan', 'Mohan K', 'Mohan, K.'],
    otherWorks: [
      {
        citation: 'Raj, S., Jyothsna, P., Lasya, V. et al. (2025). The role of microalgae and genetic engineering in transforming sustainable animal nutrition: a comprehensive review. Discover Applied Sciences, 7, 1244.',
        href: 'https://doi.org/10.1007/s42452-025-07432-0',
      },
    ],
    links: { scholar: 'https://scholar.google.com/citations?user=qGYIkSwAAAAJ&hl=en' },
  },
  {
    slug: 'badana-rajani', name: 'Badana Rajani', status: 'current', role: 'mentee', joined: 2024,
    photo: rajaniPhoto, photoPosition: '50% 25%',
    education: [CUTN_MSC],
    interests: ['Algal biotechnology', 'Algal metabolism', 'Algal transcriptomics', 'Microalgal stress dynamics'],
    bio: 'Rajani is a research mentee interested in algal metabolism, transcriptomics and microalgal stress dynamics.',
    fellowships: [], authorNames: ['Rajani B', 'Rajani, B.'], otherWorks: [], links: {},
  },
  {
    slug: 'dhananjay-kumar', name: 'Dhananjay Kumar', status: 'current', role: 'student', joined: 2024,
    photo: dhananjayPhoto, photoPosition: '50% 25%',
    education: [CUTN_MSC],
    interests: ['Algal microbiology', 'Biofuel research', 'Anaerobic digestion'],
    bio: 'Dhananjay’s research interests span algal microbiology, biofuels and anaerobic digestion.',
    fellowships: [], authorNames: [], otherWorks: [], links: {},
  },
  {
    slug: 'gourav-haritwal', name: 'Gourav Haritwal', status: 'current', role: 'student', joined: 2026,
    photo: gouravPhoto, photoPosition: '50% 25%',
    education: ['M.Sc. Horticulture (Vegetable Science), Central University of Tamil Nadu'],
    interests: ['Chlorella pyrenoidosa', 'Wastewater cultivation', 'Biomass harvesting'],
    bio: 'Gourav’s research interests focus on growing Chlorella pyrenoidosa using wastewater and harvesting its biomass.',
    fellowships: [], authorNames: ['Gourav H'], otherWorks: [], links: {},
  },
  {
    slug: 'muskaan-jain', name: 'Muskaan Jain', status: 'current', role: 'student', joined: 2025,
    photo: muskaanPhoto, photoPosition: '50% 25%',
    education: ['M.Sc. Biotechnology (pursuing)', 'B.Sc., Dr. Bhim Rao Ambedkar University, Agra'],
    interests: [],
    bio: 'Muskaan holds a B.Sc. from Dr. Bhim Rao Ambedkar University, Agra, and is pursuing an M.Sc. in Biotechnology.',
    fellowships: [], authorNames: [], otherWorks: [], links: {},
  },
];

/** Alumni positions are taken from the spreadsheet’s Alumni Current Position column. */
export const NEW_ALUMNI: LabMember[] = [
  {
    slug: 'k-manasa-leela', name: 'K Manasa Leela', status: 'alumni', role: 'student', joined: 2022,
    photo: manasaPhoto, photoPosition: '50% 25%',
    education: [CUTN_MSC],
    interests: ['Nitrogen stress in microalgae', 'Microalgal metabolic content', 'Animal and poultry feed'],
    now: 'Executive, QC In Vitro Testing, Biological E. Ltd., Hyderabad',
    bio: 'Manasa’s research interests include the effect of nitrogen stress on microalgal metabolic content for animal and poultry feed. She now works in QC In Vitro Testing at Biological E. Ltd., Hyderabad.',
    fellowships: [], authorNames: ['K. Manasa Leela'], otherWorks: [], links: {},
  },
  {
    slug: 'sreehari-m', name: 'Sreehari M', status: 'alumni', role: 'student', joined: 2022,
    photo: sreehariPhoto, photoPosition: '50% 25%',
    education: [CUTN_MSC],
    interests: ['Algal biotechnology'],
    now: 'Faculty of Zoology, Xylem Learning',
    bio: 'Sreehari studied Microbiology at the Central University of Tamil Nadu and has research interests in algal biotechnology. He is now a faculty member in Zoology at Xylem Learning.',
    fellowships: [], authorNames: ['M. Sreehari'], otherWorks: [], links: {},
  },
];
