import type { SrfKey, TeamMember } from '../types';
import amitPhoto from '../assets/team/amit.jpg';
import arathiPhoto from '../assets/team/arathi.jpg';
import subhishaPhoto from '../assets/team/subhisha.jpg';

/** Names, links and institutions. Roles, bios and step titles live in src/i18n/locales. */
export const PI: TeamMember = {
  id: 'amit-kumar-bajhaiya',
  name: 'Dr. Amit Kumar Bajhaiya',
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
  path: [
    { place: 'Department of Microbiology, Central University of Tamil Nadu', period: '2020 –' },
    { place: 'Chemical Biological Centre (KBC), Umeå University, Sweden', period: '2018 – 2020' },
    { place: 'Umeå Plant Science Centre, Umeå University, Sweden', period: '2015 – 2017' },
    { place: 'Faculty of Life Sciences, University of Manchester, UK', period: '2011 – 2015' },
    { place: 'CSIR – National Botanical Research Institute, Lucknow', period: '2009 – 2010' },
    { place: 'College of Life Sciences, Jiwaji University, Gwalior', period: '2005 – 2007' },
    { place: 'Regional Institute of Education (NCERT), Bhopal', period: '2001 – 2005' },
  ],
};

export const SRFS: (TeamMember & { key: SrfKey })[] = [
  {
    key: 'arathi',
    id: 'arathi-sreenikethanam',
    name: 'Arathi Sreenikethanam',
    photo: arathiPhoto,
    photoPosition: '58% 24%',
    email: 'arathisreenikethanam@students.cutn.ac.in',
    links: {
      orcid: 'https://orcid.org/0000-0002-6404-5756',
      scholar: 'https://scholar.google.com/citations?user=zcHm-08AAAAJ&hl=en',
      researchGate: 'https://www.researchgate.net/scientific-contributions/Arathi-Sreenikethanam-2208266378',
      linkedin: 'https://in.linkedin.com/in/arathi-sreenikethanam-694557229',
    },
    path: [
      { place: 'Central University of Tamil Nadu', period: '2020 –' },
      { place: 'Central University of Tamil Nadu', period: '2018 – 2020' },
      { place: 'St. Ann’s College for Women, Osmania University, Hyderabad', period: '2015 – 2018' },
    ],
  },
  {
    key: 'subhisha',
    id: 'subhisha-raj',
    name: 'Subhisha Raj',
    photo: subhishaPhoto,
    photoPosition: '50% 18%',
    email: 'subhisharaj@students.cutn.ac.in',
    links: {
      orcid: 'https://orcid.org/0000-0002-9651-588X',
      scholar: 'https://scholar.google.com/citations?user=PocmDTkAAAAJ&hl=en',
      linkedin: 'https://in.linkedin.com/in/subhisha-raj-2aa617119',
    },
    path: [
      { place: 'Central University of Tamil Nadu', period: '2021 –' },
      { place: 'IISER Bhopal', period: '2015 – 2020' },
    ],
  },
];

export const TEAM: TeamMember[] = [PI, ...SRFS];
