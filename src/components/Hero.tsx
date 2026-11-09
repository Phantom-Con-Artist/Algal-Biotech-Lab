import React from 'react';
import { ArrowRight, Sparkles, BookOpen, Users, Award, ShieldCheck } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-radial-[at_top_center] from-emerald-950/40 via-[#04120e] to-[#04120e]">
      {/* Subtle photosynthetic background grid & ambient light */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Institutional Accreditation Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-4 py-1.5 text-xs sm:text-sm font-medium text-emerald-300 shadow-sm backdrop-blur-md mb-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Central University of Tamil Nadu • Department of Biotechnology</span>
          </div>

          {/* Main Headline */}
          <h1 className="max-w-4xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl sm:leading-tight">
            Engineering Microalgae for a{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Sustainable Circular Bioeconomy
            </span>
          </h1>

          {/* Subtitle / Client & Lab Mission */}
          <p className="mt-6 max-w-3xl text-base text-slate-300 sm:text-lg lg:text-xl leading-relaxed">
            Welcome to the official development environment of the <strong className="text-emerald-300 font-semibold">Algal Biotechnology Laboratory</strong> at CUTN, directed by <strong className="text-white font-semibold">Dr. Amit Kumar Bajhaiya</strong>. We advance frontiers in third-generation biofuels, biological CO₂ sequestration, high-value nutraceuticals, and industrial phycoremediation.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto">
            <a
              href="#research"
              className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-400 transition-all"
            >
              <span>Explore Research Pillars</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#publications"
              className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-200 hover:bg-emerald-900/50 hover:border-emerald-400/50 focus-visible:ring-2 focus-visible:ring-emerald-400 transition-all"
            >
              <BookOpen className="h-4 w-4 text-emerald-400" />
              <span>Browse 32+ Publications</span>
            </a>
            <a
              href="#team"
              className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/40 px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-300 hover:bg-slate-800/60 focus-visible:ring-2 focus-visible:ring-emerald-400 transition-all"
            >
              <Users className="h-4 w-4 text-slate-400" />
              <span>Lab Personnel</span>
            </a>
          </div>

          {/* Key Metric Highlights / Badges */}
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-8 w-full max-w-5xl">
            <div className="rounded-2xl border border-emerald-500/15 bg-emerald-950/20 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">32+</div>
              <div className="mt-1 text-xs sm:text-sm text-slate-400">Peer-Reviewed Papers</div>
            </div>

            <div className="rounded-2xl border border-emerald-500/15 bg-emerald-950/20 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="h-5 w-5 text-teal-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">4</div>
              <div className="mt-1 text-xs sm:text-sm text-slate-400">Core Research Pillars</div>
            </div>

            <div className="rounded-2xl border border-emerald-500/15 bg-emerald-950/20 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-cyan-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">16</div>
              <div className="mt-1 text-xs sm:text-sm text-slate-400">Researchers & Alumni</div>
            </div>

            <div className="rounded-2xl border border-emerald-500/15 bg-emerald-950/20 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-center mb-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">CUTN</div>
              <div className="mt-1 text-xs sm:text-sm text-slate-400">Central University Campus</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
