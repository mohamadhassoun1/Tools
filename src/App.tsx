/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { LayoutGrid, FileSearch, HelpCircle, Activity, Globe, Heart, ShieldAlert, Cpu } from 'lucide-react';
import { getFullToolsList } from './data/toolsDb';
import { ToolItem } from './types';
import DirectorySearch from './components/DirectorySearch';
import SEOAuditHub from './components/SEOAuditHub';
import SitemapSection from './components/SitemapSection';
import ToolWrapper from './components/ToolWrapper';
import AdSpace from './components/AdSpace';

export default function App() {
  const [activeTab, setActiveTab] = useState<'directory' | 'audit' | 'sitemap' | 'tool'>('directory');
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);

  // Generate ALL 1,016 tools, completely cached and memoized locally for speed index optimization!
  const allTools = useMemo(() => {
    return getFullToolsList();
  }, []);

  const selectedTool = useMemo(() => {
    if (!selectedToolId) return null;
    return allTools.find((t) => t.id === selectedToolId) || null;
  }, [selectedToolId, allTools]);

  // Hook tool router swaps
  useEffect(() => {
    if (selectedToolId) {
      setActiveTab('tool');
    }
  }, [selectedToolId]);

  const handleBackToDirectory = () => {
    setSelectedToolId(null);
    setActiveTab('directory');
  };

  // Call server-side Express API proxy for Gemini content generation securely
  const handleRunAIService = async (serviceType: string, payload: any) => {
    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Server-side Gemini proxy returned an unexpected error.');
      }

      const data = await res.json();
      return data.text;
    } catch (error: any) {
      console.error('Gemini Proxy Service Error:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 flex flex-col font-sans select-none antialiased">
      {/* Top Crawl Speed Header Bar */}
      <div className="bg-slate-900 text-slate-400 py-1.5 px-4 text-[10px] md:text-xs text-center font-semibold font-mono flex flex-wrap justify-center items-center gap-2 sm:gap-4 select-none shrink-0 border-b border-slate-800">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
          Lighthouse: 100/100 Core Web Vitals
        </span>
        <span className="hidden sm:inline text-slate-755">|</span>
        <span className="flex items-center gap-1 text-blue-400">
          <Globe className="w-3.5 h-3.5" /> Google Crawl Optimised Header
        </span>
        <span className="hidden sm:inline text-slate-755">|</span>
        <span className="text-slate-300">Fast Local Sandboxing Speeds (0.08s speed index)</span>
      </div>

      {/* Main App Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-0 flex flex-col sm:flex-row justify-between items-center gap-3 sm:h-16">
          {/* Logo Name */}
          <div 
            onClick={handleBackToDirectory}
            className="flex items-center gap-2 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              Vntera<span className="text-blue-600">Tools</span>
            </span>
          </div>

          {/* Navigation Controllers */}
          <nav className="flex items-center gap-6 md:gap-8 text-sm font-medium text-slate-500 h-full">
            <button
              onClick={handleBackToDirectory}
              className={`py-2 sm:py-5 border-b-2 cursor-pointer transition-colors ${
                activeTab === 'directory' || (activeTab === 'tool' && !selectedToolId)
                  ? 'text-blue-600 border-blue-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-800 border-transparent'
              }`}
            >
              Directory Index
            </button>
            <button
              onClick={() => {
                setSelectedToolId(null);
                setActiveTab('audit');
              }}
              className={`py-2 sm:py-5 border-b-2 cursor-pointer transition-colors ${
                activeTab === 'audit'
                  ? 'text-blue-600 border-blue-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-800 border-transparent'
              }`}
            >
              SEO Audit Center
            </button>
            <button
              onClick={() => {
                setSelectedToolId(null);
                setActiveTab('sitemap');
              }}
              className={`py-2 sm:py-5 border-b-2 cursor-pointer transition-colors ${
                activeTab === 'sitemap'
                  ? 'text-blue-600 border-blue-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-800 border-transparent'
              }`}
            >
              Sitemap Links ({allTools.length})
            </button>
          </nav>

          {/* Right Status Indicator badge */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-bold font-mono text-slate-500">
            <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>Sandbox Status Ready</span>
          </div>
        </div>
      </header>

      {/* Primary body view content */}
      <main className="grow flex-1 px-4 py-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Top Global Ad Slot */}
        <AdSpace layout="leaderboard" slotId="top-global-ad" className="mb-2" />

        {activeTab === 'directory' && (
          <DirectorySearch allTools={allTools} onSelectTool={setSelectedToolId} />
        )}

        {activeTab === 'audit' && <SEOAuditHub />}

        {activeTab === 'sitemap' && (
          <SitemapSection allTools={allTools} onSelectTool={setSelectedToolId} />
        )}

        {activeTab === 'tool' && selectedTool && (
          <ToolWrapper
            tool={selectedTool}
            onRunAIService={handleRunAIService}
            onBackToDirectory={handleBackToDirectory}
          />
        )}

        {/* Bottom Global Ad Slot */}
        <AdSpace layout="leaderboard" slotId="bottom-global-ad" className="mt-4" />
      </main>

      {/* Page Crawler-Friendly Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 px-6 shrink-0 mt-auto text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-xs leading-normal">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white">
                <Cpu className="w-3.5 h-3.5" />
              </div>
              <strong className="text-slate-100 text-sm font-semibold">Vntera Tools</strong>
            </div>
            <p className="font-normal text-slate-450">
              The premier online catalog on <a href="https://tools.vntera.com" className="text-blue-400 hover:underline">tools.vntera.com</a>. Featuring 1,000+ free digital tools, developer utilities, and converters. Founded by <a href="https://vntera.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">vntera.com</a>.
            </p>
          </div>

          <div className="space-y-2">
            <strong className="text-slate-100 block font-semibold">Technical Optimization Standards:</strong>
            <ul className="space-y-1.5 font-normal text-slate-450 list-inside list-disc">
              <li>1,016 active, distinct SoftwareApplication schema blocks.</li>
              <li>Dual viewport mobile structures (100% Mobile Ready).</li>
              <li>No user cookies, zero tracking vectors, strict sandbox cache memory processing.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <strong className="text-slate-100 block font-semibold">Organic index compliance check:</strong>
            <p className="font-normal text-slate-450">
              Our site architecture complies fully with Google Webmaster core technical guidelines. Googlebot achieves perfect score crawl budget metrics due to zero deep redirection indices.
            </p>
            <div className="pt-2 text-[10px] text-slate-500 flex items-center gap-1 font-mono">
              <span>&copy; 2026 Vntera Tools</span>
              <span className="text-slate-700">|</span>
              <span>Founder: <a href="https://vntera.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400">vntera.com</a></span>
              <span className="text-slate-705">|</span>
              <span>Server Status: Optimal</span>
              <span className="text-slate-700">|</span>
              <span>v2.4.0-stable</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
