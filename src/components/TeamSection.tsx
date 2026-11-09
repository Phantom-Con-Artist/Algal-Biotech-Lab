import React, { useState } from 'react';
import { Mail, GraduationCap, Award, ExternalLink, BookOpen, UserCheck } from 'lucide-react';

interface Member {
  name: string;
  role: string;
  status: 'pi' | 'current' | 'alumni';
  image: string;
  education: string;
  interests: string[];
  bio?: string;
  currentPosition?: string;
  scholar?: string;
  fellowships?: string[];
}

export const TeamSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'researchers' | 'alumni'>('all');

  const pi = {
    name: 'Dr. Amit Kumar Bajhaiya',
    title: 'Lab Head & Associate Professor',
    department: 'Department of Biotechnology, School of Life Sciences',
    institution: 'Central University of Tamil Nadu (CUTN)',
    image: '/team/amit-kumar-bajhaiya.webp',
    education: 'Ph.D. Biotechnology; Extensive Postdoctoral Fellowships in Microbial & Algal Bioengineering',
    bio: 'Dr. Amit Kumar Bajhaiya spearheads the Algal Biotechnology Laboratory at CUTN. His research spans two decades of expertise in microalgae biology, photosynthetic carbon concentration mechanisms (CCM), photobioreactor design, microalgal lipid kinetics for biofuel production, and phycoremediation of industrial wastewater. He guides doctoral scholars, leads sponsored national research grants (ANRF/SERB, DST, UGC), and collaborates with leading international institutes.',
    email: 'amitkumar@cutn.ac.in',
    scholar: 'https://scholar.google.com/citations?user=d1_hXjAAAAAJ',
    orcid: 'https://orcid.org/0000-0003-4927-7278',
    researchGate: 'https://www.researchgate.net/profile/Amit-Bajhaiya',
  };

  const members: Member[] = [
    {
      name: 'Arathi Sreenikethanam',
      role: 'Senior Research Fellow (SRF)',
      status: 'current',
      image: '/team/arathi-sreenikethanam.webp',
      education: 'M.Sc. Microbiology',
      interests: ['Microalgal proteomics', 'Metabolic engineering', 'Biofuels'],
      fellowships: ['Senior Research Fellow'],
    },
    {
      name: 'Subhisha Raj',
      role: 'Senior Research Fellow (SRF)',
      status: 'current',
      image: '/team/subhisha-raj.webp',
      education: 'M.Sc. Microbiology',
      interests: ['Algal biostimulants', 'Animal nutrition', 'Stress physiology'],
      fellowships: ['Senior Research Fellow'],
    },
    {
      name: 'Mondru Niharika',
      role: 'Ph.D. Research Scholar',
      status: 'current',
      image: '/team/mondru-niharika.webp',
      education: 'M.Sc. Biotechnology',
      interests: ['CO2 sequestration kinetics', 'Photobioreactor optimization'],
      fellowships: ['Ph.D. Fellow'],
    },
    {
      name: 'Aaditay Malviya',
      role: 'Ph.D. Research Scholar',
      status: 'current',
      image: '/team/aaditay-malviya.webp',
      education: 'M.Tech / M.Sc. Life Sciences',
      interests: ['Microalgae lipidomics', 'Biofuels', 'Synthetic biology'],
      fellowships: ['Ph.D. Fellow'],
    },
    {
      name: 'Amitha K A',
      role: 'Ph.D. Research Scholar',
      status: 'current',
      image: '/team/amitha-k-a.webp',
      education: 'M.Sc. Microbiology, CUTN',
      interests: ['Phycoremediation', 'Heavy metal remediation', 'Bio-beads'],
      fellowships: ['Ph.D. Fellow'],
    },
    {
      name: 'Arindam Chatterjee',
      role: 'Project Associate',
      status: 'current',
      image: '/team/arindam-chatterjee.webp',
      education: 'M.Sc. Biotechnology',
      interests: ['Microbial genetics', 'Bioreactor scale-up'],
      fellowships: ['Project Fellow'],
    },
    {
      name: 'Abhrajit Mukherjee',
      role: 'Ph.D. Research Scholar',
      status: 'current',
      image: '/team/abhrajit-mukherjee.webp',
      education: 'M.Sc. Biotechnology',
      interests: ['Bioactive compounds', 'Nutraceuticals', 'Antioxidants'],
      fellowships: ['Ph.D. Fellow'],
    },
    {
      name: 'Krishnakumar M',
      role: 'University Research Fellow (URF)',
      status: 'current',
      image: '/team/krishnakumar-m.webp',
      education: 'M.Sc. Microbiology, Madurai Kamaraj University',
      interests: ['Transcription factor engineering', 'Algal bioplastics'],
      fellowships: ['URF Scholar'],
    },
    {
      name: 'Badana Rajani',
      role: 'Research Mentee',
      status: 'current',
      image: '/team/badana-rajani.webp',
      education: 'M.Sc. Microbiology, CUTN',
      interests: ['Algal transcriptomics', 'Stress dynamics'],
    },
    {
      name: 'Dhananjay Kumar',
      role: 'Research Student',
      status: 'current',
      image: '/team/dhananjay-kumar.webp',
      education: 'M.Sc. Microbiology, CUTN',
      interests: ['Algal microbiology', 'Anaerobic digestion'],
    },
    {
      name: 'Gourav Haritwal',
      role: 'Research Student',
      status: 'current',
      image: '/team/gourav-haritwal.webp',
      education: 'M.Sc. Horticulture, CUTN',
      interests: ['Chlorella cultivation', 'Biomass harvesting'],
    },
    {
      name: 'Muskaan Jain',
      role: 'M.Sc. Student Researcher',
      status: 'current',
      image: '/team/muskaan-jain.webp',
      education: 'M.Sc. Biotechnology (pursuing)',
      interests: ['Microalgae cultivation', 'Bioprocess engineering'],
    },
    // Alumni
    {
      name: 'Abarna P',
      role: 'Former Trainee & Researcher',
      status: 'alumni',
      image: '/team/abarna-p.webp',
      education: 'M.Sc. Microbiology, CUTN',
      interests: ['Algae-derived therapeutics', 'Abiotic stress physiology'],
      currentPosition: 'Ph.D. Scholar (CSIR NET-JRF), ICAR-CIFT, Kochi',
      fellowships: ['CSIR NET-JRF'],
    },
    {
      name: 'K Manasa Leela',
      role: 'Former M.Sc. Researcher',
      status: 'alumni',
      image: '/team/k-manasa-leela.webp',
      education: 'M.Sc. Microbiology, CUTN',
      interests: ['Nitrogen stress in microalgae', 'Animal and poultry feed'],
      currentPosition: 'Executive, QC In Vitro Testing, Biological E. Ltd., Hyderabad',
    },
    {
      name: 'Sreehari M',
      role: 'Former M.Sc. Researcher',
      status: 'alumni',
      image: '/team/sreehari-m.webp',
      education: 'M.Sc. Microbiology, CUTN',
      interests: ['Algal biotechnology'],
      currentPosition: 'Faculty of Zoology, Xylem Learning',
    },
  ];

  const filteredMembers = members.filter((m) => {
    if (activeTab === 'researchers') return m.status === 'current';
    if (activeTab === 'alumni') return m.status === 'alumni';
    return true;
  });

  return (
    <section id="team" className="py-16 md:py-28 bg-[#04120e] border-t border-emerald-500/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-md bg-emerald-950/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 border border-emerald-500/20 mb-3">
            People & Mentorship
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Laboratory Leadership & Team
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            A dynamic group of researchers, doctoral fellows, and postgraduate scholars dedicated to microbial biotechnology and sustainable environmental solutions.
          </p>
        </div>

        {/* PI Spotlight Card */}
        <div className="relative mb-16 overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-emerald-950/20 to-[#04120e] p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
            {/* PI Portrait */}
            <div className="relative h-64 w-64 sm:h-72 sm:w-72 shrink-0 overflow-hidden rounded-2xl border-2 border-emerald-500/40 bg-emerald-950/60 shadow-xl">
              <img
                src={pi.image}
                alt={`Portrait of ${pi.name}`}
                className="h-full w-full object-cover object-top"
                loading="eager"
              />
              <div className="absolute bottom-2 left-2 right-2 rounded-lg bg-[#04120e]/80 py-1 px-2 text-center text-xs font-mono font-semibold text-emerald-300 backdrop-blur-sm border border-emerald-500/30">
                PRINCIPAL INVESTIGATOR
              </div>
            </div>

            {/* PI Details */}
            <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-900/60 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30 mb-2">
                <UserCheck className="h-3.5 w-3.5" />
                <span>Head of Laboratory</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
                {pi.name}
              </h3>
              <p className="text-base sm:text-lg font-medium text-emerald-400 mt-1">
                {pi.title}
              </p>
              <p className="text-xs sm:text-sm text-slate-400">
                {pi.department} • {pi.institution}
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-slate-300 font-medium">
                <GraduationCap className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{pi.education}</span>
              </div>

              <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                {pi.bio}
              </p>

              {/* PI Academic Links */}
              <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <a
                  href={pi.scholar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/60 px-3.5 py-2 text-xs sm:text-sm font-semibold text-emerald-300 hover:bg-emerald-900/60 transition-all min-h-[44px]"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Google Scholar</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href={pi.orcid}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/60 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-800 transition-all min-h-[44px]"
                >
                  <span>ORCID Profile</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href={pi.researchGate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/60 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-800 transition-all min-h-[44px]"
                >
                  <span>ResearchGate</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href={`mailto:${pi.email}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-all min-h-[44px]"
                >
                  <Mail className="h-4 w-4" />
                  <span>Contact PI</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs for Team */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveTab('all')}
            className={`rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all min-h-[44px] ${
              activeTab === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'border border-emerald-500/20 bg-emerald-950/30 text-slate-300 hover:bg-emerald-900/40'
            }`}
          >
            All Members ({members.length})
          </button>
          <button
            onClick={() => setActiveTab('researchers')}
            className={`rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all min-h-[44px] ${
              activeTab === 'researchers'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'border border-emerald-500/20 bg-emerald-950/30 text-slate-300 hover:bg-emerald-900/40'
            }`}
          >
            Active Scholars ({members.filter((m) => m.status === 'current').length})
          </button>
          <button
            onClick={() => setActiveTab('alumni')}
            className={`rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all min-h-[44px] ${
              activeTab === 'alumni'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'border border-emerald-500/20 bg-emerald-950/30 text-slate-300 hover:bg-emerald-900/40'
            }`}
          >
            Alumni ({members.filter((m) => m.status === 'alumni').length})
          </button>
        </div>

        {/* Member Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member, idx) => (
            <div
              key={idx}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-500/15 bg-emerald-950/20 p-5 backdrop-blur-sm hover:border-emerald-500/40 hover:bg-emerald-950/30 transition-all duration-300"
            >
              <div>
                {/* Photo */}
                <div className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-xl bg-emerald-950/60 ring-1 ring-emerald-500/20">
                  <img
                    src={member.image}
                    alt={`Portrait of ${member.name}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide backdrop-blur-md ${
                        member.status === 'current'
                          ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-500/30'
                          : 'bg-teal-900/80 text-teal-300 border border-teal-500/30'
                      }`}
                    >
                      {member.status === 'current' ? 'CURRENT' : 'ALUMNI'}
                    </span>
                  </div>
                </div>

                {/* Name & Role */}
                <h4 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {member.name}
                </h4>
                <p className="text-xs font-medium text-emerald-400 mt-0.5">
                  {member.role}
                </p>

                {/* Education */}
                <div className="mt-2.5 flex items-start gap-1.5 text-xs text-slate-400">
                  <GraduationCap className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{member.education}</span>
                </div>

                {/* Alumni Position if present */}
                {member.currentPosition && (
                  <div className="mt-3 rounded-lg bg-teal-950/40 border border-teal-500/20 p-2.5 text-xs text-teal-200">
                    <span className="font-semibold text-teal-300">Now:</span> {member.currentPosition}
                  </div>
                )}
              </div>

              {/* Research Interests Tags */}
              <div className="mt-4 pt-3 border-t border-emerald-500/10">
                <div className="flex flex-wrap gap-1.5">
                  {member.interests.slice(0, 3).map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="rounded-md bg-emerald-950/60 border border-emerald-500/15 px-2 py-0.5 text-[11px] text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
