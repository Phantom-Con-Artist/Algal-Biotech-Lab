import React, { useState, useMemo } from 'react';
import { Search, ExternalLink, Copy, Check, BookOpen, Filter } from 'lucide-react';
import { PUBLICATIONS } from '../data/publications';
import type { Publication } from '../types';

export const PublicationsSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPubs = useMemo(() => {
    return PUBLICATIONS.filter((pub) => {
      const matchesType = selectedType === 'all' || pub.type === selectedType;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesType;

      const inTitle = pub.title.toLowerCase().includes(q);
      const inAuthors = pub.authors.some((a) => a.toLowerCase().includes(q));
      const inVenue = pub.venue.toLowerCase().includes(q);
      const inYear = pub.year.toString().includes(q);

      return matchesType && (inTitle || inAuthors || inVenue || inYear);
    });
  }, [searchQuery, selectedType]);

  const copyCitation = (pub: Publication) => {
    const citation = `${pub.authors.join(', ')} (${pub.year}). ${pub.title}. ${pub.venue}${pub.detail ? `, ${pub.detail}` : ''}. https://doi.org/${pub.doi}`;
    navigator.clipboard.writeText(citation).then(() => {
      setCopiedId(pub.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <section id="publications" className="py-16 md:py-28 bg-[#04120e] border-t border-emerald-500/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start max-w-3xl mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-md bg-emerald-950/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 border border-emerald-500/20 mb-3">
            Peer-Reviewed Research
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Publications & Academic Articles
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Discover peer-reviewed articles, books, and preprints produced by Dr. Amit Kumar Bajhaiya and the Algal Biotech research group.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-lg">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author (e.g. Bajhaiya), journal or year..."
              className="w-full rounded-xl border border-emerald-500/20 bg-emerald-950/30 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-400 focus:border-transparent min-h-[44px]"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline-flex items-center gap-1">
              <Filter className="h-3 w-3" /> Filter:
            </span>
            {[
              { id: 'all', label: 'All' },
              { id: 'article', label: 'Journal Articles' },
              { id: 'chapter', label: 'Book Chapters' },
              { id: 'preprint', label: 'Preprints' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setSelectedType(btn.id)}
                className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-all min-h-[44px] ${
                  selectedType === btn.id
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'border border-emerald-500/20 bg-emerald-950/30 text-slate-300 hover:bg-emerald-900/40'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-6 text-xs sm:text-sm text-slate-400 font-mono">
          Showing {filteredPubs.length} of {PUBLICATIONS.length} publications
        </div>

        {/* Publications List */}
        <div className="space-y-4">
          {filteredPubs.map((pub) => {
            const isCopied = copiedId === pub.id;

            return (
              <div
                key={pub.id}
                className="group relative rounded-2xl border border-emerald-500/15 bg-emerald-950/20 p-5 sm:p-6 backdrop-blur-sm hover:border-emerald-500/35 hover:bg-emerald-950/30 transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Meta badges: Year, Type, Journal */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="rounded-md bg-emerald-900/60 border border-emerald-500/30 px-2 py-0.5 text-xs font-mono font-bold text-emerald-300">
                        {pub.year}
                      </span>
                      <span className="rounded-md bg-slate-800/80 border border-slate-700 px-2 py-0.5 text-[11px] font-medium text-slate-300 capitalize">
                        {pub.type}
                      </span>
                      <span className="text-xs font-semibold text-emerald-400">
                        {pub.venue}
                      </span>
                      {pub.detail && (
                        <span className="text-xs text-slate-400">
                          • {pub.detail}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                      {pub.title}
                    </h3>

                    {/* Authors */}
                    <p className="mt-2 text-xs sm:text-sm text-slate-300">
                      {pub.authors.map((author, aIdx) => {
                        const isPI = author.includes('Bajhaiya');
                        return (
                          <span key={aIdx}>
                            <span className={isPI ? 'font-semibold text-emerald-300 underline decoration-emerald-500/40' : ''}>
                              {author}
                            </span>
                            {aIdx < pub.authors.length - 1 ? ', ' : ''}
                          </span>
                        );
                      })}
                    </p>

                    {/* DOI / Identifiers */}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
                      <span>DOI: {pub.doi}</span>
                      {pub.pmid && <span>PMID: {pub.pmid}</span>}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0">
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/60 px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/50 hover:border-emerald-400/50 transition-all min-h-[44px]"
                    >
                      <span>Read Paper</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>

                    <button
                      onClick={() => copyCitation(pub)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/60 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all min-h-[44px]"
                      title="Copy full citation"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Cite</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
