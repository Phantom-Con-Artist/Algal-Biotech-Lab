import React from 'react';
import { Mail, Phone, MapPin, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-emerald-500/15 bg-[#020b08] text-slate-400 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Laboratory & University */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logos/abl-logo.png"
                alt="Algal Biotechnology Lab Crest"
                className="h-10 w-10 object-contain rounded-lg bg-emerald-950/60 p-1 border border-emerald-500/30"
              />
              <img
                src="/logos/cutn-logo.png"
                alt="Central University of Tamil Nadu Insignia"
                className="h-10 w-10 object-contain rounded-lg bg-emerald-950/60 p-1 border border-emerald-500/30"
              />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Algal Biotechnology Lab</h3>
              <p className="text-xs text-emerald-400 mt-0.5">Department of Biotechnology</p>
              <p className="text-xs text-slate-400">School of Life Sciences, CUTN</p>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Pioneering microalgal metabolic engineering, photosynthetic carbon capture, biofuels, and wastewater phycoremediation under the guidance of Dr. Amit Kumar Bajhaiya.
            </p>
          </div>

          {/* Col 2: Institutional Location */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-emerald-300">
              Location & Campus
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
              <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Department of Biotechnology<br />
                Central University of Tamil Nadu (CUTN)<br />
                Neelakudi Campus, Thiruvarur – 610 005<br />
                Tamil Nadu, India
              </span>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Central+University+of+Tamil+Nadu+Neelakudi+Thiruvarur"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 min-h-[44px]"
            >
              <span>View Campus on Google Maps</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Col 3: Direct Inquiries */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-emerald-300">
              Contact & Inquiries
            </h4>
            <div className="space-y-2 text-xs">
              <a
                href="mailto:amitkumar@cutn.ac.in"
                className="flex items-center gap-2 text-slate-300 hover:text-emerald-300 min-h-[44px]"
              >
                <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>amitkumar@cutn.ac.in</span>
              </a>
              <a
                href="tel:+914366277230"
                className="flex items-center gap-2 text-slate-300 hover:text-emerald-300 min-h-[44px]"
              >
                <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>04366-277230</span>
              </a>
              <a
                href="https://cutn.ac.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-300 hover:text-emerald-300 min-h-[44px]"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>https://cutn.ac.in</span>
              </a>
            </div>
          </div>

          {/* Col 4: Platform Tech Stack */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-emerald-300">
              Development Platform
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['Astro', 'React 19', 'TypeScript', 'Tailwind v4', 'Lenis', 'GSAP', 'Motion', 'WCAG AA'].map((tech) => (
                <span
                  key={tech}
                  className="rounded-md bg-emerald-950/70 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-mono text-emerald-300"
                >
                  {tech}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              Engineered with strict mobile-first design, fluid vertical typography scaling, and WCAG 2.2 AA contrast compliance.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-emerald-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} Algal Biotechnology Laboratory • Central University of Tamil Nadu. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Lead: Dr. Amit Kumar Bajhaiya</span>
            <span>•</span>
            <span className="text-emerald-400">CUTN Life Sciences</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
