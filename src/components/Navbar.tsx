import React, { useState } from 'react';
import { Menu, X, FlaskConical, Users, BookOpen, Layers, FileText, ExternalLink } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Research Pillars', href: '#research', icon: FlaskConical },
    { name: 'Lab Head & Team', href: '#team', icon: Users },
    { name: 'Publications', href: '#publications', icon: BookOpen },
    { name: 'Facilities', href: '#facilities', icon: Layers },
    { name: 'Lab Documents', href: '#documents', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-500/15 bg-[#04120e]/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Logos */}
        <a href="#" className="flex items-center gap-3.5 group focus-visible:ring-2 focus-visible:ring-emerald-400">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-950/60 p-1.5 ring-1 ring-emerald-500/30 group-hover:ring-emerald-400/60 transition-all">
            <img
              src="/logos/abl-logo.png"
              alt="Algal Biotechnology Lab Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-100 tracking-tight text-sm sm:text-base group-hover:text-emerald-300 transition-colors">
              Algal Biotechnology Lab
            </span>
            <span className="text-xs text-emerald-400/90 font-medium tracking-wide">
              Central University of Tamil Nadu (CUTN)
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-emerald-300 hover:bg-emerald-950/40 transition-colors"
            >
              <link.icon className="h-4 w-4 text-emerald-400/70" />
              {link.name}
            </a>
          ))}
          <a
            href="https://cutn.ac.in"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-400/50 transition-all"
          >
            <span>CUTN Portal</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </nav>

        {/* Mobile Hamburger Trigger */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-950/50 p-2 text-slate-300 hover:text-emerald-300 hover:bg-emerald-900/50 focus-visible:ring-2 focus-visible:ring-emerald-400"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-emerald-500/20 bg-[#04120e] px-4 pt-3 pb-6 lg:hidden animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-slate-200 hover:bg-emerald-950/60 hover:text-emerald-300 min-h-[44px]"
              >
                <link.icon className="h-5 w-5 text-emerald-400" />
                {link.name}
              </a>
            ))}
            <a
              href="https://cutn.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-4 py-3 text-sm font-semibold text-emerald-300 min-h-[44px]"
            >
              <span>Visit CUTN Official Portal</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
