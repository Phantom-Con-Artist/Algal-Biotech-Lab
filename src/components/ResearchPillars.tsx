import React from 'react';
import { Fuel, Sparkles, CloudRain, Droplets, ArrowUpRight } from 'lucide-react';

export const ResearchPillars: React.FC = () => {
  const pillars = [
    {
      id: 'biofuel',
      title: 'Biofuels & Renewable Bioenergy',
      number: '01',
      icon: Fuel,
      accent: 'emerald',
      description:
        'Optimizing lipid biosynthesis and carbohydrate partitioning in microalgae for 3rd-generation biodiesel, bioethanol, and photobiological hydrogen production.',
      highlight: 'Lipid Accumulation Kinetics & High-Density Culture',
      image: '/focus/biofuel-hero-studio.webp',
      badge: 'Renewable Energy',
      papers: ['Bioresource Technology (2026)', 'International J. Hydrogen Energy'],
    },
    {
      id: 'carbon',
      title: 'CO₂ Sequestration & Carbon Capture',
      number: '02',
      icon: CloudRain,
      accent: 'teal',
      description:
        'Harnessing high-rate photosynthetic carbon concentration mechanisms (CCM) in cyanobacteria and microalgae to capture industrial flue gases and atmospheric carbon.',
      highlight: 'Flue-Gas Tolerant Strain Selection & Biological Fixation',
      image: '/focus/carbon-capture-pbr-array.webp',
      badge: 'Climate Mitigation',
      papers: ['Nuclear Proteome Dynamics (2020)', 'CCM & Lipid Kinetics'],
    },
    {
      id: 'nutraceutical',
      title: 'Microalgal Nutraceuticals & Metabolites',
      number: '03',
      icon: Sparkles,
      accent: 'cyan',
      description:
        'Biosynthesis and purification of high-value bioactives including astaxanthin, phycocyanin from Spirulina, carotenoids, and polyunsaturated fatty acids (EPA/DHA).',
      highlight: 'Antioxidants, Anti-inflammatory Compounds & Superfoods',
      image: '/focus/nutraceuticals-capsules-water-ripple.webp',
      badge: 'Biomedicine & Health',
      papers: ['Journal of Applied Phycology (2024)', 'Mycosporine-like Amino Acids'],
    },
    {
      id: 'wastewater',
      title: 'Phycoremediation & Wastewater Treatment',
      number: '04',
      icon: Droplets,
      accent: 'emerald',
      description:
        'Biological tertiary treatment of municipal and agro-industrial effluents using immobilized microalgal bio-beads, remediating nitrogen, phosphorus, and toxic heavy metals.',
      highlight: 'Bio-Beads Immobilization & Circular Water Recovery',
      image: '/focus/wastewater-biobeads-macro.webp',
      badge: 'Environmental Biotech',
      papers: ['Phycoremediation Innovations (2023)', 'Heavy Metal Biosorption'],
    },
  ];

  return (
    <section id="research" className="relative py-16 md:py-28 bg-[#04120e] border-t border-emerald-500/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-md bg-emerald-950/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 border border-emerald-500/20 mb-3">
            Core Scientific Programs
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Research Pillars & Innovations
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Addressing global climate change, clean energy deficits, and environmental contamination through targeted photosynthetic bioprocess engineering.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-6 sm:p-8 backdrop-blur-sm hover:border-emerald-500/40 hover:bg-emerald-950/30 transition-all duration-300"
            >
              {/* Background preview image container */}
              <div className="relative mb-6 h-52 sm:h-64 w-full overflow-hidden rounded-xl bg-emerald-950/60 ring-1 ring-emerald-500/20">
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04120e] via-transparent to-transparent opacity-80" />
                <div className="absolute top-3 left-3 rounded-md bg-[#04120e]/80 px-2.5 py-1 text-xs font-mono font-medium text-emerald-400 backdrop-blur-md border border-emerald-500/30">
                  PILLAR {pillar.number}
                </div>
                <div className="absolute bottom-3 left-3 rounded-md bg-emerald-900/80 px-2.5 py-1 text-xs font-medium text-emerald-200 backdrop-blur-md border border-emerald-500/20">
                  {pillar.badge}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-900/40 text-emerald-400 border border-emerald-500/30">
                    <pillar.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {pillar.title}
                  </h3>
                </div>

                <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
                  {pillar.description}
                </p>

                <div className="mt-4 pt-4 border-t border-emerald-500/10">
                  <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                    Key Publications & Focus
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pillar.papers.map((p, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-emerald-950/60 border border-emerald-500/20 px-3 py-1 text-xs text-slate-300 font-mono"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
