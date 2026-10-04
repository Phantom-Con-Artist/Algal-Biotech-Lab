import type { Grant, Recognition, Talk } from '../types';

export const GRANTS: Grant[] = [
  { title: 'Start-up Research Grant (SRG)', agency: 'SERB, Department of Science and Technology, Government of India', period: '2021 – 2023', role: 'Principal Investigator' },
  { title: 'Science Technology and Innovation (STI) Hub for SC/ST communities', agency: 'Department of Science and Technology, Government of India', period: '2021 – 2024', role: 'Co-Principal Investigator' },
  { title: 'COFRADIC proteomic analysis', agency: 'European Horizon 2020, Sweden', period: '2019', role: 'Co-Principal Investigator' },
  { title: 'Annual Instrument Grant (300,000 SEK)', agency: 'Umeå University, Sweden', period: '2018', role: 'Co-PI with Prof. Christiane Funk' },
  { title: 'Research Grant (45,500 SEK)', agency: 'Gunnar & Ruth Björkmans Foundation, Sweden', period: '2018', role: 'Principal Investigator' },
];

export const RECOGNITION: Recognition[] = [
  { year: '2019', title: 'Wallenberg Foundation Travel Grant', body: 'Sweden' },
  { year: '2019', title: 'Company of Biologists Travel Grant', body: 'Society for Experimental Biology, UK (also awarded 2014)' },
  { year: '2018', title: 'DST INSPIRE Faculty Award', body: 'Department of Science and Technology, Government of India' },
  { year: '2018', title: 'Young Scientist Travel Award', body: 'International Union of Biological Sciences, CSIR-NBRI Lucknow' },
  { year: '2017', title: 'Lawski Foundation Postdoctoral Fellowship', body: 'Sweden' },
  { year: '2014', title: 'Best Oral Presentation', body: 'International Algal Biotechnology Symposium, Sheffield, UK' },
  { year: '2013–14', title: 'PrimerDesign Sponsorship Awards', body: 'Gold (2013) and Silver (2014), UK' },
  { year: '2011', title: 'Overseas Ph.D. Fellowship', body: 'Government of India' },
];

export const SERVICE: string[] = [
  'Convener, National Symposium “Proteomics for Life: The Intra and Interplay of Proteins in Plants and Microbes”, CUTN with ICAR-IARI Rice Breeding and Genetics Research Centre, Aduthurai (18 March 2025)',
  'Review Editor, Circular Economy section, Frontiers in Sustainability',
  'Reviewer for Journal of Experimental Botany, World Journal of Microbiology and Biotechnology, Journal of Agronomy and Crop Science, Scientific African, Environmental Sustainability',
];

export const TALKS: Talk[] = [
  { venue: 'ICEBB 2023', year: '2023', title: 'Effect of abiotic stress on synthesis of photoprotective compounds in microalgae', authors: 'Sreenikethanam, Raj, Bajhaiya' },
  { venue: 'ICEBB 2023', year: '2023', title: 'Genetic engineering of microalgae for enhanced polyphosphate storage: an approach towards producing eco-friendly phosphate biofertilizer', authors: 'Raj, Sreenikethanam, Bajhaiya' },
  { venue: 'ICAB 2022', year: '2022', title: 'Metabolic engineering of microalgae to enhance vitamin D3 synthesis for food fortification', authors: 'Raj, Sreenikethanam, Bajhaiya' },
  { venue: 'ICAB 2022', year: '2022', title: 'Metabolic engineering of microalgae for the production of UV protective compounds', authors: 'Sreenikethanam, Raj, Bajhaiya' },
  { venue: 'i-RESEAT 2021', year: '2021', title: 'Transcriptional engineering of microalgae for the production of carbon storage metabolites', authors: 'Raj, Sreenikethanam, Bajhaiya' },
];
