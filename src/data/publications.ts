import type { Publication } from '../types';

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const RAW: Publication[] = [
  {
    id: 'fuels-2026',
    title: 'Inducible two-step cultivation of microalgae: engineering the growth and lipid biosynthesis for biofuel production',
    authors: ['Krishnakumar Mohan', 'Arathi Sreenikethanam', 'Subhisha Raj', 'Niharika Mondru', 'Amit K. Bajhaiya'],
    venue: 'Frontiers in Fuels', year: 2026, month: 'June', detail: 'Vol. 4, Article 1860328',
    doi: '10.3389/ffuel.2026.1860328', type: 'article',
  },
  {
    id: 'lecithin-2026',
    title: 'Cancer modulatory potential of oilseed lecithins as functional foods',
    authors: ['Abhrajit Mukherjee', 'Subhisha Raj', 'Riddhi Chakraborty', 'Sandip Hati', 'Kaberi Guha Roy', 'Sriparna Das', 'Priom Banerjee', 'Arathi Sreenikethanam', 'Amit K. Bajhaiya'],
    venue: 'Discover Food', year: 2026, month: 'June', detail: 'Vol. 6, Article 1115',
    doi: '10.1007/s44187-026-01115-4', type: 'article',
  },
  {
    id: 'nacl-2026',
    title: 'Intracellular and Extracellular metabolite remodelling in freshwater microalgae: A dual adaptation strategy in response to NaCl stress',
    authors: ['Arathi Sreenikethanam', 'Subhisha Raj', 'Krishnakumar Mohan', 'M. Gobi', 'Deepak Sakate', 'J. Rajesh Banu', 'Avijeet Singh Jaswal', 'Sandeep Kumar', 'Amit Kumar Bajhaiya'],
    venue: 'SSRN Electronic Journal', year: 2026, month: 'February',
    doi: '10.2139/ssrn.6249644', type: 'preprint',
  },
  {
    id: 'biohydrogen-2026',
    title: 'Biohydrogen Production from Microalgae: A Mechanistic Overview',
    authors: ['Arindam Chatterjee', 'Arathi Sreenikethanam', 'Preeti Bit', 'P. Abarna', 'Manisha Bhattacharjee', 'Lagnajita Dash', 'Amit K. Bajhaiya'],
    venue: 'Handbook of Carbon Negative Footprint Materials, Springer', year: 2026,
    doi: '10.1007/978-3-031-87501-4_38-1', type: 'chapter',
  },
  {
    id: 'polyp-2025',
    title: 'Effect of phosphate availability on the dynamics of polyphosphate accumulation in microalgae',
    authors: ['Subhisha Raj', 'Arathi Sreenikethanam', 'M. Gobi', 'Deepak Sakate', 'Tharunkumar Jayakumar', 'Suchitra Rakesh', 'J. Rajesh Banu', 'Amit K. Bajhaiya'],
    venue: 'Scientific Reports', year: 2025, month: 'November', detail: 'Vol. 15, Article 39069',
    doi: '10.1038/s41598-025-24985-7', pmid: '41203826', type: 'article',
  },
  {
    id: 'bioremediation-2025',
    title: 'Bioremediation and Phytoremediation of Environmental Pollutants: Advances and Current Strategies',
    authors: ['Krishnakumar Mohan', 'Arathi Sreenikethanam', 'Subhisha Raj', 'Amit K. Bajhaiya'],
    venue: 'Biotechnology for Environmental Sustainability, Springer Nature', year: 2025,
    doi: '10.1007/978-981-97-7221-6_5', type: 'chapter',
  },
  {
    id: 'macroalgae-pretreatment-2025',
    title: 'Energy efficient pretreatment for enhanced conversion of macroalgal biomass to bioenergy: Detailed energy and cost assessment',
    authors: ['S. Kavitha', 'Yukesh Kannah Ravi', 'Rajeev Kumar Bhaskar', 'Amit K. Bajhaiya', 'J. Rajesh Banu'],
    venue: 'Energy Conversion and Management', year: 2025, detail: 'Vol. 330, Article 119631',
    doi: '10.1016/j.enconman.2025.119631', type: 'article',
  },
  {
    id: 'metacaspase-2024',
    title: 'In vivo proteolytic profiling of the type I and type II metacaspases in Chlamydomonas reinhardtii exposed to salt stress',
    authors: ['Georgia Antonia Vergou', 'Amit K. Bajhaiya', 'Luisa Corredor', 'Saul Lema Asqui', 'Evy Timmerman', 'Francis Impens', 'Christiane Funk'],
    venue: 'Physiologia Plantarum', year: 2024, month: 'May', detail: 'Vol. 176(3), e14401',
    doi: '10.1111/ppl.14401', type: 'article',
  },
  {
    id: 'cold-2024',
    title: 'Transcriptomic analysis of a cold-resistant Nordic microalga: unraveling the mechanisms underlying adaptation to low temperatures',
    authors: ['Olivia Spain', 'Amit K. Bajhaiya', 'Hugh Tanner', 'Sam Cook', 'Christiane Funk'],
    venue: 'Physiologia Plantarum', year: 2024, month: 'May', detail: 'Vol. 176(3), e14402',
    doi: '10.1111/ppl.14402', type: 'article',
  },
  {
    id: 'nutraceutical-2024',
    title: 'Microalgal Derivatives as Potential Nutraceutical and Pharmaceutical: Boon to Human Beings',
    authors: ['Namrata Dash', 'Amit Kumar Bajhaiya', 'Chandrashaker B', 'Poornachandar Gugulothu'],
    venue: 'Archives of Biotechnology and Biomedicine', year: 2024, month: 'June', detail: 'Vol. 8, pp. 018–023',
    doi: '10.29328/journal.abb.1001040', type: 'article',
  },
  {
    id: 'multiomics-2023',
    title: 'Multi-Omics Approaches in Plant–Microbe Interactions Hold Enormous Promise for Sustainable Agriculture',
    authors: ['Umesh Kumar', 'Subhisha Raj', 'Arathi Sreenikethanam', 'Rahul Maddheshiya', 'Seema Kumari', 'Sungsoo Han', 'Krishan K. Kapoor', 'Rakesh Bhaskar', 'Amit K. Bajhaiya', 'Dharmender K. Gahlot'],
    venue: 'Agronomy', year: 2023, month: 'July', detail: 'Vol. 13(7), Article 1804',
    doi: '10.3390/agronomy13071804', type: 'article',
  },
  {
    id: 'algal-lipids-2023',
    title: 'Algal lipids for biofuel production: strategies, environmental impacts, downstream processing and commercialization',
    authors: ['Arathi Sreenikethanam', 'Subhisha Raj', 'J. Rajesh Banu', 'Poornachandar Gugulothu', 'Sunita Varjani', 'Amit K. Bajhaiya'],
    venue: 'Phytochemistry Reviews', year: 2023, month: 'August', detail: 'Vol. 22, pp. 981–1008',
    doi: '10.1007/s11101-022-09824-1', type: 'article',
  },
  {
    id: 'biofuels-review-2023',
    title: 'Renewable biofuels from microalgae: technical advances, limitations and economics',
    authors: ['Subhisha Raj', 'Amrutha Sajith', 'Arathi Sreenikethanam', 'Swathi Vadlamani', 'Aiswarya Satheesh', 'Anurup Ganguly', 'J. Rajesh Banu', 'Sunita Varjani', 'Poornachandar Gugulothu', 'Amit K. Bajhaiya'],
    venue: 'Environmental Technology Reviews', year: 2023, detail: 'Vol. 12(1), pp. 18–36',
    doi: '10.1080/21622515.2023.2167126', type: 'article',
  },
  {
    id: 'phycoremediation-2023',
    title: 'Phycoremediation: A Sustainable Alternative for Removing Emerging Contaminants from Wastewater',
    authors: ['Preethi Selvaraj', 'Arathi Sreenikethanam', 'Subhisha Raj', 'Amit K. Bajhaiya'],
    venue: 'Algae Refinery: Up- and Downstream Processes, CRC Press', year: 2023,
    doi: '10.1201/9781003455950-2', type: 'chapter',
  },
  {
    id: 'marine-2023',
    title: 'Marine microalgae: an emerging source of pharmaceuticals and bioactive compounds',
    authors: ['M. K. Anusree', 'K. Manasa Leela', 'M. Sreehari', 'Subhisha Raj', 'Arathi Sreenikethanam', 'Amit K. Bajhaiya'],
    venue: 'New Horizons in Natural Compound Research, Elsevier', year: 2023,
    doi: '10.1016/B978-0-443-15232-0.00025-4', type: 'chapter',
  },
  {
    id: 'vitamin-d-2022',
    title: 'Interdictory contribution of Vitamin D to prevent corona virus infections',
    authors: ['Neelam Lahari', 'Vinoy K. Shrivastava', 'Arathi Sreenikethanam', 'Subhisha Raj', 'Amit K. Bajhaiya'],
    venue: 'Archives of Food and Nutritional Science', year: 2022, month: 'November', detail: 'Vol. 6(1), pp. 073–081',
    doi: '10.29328/journal.afns.1001041', type: 'article',
  },
  {
    id: 'genetic-engineering-2022',
    title: 'Genetic Engineering of Microalgae for Secondary Metabolite Production: Recent Developments, Challenges, and Future Prospects',
    authors: ['Arathi Sreenikethanam', 'Subhisha Raj', 'Rajesh Banu J', 'Poornachandar Gugulothu', 'Amit K. Bajhaiya'],
    venue: 'Frontiers in Bioengineering and Biotechnology', year: 2022, month: 'March', detail: 'Vol. 10, Article 836056',
    doi: '10.3389/fbioe.2022.836056', pmid: '35402377', type: 'article',
  },
  {
    id: 'sludge-hydrogen-2022',
    title: 'Biohydrogen production from waste activated sludge through thermochemical mechanical pretreatment',
    authors: ['Preethi', 'J. Rajesh Banu', 'Gopala Krishna Kumar', 'Vinay Kumar Tyagi', 'Amit K. Bajhaiya', 'Poornachandar Gugulothu', 'M. Gunasekaran'],
    venue: 'Bioresource Technology', year: 2022, detail: 'Vol. 359, Article 127301',
    doi: '10.1016/j.biortech.2022.127301', type: 'article',
  },
  {
    id: 'large-scale-2022',
    title: 'Innovative and Strategic Upgrades in Large-Scale Microalgal Culture Techniques',
    authors: ['Mukka Pranay Kumar', 'N. Abirami', 'S. K. Paromita Bilkis', 'Ponnasani Kotesh', 'Arathi Sreenikethanam', 'Subhisha Raj', 'Amit K. Bajhaiya'],
    venue: 'Micro-algae: Next-generation Feedstock for Biorefineries, Springer Nature', year: 2022,
    doi: '10.1007/978-981-19-0793-7_9', type: 'chapter',
  },
  {
    id: 'bioplastics-2022',
    title: 'Algae Based Bio-Plastics: Future of Green Economy',
    authors: ['Arathi Sreenikethanam', 'Amit Bajhaiya'],
    venue: 'Biorefineries: Selected Processes, IntechOpen', year: 2022,
    doi: '10.5772/intechopen.100981', type: 'chapter',
  },
  {
    id: 'maa-2021',
    title: 'Microalgae as a Source of Mycosporine-like Amino Acids (MAAs); Advances and Future Prospects',
    authors: ['Subhisha Raj', 'Anusree M. Kuniyil', 'Arathi Sreenikethanam', 'Poornachandar Gugulothu', 'Rajesh Banu Jeyakumar', 'Amit K. Bajhaiya'],
    venue: 'International Journal of Environmental Research and Public Health', year: 2021, month: 'November', detail: 'Vol. 18(23), Article 12402',
    doi: '10.3390/ijerph182312402', pmid: '34886127', type: 'article',
  },
  {
    id: 'macroalgae-biofuel-2021',
    title: 'Biofuel production from Macroalgae: present scenario and future scope',
    authors: ['Godvin Sharmila V', 'Dinesh Kumar M', 'Arulazhagan Pugazhendi', 'Amit Kumar Bajhaiya', 'Poornachander Gugulothu', 'Rajesh Banu J'],
    venue: 'Bioengineered', year: 2021, detail: 'Vol. 12(2), pp. 9216–9238',
    doi: '10.1080/21655979.2021.1996019', type: 'article',
  },
  {
    id: 'ccm-lipids-2020',
    title: 'Changes in lipid and carotenoid metabolism in Chlamydomonas reinhardtii during induction of CO₂-concentrating mechanism: Cellular response to low CO₂ stress',
    authors: ['Ilka N. Abreu', 'Anna Aksmann', 'Amit K. Bajhaiya', 'Reyes Benlloch', 'Mario Giordano', 'Wojciech Pokora', 'Eva Selstam', 'Thomas Moritz'],
    venue: 'Algal Research', year: 2020, month: 'December', detail: 'Vol. 52, Article 102099',
    doi: '10.1016/j.algal.2020.102099', type: 'article',
  },
  {
    id: 'nuclear-proteome-2020',
    title: 'Nuclear proteome analysis of Chlamydomonas with response to CO₂ limitation',
    authors: ['Carolina Arias', 'Ogonna Obudulu', 'Xiaoling Zhao', 'Preeti Ansolia', 'Suman Paul', 'Joakim Bygdell', 'Mohammad Pirmoradian', 'Roman A. Zubarev', 'Göran Samuelsson', 'Gunnar Wingsle', 'Amit K. Bajhaiya'],
    venue: 'Algal Research', year: 2020, month: 'January', detail: 'Vol. 46, Article 101765',
    doi: '10.1016/j.algal.2019.101765', type: 'article',
  },
  {
    id: 'heavy-metal-2019',
    title: 'Heavy metal bioremediation by microalgae: mechanism and application',
    authors: ['Aniefon A. Ibuot', 'Sanjay Kumar Gupta', 'Preeti Ansolia', 'Amit K. Bajhaiya'],
    venue: 'Microbial Biodegradation of Xenobiotic Compounds, CRC Press', year: 2019,
    doi: '10.1201/b22151-4', type: 'chapter',
  },
  {
    id: 'blue-green-2019',
    title: 'Potential of blue-green algae in wastewater treatment',
    authors: ['Pushan Bag', 'Preeti Ansolia', 'Sachin K. Mandotra', 'Amit K. Bajhaiya'],
    venue: 'Application of Microalgae in Wastewater Treatment, Springer', year: 2019,
    doi: '10.1007/978-3-030-13913-1_17', type: 'chapter',
  },
  {
    id: 'transcriptional-engineering-2017',
    title: 'Transcriptional Engineering of Microalgae: Prospects for High-Value Chemicals',
    authors: ['Amit K. Bajhaiya', 'Javiera Ziehe Moreira', 'Jon K. Pittman'],
    venue: 'Trends in Biotechnology', year: 2017, month: 'February', detail: 'Vol. 35(2), pp. 95–99',
    doi: '10.1016/j.tibtech.2016.06.001', type: 'article',
  },
  {
    id: 'psr1-2016',
    title: 'PSR1 is a Global Transcriptional Regulator of Phosphorus Deficiency Responses and Carbon Storage Metabolism in Chlamydomonas reinhardtii',
    authors: ['Amit K. Bajhaiya', 'Leo Zeef', 'Andrew P. Dean', 'Racheal Webster', 'Jon K. Pittman'],
    venue: 'Plant Physiology', year: 2016, month: 'March', detail: 'Vol. 170(3), pp. 1216–1234',
    doi: '10.1104/pp.15.01907', type: 'article',
  },
  {
    id: 'metabolomics-2016',
    title: 'High-throughput metabolic screening of microalgae genetic variation in response to nutrient limitation',
    authors: ['Amit K. Bajhaiya', 'Andrew P. Dean', 'William Allwood', 'Royston Goodacre', 'Jon K. Pittman'],
    venue: 'Metabolomics', year: 2016, detail: 'Vol. 12(9), pp. 1–14',
    doi: '10.1007/s11306-015-0878-4', type: 'article',
  },
];

const monthIndex = (month?: string) => (month ? MONTHS.indexOf(month) : -1);

export const PUBLICATIONS: Publication[] = [...RAW].sort(
  (a, b) => b.year - a.year || monthIndex(b.month) - monthIndex(a.month),
);

export const getPublication = (id: string): Publication => {
  const found = PUBLICATIONS.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown publication id: ${id}`);
  return found;
};
