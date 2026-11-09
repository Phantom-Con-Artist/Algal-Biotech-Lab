import React from 'react';
import { FileText, ShieldAlert, GitBranch, Check, FolderGit2, Database } from 'lucide-react';

export const DocumentsBrowser: React.FC = () => {
  const documents = [
    {
      name: 'lab details.pdf',
      type: 'PDF Document',
      size: '279 KB',
      description: 'Official CUTN laboratory profile detailing facilities, research programs, instrumentation, and administrative overview.',
      path: 'assets/documents/lab details.pdf',
      status: 'Imported (Ignored by Git)',
    },
    {
      name: 'LAB_PERSONNEL_DATA_SHEET.md',
      type: 'Markdown Dataset',
      size: '20 KB',
      description: 'Comprehensive biographical dossiers, doctoral degrees, fellowships, and research areas for all 16 lab members.',
      path: 'assets/documents/LAB_PERSONNEL_DATA_SHEET.md',
      status: 'Imported (Ignored by Git)',
    },
    {
      name: 'RESEARCHERS_PUBLICATIONS_ACHIEVEMENTS.md',
      type: 'Academic Records',
      size: '24 KB',
      description: 'Detailed bibliography of publications, impact factors, grant milestones, and research achievements.',
      path: 'assets/documents/RESEARCHERS_PUBLICATIONS_ACHIEVEMENTS.md',
      status: 'Imported (Ignored by Git)',
    },
    {
      name: 'LAB_PERSONNEL_TEMPLATE.csv',
      type: 'CSV Spreadsheet Template',
      size: '6.3 KB',
      description: 'Standardized data structure for laboratory roster ingestions, alumni tracking, and profile updates.',
      path: 'assets/documents/LAB_PERSONNEL_TEMPLATE.csv',
      status: 'Imported (Ignored by Git)',
    },
    {
      name: 'RULES_FOR_AGENTS.md',
      type: 'Engineering Directive',
      size: '6.5 KB',
      description: 'Strict architectural guidelines: Mobile First, WCAG AA, typography scaling, 8pt spatial rhythm, color harmonics.',
      path: './RULES_FOR_AGENTS.md',
      status: 'Active (Ignored by Git)',
    },
    {
      name: 'Used Images Library',
      type: 'Optimized WebP / PNG',
      size: '3.6 MB (35 Assets)',
      description: 'Production team portraits, laboratory facility imagery, research pillar diagrams, and official university logos.',
      path: 'assets/used/**',
      status: 'TRACKED BY GIT (!assets/used/**)',
    },
  ];

  return (
    <section id="documents" className="py-16 md:py-28 bg-[#04120e] border-t border-emerald-500/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-md bg-emerald-950/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 border border-emerald-500/20 mb-3">
            Data & Artifact Pipeline
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Imported Lab Data & Git Assets Configuration
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Per development environment requirements, member data, research articles, laboratory documents, and images are imported from the original repository with strict selective gitignore rules.
          </p>
        </div>

        {/* Gitignore Policy Notice Banner */}
        <div className="mb-8 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-5 sm:p-6 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-900/60 text-emerald-300 border border-emerald-500/30">
                <FolderGit2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Selective Git Tracking Configured
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  <code className="text-emerald-300 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/20">assets/*</code> is ignored, while <code className="text-emerald-300 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/20">!assets/used/**</code> is tracked. Legacy Blender files deleted.
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-900/60 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30 shrink-0">
              <Check className="h-4 w-4" />
              <span>Git Initialized on Main</span>
            </div>
          </div>
        </div>

        {/* Documents Table / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc, idx) => (
            <div
              key={idx}
              className="group flex flex-col justify-between rounded-2xl border border-emerald-500/15 bg-emerald-950/20 p-6 backdrop-blur-sm hover:border-emerald-500/35 hover:bg-emerald-950/30 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-900/50 text-emerald-400 border border-emerald-500/25">
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-emerald-950/80 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-mono font-medium text-emerald-300">
                    {doc.size}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {doc.name}
                </h3>
                <div className="text-xs font-medium text-emerald-400 mt-0.5">
                  {doc.type}
                </div>

                <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {doc.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-emerald-500/10 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 truncate max-w-[170px]" title={doc.path}>
                  {doc.path}
                </span>
                <span className={doc.status.includes('TRACKED') ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                  {doc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
