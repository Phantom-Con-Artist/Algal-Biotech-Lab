import { TeamMember, Publication, ResearchThrust, Grant } from '../types';

export const LAB_INFO = {
  name: 'Algal Biotechnology Laboratory',
  shortName: 'Algal Biotech Lab',
  department: 'Department of Microbiology',
  school: 'School of Life Sciences',
  institution: 'Central University of Tamil Nadu (CUTN)',
  location: 'Neelakudi Campus, Thiruvarur – 610 005, Tamil Nadu, India',
  email: 'amitkumar@cutn.ac.in',
  phone: '+91-4366-277230',
};

export const RESEARCH_THRUSTS: ResearchThrust[] = [
  {
    id: 'transcriptional-engineering',
    title: 'Transcriptional Engineering of Microalgae',
    shortDescription: 'Investigating global transcription regulators (like PSR1) to modulate metabolic pathways for secondary metabolite and lipid production.',
    icon: 'Dna',
    keywords: ['PSR1 Regulator', 'Secondary Metabolites', 'Genetic Manipulation', 'Chlamydomonas']
  },
  {
    id: 'biofuels-biorefinery',
    title: 'Algal Biofuels & Circular Biorefinery',
    shortDescription: 'Developing inducible two-step cultivation regimes to decouple growth and lipid biosynthesis for scalable, cost-efficient biofuels.',
    icon: 'Fuel',
    keywords: ['Two-Step Cultivation', 'Lipid Biosynthesis', 'Biohydrogen', 'Circular Bioeconomy']
  },
  {
    id: 'abiotic-stress',
    title: 'Abiotic Stress Biology & Programmed Cell Death',
    shortDescription: 'Characterizing type I and type II metacaspases and proteomic remodeling in response to salinity, nutrient limitation, and cold stress.',
    icon: 'Activity',
    keywords: ['Metacaspases', 'PCD', 'NaCl Stress', 'Proteomics']
  },
  {
    id: 'biofertilizers-polyphosphate',
    title: 'Polyphosphate Dynamics & Biofertilizers',
    shortDescription: 'Deciphering intracellular polyphosphate accumulation under phosphate variability to engineer eco-friendly slow-release algal biofertilizers.',
    icon: 'Leaf',
    keywords: ['Polyphosphate', 'Phosphate Starvation', 'Biofertilizer', 'Sustainable Agriculture']
  },
  {
    id: 'bioplastics-phycoremediation',
    title: 'Bioplastics & Wastewater Bioremediation',
    shortDescription: 'Developing algae-derived biodegradable plastics and utilizing microalgae consortia for heavy-metal and xenobiotic phycoremediation.',
    icon: 'Recycle',
    keywords: ['Algal Bioplastics', 'Phycoremediation', 'Heavy Metals', 'Wastewater Treatment']
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'dr-amit-kumar-bajhaiya',
    name: 'Dr. Amit Kumar Bajhaiya',
    alternativeNames: ['Amit Kumar Bhajhaiya', 'A. K. Bajhaiya'],
    role: 'Assistant Professor & Principal Investigator',
    affiliation: 'Central University of Tamil Nadu',
    department: 'Department of Microbiology, School of Life Sciences',
    institution: 'Central University of Tamil Nadu (CUTN)',
    email: 'amitkumar@cutn.ac.in',
    phone: '+91-4366-277230 / +91-7499879105',
    orcid: 'https://orcid.org/0000-0002-9912-4278',
    googleScholar: 'https://scholar.google.com/citations?user=E5hc9kAAAAAJ&hl=en',
    researchGate: 'https://www.researchgate.net/profile/Dr-Amit-Bajhaiya',
    linkedin: 'https://in.linkedin.com/in/dr-amit-kumar-bajhaiya-64705143',
    education: [
      {
        degree: 'Postdoctoral Fellow',
        institution: 'Chemical Biological Centre (KBC), Umeå University, Sweden',
        year: '2018 – 2020'
      },
      {
        degree: 'Postdoctoral Fellow',
        institution: 'Umeå Plant Science Centre (UPSC), Umeå University, Sweden',
        year: '2015 – 2017'
      },
      {
        degree: 'Ph.D. in Algal Biotechnology / Life Sciences',
        institution: 'University of Manchester, United Kingdom',
        year: '2011 – 2015'
      },
      {
        degree: 'M.Sc. in Biotechnology',
        institution: 'College of Life Sciences, Jiwaji University, Gwalior',
        year: '2005 – 2007'
      },
      {
        degree: 'B.Sc. B.Ed. Integrated',
        institution: 'Regional Institute of Education (RIE, NCERT), Bhopal',
        year: '2001 – 2005'
      }
    ],
    researchInterests: [
      'Algal Molecular Biology',
      'Transcriptional Engineering',
      'Metabolomics & Sub-cellular Proteomics',
      'Carbon Concentrating Mechanism (CCM)',
      'Abiotic Stress & Programmed Cell Death'
    ],
    awardsAndFellowships: [
      'DST INSPIRE Faculty Award (Govt. of India, 2018)',
      'SERB Start-up Research Grant (SRG) PI (2021–2023)',
      'Lawski Foundation Postdoctoral Fellowship (Sweden, 2017)',
      'Overseas PhD Fellowship (Govt. of India, 2011)',
      'Young Scientist Travel Award (IUBS, 2018)',
      'Wallenberg Foundation Travel Grant (Sweden, 2019)',
      'Company of Biologists / SEB Travel Awards (UK, 2014 & 2019)',
      'Best Oral Presentation Award, International Algal Biotechnology Symposium (UK, 2014)'
    ]
  },
  {
    id: 'arathi-sreenikethanam',
    name: 'Arathi Sreenikethanam',
    role: 'Senior Research Fellow (SRF) / Ph.D. Scholar',
    affiliation: 'Central University of Tamil Nadu',
    department: 'Department of Microbiology, School of Life Sciences',
    institution: 'Central University of Tamil Nadu (CUTN)',
    email: 'arathisreenikethanam@students.cutn.ac.in',
    orcid: 'https://orcid.org/0000-0002-6404-5756',
    googleScholar: 'https://scholar.google.com/citations?user=zcHm-08AAAAJ&hl=en',
    researchGate: 'https://www.researchgate.net/scientific-contributions/Arathi-Sreenikethanam-2208266378',
    linkedin: 'https://in.linkedin.com/in/arathi-sreenikethanam-694557229',
    education: [
      {
        degree: 'Ph.D. in Microbiology / Algal Biotechnology',
        institution: 'Central University of Tamil Nadu (CUTN)',
        year: '2020 – Present'
      },
      {
        degree: 'M.Sc. in Microbiology (General Distinction)',
        institution: 'Central University of Tamil Nadu (CUTN)',
        year: '2018 – 2020'
      },
      {
        degree: 'B.Sc. in Microbiology',
        institution: 'St. Ann’s College for Women, Osmania University, Hyderabad',
        year: '2015 – 2018'
      }
    ],
    researchInterests: [
      'Microalgae Metabolite Remodeling under NaCl Stress',
      'Genetic Engineering for Secondary Metabolites',
      'Algae-based Bioplastics & Circular Economy',
      'Mycosporine-like Amino Acids (MAAs)',
      'Phycoremediation of Emerging Contaminants'
    ],
    awardsAndFellowships: [
      'SERB Project Fellowship Support (DST, Govt. of India)',
      'NBCFDC & DST National Fellowship Support'
    ]
  },
  {
    id: 'subhisha-raj',
    name: 'Subhisha Raj',
    role: 'Senior Research Fellow (SRF) / Ph.D. Scholar (CSIR Fellow)',
    affiliation: 'Central University of Tamil Nadu',
    department: 'Department of Microbiology, School of Life Sciences',
    institution: 'Central University of Tamil Nadu (CUTN)',
    email: 'subhisharaj@students.cutn.ac.in',
    orcid: 'https://orcid.org/0000-0002-9651-588X',
    googleScholar: 'https://scholar.google.com/citations?user=PocmDTkAAAAJ&hl=en',
    linkedin: 'https://in.linkedin.com/in/subhisha-raj-2aa617119',
    education: [
      {
        degree: 'Ph.D. in Algal Biotechnology / Microbiology',
        institution: 'Central University of Tamil Nadu (CUTN)',
        year: '2021 – Present'
      },
      {
        degree: 'BS-MS Dual Degree in Biological Sciences',
        institution: 'Indian Institute of Science Education and Research Bhopal (IISER Bhopal)',
        year: '2015 – 2020'
      }
    ],
    researchInterests: [
      'Dynamics of Polyphosphate Accumulation in Microalgae',
      'Eco-friendly Phosphate Biofertilizer Development',
      'Metabolic Engineering for Food Fortification (Vitamin D3)',
      'Mycosporine-like Amino Acids (MAAs)',
      'Multi-Omics in Plant-Microbe Interactions'
    ],
    awardsAndFellowships: [
      'CSIR-JRF (Junior Research Fellowship) Awarded (2021)',
      'Upgraded to CSIR-SRF (Senior Research Fellowship)'
    ]
  }
];

export const PUBLICATIONS: Publication[] = [
  {
    id: 'pub-2026-1',
    title: 'Inducible two-step cultivation of microalgae: engineering the growth and lipid biosynthesis for biofuel production',
    authors: ['Krishnakumar Mohan', 'Arathi Sreenikethanam', 'Subhisha Raj', 'Niharika Mondru', 'Amit K. Bajhaiya'],
    journal: 'Frontiers in Fuels',
    year: 2026,
    month: 'June',
    doi: '10.3389/ffuel.2026.1860328',
    type: 'journal',
    isHighlighted: true
  },
  {
    id: 'pub-2026-2',
    title: 'Cancer modulatory potential of oilseed lecithins as functional foods',
    authors: ['Abhrajit Mukherjee', 'Subhisha Raj', 'Riddhi Chakraborty', 'Sandip Hati', 'Kaberi Guha Roy', 'Sriparna Das', 'Priom Banerjee', 'Arathi Sreenikethanam', 'Amit K. Bajhaiya'],
    journal: 'Discover Food (Springer Nature)',
    year: 2026,
    month: 'June',
    doi: '10.1007/s44187-026-01115-4',
    type: 'journal'
  },
  {
    id: 'pub-2026-3',
    title: 'Intracellular and Extracellular metabolite remodelling in freshwater microalgae: A dual adaptation strategy in response to NaCl stress',
    authors: ['Arathi Sreenikethanam', 'Subhisha Raj', 'Krishnakumar Mohan', 'M. Gobi', 'Deepak Sakate', 'J. Rajesh Banu', 'Avijeet Singh Jaswal', 'Sandeep Kumar', 'Amit Kumar Bajhaiya'],
    journal: 'SSRN Electronic Journal',
    year: 2026,
    month: 'February',
    doi: '10.2139/ssrn.6249644',
    type: 'preprint'
  },
  {
    id: 'pub-2025-1',
    title: 'Effect of phosphate availability on the dynamics of polyphosphate accumulation in microalgae',
    authors: ['Subhisha Raj', 'Arathi Sreenikethanam', 'M. Gobi', 'Deepak Sakate', 'Tharunkumar Jayakumar', 'Suchitra Rakesh', 'J. Rajesh Banu', 'Amit K. Bajhaiya'],
    journal: 'Scientific Reports (Nature Portfolio)',
    year: 2025,
    month: 'November',
    doi: '10.1038/s41598-025-24985-7',
    pmid: '41203826',
    type: 'journal',
    isHighlighted: true
  },
  {
    id: 'pub-2025-2',
    title: 'Bioremediation and Phytoremediation of Environmental Pollutants: Advances and Current Strategies',
    authors: ['Krishnakumar Mohan', 'Arathi Sreenikethanam', 'Subhisha Raj', 'Amit K. Bajhaiya'],
    journal: 'Biotechnology for Environmental Sustainability (Springer Nature)',
    year: 2025,
    doi: '10.1007/978-981-97-7221-6_5',
    type: 'book-chapter'
  },
  {
    id: 'pub-2024-1',
    title: 'In vivo proteolytic profiling of the type I and type II metacaspases in Chlamydomonas reinhardtii exposed to salt stress',
    authors: ['Georgia Antonia Vergou', 'Amit K. Bajhaiya', 'Luisa Corredor', 'Saul Lema Asqui', 'Evy Timmerman', 'Francis Impens', 'Christiane Funk'],
    journal: 'Physiologia Plantarum',
    year: 2024,
    month: 'May',
    doi: '10.1111/ppl.14401',
    type: 'journal',
    isHighlighted: true
  },
  {
    id: 'pub-2024-2',
    title: 'Transcriptomic analysis of a cold‐resistant Nordic microalga: unraveling the mechanisms underlying adaptation to low temperatures',
    authors: ['Olivia Spain', 'Amit K. Bajhaiya', 'Hugh Tanner', 'Sam Cook', 'Christiane Funk'],
    journal: 'Physiologia Plantarum',
    year: 2024,
    month: 'May',
    doi: '10.1111/ppl.14402',
    type: 'journal'
  },
  {
    id: 'pub-2023-1',
    title: 'Multi-Omics Approaches in Plant–Microbe Interactions Hold Enormous Promise for Sustainable Agriculture',
    authors: ['Umesh Kumar', 'Subhisha Raj', 'Arathi Sreenikethanam', 'Rahul Maddheshiya', 'Seema Kumari', 'Sungsoo Han', 'Krishan K. Kapoor', 'Rakesh Bhaskar', 'Amit K. Bajhaiya', 'Dharmender K. Gahlot'],
    journal: 'Agronomy',
    year: 2023,
    month: 'July',
    doi: '10.3390/agronomy13071804',
    type: 'journal',
    isHighlighted: true
  },
  {
    id: 'pub-2023-2',
    title: 'Algal lipids for biofuel production: strategies, environmental impacts, downstream processing and commercialization',
    authors: ['Arathi Sreenikethanam', 'Subhisha Raj', 'J. Rajesh Banu', 'Poornachandar Gugulothu', 'Sunita Varjani', 'Amit K. Bajhaiya'],
    journal: 'Phytochemistry Reviews',
    year: 2023,
    doi: '10.1007/s11101-022-09824-1',
    type: 'journal'
  },
  {
    id: 'pub-2023-3',
    title: 'Renewable biofuels from microalgae: technical advances, limitations and economics',
    authors: ['Subhisha Raj', 'Amrutha Sajith', 'Arathi Sreenikethanam', 'Swathi Vadlamani', 'Aiswarya Satheesh', 'Anurup Ganguly', 'J. Rajesh Banu', 'Sunita Varjani', 'Poornachandar Gugulothu', 'Amit K. Bajhaiya'],
    journal: 'Environmental Technology Reviews',
    year: 2023,
    doi: '10.1080/21622515.2023.2167126',
    type: 'journal'
  },
  {
    id: 'pub-2023-4',
    title: 'Phycoremediation: A Sustainable Alternative for Removing Emerging Contaminants from Wastewater',
    authors: ['Preethi Selvaraj', 'Arathi Sreenikethanam', 'Subhisha Raj', 'Amit K. Bajhaiya'],
    journal: 'Algae Refinery: Up- and Downstream Processes (CRC Press)',
    year: 2023,
    doi: '10.1201/9781003455950-2',
    type: 'book-chapter'
  },
  {
    id: 'pub-2023-5',
    title: 'Marine microalgae: an emerging source of pharmaceuticals and bioactive compounds',
    authors: ['M. K. Anusree', 'K. Manasa Leela', 'M. Sreehari', 'Subhisha Raj', 'Arathi Sreenikethanam', 'Amit K. Bajhaiya'],
    journal: 'New Horizons in Natural Compound Research (Elsevier)',
    year: 2023,
    doi: '10.1016/B978-0-443-15232-0.00025-4',
    type: 'book-chapter'
  },
  {
    id: 'pub-2022-1',
    title: 'Genetic Engineering of Microalgae for Secondary Metabolite Production: Recent Developments, Challenges, and Future Prospects',
    authors: ['Arathi Sreenikethanam', 'Subhisha Raj', 'Rajesh Banu J', 'Poornachandar Gugulothu', 'Amit K. Bajhaiya'],
    journal: 'Frontiers in Bioengineering and Biotechnology',
    year: 2022,
    month: 'March',
    doi: '10.3389/fbioe.2022.836056',
    pmid: '35402377',
    type: 'journal',
    isHighlighted: true
  },
  {
    id: 'pub-2022-2',
    title: 'Algae Based Bio-Plastics: Future of Green Economy',
    authors: ['Arathi Sreenikethanam', 'Amit Bajhaiya'],
    journal: 'Biorefineries - Selected Processes (IntechOpen)',
    year: 2022,
    doi: '10.5772/intechopen.100981',
    type: 'book-chapter'
  },
  {
    id: 'pub-2021-1',
    title: 'Microalgae as a Source of Mycosporine-like Amino Acids (MAAs); Advances and Future Prospects',
    authors: ['Subhisha Raj', 'Anusree M. Kuniyil', 'Arathi Sreenikethanam', 'Poornachandar Gugulothu', 'Rajesh Banu Jeyakumar', 'Amit K. Bajhaiya'],
    journal: 'International Journal of Environmental Research and Public Health',
    year: 2021,
    month: 'November',
    doi: '10.3390/ijerph182312402',
    pmid: '34886127',
    type: 'journal'
  }
];

export const GRANTS: Grant[] = [
  {
    title: 'SERB Start-up Research Grant (SRG)',
    agency: 'Science and Engineering Research Board, DST, Govt. of India',
    duration: '2021 – 2023',
    role: 'Principal Investigator (PI)'
  },
  {
    title: 'Science Technology and Innovation (STI) Hub for SC/ST Communities',
    agency: 'Department of Science and Technology (DST), Govt. of India',
    duration: '2021 – 2024',
    role: 'Co-Principal Investigator (Co-PI)'
  },
  {
    title: 'COFRADIC Proteomic Analysis Grant',
    agency: 'European Horizon 2020 (Sweden)',
    duration: '2019',
    role: 'Co-Principal Investigator (Co-PI)'
  }
];
