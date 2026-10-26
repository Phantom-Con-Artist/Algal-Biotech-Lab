import type { LabMember } from '../types';
import { NEW_ALUMNI, NEW_RESEARCHERS } from './memberAdditions';
import amitPhoto from '../assets/team/amit-kumar-bajhaiya.webp';
import arathiPhoto from '../assets/team/arathi-sreenikethanam.webp';
import subhishaPhoto from '../assets/team/subhisha-raj.webp';
import niharikaPhoto from '../assets/team/mondru-niharika.webp';
import aaditayPhoto from '../assets/team/aaditay-malviya.webp';
import amithaPhoto from '../assets/team/amitha-k-a.webp';
import arindamPhoto from '../assets/team/arindam-chatterjee.webp';
import abhrajitPhoto from '../assets/team/abhrajit-mukherjee.webp';
import abarnaPhoto from '../assets/team/abarna-p.webp';

const CUTN_MSC = 'M.Sc. Microbiology, Department of Microbiology, Central University of Tamil Nadu';
const PROTEOMICS_BOOK =
  'In: Proteomics for Agriculture. Eds. A. K. Bajhaiya, P. Uma Devi, M. Malakar and S. Manivannan. CUTN Publisher, 2025. ISBN 978-81-961610-6-4.';

export const PI: LabMember = {
  slug: 'amit-kumar-bajhaiya',
  name: 'Amit Kumar Bajhaiya',
  honorific: 'Dr.',
  status: 'pi',
  role: 'pi',
  joined: 2020,
  photo: amitPhoto,
  photoPosition: '50% 20%',
  email: 'amitkumar@cutn.ac.in',
  education: [
    'Ph.D., Algal Biotechnology, University of Manchester, UK',
    'M.Sc., Biotechnology, Jiwaji University, Gwalior',
    'B.Sc. B.Ed. (integrated), Regional Institute of Education (NCERT), Bhopal',
  ],
  interests: ['Transcriptional engineering', 'Abiotic stress', 'Carbon-concentrating mechanisms', 'Proteomics', 'Algal biofuels'],
  fellowships: [],
  authorNames: ['Amit K. Bajhaiya', 'Amit Kumar Bajhaiya'],
  otherWorks: [],
  links: {
    profile: 'https://cutn.ac.in/staff-members/dr-amit-kumar-bajhaiya/',
    cv: 'https://cutn.ac.in/wp-content/uploads/2023/07/Dr_Amit_Bajhaiya_cv_05082023.pdf',
    orcid: 'https://orcid.org/0000-0002-9912-4278',
    scholar: 'https://scholar.google.com/citations?user=E5hc9kAAAAAJ&hl=en',
    researchGate: 'https://www.researchgate.net/profile/Dr-Amit-Bajhaiya',
    linkedin: 'https://in.linkedin.com/in/dr-amit-kumar-bajhaiya-64705143',
  },
};

/** Career steps of the PI; titles and notes are translated in the dictionaries (same order). */
export const PI_PATH = [
  { place: 'Department of Microbiology, Central University of Tamil Nadu', period: '2020 –' },
  { place: 'Chemical Biological Centre (KBC), Umeå University, Sweden', period: '2018 – 2020' },
  { place: 'Umeå Plant Science Centre, Umeå University, Sweden', period: '2015 – 2017' },
  { place: 'Faculty of Life Sciences, University of Manchester, UK', period: '2011 – 2015' },
  { place: 'CSIR – National Botanical Research Institute, Lucknow', period: '2009 – 2010' },
  { place: 'College of Life Sciences, Jiwaji University, Gwalior', period: '2005 – 2007' },
  { place: 'Regional Institute of Education (NCERT), Bhopal', period: '2001 – 2005' },
];

/** Current researchers, most senior first. Biographies are as supplied by each member, lightly edited. */
const EXISTING_RESEARCHERS: LabMember[] = [
  {
    slug: 'arathi-sreenikethanam',
    name: 'Arathi Sreenikethanam',
    status: 'current',
    role: 'srf',
    joined: 2020,
    photo: arathiPhoto,
    photoPosition: '58% 24%',
    education: [CUTN_MSC, 'B.Sc. Microbiology, St. Ann’s College for Women, Osmania University, Hyderabad'],
    interests: ['Metabolite remodelling under NaCl stress', 'Genetic engineering', 'Mycosporine-like amino acids', 'Algal bioplastics', 'Phycoremediation'],
    bio: 'Arathi studies how freshwater microalgae rebuild their metabolism under salt and nutrient stress, and how that response can be harnessed through genetic and transcriptional engineering. Her work spans UV-protective mycosporine-like amino acids, algal bioplastics and the phycoremediation of emerging contaminants.',
    fellowships: [],
    authorNames: ['Arathi Sreenikethanam'],
    otherWorks: [],
    links: {
      orcid: 'https://orcid.org/0000-0002-6404-5756',
      scholar: 'https://scholar.google.com/citations?user=zcHm-08AAAAJ&hl=en',
      researchGate: 'https://www.researchgate.net/scientific-contributions/Arathi-Sreenikethanam-2208266378',
      linkedin: 'https://in.linkedin.com/in/arathi-sreenikethanam-694557229',
    },
  },
  {
    slug: 'subhisha-raj',
    name: 'Subhisha Raj',
    status: 'current',
    role: 'srf',
    joined: 2021,
    photo: subhishaPhoto,
    photoPosition: '50% 18%',
    education: ['BS-MS Dual Degree, Biological Sciences, IISER Bhopal'],
    interests: ['Microalgal biotechnology', 'Microalgal physiology and metabolism', 'Nutrient stress responses', 'Polyphosphate', 'Molecular biology'],
    bio: 'Subhisha is a research scholar in the Algal Biotechnology Lab under Dr. Amit Kumar Bajhaiya, with a background in the biological sciences. Her research focuses on microalgal biology and biotechnology, particularly phosphorus metabolism, nutrient stress responses, phosphate uptake, polyphosphate storage and algal metabolism. She is interested in the molecular and physiological mechanisms behind microalgal adaptation to nutrient availability, and in applying them to sustainable biotechnology, including nutrient recovery and biofertiliser development.',
    fellowships: ['CSIR Junior and Senior Research Fellowship', 'ANRF International Travel Support grant'],
    authorNames: ['Subhisha Raj'],
    otherWorks: [],
    links: {
      orcid: 'https://orcid.org/0000-0002-9651-588X',
      scholar: 'https://scholar.google.com/citations?user=PocmDTkAAAAJ&hl=en',
      linkedin: 'https://in.linkedin.com/in/subhisha-raj-2aa617119',
    },
  },
  {
    slug: 'mondru-niharika',
    name: 'Mondru Niharika',
    status: 'current',
    role: 'inspire',
    joined: 2025,
    photo: niharikaPhoto,
    photoPosition: '50% 30%',
    education: ['M.Sc. Microbiology, Department of Microbiology, Sri Venkateswara University, Tirupati'],
    interests: ['Microalgal biotechnology', 'Stress biology', 'Secondary metabolites', 'Molecular biology', 'Genetic engineering'],
    bio: 'Niharika Mondru is a research scholar in the Algal Biotechnology Lab under the supervision of Dr. Amit Kumar Bajhaiya. Her research combines molecular biology, biochemical analysis, gene-expression studies, stress physiology and sustainable bioprocessing, and focuses mainly on photoprotective compounds such as microalgal flavonoids.',
    fellowships: ['DST-INSPIRE Fellowship (2026)'],
    authorNames: ['Niharika Mondru'],
    otherWorks: [],
    links: { scholar: 'https://scholar.google.com/citations?user=bCdNwJ0AAAAJ&hl=en' },
  },
  {
    slug: 'aaditay-malviya',
    name: 'Aaditay Malviya',
    status: 'current',
    role: 'urf',
    joined: 2025,
    photo: aaditayPhoto,
    photoPosition: '50% 25%',
    education: ['M.Sc. Life Sciences, Devi Ahilya University, Indore, Madhya Pradesh'],
    interests: ['Microalgal biotechnology', 'Strain improvement', 'Random mutagenesis', 'Metabolic engineering', 'Stress-induced metabolites'],
    bio: 'Aaditay Malviya is a Ph.D. researcher in the Department of Microbiology at the Central University of Tamil Nadu, working in microalgal biotechnology. His research improves microalgal strains through random mutagenesis and screening for higher biomass and valuable biochemical metabolites. His interests include strain improvement, stress-induced metabolic responses, lipid, protein, carbohydrate and pigment production, and biotechnological strategies for high-performing algal strains.',
    fellowships: ['Mukhyamantri Medhavi Vidyarthi Yojana (MMVY) undergraduate scholarship', 'MPTAAS scholarship for postgraduate studies'],
    authorNames: [],
    otherWorks: [
      {
        citation: 'Thakur, V. and Malviya, A. (2023). A comprehensive comparative study of air pollution in Indore, Bhopal, Gwalior and Jabalpur, Madhya Pradesh. International Journal of Creative Research Thoughts, 11(3), i366–i374.',
        href: 'https://ijcrt.org/viewpaperforall.php?paper=IJCRT2303993',
      },
    ],
    links: { scholar: 'https://scholar.google.com/citations?user=HJWOxaoAAAAJ&hl=en' },
  },
  {
    slug: 'amitha-k-a',
    name: 'Amitha K A',
    status: 'current',
    role: 'anrf',
    joined: 2025,
    photo: amithaPhoto,
    photoPosition: '50% 30%',
    education: ['M.Sc. Botany, Department of Plant Science, Central University of Kerala'],
    interests: ['Algal bioremediation', 'Microalgal biofertilisers', 'Carbon sequestration', 'Molecular cloning', 'Gene editing'],
    bio: 'Amitha K A is a Junior Research Fellow in the Algal Biotechnology Lab under the supervision of Dr. Amit Kumar Bajhaiya. Her research seeks the molecular pathways and regulatory networks behind the bioremediation capabilities of microalgae, with the aim of raising biomass production and carrying the findings into industrial use. She plans to engineer microalgal genomes and develop strains with improved biotechnological potential, integrating molecular genetics with applied bioprocesses for environmental remediation, nutrient recovery and the bioeconomy.',
    fellowships: ['ANRF-IRG Junior Research Fellowship', 'Joint CSIR-UGC NET 2026 (Category II)', 'National Scholarship for Postgraduate Studies'],
    authorNames: ['Amitha K. Alenchery'],
    otherWorks: [],
    links: {},
  },
  {
    slug: 'arindam-chatterjee',
    name: 'Arindam Chatterjee',
    status: 'current',
    role: 'mentee',
    joined: 2024,
    photo: arindamPhoto,
    photoPosition: '50% 30%',
    education: [CUTN_MSC],
    interests: ['Algae-derived therapeutics', 'Genetic engineering', 'Extremophile biology'],
    bio: 'Arindam Chatterjee completed his M.Sc. in the Department of Microbiology and trained in the Algal Biotechnology Lab, where he has published work under the guidance of Dr. Amit Kumar Bajhaiya. He continues in the lab as a research mentee, exploring algae-derived therapeutics and genetic engineering.',
    fellowships: [],
    authorNames: ['Arindam Chatterjee'],
    otherWorks: [
      { citation: `Chatterjee, A. et al. (2025). Role of proteomics in the study of plant secondary metabolites and bioactive compounds. ${PROTEOMICS_BOOK}` },
    ],
    links: {},
  },
];

const EXISTING_ALUMNI: LabMember[] = [
  {
    slug: 'abhrajit-mukherjee',
    name: 'Abhrajit Mukherjee',
    status: 'alumni',
    role: 'mentee',
    joined: 2024,
    photo: abhrajitPhoto,
    photoPosition: '50% 25%',
    now: 'ICMR Research Fellow, Department of Transfusion Medicine, All India Institute of Medical Sciences (AIIMS), Bhubaneswar',
    education: [CUTN_MSC],
    interests: ['Cancer immunotherapy', 'CAR-T cell therapy', 'mRNA vaccines', 'Drug delivery', 'Nanobiotechnology'],
    bio: 'Abhrajit Mukherjee completed his M.Sc. in Microbiology at the Central University of Tamil Nadu as a mentee of Dr. Amit Kumar Bajhaiya in the Algal Biotechnology Lab. During his M.Sc. he received the INSA–NASI–IASc Summer Research Fellowship (2025) and worked at CSIR-Indian Institute of Chemical Technology, where he also carried out his master’s dissertation. He published during his postgraduate studies, both within the department and with other departments of the university, and is now an ICMR Research Fellow at AIIMS Bhubaneswar.',
    fellowships: ['INSA–NASI–IASc Summer Research Fellowship (2025)', 'Joint CSIR-UGC NET 2026 (Category III)'],
    authorNames: ['Abhrajit Mukherjee'],
    otherWorks: [
      { citation: `Mukherjee, A. et al. (2025). Analysis of plant-derived immunomodulators in anticancer therapeutics using proteomic studies. ${PROTEOMICS_BOOK}` },
      {
        citation: 'Mukherjee, A., Ghosh, A., Ghosh, S., Mallik, A., Chakraborty, P. and Sarkar, J. (2026). Genetically modified Salmonella typhimurium: a Trojan horse strategy for targeted cancer therapy. Journal of Experimental Biology and Agricultural Sciences, 14, 1–9.',
        href: 'https://doi.org/10.18006/2026.14(1).1.9',
      },
    ],
    links: { scholar: 'https://scholar.google.com/citations?user=S1xDq0Hh14wC&hl=en' },
  },
  {
    slug: 'abarna-p',
    name: 'Abarna P',
    status: 'alumni',
    role: 'trainee',
    joined: 2024,
    photo: abarnaPhoto,
    photoPosition: '50% 30%',
    now: 'Ph.D. scholar (CSIR NET-JRF), ICAR-Central Institute of Fisheries Technology, Kochi',
    education: [CUTN_MSC],
    interests: ['Algae-derived therapeutics', 'Abiotic stress physiology', 'Metabolomic shifts'],
    bio: 'Abarna P completed her M.Sc. in Microbiology at the Central University of Tamil Nadu and trained in the Algal Biotechnology Lab, where she contributed to published work under the supervision of Dr. Amit Kumar Bajhaiya. She is now a Ph.D. scholar at ICAR-Central Institute of Fisheries Technology, Kochi.',
    fellowships: ['CSIR NET-JRF'],
    authorNames: ['P. Abarna'],
    otherWorks: [],
    links: {},
  },
];

export const RESEARCHERS: LabMember[] = [...EXISTING_RESEARCHERS, ...NEW_RESEARCHERS]
  .sort((a, b) => a.joined - b.joined);
export const ALUMNI: LabMember[] = [...EXISTING_ALUMNI, ...NEW_ALUMNI];
export const MEMBERS: LabMember[] = [PI, ...RESEARCHERS, ...ALUMNI];

export const getMember = (slug: string): LabMember | undefined => MEMBERS.find((m) => m.slug === slug);

/** Display name with honorific, for example "Dr. Amit Kumar Bajhaiya". */
export const fullName = (m: LabMember) => (m.honorific ? `${m.honorific} ${m.name}` : m.name);
