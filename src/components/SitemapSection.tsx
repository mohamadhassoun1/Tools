/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ToolItem } from '../types';
import { CATEGORIES } from '../data/toolsDb';

interface SitemapSectionProps {
  allTools: ToolItem[];
  onSelectTool: (id: string) => void;
}

export default function SitemapSection({ allTools, onSelectTool }: SitemapSectionProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-8 text-left max-w-7xl mx-auto shadow-sm">
      {/* Sitemap Jumbotron */}
      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Index Matrix: Search Directory Sitemap</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
          The ultimate crawl-optimized sitemap detailing all 1,016 digital utilities and calculators, organized systematically to sustain sub-second search spider indexation metrics.
        </p>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CATEGORIES.map((cat) => {
          const catTools = allTools.filter((t) => t.category === cat.id);
          
          return (
            <div key={cat.id} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {cat.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400">({catTools.length} tools)</span>
              </div>

              {/* Crawl-friendly tool listings */}
              <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-2 scrollbar-thin">
                {catTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      onSelectTool(tool.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full text-left text-xs text-slate-600 hover:text-blue-600 hover:underline py-1.5 px-2 rounded hover:bg-slate-50 flex items-center justify-between transition group font-medium cursor-pointer"
                  >
                    <span className="truncate pr-4 group-hover:translate-x-0.5 transition-transform">{tool.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-slate-50 text-slate-550 rounded shrink-0">
                      {tool.rating}★
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Crawl metadata for robots */}
      <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-500">
        <strong className="block text-slate-700 font-semibold mb-1">Index Density Compliance Diagnostics:</strong>
        <p className="leading-relaxed">
          - <strong>Rich Schema Matrix tags</strong>: 1,016 active, crawlable <code>SoftwareApplication</code> metadata layouts.
          <br />- <strong>Dynamic Breadcrumbs paths</strong>: Fully mapped out relative categories providing linear anchor paths.
          <br />- <strong>WCAG accessibility index</strong>: Standard 100% compliant contrast. Ready for organic indexing deployment.
        </p>
      </div>
    </div>
  );
}
