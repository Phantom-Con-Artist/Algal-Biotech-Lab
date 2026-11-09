import React from 'react';
import { Layers, CheckCircle2 } from 'lucide-react';

export const LabFacilities: React.FC = () => {
  const facilities = [
    {
      title: 'Photobioreactor Cultivation Bay',
      description: 'Multi-column photobioreactor setup with precision illumination, CO₂ gas injection, and thermal control for microalgal growth kinetic studies.',
      image: '/lab/lab-01.webp',
      badge: 'Cultivation',
    },
    {
      title: 'Analytical Spectrophotometry & Kinetics',
      description: 'UV-Visible spectrophotometric systems used for real-time optical density monitoring, chlorophyll fluorometry, and metabolite quantitation.',
      image: '/lab/lab-02.webp',
      badge: 'Analytics',
    },
    {
      title: 'Climate Controlled Incubation Racks',
      description: 'Automated diurnal light cycle growth chambers optimizing light-emitting spectra for freshwater and marine microalgal strains.',
      image: '/lab/lab-03.webp',
      badge: 'Strain Maintenance',
    },
    {
      title: 'High-Speed Biomass Harvesting & Centrifugation',
      description: 'Floor-standing refrigerated centrifuges enabling rapid separation of high-density biomass for downstream lipid and protein extraction.',
      image: '/lab/lab-04.webp',
      badge: 'Downstream Processing',
    },
    {
      title: 'Sterile Laminar Airflow & Inoculation Benches',
      description: 'HEPA-filtered Class II biosafety workstations maintaining pure axenic culture strains of Chlamydomonas, Chlorella, and Spirulina.',
      image: '/lab/lab-05.webp',
      badge: 'Axenic Inoculation',
    },
    {
      title: 'Bio-Beads Immobilization & Phycoremediation',
      description: 'Custom polymer encapsulation and bead manufacturing station for industrial wastewater polishing and heavy metal biosorption.',
      image: '/lab/lab-06.webp',
      badge: 'Environmental Systems',
    },
  ];

  return (
    <section id="facilities" className="py-16 md:py-28 bg-[#04120e] border-t border-emerald-500/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-md bg-emerald-950/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 border border-emerald-500/20 mb-3">
            Infrastructure & Equipment
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Laboratory Facilities & Instrumentation
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Housed within the Department of Biotechnology at CUTN, our specialized equipment supports end-to-end research from genetic characterization to bioreactor scale-up.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {facilities.map((fac, idx) => (
            <div
              key={idx}
              className="group flex flex-col overflow-hidden rounded-2xl border border-emerald-500/15 bg-emerald-950/20 backdrop-blur-sm hover:border-emerald-500/40 hover:bg-emerald-950/30 transition-all duration-300"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-emerald-950/60 ring-1 ring-emerald-500/20">
                <img
                  src={fac.image}
                  alt={fac.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 rounded-md bg-[#04120e]/80 px-2.5 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md border border-emerald-500/30">
                  {fac.badge}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {fac.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {fac.description}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-emerald-500/10 flex items-center gap-2 text-xs font-medium text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Active Operational Facility</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
