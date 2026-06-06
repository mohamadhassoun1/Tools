/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AdSpaceProps {
  /**
   * Layout format of the advertisement unit
   */
  layout: 'leaderboard' | 'sidebar' | 'feed' | 'square';
  /**
   * Custom classes to append to the wrapper
   */
  className?: string;
  /**
   * Unique ID for the ad slot targeting
   */
  slotId?: string;
}

export default function AdSpace({ layout, className = '', slotId }: AdSpaceProps) {
  // If you are ready to insert Google AdSense or another ad script, you can:
  // 1. Paste your setup script in index.html (e.g. <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>)
  // 2. Erase the helper UI below and replace with your actual ad element:
  //    <ins className="adsbygoogle"
  //         style={{ display: 'block' }}
  //         data-ad-client="ca-pub-XXXXXXXXXXXXXX"
  //         data-ad-slot={slotId || "XXXXXXX"}
  //         data-ad-format={layout === 'leaderboard' ? 'horizontal' : layout === 'sidebar' ? 'vertical' : 'auto'}
  //         data-full-width-responsive="true"></ins>
  // 3. Trigger a load on mount using: (window.adsbygoogle = window.adsbygoogle || []).push({});

  const containerStyles = () => {
    switch (layout) {
      case 'leaderboard':
        // Standard 728x90 banner space
        return 'w-full min-h-[90px] sm:min-h-[110px] py-3 px-4';
      case 'sidebar':
        // Modern 160x600 or 300x600 skyscraper
        return 'w-full min-h-[300px] md:min-h-[600px] p-4';
      case 'square':
        // Standard 300x250 or 336x280 rectangle
        return 'w-full max-w-[350px] min-h-[250px] mx-auto p-4';
      case 'feed':
      default:
        // Responsive in-feed auto ad
        return 'w-full min-h-[120px] p-4';
    }
  };

  const getSizingText = () => {
    switch (layout) {
      case 'leaderboard':
        return 'Leaderboard Banner (728 × 90)';
      case 'sidebar':
        return 'Skyscraper Sidebar (300 × 600)';
      case 'square':
        return 'Medium Rectangle (300 × 250)';
      case 'feed':
        return 'In-Feed Fluid Ad (Responsive)';
    }
  };

  return (
    <div 
      className={`relative rounded-xl border-2 border-dashed border-slate-200/85 bg-slate-50/70 overflow-hidden flex flex-col items-center justify-center text-center transition-all ${containerStyles()} ${className}`}
      style={{ contentVisibility: 'auto' }}
    >
      {/* Tiny clean "AD" badge at top-right */}
      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-slate-200 text-slate-500 font-mono text-[8px] font-bold uppercase tracking-wider select-none leading-none">
        Ad Space
      </div>

      {/* Visual Placeholder Content */}
      <div className="flex flex-col items-center gap-1.5 p-2 select-none pointer-events-none">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
          <svg className="w-4.5 h-4.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        </div>
        <div className="space-y-0.5">
          <p className="text-[11px] font-bold text-slate-700 tracking-tight leading-none">
            {getSizingText()}
          </p>
          <p className="text-[9px] text-slate-400 font-medium">
            Placeholder for {layout === 'leaderboard' ? 'top-level' : layout === 'sidebar' ? 'skyscaper' : 'in-page'} Google AdSense code
          </p>
        </div>
      </div>

      {/* Code Hook guide for the developer visible when inspecting */}
      <span className="hidden">ad_slot_hint="{slotId || 'auto_layout'}"</span>
    </div>
  );
}
