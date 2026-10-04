import type { TeamMember } from '../types';
import amitPhoto from '../assets/team/amit.jpg';
import arathiPhoto from '../assets/team/arathi.jpg';
import subhishaPhoto from '../assets/team/subhisha.jpg';

export const PI: TeamMember = {
  id: 'amit-kumar-bajhaiya',
  name: 'Dr. Amit Kumar Bajhaiya',
  shortName: 'Amit Kumar Bajhaiya',
  role: 'Assistant Professor · Principal Investigator',
  group: 'pi',
  photo: amitPhoto,
  photoPosition: '50% 20%',
  email: 'amitkumar@cutn.ac.in',
  links: {
    profile: 'https://cutn.ac.in/staff-members/dr-amit-kumar-bajhaiya/',
    cv: 'https://cutn.ac.in/wp-content/uploads/2023/07/Dr_Amit_Bajhaiya_cv_05082023.pdf',
    orcid: 'https://orcid.org/0000-0002-9912-4278',
    scholar: 'https://scholar.google.com/citations?user=E5hc9kAAAAAJ&hl=en',
    researchGate: 'https://www.researchgate.net/profile/Dr-Amit-Bajhaiya',
    linkedin: 'https://in.linkedin.com/in/dr-amit-kumar-bajhaiya-64705143',
  },
  bio: 'Amit trained in algal biotechnology at the University of Manchester, where his doctoral work on Chlamydomonas reinhardtii metabolism and transcriptional engineering for biofuel production identified PSR1 as a global regulator of phosphorus-starvation responses. Postdoctoral years at Umeå University in Sweden added proteomics, carbon-concentrating mechanisms and stress biology. He joined the Central University of Tamil Nadu in 2020 and leads the Algal Biotechnology Laboratory.',
  focus: [
    'Transcriptional engineering of microalgae',
    'Abiotic stress and programmed cell death',
    'Carbon-concentrating mechanisms and proteomics',
    'Algal biofuels and circular bioeconomy',
  ],
  path: [
    { title: 'Assistant Professor', place: 'Department of Microbiology, Central University of Tamil Nadu', period: '2020 – present' },
    { title: 'Postdoctoral Fellow', place: 'Chemical Biological Centre (KBC), Umeå University, Sweden', period: '2018 – 2020', note: 'Host: Prof. Christiane Funk' },
    { title: 'Postdoctoral Fellow', place: 'Umeå Plant Science Centre, Umeå University, Sweden', period: '2015 – 2017', note: 'Host: Prof. Göran Samuelsson' },
    { title: 'Ph.D., Algal Biotechnology', place: 'Faculty of Life Sciences, University of Manchester, UK', period: '2011 – 2015', note: 'Supervisors: Dr. Jon K. Pittman and Dr. Andrew P. Dean' },
    { title: 'DBT Project Assistant', place: 'CSIR – National Botanical Research Institute, Lucknow', period: '2009 – 2010' },
    { title: 'M.Sc., Biotechnology', place: 'College of Life Sciences, Jiwaji University, Gwalior', period: '2005 – 2007' },
    { title: 'B.Sc. B.Ed. (integrated)', place: 'Regional Institute of Education (NCERT), Bhopal', period: '2001 – 2005' },
  ],
  honours: [],
};

export const SRFS: TeamMember[] = [
  {
    id: 'arathi-sreenikethanam',
    name: 'Arathi Sreenikethanam',
    shortName: 'Arathi Sreenikethanam',
    role: 'Senior Research Fellow · Ph.D. scholar',
    group: 'srf',
    photo: arathiPhoto,
    photoPosition: '58% 24%',
    email: 'arathisreenikethanam@students.cutn.ac.in',
    links: {
      orcid: 'https://orcid.org/0000-0002-6404-5756',
      scholar: 'https://scholar.google.com/citations?user=zcHm-08AAAAJ&hl=en',
      researchGate: 'https://www.researchgate.net/scientific-contributions/Arathi-Sreenikethanam-2208266378',
      linkedin: 'https://in.linkedin.com/in/arathi-sreenikethanam-694557229',
    },
    bio: 'Arathi studies how freshwater microalgae rebuild their metabolism under salt and nutrient stress, and how that response can be harnessed through genetic and transcriptional engineering. Her work spans UV-protective mycosporine-like amino acids, algal bioplastics and the phycoremediation of emerging contaminants.',
    focus: [
      'Metabolite remodelling under NaCl stress',
      'Genetic engineering for secondary metabolites',
      'Algae-based bioplastics',
      'Mycosporine-like amino acids',
      'Phycoremediation of emerging contaminants',
    ],
    path: [
      { title: 'Ph.D., Microbiology (Algal Biotechnology)', place: 'Central University of Tamil Nadu', period: '2020 – present' },
      { title: 'M.Sc., Microbiology (general distinction)', place: 'Central University of Tamil Nadu', period: '2018 – 2020' },
      { title: 'B.Sc., Microbiology', place: 'St. Ann’s College for Women, Osmania University, Hyderabad', period: '2015 – 2018' },
    ],
    honours: ['SERB project fellow (DST, Government of India)', 'NBCFDC and DST national fellowship support'],
  },
  {
    id: 'subhisha-raj',
    name: 'Subhisha Raj',
    shortName: 'Subhisha Raj',
    role: 'Senior Research Fellow · Ph.D. scholar (CSIR)',
    group: 'srf',
    photo: subhishaPhoto,
    photoPosition: '50% 18%',
    email: 'subhisharaj@students.cutn.ac.in',
    links: {
      orcid: 'https://orcid.org/0000-0002-9651-588X',
      scholar: 'https://scholar.google.com/citations?user=PocmDTkAAAAJ&hl=en',
      linkedin: 'https://in.linkedin.com/in/subhisha-raj-2aa617119',
    },
    bio: 'Subhisha tracks how much polyphosphate microalgae accumulate as phosphate availability changes, groundwork for algae that serve as slow-release phosphate biofertilisers. She also works on metabolic engineering for food fortification, including vitamin D3, and on multi-omics of plant–microbe interactions.',
    focus: [
      'Polyphosphate accumulation dynamics',
      'Algal phosphate biofertiliser',
      'Metabolic engineering for vitamin D3',
      'Mycosporine-like amino acids',
      'Multi-omics of plant–microbe interactions',
    ],
    path: [
      { title: 'Ph.D., Microbiology (Algal Biotechnology)', place: 'Central University of Tamil Nadu', period: '2021 – present', note: 'CSIR-JRF, upgraded to CSIR-SRF' },
      { title: 'BS-MS Dual Degree, Biological Sciences', place: 'IISER Bhopal', period: '2015 – 2020' },
    ],
    honours: ['CSIR Junior Research Fellowship (2021), upgraded to Senior Research Fellowship'],
  },
];

export const TEAM: TeamMember[] = [PI, ...SRFS];
