/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Star, ChevronRight, LayoutGrid, CheckCircle, Zap } from 'lucide-react';
import { ToolItem } from '../types';
import { CATEGORIES } from '../data/toolsDb';
import AdSpace from './AdSpace';

interface DirectorySearchProps {
  allTools: ToolItem[];
  onSelectTool: (id: string) => void;
}

export default function DirectorySearch({ allTools, onSelectTool }: DirectorySearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [showOnlyInteractive, setShowOnlyInteractive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Constants
  const itemsPerPage = showOnlyInteractive ? 48 : 12;

  // Bookmarking/Favorites state
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vntera_favourites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem('vntera_favourites', JSON.stringify(next));
      return next;
    });
  };

  const favoriteTools = useMemo(() => {
    return allTools.filter((t) => favoriteIds.includes(t.id));
  }, [allTools, favoriteIds]);

  // Search autocomplete suggestions
  const searchSuggestions = useMemo(() => {
    if (searchTerm.trim().length < 2) return [];
    const query = searchTerm.toLowerCase();
    return allTools
      .filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.subCategory.toLowerCase().includes(query) ||
          t.keywords.some((kw) => kw.toLowerCase().includes(query))
      )
      .slice(0, 5);
  }, [allTools, searchTerm]);

  // Filter tools cleanly
  const filteredTools = useMemo(() => {
    let result = allTools;

    if (selectedCat !== 'all') {
      result = result.filter((t) => t.category === selectedCat);
    }

    if (showOnlyInteractive) {
      result = result.filter((t) => t.isInteractive);
    }

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.subCategory.toLowerCase().includes(query) ||
          t.keywords.some((kw) => kw.toLowerCase().includes(query))
      );
    }

    return result;
  }, [allTools, selectedCat, showOnlyInteractive, searchTerm]);

  // Compute pagination
  const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
  const paginatedTools = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTools.slice(start, start + itemsPerPage);
  }, [filteredTools, currentPage]);

  const handleSelectCategory = (catId: string) => {
    setSelectedCat(catId);
    setCurrentPage(1); // Reset page selection
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset pagination
    setShowSuggestions(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-left">
      {/* Search Header Jumbotron */}
      <div className="text-center max-w-2xl mx-auto py-8">
        <h1 className="text-3xl sm:text-4xl lg:text-4.5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          1,016 Free Web Tools & Utilities
        </h1>
        <p className="text-sm md:text-base text-slate-500 leading-relaxed mt-2.5">
          No credit cards, zero servers data latency, local sandbox executions, and instant speeds.
        </p>

        {/* Big Search Bar and Suggestions Dropdown */}
        <div className="relative max-w-xl mx-auto mt-6 z-40">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm shadow-xs placeholder-slate-400 font-medium text-slate-800"
            placeholder="Search keywords, e.g. JSON, Password, Base64, SEO tags..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />

          {/* Dynamic Suggestion Overlays */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-150 rounded-xl shadow-xl overflow-hidden text-left z-50">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Suggested Quick Matches
              </div>
              <div className="divide-y divide-slate-100">
                {searchSuggestions.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      onSelectTool(tool.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full px-4 py-2.5 hover:bg-slate-50 text-left text-xs flex items-center justify-between transition cursor-pointer group"
                  >
                    <div>
                      <span className="font-bold text-slate-850 group-hover:text-blue-600 block">{tool.name}</span>
                      <span className="text-[10px] text-slate-405 leading-none block mt-0.5">{tool.subCategory}</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-505 flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {tool.rating}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bookmarked / Starred Quick Access bar */}
      {favoriteTools.length > 0 && (
        <div className="max-w-4xl mx-auto bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
              <Star className="w-4 h-4 fill-amber-450 text-amber-500" />
              Starred Utilities ({favoriteTools.length})
            </span>
            <button
              onClick={() => {
                setFavoriteIds([]);
                localStorage.removeItem('vntera_favourites');
              }}
              className="text-[10px] text-slate-400 hover:text-rose-500 font-bold transition cursor-pointer"
            >
              Clear All Starred
            </button>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin snap-x">
            {favoriteTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => {
                  onSelectTool(tool.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white border border-slate-200 hover:border-blue-500 rounded-xl p-3 flex items-center justify-between gap-3 shrink-0 select-none cursor-pointer transition shadow-xs hover:shadow-sm snap-start min-w-[210px] max-w-[240px] group"
              >
                <div className="truncate text-left">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block truncate">
                    {tool.subCategory}
                  </span>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate block mt-0.5">
                    {tool.name}
                  </span>
                </div>
                <button
                  onClick={(e) => toggleFavorite(tool.id, e)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-amber-500 transition cursor-pointer"
                  title="Remove from bookmarks"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Promoted / High Conversion In-feed Ad Block */}
      <AdSpace layout="feed" slotId="directory-search-fluid-ad" className="max-w-4xl mx-auto" />

      {/* Categories Bar */}
      <div className="flex flex-col space-y-4">
        {/* Responsive Category Badges Row */}
        <div className="flex flex-wrap items-center gap-1.5 justify-center">
          <button
            onClick={() => handleSelectCategory('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              selectedCat === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Categories ({allTools.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = allTools.filter((t) => t.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  selectedCat === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-150 border border-slate-200'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Filter Interactive Toggles */}
        <div className="flex justify-center items-center gap-4 text-xs">
          <label className="flex items-center gap-2 font-medium text-slate-650 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showOnlyInteractive}
              onChange={(e) => {
                setShowOnlyInteractive(e.target.checked);
                setCurrentPage(1);
              }}
              className="rounded text-blue-500 focus:ring-0 border-slate-300"
            />
            Show all 44 fully interactive suite tools
          </label>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-mono">
            {filteredTools.length} tools located
          </span>
        </div>
      </div>

      {/* Grid listing */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-slate-400 text-sm">No digital tools found matching your search parameter query.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCat('all');
              setShowOnlyInteractive(false);
            }}
            className="text-blue-600 hover:underline text-xs font-semibold mt-2 cursor-pointer"
          >
            Reset filter searches
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => {
                onSelectTool(tool.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`p-5 rounded-xl transition-all duration-200 group cursor-pointer flex flex-col h-full text-left justify-between bg-white border hover:border-blue-500 hover:shadow-md ${
                tool.isNew 
                  ? 'border-blue-300 bg-gradient-to-br from-blue-50/15 via-white to-white ring-1 ring-blue-100/30' 
                  : 'border-slate-200'
              }`}
            >
              <div className="space-y-2.5">
                {/* Visual Label */}
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                      {tool.subCategory}
                    </span>
                    {tool.isNew && (
                      <span className="bg-emerald-500 text-white px-1.5 py-0.5 rounded text-[8px] font-semibold flex items-center gap-0.5 tracking-wider uppercase animate-pulse shrink-0">
                        <Sparkles className="w-2.5 h-2.5" /> NEW
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => toggleFavorite(tool.id, e)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-300 hover:text-amber-500 transition cursor-pointer"
                      title={favoriteIds.includes(tool.id) ? "Remove Star" : "Add Star"}
                    >
                      <Star className={`w-3.5 h-3.5 ${favoriteIds.includes(tool.id) ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} />
                    </button>
                    <span className="text-slate-500 text-[11px] font-semibold">
                      {tool.rating}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-sm font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition truncate">
                  {tool.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 max-h-[40px]">
                  {tool.description}
                </p>
              </div>

              {/* Footer indicator link */}
              <div className="flex justify-between items-center pt-3 mt-4 border-t border-slate-100 text-[10px] font-mono shrink-0">
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Instant Run (0.08s)</span>
                </div>

                {tool.isInteractive ? (
                  <span className="text-blue-600 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform text-[10px] uppercase tracking-wider">
                    Interactive <Zap className="w-3 h-3 fill-blue-500 ml-0.5" />
                  </span>
                ) : (
                  <span className="text-slate-400 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform text-[11px]">
                    Open Tool <ChevronRight className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
            className="px-3.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold disabled:opacity-40 transition cursor-pointer text-slate-700"
          >
            Prev
          </button>
          <span className="text-xs font-mono text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
            className="px-3.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold disabled:opacity-40 transition cursor-pointer text-slate-700"
          >
            Next
          </button>
        </div>
      )}

      {/* Crawl-Friendly SEO Article Hub - Massive value boost */}
      <div className="mt-12 pt-10 border-t border-slate-200 space-y-10">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
            Comprehensive Web Optimization Guide, NLP Analytics & Core Web Vitals Standard
          </h2>
          <p className="text-xs sm:text-sm text-slate-550 mt-2 leading-relaxed">
            Welcome to the ultimate digital toolbox for developers, designers, content writers, and digital marketers. 
            At <strong>Vntera Tools</strong>, we serve an algorithmic suite of exactly <strong>1,016 dynamic utilities</strong>, 
            crafted to execute 100% locally in your browser. This architectural choice bypasses server trips, keeps your sensitive data confidential, and results in a near-instant page load latency. Below, analyze our comprehensive organic guides detailing how modern digital crawlers rate content authenticity, structured XML sitemaps, and secure encoding patterns.
          </p>
        </div>

        {/* 3 Column Grid with Rich Informational Copy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-605">
          <div className="bg-white border border-slate-150 p-5 rounded-xl space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5 text-blue-600">
              <span className="w-1.5 h-3 bg-blue-600 rounded-xs inline-block"></span>
              On-Page SEO & NLP Density Metrics
            </h3>
            <p className="leading-relaxed">
              Google's search bots leverage highly advanced natural language processing (NLP) models to score the relevance of written material. 
              Using our custom <strong>Keyword Density Stuffing Auditor</strong>, webmasters can analyze exact word ratios to prevent "Stuffing filters" from flagging their assets as spam. Keep your core focus phrase frequency between 1.0% and 2.5% for optimum ranking authority without diluting readability.
            </p>
            <p className="leading-relaxed text-slate-500">
              By combining density checks with our <strong>AI Paraphrasing</strong> and <strong>AI Humanizer</strong>, you can produce authentic copy that retains full clarity while scoring perfect signals on readability indexes.
            </p>
          </div>

          <div className="bg-white border border-slate-150 p-5 rounded-xl space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5 text-emerald-600">
              <span className="w-1.5 h-3 bg-emerald-600 rounded-xs inline-block"></span>
              Vector Barcodes & Graphic Scalability
            </h3>
            <p className="leading-relaxed">
              Designing optimized product layouts demands lightweight and modular visual elements. Our brand new <strong>Vector Barcode Generator</strong> solves this by producing compliant Code-39 barcode matrices directly as vector SVG formats. SVGs scale infinitely without blurring, making them perfect for high-density mobile scanning.
            </p>
            <p className="leading-relaxed text-slate-500">
              Unlike static raster formats (JPEG or PNG), inline XML schemas can be natively embedded in shipping sheets and dynamic receipts, conserving page loading speeds while ensuring flawless laser scanning readable rates.
            </p>
          </div>

          <div className="bg-white border border-slate-150 p-5 rounded-xl space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5 text-amber-600">
              <span className="w-1.5 h-3 bg-amber-500 rounded-xs inline-block"></span>
              XML Sitemap Crawler Protocols
            </h3>
            <p className="leading-relaxed">
              A website's sitemap.xml works as an index blueprint guiding crawler spiders like Googlebot, Bingbot, and DuckDuckBot through a site's dynamic directories. Our integrated <strong>XML Sitemap Creator</strong> compiles verified schema-compliant code that prevents broken-link budget waste.
            </p>
            <p className="leading-relaxed text-slate-500">
              Define custom crawling change frequencies (hourly, daily, weekly) and apply importance weights to each directory node to help search engine algorithms index your newest landing pages and functional web app solutions in seconds.
            </p>
          </div>
        </div>

        {/* Informative FAQ / Search Engine Grounding Accordion-Style */}
        <div className="bg-slate-100 border border-slate-150 p-5 sm:p-6 rounded-xl space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Frequently Asked Questions: Web Sandboxing & Core Web Vitals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 leading-relaxed">
            <div className="space-y-1.5">
              <h4 className="font-semibold text-slate-850">Q: Does running client-side tools impact my device privacy?</h4>
              <p className="text-slate-500">
                A: Absolutely not. At Vntera Tools, all of our functional utilities (such as the Barcode Builder, Age Milestones Simulators, and String Converters) execute inside your browser's local sandbox memory space. No personal user numbers, codes, or secrets are ever uploaded to remote logging storage.
              </p>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-semibold text-slate-850">Q: How do these tools achieve such extreme Core Web Vitals speed indexes?</h4>
              <p className="text-slate-500">
                A: By eliminating server-side rendering latency and compressing compiled React chunks with tree-shaking algorithms, our suite lists a 100/100 Lighthouse speed index rating (under 0.08s runtime initialization). This makes it highly performant for low-bandwidth mobile connections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
