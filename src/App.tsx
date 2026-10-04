import React, { useState } from 'react';
import { 
  Dna, 
  BookOpen, 
  Users, 
  ExternalLink, 
  Menu, 
  X, 
  Sparkles, 
  Microscope,
  Mail,
  CheckCircle2,
  Atom
} from 'lucide-react';
import { AlgalParticleCanvas } from './components/3d/AlgalParticleCanvas';
import { TEAM_MEMBERS, PUBLICATIONS, RESEARCH_THRUSTS } from './data/labData';

export const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'publications' | 'thrusts'>('overview');

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Dynamic 3D Microalgae Points Canvas */}
      <AlgalParticleCanvas />

      {/* Top Notification / Status Banner */}
      <div className="w-full bg-emerald-950/80 border-b border-emerald-800/40 px-4 py-2 text-xs md:text-sm text-emerald-300 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-2 truncate">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium truncate">Central University of Tamil Nadu (CUTN) • Department of Microbiology</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400/90 font-mono">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Vite + React + TS + Tailwind Ready</span>
        </div>
      </div>

      {/* Header / Mobile-First Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Microscope className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-white block leading-tight">
                Algal Biotech Lab
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 block font-medium">
                CUTN Microbiology
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('thrusts')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'thrusts'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Research Thrusts
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'team'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              People ({TEAM_MEMBERS.length})
            </button>
            <button
              onClick={() => setActiveTab('publications')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'publications'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Publications ({PUBLICATIONS.length})
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-2 pb-4 space-y-1">
            <button
              onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'overview' ? 'bg-emerald-500/15 text-emerald-400 font-semibold' : 'text-slate-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => { setActiveTab('thrusts'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'thrusts' ? 'bg-emerald-500/15 text-emerald-400 font-semibold' : 'text-slate-300'
              }`}
            >
              Research Thrusts
            </button>
            <button
              onClick={() => { setActiveTab('team'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'team' ? 'bg-emerald-500/15 text-emerald-400 font-semibold' : 'text-slate-300'
              }`}
            >
              People ({TEAM_MEMBERS.length})
            </button>
            <button
              onClick={() => { setActiveTab('publications'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'publications' ? 'bg-emerald-500/15 text-emerald-400 font-semibold' : 'text-slate-300'
              }`}
            >
              Publications ({PUBLICATIONS.length})
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10">
        
        {/* Hero Section */}
        <section className="relative rounded-2xl sm:rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-900/80 to-slate-950/90 p-6 sm:p-10 backdrop-blur-sm overflow-hidden">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>School of Life Sciences • Central University of Tamil Nadu</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Microalgal Biotechnology & Transcriptional Engineering
            </h1>
            
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Advancing translational research in photosynthetic cell factories, lipid metabolic engineering,
              biofuels, polyphosphate biofertilizers, and high-value bioactive secondary metabolites at CUTN.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab('team')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 font-semibold"
              >
                <Users className="w-4 h-4" />
                <span>Meet the Team</span>
              </button>
              <button
                onClick={() => setActiveTab('publications')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Verified Publications ({PUBLICATIONS.length})</span>
              </button>
            </div>
          </div>
        </section>

        {/* Tab Content: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                <span className="text-xs text-slate-400 block font-medium">Core Researchers</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">3</span>
                <span className="text-[11px] text-emerald-400 mt-1 block">Faculty PI & Senior Fellows</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                <span className="text-xs text-slate-400 block font-medium">Recent Outputs</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">{PUBLICATIONS.length}+</span>
                <span className="text-[11px] text-emerald-400 mt-1 block">Nature, Frontiers, Springer</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                <span className="text-xs text-slate-400 block font-medium">Active Thrusts</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">{RESEARCH_THRUSTS.length}</span>
                <span className="text-[11px] text-emerald-400 mt-1 block">Genetics to Bioeconomy</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                <span className="text-xs text-slate-400 block font-medium">Major Fellowships</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">SERB / CSIR</span>
                <span className="text-[11px] text-emerald-400 mt-1 block">National Competitive Awards</span>
              </div>
            </div>

            {/* Principal Investigator Feature Banner */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">Principal Investigator</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">Dr. Amit Kumar Bajhaiya</h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Assistant Professor, Department of Microbiology, Central University of Tamil Nadu</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://cutn.ac.in/staff-members/dr-amit-kumar-bajhaiya/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                  >
                    <span>CUTN Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://orcid.org/0000-0002-9912-4278"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                  >
                    <span>ORCID</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Ph.D. in Algal Biotechnology from the <strong>University of Manchester, UK</strong> (2015), followed by postdoctoral research at 
                <strong> Umeå Plant Science Centre (UPSC)</strong> and <strong>Chemical Biological Centre (KBC), Sweden</strong>.
                Recipient of the prestigious <strong>DST INSPIRE Faculty Award</strong> and <strong>SERB Startup Research Grant</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Tab Content: Research Thrusts */}
        {activeTab === 'thrusts' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Atom className="w-6 h-6 text-emerald-400" />
              <span>Core Research Programs</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {RESEARCH_THRUSTS.map((thrust) => (
                <div key={thrust.id} className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-5 space-y-3 hover:border-emerald-500/40 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Dna className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">{thrust.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{thrust.shortDescription}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {thrust.keywords.map((kw, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: People */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-400" />
              <span>Laboratory Members</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TEAM_MEMBERS.map((member) => (
                <div key={member.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-slate-950 font-bold text-lg shadow-md">
                      {member.name.split(' ').slice(-1)[0][0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{member.name}</h3>
                      <p className="text-xs text-emerald-400 font-medium">{member.role}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{member.department}, CUTN</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 space-y-2">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Education & Milestones</span>
                      {member.education.slice(0, 2).map((edu, idx) => (
                        <div key={idx} className="text-xs">
                          <p className="font-medium text-slate-200">{edu.degree}</p>
                          <p className="text-[11px] text-slate-400">{edu.institution} ({edu.year})</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Key Focus Areas</span>
                      <div className="flex flex-wrap gap-1">
                        {member.researchInterests.slice(0, 3).map((interest, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-emerald-300 border border-slate-700/50">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    {member.orcid && (
                      <a
                        href={member.orcid}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 font-mono text-[11px] shrink-0 ml-2"
                      >
                        ORCID
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Publications */}
        {activeTab === 'publications' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-emerald-400" />
                  <span>Verified Publications Catalog</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Cross-referenced with PubMed, Crossref, and the official CUTN faculty repository.</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30 self-start sm:self-auto">
                {PUBLICATIONS.length} Indexed Works
              </span>
            </div>

            <div className="space-y-3">
              {PUBLICATIONS.map((pub) => (
                <div
                  key={pub.id}
                  className={`rounded-xl border p-4 sm:p-5 transition-colors ${
                    pub.isHighlighted
                      ? 'border-emerald-500/30 bg-emerald-950/20'
                      : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          pub.type === 'journal' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {pub.type}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{pub.year}</span>
                        {pub.isHighlighted && (
                          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            Key Paper
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                        {pub.title}
                      </h3>

                      <p className="text-xs text-slate-300">
                        {pub.authors.join(', ')}
                      </p>

                      <p className="text-xs text-emerald-400 font-medium italic">
                        {pub.journal}
                      </p>
                    </div>

                    {pub.doi && (
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shrink-0 transition-colors"
                        title="View via DOI"
                      >
                        <span className="hidden sm:inline">DOI</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/90 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-400 text-center space-y-2">
        <p className="text-slate-300 font-medium">
          Algal Biotechnology Laboratory • Department of Microbiology, School of Life Sciences
        </p>
        <p>
          Central University of Tamil Nadu (CUTN), Thiruvarur – 610 005, India
        </p>
        <p className="text-[11px] text-slate-400 font-mono">
          Environment configured strictly with modular architecture and mobile-first standards (AGENTS.md).
        </p>
      </footer>
    </div>
  );
};

export default App;
