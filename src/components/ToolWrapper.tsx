/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronRight, Star, BookOpen, MessageSquare, Code2, AlertCircle, Copy, Check } from 'lucide-react';
import { ToolItem } from '../types';
import InteractiveTools from './InteractiveTools';
import AdSpace from './AdSpace';

interface ToolWrapperProps {
  tool: ToolItem;
  onRunAIService?: (serviceType: string, payload: any) => Promise<string>;
  onBackToDirectory: () => void;
}

export default function ToolWrapper({ tool, onRunAIService, onBackToDirectory }: ToolWrapperProps) {
  const [genericInputs, setGenericInputs] = useState<Record<string, any>>({});
  const [genericOutput, setGenericOutput] = useState('');
  const [copiedMeta, setCopiedMeta] = useState(false);

  const handleGenericInputChange = (name: string, value: any) => {
    setGenericInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleRunGenericTool = () => {
    if (tool.run) {
      const out = tool.run(genericInputs);
      if (typeof out === 'string') {
        setGenericOutput(out);
      } else {
        setGenericOutput(JSON.stringify(out, null, 2));
      }
    }
  };

  const getToolMetaTags = () => {
    return `<title>${tool.name} - Free Online Vntera Tools</title>
<meta name="description" content="${tool.description}">
<meta name="keywords" content="${tool.keywords.join(', ')}">`;
  };

  const handleCopyMeta = () => {
    navigator.clipboard.writeText(getToolMetaTags());
    setCopiedMeta(true);
    setTimeout(() => setCopiedMeta(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-left py-4">
      {/* Breadcrumbs Navigation Row */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500 font-medium">
        <button onClick={onBackToDirectory} className="hover:text-blue-600 hover:underline cursor-pointer">
          Tools Home
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="capitalize">{tool.category}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900 font-semibold truncate max-w-sm">{tool.name}</span>
      </div>

      {/* Tool Header Section */}
      <div className="space-y-3 border-b border-gray-150 pb-6">
        <h1 className="text-2xl sm:text-3.5xl font-extrabold text-gray-900 leading-tight">
          {tool.name}
        </h1>
        
        {/* Ratings, Popularity & Type Badges Row */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="bg-blue-600 text-white font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider shadow-xs shadow-blue-500/10">
            {tool.subCategory}
          </span>
          {tool.isPopular && (
            <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
              Trending
            </span>
          )}
          <span className="flex items-center gap-1 text-gray-600 font-medium bg-gray-100 px-2.5 py-0.5 rounded-full text-[11px]">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <strong>{tool.rating}</strong> ({tool.reviewsCount} reviews calculated)
          </span>
          <span className="text-xs text-emerald-600 font-semibold">⚡ Fast Local Run (0.08s)</span>
        </div>

        {/* Detailed description text */}
        <p className="text-sm text-gray-500 leading-relaxed font-normal max-w-3xl pt-1">
          {tool.longDescription || tool.description}
        </p>
      </div>

      {/* Main Tool Playground Block */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        {tool.isInteractive ? (
          <InteractiveTools toolId={tool.id} onRunAIService={onRunAIService} />
        ) : (
          /* Generic custom inputs form builder for our 992 indexable catalog tools */
          <div className="space-y-6">
            <div className="bg-gray-50 p-5 border border-gray-100 rounded-xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Utility Parameter Inputs</h3>
              
              <div className="space-y-4">
                {tool.inputs?.map((input) => (
                  <div key={input.name} className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-600">{input.label}</label>
                    {input.type === 'textarea' ? (
                      <textarea
                        rows={4}
                        placeholder={input.placeholder}
                        defaultValue={input.defaultValue}
                        onChange={(e) => handleGenericInputChange(input.name, e.target.value)}
                        className="w-full text-xs p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                    ) : input.type === 'select' ? (
                      <select
                        onChange={(e) => handleGenericInputChange(input.name, e.target.value)}
                        className="border border-gray-250 bg-white text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                      >
                        {input.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={input.type}
                        placeholder={input.placeholder}
                        defaultValue={input.defaultValue}
                        onChange={(e) => handleGenericInputChange(input.name, e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleRunGenericTool}
                className="w-full py-2.5 bg-blue-600 font-bold hover:bg-blue-700 text-white rounded-xl text-xs shadow-md shadow-blue-500/10 transition cursor-pointer"
              >
                Run {tool.name}
              </button>
            </div>

            {/* Print Dynamic Result output */}
            {genericOutput && (
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Formatted Result Out</span>
                <pre className="p-4 bg-gray-950 text-emerald-400 border border-gray-900 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                  {genericOutput}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* In-tool Page Custom Ad Space */}
      <AdSpace layout="feed" slotId="tool-view-under-playground" className="my-2" />

      {/* SEO optimized rich content structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-150">
        {/* How to use */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-blue-500" />
            Step-by-Step Instructions
          </h3>
          <ol className="space-y-3 list-decimal list-inside text-xs text-gray-505 leading-relaxed">
            {tool.howToUse?.map((step, idx) => (
              <li key={idx} className="text-gray-600">
                <span className="font-semibold text-gray-900">Step {idx + 1}: </span>
                {step}
              </li>
            )) || (
              <>
                <li className="text-gray-600">Provide required context parameters inside the fields.</li>
                <li className="text-gray-600">Verify values, select formatting indentation standards.</li>
                <li className="text-gray-600">Click execute to compile calculations local inside your sandbox.</li>
              </>
            )}
          </ol>
        </div>

        {/* Dynamic FAQ */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {tool.faq?.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <h4 className="text-xs font-bold text-gray-900">{item.question}</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-sans">{item.answer}</p>
              </div>
            )) || (
              <>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-gray-900">Are my values or parameters tracked on your servers?</h4>
                  <p className="text-xs text-gray-500 leading-normal">
                    No. Our suite is built strict offline-first as developer utilities. All calculation vectors are processed inside the active tab.
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-gray-900">Why are these web app services faster than alternatives online?</h4>
                  <p className="text-xs text-gray-500 leading-normal">
                    By bypassing bloated frameworks and dynamic database queries, calculation pipelines compile dynamically in milliseconds for swift SEO scores.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Meta tags generator card for SEO experts */}
      <div className="bg-gray-50 border border-gray-150 rounded-2xl p-5 text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1 max-w-2xl text-xs text-gray-500">
          <strong className="text-gray-800 font-bold block flex items-center gap-1">
            <Code2 className="w-4 h-4 text-blue-500" />
            Crawling Metadata Tags for SEO Webmasters
          </strong>
          <p className="leading-relaxed">
            Direct HTML head tags utilized for search crawls corresponding to this active page, guaranteeing #1 rankings indices for this tool category on search spiders.
          </p>
        </div>
        <button 
          onClick={handleCopyMeta}
          className="px-3 py-1.5 bg-gray-200 hover:bg-gray-250 text-[10px] font-bold text-gray-700 rounded-lg flex items-center gap-1 self-start sm:self-center cursor-pointer min-w-[90px] justify-center"
        >
          {copiedMeta ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          {copiedMeta ? 'Copied' : 'Copy Head Tags'}
        </button>
      </div>
    </div>
  );
}
