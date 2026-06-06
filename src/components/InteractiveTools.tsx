/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Copy, Check, Download, AlertCircle, RefreshCw, Eye, Smartphone, Monitor } from 'lucide-react';
import {
  PDFToWord, WordToPDF, MergePDF, SplitPDF, CompressPDF, PDFEditor, PDFToJPG, JPGToPDF, PDFPasswordRemover, OCRPDF,
  ImageCompressor, BackgroundRemover, ImageResizer, ImageToTextOCR, ImageFormatConverter,
  AIContentWriter, AIParaphrasingTool, GrammarChecker, AIHumanizer, PlagiarismChecker
} from './PdfImageAiTools';
import {
  BarcodeGenerator, AgeCalculator, CurrencyConverter, YoutubeThumbnailDownloader,
  YoutubeVideoDownloader, InstagramPhotoDownloader, KeywordDensityChecker, XmlSitemapGenerator
} from './RequestedTools';

interface InteractiveToolProps {
  toolId: string;
  onRunAIService?: (serviceType: string, payload: any) => Promise<string>;
}

export default function InteractiveTools({ toolId, onRunAIService }: InteractiveToolProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const triggerCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  switch (toolId) {
    case 'seo-meta-generator':
      return <SEOMetaGenerator onCopy={triggerCopy} copied={copied} />;
    case 'json-formatter':
      return <JSONFormatter onCopy={triggerCopy} copied={copied} />;
    case 'password-generator':
      return <PasswordGenerator onCopy={triggerCopy} copied={copied} />;
    case 'ai-copilot':
      return <AICopilot onRunAIService={onRunAIService} onCopy={triggerCopy} copied={copied} />;
    case 'markdown-editor':
      return <MarkdownEditor onCopy={triggerCopy} copied={copied} />;
    case 'base64-encoder':
      return <Base64Encoder onCopy={triggerCopy} copied={copied} />;
    case 'qr-generator':
      return <QRGenerator onCopy={triggerCopy} copied={copied} />;
    case 'color-palette':
      return <ColorPaletteContrast onCopy={triggerCopy} copied={copied} />;
    case 'unit-converter':
      return <UnitConverter />;
    case 'loan-calculator':
      return <LoanCalculator onCopy={triggerCopy} copied={copied} />;
    case 'diff-checker':
      return <DiffChecker />;
    case 'hash-generator':
      return <HashGenerator onCopy={triggerCopy} copied={copied} />;
    case 'word-counter':
      return <WordCounter onCopy={triggerCopy} copied={copied} />;
    case 'url-encoder':
      return <URLEncoder onCopy={triggerCopy} copied={copied} />;
    case 'robots-txt-generator':
      return <RobotsTxtGenerator onCopy={triggerCopy} copied={copied} />;
    case 'ai-seo-analyzer':
      return <AISEOAnalyzer onRunAIService={onRunAIService} onCopy={triggerCopy} copied={copied} />;
    
    // 10 new PDF Tools
    case 'pdf-to-word':
      return <PDFToWord onCopy={triggerCopy} copied={copied} onRunAIService={onRunAIService} />;
    case 'word-to-pdf':
      return <WordToPDF onCopy={triggerCopy} copied={copied} onRunAIService={onRunAIService} />;
    case 'merge-pdf':
      return <MergePDF />;
    case 'split-pdf':
      return <SplitPDF />;
    case 'compress-pdf':
      return <CompressPDF />;
    case 'pdf-editor':
      return <PDFEditor />;
    case 'pdf-to-jpg':
      return <PDFToJPG />;
    case 'jpg-to-pdf':
      return <JPGToPDF />;
    case 'pdf-password-remover':
      return <PDFPasswordRemover />;
    case 'ocr-pdf':
      return <OCRPDF onCopy={triggerCopy} copied={copied} onRunAIService={onRunAIService} />;

    // 5 new Image Tools
    case 'image-compressor':
      return <ImageCompressor />;
    case 'background-remover':
      return <BackgroundRemover />;
    case 'image-resizer':
      return <ImageResizer />;
    case 'image-to-text':
      return <ImageToTextOCR onCopy={triggerCopy} copied={copied} onRunAIService={onRunAIService} />;
    case 'image-format-converter':
      return <ImageFormatConverter />;

    // 5 new AI & Text Tools
    case 'ai-content-writer':
      return <AIContentWriter onCopy={triggerCopy} copied={copied} onRunAIService={onRunAIService} />;
    case 'ai-paraphrasing-tool':
      return <AIParaphrasingTool onCopy={triggerCopy} copied={copied} onRunAIService={onRunAIService} />;
    case 'grammar-checker':
      return <GrammarChecker onCopy={triggerCopy} copied={copied} onRunAIService={onRunAIService} />;
    case 'ai-humanizer':
      return <AIHumanizer onCopy={triggerCopy} copied={copied} onRunAIService={onRunAIService} />;
    case 'plagiarism-checker':
      return <PlagiarismChecker />;

    // 8 brand new requested tools
    case 'barcode-generator':
      return <BarcodeGenerator onCopy={triggerCopy} copied={copied} />;
    case 'age-calculator':
      return <AgeCalculator />;
    case 'currency-converter':
      return <CurrencyConverter />;
    case 'youtube-thumbnail-downloader':
      return <YoutubeThumbnailDownloader />;
    case 'youtube-video-downloader':
      return <YoutubeVideoDownloader onRunAIService={onRunAIService} />;
    case 'instagram-photo-downloader':
      return <InstagramPhotoDownloader />;
    case 'keyword-density-checker':
      return <KeywordDensityChecker onCopy={triggerCopy} copied={copied} />;
    case 'xml-sitemap-generator':
      return <XmlSitemapGenerator onCopy={triggerCopy} copied={copied} />;

    default:
      return (
        <div className="p-8 text-center text-gray-400">
          <p>Interactive playground unavailable for this catalog tool.</p>
        </div>
      );
  }
}

// -------------------------------------------------------------
// 1. SEO META GENERATOR & PREVIEWER
// -------------------------------------------------------------
function SEOMetaGenerator({ onCopy, copied }: { onCopy: (t: string, l: string) => void; copied: string | null }) {
  const [url, setUrl] = useState('https://example.com/blog/boost-organic-rankings');
  const [title, setTitle] = useState('10 Actionable SEO Techniques to Rank #1 on Google in 2026');
  const [desc, setDesc] = useState('Discover proven, high-performance optimization strategies, core web vitals adjustments, and schema markup formulas designed to rocket keyword rankings today.');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const titleLength = title.length;
  const descLength = desc.length;

  const titleProgress = Math.min((titleLength / 60) * 100, 100);
  const descProgress = Math.min((descLength / 160) * 100, 100);

  const getTitleColor = () => {
    if (titleLength === 0) return 'bg-gray-200';
    if (titleLength < 40) return 'bg-amber-400';
    if (titleLength <= 60) return 'bg-emerald-500';
    return 'bg-rose-500';
  };

  const getDescColor = () => {
    if (descLength === 0) return 'bg-gray-200';
    if (descLength < 110) return 'bg-amber-400';
    if (descLength <= 160) return 'bg-emerald-500';
    return 'bg-rose-500';
  };

  const htmlHeadTags = `<!-- SEO Meta Tags for Search Optimization -->
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${url}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${desc}">`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Parameters */}
        <div className="bg-gray-50 border border-gray-100 p-5 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 tracking-tight">SERP Meta Optimization Config</h3>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Target Canonical URL</label>
            <input 
              type="text" 
              className="w-full text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-medium text-gray-500">SEO Meta Title</label>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${titleLength > 60 ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50'}`}>
                {titleLength} / 60 chars
              </span>
            </div>
            <input 
              type="text" 
              className="w-full text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter eye-catching high-CTR title"
            />
            <div className="h-1.5 w-full bg-gray-200 rounded-full mt-1.5 overflow-hidden">
              <div className={`h-full ${getTitleColor()}`} style={{ width: `${titleProgress}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-medium text-gray-500">SEO Meta Description</label>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${descLength > 160 ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50'}`}>
                {descLength} / 160 chars
              </span>
            </div>
            <textarea 
              rows={3}
              className="w-full text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Enter search snippet listing core features & keyword hooks..."
            />
            <div className="h-1.5 w-full bg-gray-200 rounded-full mt-1.5 overflow-hidden">
              <div className={`h-full ${getDescColor()}`} style={{ width: `${descProgress}%` }}></div>
            </div>
          </div>
        </div>

        {/* Live Visual Google Result Simulator */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-semibold text-gray-900 tracking-tight flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-blue-500" />
              Live Google SERP Visualizer
            </h3>
            <div className="flex bg-gray-100 p-0.5 rounded-lg text-[10px] font-medium">
              <button 
                onClick={() => setPreviewMode('desktop')} 
                className={`px-2 py-1 rounded-md flex items-center gap-1 ${previewMode === 'desktop' ? 'bg-white shadow-xs text-gray-900' : 'text-gray-500'}`}
              >
                <Monitor className="w-3 h-3" /> Desktop
              </button>
              <button 
                onClick={() => setPreviewMode('mobile')} 
                className={`px-2 py-1 rounded-md flex items-center gap-1 ${previewMode === 'mobile' ? 'bg-white shadow-xs text-gray-900' : 'text-gray-500'}`}
              >
                <Smartphone className="w-3 h-3" /> Mobile
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs">
            <div className={previewMode === 'mobile' ? 'max-w-sm mx-auto border-x border-gray-150 px-2' : ''}>
              {/* Google Breadcrumb / Brand */}
              <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-1">
                <span className="font-sans antialiased font-semibold text-gray-900">Google Search</span>
                <span className="text-[9px] text-gray-400">⚡</span>
                <span className="text-[10px] truncate max-w-xs">{url}</span>
              </div>
              
              {/* Blue Link / Heading */}
              <h4 className={`text-blue-800 hover:underline cursor-pointer tracking-tight font-sans antialiased text-left leading-tight ${previewMode === 'mobile' ? 'text-lg' : 'text-xl'}`}>
                {titleLength > 60 ? `${title.slice(0, 58)}...` : title || 'Title is empty'}
              </h4>

              {/* Description Snippet */}
              <p className="text-xs text-gray-600 text-left mt-1.5 leading-relaxed antialiased">
                {descLength > 160 ? `${desc.slice(0, 156)}...` : desc || 'Meta description is empty.'}
              </p>
            </div>
          </div>

          {/* Code Outputs */}
          <div className="relative bg-gray-900 text-gray-100 p-4 rounded-xl text-left font-mono text-[10px] sm:text-xs overflow-x-auto select-all shadow-md">
            <button 
              onClick={() => onCopy(htmlHeadTags, 'serp')}
              className="absolute top-3 right-3 p-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all"
              title="Copy tags to clipboard"
            >
              {copied === 'serp' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <pre className="whitespace-pre-wrap">{htmlHeadTags}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 2. JSON FORMATTER, VALIDATOR & BEAUTIFIER
// -------------------------------------------------------------
function JSONFormatter({ onCopy, copied }: { onCopy: (t: string, l: string) => void; copied: string | null }) {
  const [inputJson, setInputJson] = useState('{"title":"SEO Tools Marketplace","meta":{"active":true,"schema":"WebApplication","keywords":["tools","analyzer"]},"ratings":[4.9,4.8,5.0],"load_speed_seconds":0.08}');
  const [outputJson, setOutputJson] = useState('');
  const [indent, setIndent] = useState<number>(2);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const formatJson = (minify = false) => {
    try {
      const parsed = JSON.parse(inputJson);
      if (minify) {
        setOutputJson(JSON.stringify(parsed));
      } else {
        setOutputJson(JSON.stringify(parsed, null, indent));
      }
      setErrorStatus(null);
    } catch (e: any) {
      setErrorStatus(e.message || 'Parsing error validation mismatch.');
    }
  };

  useEffect(() => {
    if (inputJson.trim()) {
      formatJson();
    } else {
      setOutputJson('');
      setErrorStatus(null);
    }
  }, [inputJson, indent]);

  const handleBeautifyExample = () => {
    setInputJson('{"category":"developers","utilities":[{"id":"base64","clicks":15000,"status":"optimized"},{"id":"json-beautifier","clicks":18400,"status":"super-fast"}],"google_rich_schema":true}');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2 text-xs">
          <label className="font-semibold text-gray-700">Indent Spacing:</label>
          <select 
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="border border-gray-250 bg-white px-2 py-1 rounded-lg"
          >
            <option value={2}>2 Spaces</option>
            <option value={4}>4 Spaces</option>
            <option value={8}>8 Spaces</option>
          </select>
          <button 
            onClick={handleBeautifyExample}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Insert Mock Code
          </button>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => formatJson(true)}
            className="px-3 py-1.5 bg-gray-150 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-all"
          >
            Minify JSON
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input area */}
        <div className="space-y-1 text-left">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Input Raw Payload JSON</span>
          <textarea 
            rows={10}
            className="w-full font-mono text-xs p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder='Paste JSON here, e.g. {"field": "content"}'
          />
        </div>

        {/* Output Area */}
        <div className="space-y-1 text-left relative">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Syntax Highlighted Output</span>
            {outputJson && !errorStatus && (
              <button 
                onClick={() => onCopy(outputJson, 'json')}
                className="p-1 text-gray-400 hover:text-gray-700"
                title="Copy formatted JSON"
              >
                {copied === 'json' ? <span className="text-emerald-500 text-[10px]">Copied!</span> : <Copy className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
          
          {errorStatus ? (
            <div className="h-[200px] sm:h-[224px] p-4 bg-rose-50 border border-rose-150 rounded-xl text-rose-700 font-mono text-xs overflow-auto flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <strong className="block font-semibold">JSON Syntax Standard Mismatch:</strong>
                <p className="mt-1">{errorStatus}</p>
              </div>
            </div>
          ) : (
            <textarea 
              readOnly
              rows={10}
              className="w-full font-mono text-xs p-4 bg-gray-950 text-emerald-400 border border-gray-900 rounded-xl focus:outline-none resize-none shadow-inner"
              value={outputJson}
              placeholder="Beautified validation results will be outputted..."
            />
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 3. ULTRA-SECURE STRONG PASSWORD GENERATOR
// -------------------------------------------------------------
function PasswordGenerator({ onCopy, copied }: { onCopy: (t: string, l: string) => void; copied: string | null }) {
  const [length, setLength] = useState<number>(18);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNums, setIncludeNums] = useState(true);
  const [includeSyms, setIncludeSyms] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [password, setPassword] = useState('');

  const generatePass = () => {
    let charset = '';
    if (includeUpper) charset += excludeSimilar ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLower) charset += excludeSimilar ? 'abcdefghijkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
    if (includeNums) charset += excludeSimilar ? '23456789' : '0123456789';
    if (includeSyms) charset += '@#$%=*?+!&';

    if (!charset) {
      setPassword('Select at least one set requirement.');
      return;
    }

    let result = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }
    setPassword(result);
  };

  useEffect(() => {
    generatePass();
  }, [length, includeUpper, includeLower, includeNums, includeSyms, excludeSimilar]);

  // Compute password entropy
  const getEntropy = () => {
    if (!password || password.startsWith('Select')) return 0;
    let poolSize = 0;
    if (includeUpper) poolSize += includeUpper ? 26 : 0;
    if (includeLower) poolSize += includeLower ? 26 : 0;
    if (includeNums) poolSize += includeNums ? 10 : 0;
    if (includeSyms) poolSize += includeSyms ? 10 : 0;
    if (poolSize === 0) return 0;
    return Math.round(length * Math.log2(poolSize));
  };

  const entropy = getEntropy();

  const getStrengthMeta = () => {
    if (entropy === 0) return { label: 'Empty', color: 'bg-gray-200 text-gray-500', width: '0%' };
    if (entropy < 50) return { label: 'Weak (Vulnerable)', color: 'bg-rose-500 text-white', width: '25%' };
    if (entropy < 75) return { label: 'Moderate Safe', color: 'bg-amber-500 text-white', width: '50%' };
    if (entropy < 100) return { label: 'Highly Secure', color: 'bg-emerald-500 text-white', width: '80%' };
    return { label: 'Military-Grade Cryptographic Force', color: 'bg-indigo-600 text-white', width: '100%' };
  };

  const strength = getStrengthMeta();

  return (
    <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl space-y-6 max-w-2xl mx-auto">
      {/* Output Panel */}
      <div className="flex items-center gap-3 bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-xs relative">
        <input 
          readOnly
          type="text" 
          className="w-full bg-transparent font-mono text-base md:text-lg text-gray-900 select-all tracking-wide focus:outline-none"
          value={password}
        />
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={generatePass}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition"
            title="Regenerate"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onCopy(password, 'pwd')}
            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition"
            title="Copy password"
          >
            {copied === 'pwd' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Strength Metrics */}
      <div className="space-y-1.5 text-left">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-gray-600">Password Entropy:</span>
          <span className="font-mono text-gray-800 font-bold">{entropy} bits ({strength.label})</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-300 ${strength.color}`} style={{ width: strength.width }}></div>
        </div>
        <div className="text-[10px] text-gray-400">
          * Cryptographically secure passwords matching federal standard entropy requirements are created completely local on your browser cache.
        </div>
      </div>

      {/* Parameters Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left border-t border-gray-100 pt-5">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Password Size Length:</label>
              <span className="text-xs font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{length}</span>
            </div>
            <input 
              type="range" 
              min={8} 
              max={64} 
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <label className="flex items-center gap-2.5 text-xs font-medium text-gray-600 cursor-pointer">
            <input 
              type="checkbox" 
              checked={excludeSimilar}
              onChange={(e) => setExcludeSimilar(e.target.checked)}
              className="rounded text-blue-500"
            />
            Exclude character conflicts <span className="text-gray-400 font-mono">(l, 1, I, o, 0, O)</span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3.5 pt-1">
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer">
            <input type="checkbox" checked={includeUpper} onChange={(e) => setIncludeUpper(e.target.checked)} className="rounded text-blue-500" />
            A-Z Characters
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer">
            <input type="checkbox" checked={includeLower} onChange={(e) => setIncludeLower(e.target.checked)} className="rounded text-blue-500" />
            a-z Characters
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer">
            <input type="checkbox" checked={includeNums} onChange={(e) => setIncludeNums(e.target.checked)} className="rounded text-blue-500" />
            0-9 Numbers
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer">
            <input type="checkbox" checked={includeSyms} onChange={(e) => setIncludeSyms(e.target.checked)} className="rounded text-blue-500" />
            Special Characters
          </label>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 4. AI SEO ASSISTANT COPILOT (leveraging Gemini on Server)
// -------------------------------------------------------------
function AICopilot({ onRunAIService, onCopy, copied }: { onRunAIService?: (s: string, p: any) => Promise<string>; onCopy: (t: string, l: string) => void; copied: string | null }) {
  const [keyword, setKeyword] = useState('how to rank on google');
  const [topic, setTopic] = useState('10 Actionable steps to optimize Core Web Vitals and leverage indexable json-ld schema markup tools.');
  const [mode, setMode] = useState<'paragraph' | 'outline' | 'metatags'>('paragraph');
  const [tone, setTone] = useState('authoritative, expert, informative');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleGenerate = async () => {
    if (!onRunAIService) {
      setErrorText('Gemini API Integration service is currently unavailable or initializing in this preview server sandbox.');
      return;
    }
    if (!topic.trim()) {
      setErrorText('Please state a target topic or context description.');
      return;
    }

    setLoading(true);
    setErrorText('');
    setResult('');

    try {
      const prompt = `Act as an Elite SEO Strategist. Generate high-ranking copy for the following request:
Category Style: ${mode === 'paragraph' ? 'High-quality SEO Blog Paragraph Builder' : mode === 'outline' ? 'A comprehensive Heading Strategy and outline map' : 'Perfect SEO Title and Meta Description markup tags'}
Primary Targeted Keyword to rank: ${keyword}
Target Audience tone: ${tone}
Topic Core Context constraints: ${topic}

Requirements: Include latent semantic indexed tags, optimize structural hierarchies, maintain deep expertise and index density without keyword stuffing. Output formatted markdown.`;

      const responseText = await onRunAIService('generate', { prompt });
      setResult(responseText);
    } catch (e: any) {
      setErrorText(e.message || 'Error occurred generating content from Gemini server. Verify GEMINI_API_KEY in Secrets.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl text-left space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
          AI Writer Prompt Parameters
        </h3>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Select Copilot Mode Model</label>
          <div className="grid grid-cols-3 gap-2 bg-gray-150 p-1 rounded-lg">
            <button 
              onClick={() => setMode('paragraph')}
              className={`text-xs py-1.5 rounded-md font-medium transition ${mode === 'paragraph' ? 'bg-white shadow-xs text-blue-600' : 'text-gray-500 hover:text-gray-950'}`}
            >
              Paragraph Web Block
            </button>
            <button 
              onClick={() => setMode('outline')}
              className={`text-xs py-1.5 rounded-md font-medium transition ${mode === 'outline' ? 'bg-white shadow-xs text-blue-600' : 'text-gray-500 hover:text-gray-950'}`}
            >
              SEO Article Outline
            </button>
            <button 
              onClick={() => setMode('metatags')}
              className={`text-xs py-1.5 rounded-md font-medium transition ${mode === 'metatags' ? 'bg-white shadow-xs text-blue-600' : 'text-gray-500 hover:text-gray-950'}`}
            >
              Optimized Meta Snippet
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Target Ranking Focus Keyword</label>
          <input 
            type="text" 
            className="w-full text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-gray-700"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Tone of Voice Guidelines</label>
          <input 
            type="text" 
            className="w-full text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Context Outline Topic & Goals</label>
          <textarea 
            rows={4}
            className="w-full text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none text-gray-700 leading-relaxed"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 font-bold hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Sourcing Gemini Generative Engine...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              Generate SEO Copy (Gemini)
            </>
          )}
        </button>
      </div>

      <div className="space-y-3 text-left flex flex-col h-full relative">
        <div className="flex justify-between items-center shrink-0">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-1">
            Generated Insights Output
          </span>
          {result && (
            <button 
              onClick={() => onCopy(result, 'aiWriter')}
              className="p-1 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-lg flex items-center gap-1"
            >
              {copied === 'aiWriter' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              Copy Markdown
            </button>
          )}
        </div>

        <div className="grow bg-white border border-gray-100 rounded-2xl p-5 shadow-xs overflow-auto flex-1 h-[300px] min-h-[300px]">
          {errorText && (
            <div className="text-rose-600 flex items-start gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Engine Refusal Error:</strong>
                <p className="mt-1">{errorText}</p>
                <p className="text-[10px] text-gray-400 mt-2">Make sure your GEMINI_API_KEY environment variable is configured in settings.</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col justify-center items-center text-gray-400 space-y-2">
              <RefreshCw className="w-7 h-7 animate-spin text-blue-500" />
              <p className="text-xs font-semibold text-gray-900">Formulating dynamic structural vocabulary copy on the fly...</p>
              <p className="text-[10px] text-gray-400">Leverages Gemini text modeling engine for optimal indexing rankings.</p>
            </div>
          )}

          {!result && !loading && !errorText && (
            <div className="h-full flex flex-col justify-center items-center text-gray-400 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-gray-300" />
              <p className="text-xs">Adjust prompt details on the left hand panel and tap execute to invoke AI core creation.</p>
            </div>
          )}

          {result && (
            <div className="prose prose-sm prose-slate text-xs text-gray-700 leading-relaxed font-sans whitespace-pre-wrap text-left">
              {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 5. RESPONSIVE MARKDOWN EDITOR & LIVE HTML PREVIEW
// -------------------------------------------------------------
function MarkdownEditor({ onCopy, copied }: { onCopy: (t: string, l: string) => void; copied: string | null }) {
  const [md, setMd] = useState(`# Ultimate Google Guide 🚀\n\nTo rank #1 on Google, write useful content and focus heavily on user intent.\n\n## Vital Check List\n- Dynamic Web Schemas\n- Sub-second performance speeds\n- Mobile flexible responsive alignments\n\n### Code Sample Example\n\`\`\`json\n{\n  "@context": "https://schema.org",\n  "@type": "WebApplication"\n}\n\`\`\`\n\nLearn more at [Vntera Tools](${window.location.origin})`);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  // Simple, regex markdown parser to HTML to avoid heavy node module requirements
  const parseMarkdown = (markdown: string) => {
    let html = markdown
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Code blocks
    html = html.replace(/\`\`\`(.*?)\n([\s\S]*?)\`\`\`/g, '<pre class="bg-gray-900 text-emerald-400 p-4 rounded-lg my-2 font-mono text-xs overflow-x-auto">$2</pre>');
    // Inline code
    html = html.replace(/\`(.*?)\`/g, '<code class="bg-gray-100 text-rose-600 px-1 py-0.5 rounded font-mono text-xs">$1</code>');
    // Headings
    html = html.replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold text-gray-900 border-b border-gray-150 pb-2 mb-3 mt-4">$1</h1>');
    html = html.replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold text-gray-900 mb-2 mt-4">$1</h2>');
    html = html.replace(/^### (.*?)$/gm, '<h3 class="text-lg font-bold text-gray-900 mb-2 mt-3">$1</h3>');
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Lists
    html = html.replace(/^[-\*] (.*?)$/gm, '<li class="ml-4 list-disc text-gray-700">$1</li>');
    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-blue-600 hover:underline">$1</a>');
    // Paragraphs (split by double lines)
    html = html.split(/\n\n+/).map(p => {
      if (p.trim().startsWith('<h') || p.trim().startsWith('<pre') || p.trim().startsWith('<li') || p.trim().startsWith('<a')) {
        return p;
      }
      return `<p class="text-xs text-gray-700 leading-relaxed mb-3">${p.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');

    return html;
  };

  const mdHtml = parseMarkdown(md);

  return (
    <div className="space-y-4">
      {/* Tab controls on small devices */}
      <div className="flex justify-between items-center border-b border-gray-150 pb-3">
        <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs font-semibold">
          <button 
            onClick={() => setActiveTab('editor')} 
            className={`px-3 py-1 rounded-md ${activeTab === 'editor' ? 'bg-white shadow-xs text-blue-600' : 'text-gray-500'}`}
          >
            Markdown Writer
          </button>
          <button 
            onClick={() => setActiveTab('preview')} 
            className={`px-3 py-1 rounded-md ${activeTab === 'preview' ? 'bg-white shadow-xs text-blue-600' : 'text-gray-500'}`}
          >
            Rich HTML Live Render
          </button>
        </div>
        <button 
          onClick={() => onCopy(mdHtml, 'mdHtml')}
          className="text-xs text-blue-600 hover:underline cursor-pointer"
        >
          {copied === 'mdHtml' ? 'Formatted HTML Copied!' : 'Copy Clean HTML Markup'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor Area */}
        <div className={`text-left ${activeTab === 'editor' ? 'block' : 'hidden lg:block'}`}>
          <textarea 
            rows={12}
            className="w-full font-mono text-xs p-4 bg-gray-50 border border-gray-250 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
            value={md}
            onChange={(e) => setMd(e.target.value)}
          />
        </div>

        {/* Preview Panel */}
        <div className={`bg-white border border-gray-100 rounded-xl p-5 shadow-xs text-left overflow-auto scrollbar-thin h-[264px] ${activeTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
          <div dangerouslySetInnerHTML={{ __html: mdHtml }} />
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 6. INSTANT BASE64 TEXT/FILE ENCODER & DECODER
// -------------------------------------------------------------
function Base64Encoder({ onCopy, copied }: { onCopy: (t: string, l: string) => void; copied: string | null }) {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('Vntera Tools - Free Web Tools, Converters & Developer Utilities catalog by Vntera (founder: vntera.com).');
  const [output, setOutput] = useState('');
  const [fileMode, setFileMode] = useState(false);

  const runConvert = () => {
    try {
      if (mode === 'encode') {
        setOutput(btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16)))));
      } else {
        setOutput(decodeURIComponent(atob(input).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
      }
    } catch {
      setOutput('Error: Payload data does not match standard Base64 encoding parameters.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const stringResult = reader.result as string;
      setInput(stringResult.split(',')[1] || stringResult);
      setMode('decode'); // Switch to decoding preview option
    };
    reader.readAsDataURL(file);
    setFileMode(true);
  };

  useEffect(() => {
    if (!fileMode) {
      runConvert();
    }
  }, [input, mode, fileMode]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs font-semibold">
          <button onClick={() => { setMode('encode'); setFileMode(false); }} className={`px-3 py-1 rounded-md ${mode === 'encode' ? 'bg-white shadow-xs text-blue-600' : 'text-gray-500'}`}>Encode Sequence</button>
          <button onClick={() => { setMode('decode'); setFileMode(false); }} className={`px-3 py-1 rounded-md ${mode === 'decode' ? 'bg-white shadow-xs text-blue-600' : 'text-gray-500'}`}>Decode Sequence</button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <label className="font-semibold text-gray-600">Local File Upload:</label>
          <input 
            type="file" 
            onChange={handleFileUpload}
            className="text-[10px] text-gray-500 border border-gray-200 px-2 py-1 rounded-lg bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="text-left space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Input Raw Value</span>
          <textarea 
            rows={6}
            className="w-full font-mono text-xs p-4 bg-gray-5"
            style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px' }}
            value={input}
            onChange={(e) => { setInput(e.target.value); setFileMode(false); }}
            placeholder={mode === 'encode' ? 'Enter raw text strings here...' : 'Paste Base64 code text here...'}
          />
        </div>

        <div className="text-left space-y-1 relative">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Base64 Output Result</span>
            {output && (
              <button onClick={() => onCopy(output, 'b64')} className="text-gray-400 hover:text-gray-600">
                {copied === 'b64' ? <span className="text-emerald-500 text-[10px]">Copied!</span> : <Copy className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
          <textarea 
            readOnly
            rows={6}
            className="w-full font-mono text-xs p-4 bg-gray-900 text-amber-400 border border-gray-900 rounded-xl focus:outline-none resize-none shadow-inner"
            value={output}
            placeholder="..."
          />
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 7. CUSTOM QR CODE BUILDER using standard API matrix render
// -------------------------------------------------------------
function QRGenerator({ onCopy, copied }: { onCopy: (t: string, l: string) => void; copied: string | null }) {
  const [data, setData] = useState('https://example.com/blog');
  const [size, setSize] = useState<number>(250);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Instead of an unstable local QR algorithm block, we draw an beautifully aligned grid using canvas and an API bridge, 
  // loading the QR into local canvas so the user can download instantly and customize foreground colors and backgrounds on their Canvas!
  const buildQrCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const encodedData = encodeURIComponent(data);
    const cleanedFg = fgColor.substring(1);
    const cleanedBg = bgColor.substring(1);
    
    // Call reliable chart API and load into standard Canvas so clients retain 100% download flexibility local
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&color=${cleanedFg}&bgcolor=${cleanedBg}&data=${encodedData}`;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
    };
    img.src = qrUrl;
  };

  useEffect(() => {
    buildQrCanvas();
  }, [data, size, fgColor, bgColor]);

  const handleDownloadQr = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `vntera-tools-qrcode-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center max-w-2xl mx-auto bg-gray-50 border border-gray-100 p-6 rounded-2xl text-left">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">QR Parameters</h3>
        
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">QR Embed URL / Value Content</label>
          <input 
            type="text" 
            className="w-full text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium font-sans text-gray-750"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Foreground Color</label>
            <div className="flex gap-2">
              <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-7 h-7 bg-transparent cursor-pointer rounded overflow-hidden" />
              <input type="text" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full text-xs font-mono border border-gray-200 rounded px-1.5 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Background Color</label>
            <div className="flex gap-2">
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-7 h-7 bg-transparent cursor-pointer rounded overflow-hidden" />
              <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full text-xs font-mono border border-gray-200 rounded px-1.5 focus:outline-none" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Size Matrix Dimensions: {size}px</label>
          <input 
            type="range" 
            min={150} 
            max={400} 
            value={size} 
            onChange={(e) => setSize(Number(e.target.value))} 
            className="w-full"
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4 bg-white p-5 border border-gray-200 rounded-xl shadow-xs">
        <div style={{ width: size, height: size, maxWidth: '100%' }} className="aspect-square flex justify-center items-center border border-gray-50 p-2.5 bg-white shadow-inner rounded-xl">
          <canvas ref={canvasRef} width={size} height={size} className="w-full h-full" />
        </div>
        <button 
          onClick={handleDownloadQr}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 font-semibold text-white text-xs rounded-xl flex items-center gap-1 shadow-md shadow-blue-500/10 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" /> Download QR (PNG)
        </button>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 8. COLOR HARMONIES & WCAG CONTRAST CHECKER
// -------------------------------------------------------------
function ColorPaletteContrast({ onCopy, copied }: { onCopy: (t: string, l: string) => void; copied: string | null }) {
  const [bgHex, setBgHex] = useState('#ffffff');
  const [fgHex, setFgHex] = useState('#2563eb');

  const hexToRgb = (hex: string) => {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  };

  const calculateLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const getContrastRatio = () => {
    try {
      const rgb1 = hexToRgb(bgHex);
      const rgb2 = hexToRgb(fgHex);
      const l1 = calculateLuminance(rgb1.r, rgb1.g, rgb1.b);
      const l2 = calculateLuminance(rgb2.r, rgb2.g, rgb2.b);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return +( (lighter + 0.05) / (darker + 0.05) ).toFixed(2);
    } catch {
      return 1;
    }
  };

  const contrast = getContrastRatio();

  const getResults = () => {
    return {
      aaNormal: contrast >= 4.5 ? 'PASS' : 'FAIL',
      aaLarge: contrast >= 3.0 ? 'PASS' : 'FAIL',
      aaaNormal: contrast >= 7.0 ? 'PASS' : 'FAIL',
      aaaLarge: contrast >= 4.5 ? 'PASS' : 'FAIL',
    };
  };

  const result = getResults();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
      {/* Parameters Controls */}
      <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Color Controls</h3>
        
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Canvas Background color</label>
          <div className="flex gap-2">
            <input type="color" value={bgHex} onChange={(e) => setBgHex(e.target.value)} className="w-10 h-10 cursor-pointer border border-transparent rounded overflow-hidden" />
            <input type="text" value={bgHex} onChange={(e) => setBgHex(e.target.value)} className="w-full border border-gray-250 px-3 py-1.5 rounded-lg bg-white focus:outline-none font-mono text-xs" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Text Foreground Color</label>
          <div className="flex gap-2">
            <input type="color" value={fgHex} onChange={(e) => setFgHex(e.target.value)} className="w-10 h-10 cursor-pointer border border-transparent rounded overflow-hidden" />
            <input type="text" value={fgHex} onChange={(e) => setFgHex(e.target.value)} className="w-full border border-gray-250 px-3 py-1.5 rounded-lg bg-white focus:outline-none font-mono text-xs" />
          </div>
        </div>

        {/* Live preview Box */}
        <div style={{ backgroundColor: bgHex, color: fgHex }} className="p-6 rounded-xl text-center border border-gray-250 transition-all font-sans">
          <h4 className="font-bold text-base md:text-lg mb-1">Visual Preview Heading</h4>
          <p className="text-xs">This matches standard text alignments. WCAG AA requires 4.5:1 ratio contrast levels.</p>
        </div>
      </div>

      {/* WCAG Grader */}
      <div className="space-y-4 bg-white border border-gray-100 p-5 rounded-2xl shadow-xs">
        <h3 className="text-sm font-semibold text-gray-900 flex justify-between items-center">
          <span>Contrast Audit Result</span>
          <span className="font-mono text-base font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
            {contrast} : 1
          </span>
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 border border-gray-100 rounded-xl space-y-1">
            <span className="text-[10px] text-gray-500 font-semibold uppercase">WCAG AA Normal Text</span>
            <div className={`text-sm font-bold ${result.aaNormal === 'PASS' ? 'text-emerald-600' : 'text-rose-500'}`}>
              {result.aaNormal} (Min 4.5)
            </div>
          </div>

          <div className="p-3 border border-gray-100 rounded-xl space-y-1">
            <span className="text-[10px] text-gray-500 font-semibold uppercase">WCAG AA Large Text</span>
            <div className={`text-sm font-bold ${result.aaLarge === 'PASS' ? 'text-emerald-600' : 'text-rose-500'}`}>
              {result.aaLarge} (Min 3.0)
            </div>
          </div>

          <div className="p-3 border border-gray-100 rounded-xl space-y-1">
            <span className="text-[10px] text-gray-500 font-semibold uppercase">WCAG AAA Normal Text</span>
            <div className={`text-sm font-bold ${result.aaaNormal === 'PASS' ? 'text-emerald-600' : 'text-rose-500'}`}>
              {result.aaaNormal} (Min 7.0)
            </div>
          </div>

          <div className="p-3 border border-gray-100 rounded-xl space-y-1">
            <span className="text-[10px] text-gray-500 font-semibold uppercase">WCAG AAA Large Text</span>
            <div className={`text-sm font-bold ${result.aaaLarge === 'PASS' ? 'text-emerald-600' : 'text-rose-500'}`}>
              {result.aaaLarge} (Min 4.5)
            </div>
          </div>
        </div>

        <p className="text-[10px] text-gray-400 leading-relaxed">
          * Passing contrast thresholds establishes web accessibility compliance, ensuring search engines index high accessibility grades (WCAG 2.1).
        </p>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 9. METRIC / DIMENSION UNIT CONVERTER
// -------------------------------------------------------------
function UnitConverter() {
  const [metric, setMetric] = useState<'length' | 'weight' | 'temp' | 'storage'>('length');
  const [val, setVal] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('miles');
  const [result, setResult] = useState<number>(0);

  const unitsMap = {
    length: {
      meters: 1,
      kilometers: 1000,
      miles: 1609.34,
      yards: 0.9144,
      feet: 0.3048,
      inches: 0.0254
    },
    weight: {
      kilograms: 1,
      grams: 0.001,
      pounds: 0.453592,
      ounces: 0.0283495
    },
    storage: {
      bytes: 1,
      kilobyte: 1024,
      megabyte: 1024 * 1024,
      gigabyte: 1024 * 1024 * 1024,
      terabyte: 1024 * 1024 * 1024 * 1024
    }
  };

  const handleConvert = () => {
    if (metric === 'temp') {
      if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
        setResult((val * 9/5) + 32);
      } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
        setResult((val - 32) * 5/9);
      } else if (fromUnit === 'celsius' && toUnit === 'kelvin') {
        setResult(val + 273.15);
      } else if (fromUnit === 'kelvin' && toUnit === 'celsius') {
        setResult(val - 273.15);
      } else {
        setResult(val);
      }
      return;
    }

    const map = unitsMap[metric];
    const baseVal = val * map[fromUnit as keyof typeof map];
    const converted = baseVal / map[toUnit as keyof typeof map];
    setResult(+converted.toFixed(6));
  };

  useEffect(() => {
    // Reset standard units on change
    if (metric === 'length') {
      setFromUnit('meters');
      setToUnit('miles');
    } else if (metric === 'weight') {
      setFromUnit('kilograms');
      setToUnit('pounds');
    } else if (metric === 'temp') {
      setFromUnit('celsius');
      setToUnit('fahrenheit');
    } else if (metric === 'storage') {
      setFromUnit('megabyte');
      setToUnit('gigabyte');
    }
  }, [metric]);

  useEffect(() => {
    handleConvert();
  }, [val, fromUnit, toUnit, metric]);

  return (
    <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl space-y-6 max-w-2xl mx-auto text-left">
      <div className="flex bg-gray-150 p-1 rounded-lg text-xs font-semibold">
        {(['length', 'weight', 'temp', 'storage'] as const).map((m) => (
          <button 
            key={m}
            onClick={() => setMetric(m)} 
            className={`w-full py-1.5 capitalize rounded-md transition ${metric === m ? 'bg-white shadow-xs text-blue-600' : 'text-gray-500'}`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* From Section */}
        <div className="p-4 bg-white border border-gray-150 rounded-xl space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">From</label>
          <div className="flex gap-2">
            <input 
              type="number" 
              value={val}
              onChange={(e) => setVal(Number(e.target.value))}
              className="w-full text-sm font-semibold border-b border-gray-150 focus:outline-none focus:border-blue-500"
            />
            <select 
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="border border-transparent text-xs bg-gray-50 px-2 py-1 rounded"
            >
              {metric !== 'temp' ? Object.keys(unitsMap[metric]).map((u) => (
                <option key={u} value={u}>{u}</option>
              )) : (
                <>
                  <option value="celsius">Celsius</option>
                  <option value="fahrenheit">Fahrenheit</option>
                  <option value="kelvin">Kelvin</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* To Section */}
        <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Converted To</label>
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-900 font-mono py-1 truncate">
              {result}
            </span>
            <select 
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="border border-transparent text-xs bg-gray-50 px-2 py-1 rounded"
            >
              {metric !== 'temp' ? Object.keys(unitsMap[metric]).map((u) => (
                <option key={u} value={u}>{u}</option>
              )) : (
                <>
                  <option value="celsius">Celsius</option>
                  <option value="fahrenheit">Fahrenheit</option>
                  <option value="kelvin">Kelvin</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 10. COMPREHENSIVE MORTGAGE & LOAN CALCULATOR
// -------------------------------------------------------------
function LoanCalculator({ onCopy, copied }: { onCopy: (t: string, l: string) => void; copied: string | null }) {
  const [loan, setLoan] = useState<number>(300000);
  const [rate, setRate] = useState<number>(6.5);
  const [term, setTerm] = useState<number>(30); // years
  const [extra, setExtra] = useState<number>(100); // monthly prepayment

  const computeAmortization = () => {
    const P = loan;
    const monthlyRate = (rate / 100) / 12;
    const numPayments = term * 12;

    // Monthly compound payment formula
    const payment = P * ( (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1) );
    
    let balance = P;
    const schedule = [];
    let totalInterest = 0;

    for (let m = 1; m <= numPayments; m++) {
      if (balance <= 0) break;
      const iPayment = balance * monthlyRate;
      let pPayment = payment - iPayment;
      
      // Add prepayment
      pPayment += extra;

      if (balance - pPayment < 0) {
        pPayment = balance;
      }
      
      balance -= pPayment;
      totalInterest += iPayment;

      if (m % 12 === 0 || balance === 0) {
        schedule.push({
          year: Math.ceil(m / 12),
          payment: +(pPayment + iPayment).toFixed(2),
          principal: +pPayment.toFixed(2),
          interest: +iPayment.toFixed(2),
          balance: +balance.toFixed(2)
        });
      }
    }

    return {
      monthly: +payment.toFixed(2),
      totalCost: +(P + totalInterest).toFixed(2),
      totalInterest: +totalInterest.toFixed(2),
      schedule
    };
  };

  const results = computeAmortization();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
      <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl space-y-4">
        <h3 className="text-sm font-semibold text-gray-950">Loan Configuration</h3>
        
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Loan Principal Amount: ${loan.toLocaleString()}</label>
          <input type="range" min={10000} max={1000000} step={5000} value={loan} onChange={(e) => setLoan(Number(e.target.value))} className="w-full" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 mb-1">Rate (%)</label>
            <input type="number" step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full border border-gray-200 px-2 py-1 bg-white rounded-lg focus:outline-none text-xs text-gray-900 font-semibold" />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 mb-1">Term (Years)</label>
            <input type="number" value={term} onChange={(e) => setTerm(Number(e.target.value))} className="w-full border border-gray-200 px-2 py-1 bg-white rounded-lg focus:outline-none text-xs text-gray-900 font-semibold" />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 mb-1">Extra Prepay</label>
            <input type="number" value={extra} onChange={(e) => setExtra(Number(e.target.value))} className="w-full border border-gray-200 px-2 py-1 bg-white rounded-lg focus:outline-none text-xs text-gray-900 font-semibold" />
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <span className="text-[10px] font-bold text-blue-600 block uppercase tracking-widest">Estimated Minimum Monthly Payment</span>
          <strong className="text-xl md:text-2xl text-blue-900 font-sans">${results.monthly} <span className="text-xs font-normal">/ month</span></strong>
        </div>
      </div>

      <div className="space-y-4">
        {/* Core calculations summary */}
        <div className="grid grid-cols-2 gap-4 bg-white p-4 border border-gray-100 rounded-xl shadow-xs">
          <div>
            <span className="text-[10px] font-semibold text-gray-500 uppercase">Total Interest Cost</span>
            <div className="text-base font-bold text-gray-900">${results.totalInterest.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-gray-500 uppercase">Loan Total Cost</span>
            <div className="text-base font-bold text-gray-900">${results.totalCost.toLocaleString()}</div>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-500 uppercase">Annual Amortization Table</span>
          </div>
          <div className="max-h-[140px] overflow-y-auto font-mono text-[10px]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100 text-gray-500">
                  <th className="px-3 py-1.5">Yr</th>
                  <th className="px-3 py-1.5">Principal</th>
                  <th className="px-3 py-1.5">Interest</th>
                  <th className="px-3 py-1.5">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {results.schedule.map((row) => (
                  <tr key={row.year} className="hover:bg-gray-50">
                    <td className="px-3 py-1 font-bold text-gray-700">{row.year}</td>
                    <td className="px-3 py-1 text-gray-600">${row.principal.toLocaleString()}</td>
                    <td className="px-3 py-1 text-gray-650">${row.interest.toLocaleString()}</td>
                    <td className="px-3 py-1 text-gray-800 font-semibold">${row.balance.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 11. DIFF CHECKER (TEXT COMPARE TOOL)
// -------------------------------------------------------------
function DiffChecker() {
  const [original, setOriginal] = useState('Google values fast page loads.\nSEO is about user intent and schema structure.\nOptimized components make users happy.');
  const [modified, setModified] = useState('Google prioritizing fast page load times.\nSEO is completely about user intent and JSON-LD schema structure.\nOptimized components render fast.');
  const [diffMode, setDiffMode] = useState<'line' | 'word'>('line');

  // Basic LCS line comparing sequence
  const computeDiff = () => {
    const lines1 = original.split('\n');
    const lines2 = modified.split('\n');
    const matches: { type: 'normal' | 'add' | 'remove'; text: string }[] = [];

    // Simple line matching logic
    let i = 0;
    let j = 0;
    while (i < lines1.length || j < lines2.length) {
      if (i < lines1.length && j < lines2.length && lines1[i] === lines2[j]) {
        matches.push({ type: 'normal', text: lines1[i] });
        i++;
        j++;
      } else if (j < lines2.length && (i >= lines1.length || !lines1.slice(i).includes(lines2[j])) ) {
        matches.push({ type: 'add', text: lines2[j] });
        j++;
      } else {
        matches.push({ type: 'remove', text: lines1[i] });
        i++;
      }
    }
    return matches;
  };

  const diffResult = computeDiff();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source original */}
        <div className="text-left space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Original Reference Copy (Left)</span>
          <textarea rows={4} className="w-full text-xs font-mono p-3 bg-gray-50 border border-gray-250 rounded-xl" value={original} onChange={(e) => setOriginal(e.target.value)} />
        </div>
        {/* Source modified */}
        <div className="text-left space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Modified Reference Copy (Right)</span>
          <textarea rows={4} className="w-full text-xs font-mono p-3 bg-gray-50 border border-gray-250 rounded-xl" value={modified} onChange={(e) => setModified(e.target.value)} />
        </div>
      </div>

      {/* Compiled diff previewer panel */}
      <div className="bg-gray-950 border border-gray-900 rounded-xl p-5 text-left font-mono text-[11px] space-y-1 overflow-x-auto shadow-inner text-gray-100">
        {diffResult.map((el, i) => {
          if (el.type === 'add') {
            return <div key={i} className="bg-emerald-950/60 border-l-4 border-emerald-500 text-emerald-400 px-3 py-1 font-semibold">+ {el.text}</div>;
          }
          if (el.type === 'remove') {
            return <div key={i} className="bg-rose-950/60 border-l-4 border-rose-500 text-rose-400 px-3 py-1 line-through">- {el.text}</div>;
          }
          return <div key={i} className="text-gray-400 px-3 py-0.5">  {el.text}</div>;
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 12. CRYPTOGRAPHIC HASH GENERATOR (SUBTLE API INTEGRATED)
// -------------------------------------------------------------
function HashGenerator({ onCopy, copied }: { onCopy: (t: string, l: string) => void; copied: string | null }) {
  const [text, setText] = useState('Vntera Tools SEO Framework');
  const [algo, setAlgo] = useState<'SHA-256' | 'SHA-512' | 'SHA-1'>('SHA-256');
  const [hash, setHash] = useState('');

  const generateHashes = async () => {
    if (!text) {
      setHash('');
      return;
    }
    try {
      const msgUint8 = new TextEncoder().encode(text);
      const hashBuffer = await window.crypto.subtle.digest(algo, msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setHash(hashHex);
    } catch {
      setHash('Error executing local subtle encryption algorithms.');
    }
  };

  useEffect(() => {
    generateHashes();
  }, [text, algo]);

  return (
    <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl space-y-4 max-w-xl mx-auto text-left">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-gray-700">Select Cryptographic Hash Standard:</label>
        <select value={algo} onChange={(e) => setAlgo(e.target.value as any)} className="border border-gray-250 bg-white rounded-md text-xs px-2 py-1 focus:outline-none">
          <option value="SHA-256">SHA-256 Checksum</option>
          <option value="SHA-512">SHA-512 Checksum</option>
          <option value="SHA-1">SHA-1 Legacy</option>
        </select>
      </div>

      <input 
        type="text" 
        className="w-full text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter plain text sequences here..."
      />

      <div className="relative p-4 bg-gray-900 text-amber-400 rounded-xl font-mono text-xs select-all text-left overflow-x-auto shadow-md">
        <button 
          onClick={() => onCopy(hash, 'hash')} 
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          {copied === 'hash' ? <span className="text-emerald-500 text-[10px]">Copied!</span> : <Copy className="w-3.5 h-3.5" />}
        </button>
        <span className="block text-[8px] text-gray-500 uppercase shrink mb-1 select-none">Hashed Digest Result</span>
        <pre className="whitespace-pre-wrap">{hash || 'Empty Input'}</pre>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 13. WORD COUNTER & READABILITY GRADIENT
// -------------------------------------------------------------
function WordCounter({ onCopy, copied }: { onCopy: (t: string, l: string) => void; copied: string | null }) {
  const [content, setContent] = useState('Google SEO algorithm guidelines heavily prioritize readability, page structure and original content. Ensure subheadings (H2, H3) logically divide complex instructions. When utilizing tools online, maintain sub-second visual speeds to satisfy Core Web Vitals standard protocols to index securely.');

  const getStats = () => {
    const text = content.trim();
    if (!text) return { words: 0, chars: 0, spaces: 0, readTime: 0, grade: 'N/A' };

    const words = text.split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    const spaces = (text.match(/\s/g) || []).length;
    
    // Simple syllables estimator
    const syllables = (text.match(/[aeiouy]{1,2}/gi) || []).length;
    const sentences = (text.match(/[.!?]+/g) || []).length || 1;

    // Flesch-Kincaid ease formula: 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
    let ease = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    ease = Math.max(0, Math.min(100, ease));

    const getResLabel = (score: number) => {
      if (score > 80) return 'Easy Reading (5th Grade)';
      if (score > 60) return 'Conversational (7th Grade)';
      if (score > 45) return 'Academic Study (Highschool)';
      return 'Complex / Technical Documentation';
    };

    return {
      words,
      chars,
      spaces,
      readTime: Math.ceil(words / 225), // 225 WPM avg
      grade: getResLabel(ease)
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-4 text-left">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl">
          <span className="text-[10px] text-gray-500 block font-bold uppercase tracking-wider">Words Tally</span>
          <strong className="text-lg text-gray-900 font-mono">{stats.words}</strong>
        </div>

        <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl">
          <span className="text-[10px] text-gray-500 block font-bold uppercase tracking-wider">Characters</span>
          <strong className="text-lg text-gray-900 font-mono">{stats.chars}</strong>
        </div>

        <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl">
          <span className="text-[10px] text-gray-500 block font-bold uppercase tracking-wider">Silently Read Time</span>
          <strong className="text-lg text-gray-900 font-mono">~{stats.readTime} min</strong>
        </div>

        <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl">
          <span className="text-[10px] text-gray-500 block font-bold uppercase tracking-wider">Readability Grade</span>
          <strong className="text-xs text-blue-600 block pt-0.5 truncate">{stats.grade}</strong>
        </div>
      </div>

      <textarea 
        rows={6}
        className="w-full text-xs p-4 bg-white border border-gray-250 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed font-sans"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Draft your blog posts or copywriting copy here to analyze keyword weight metrics dynamically."
      />
    </div>
  );
}

// -------------------------------------------------------------
// 14. URL ENCODER & DECODER WITH INDENTED SPLITER
// -------------------------------------------------------------
function URLEncoder({ onCopy, copied }: { onCopy: (t: string, l: string) => void; copied: string | null }) {
  const [val, setVal] = useState('https://google.com/search?q=seo+experts+vntera&client=chrome&target=tools.vntera.com');
  const [result, setResult] = useState('');

  const processUrl = (mode: 'encode' | 'decode') => {
    try {
      if (mode === 'encode') {
        setResult(encodeURIComponent(val));
      } else {
        setResult(decodeURIComponent(val));
      }
    } catch {
      setResult('Error parsing URL queries.');
    }
  };

  useEffect(() => {
    processUrl('encode'); // default
  }, [val]);

  return (
    <div className="space-y-4 max-w-xl mx-auto text-left">
      <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs font-semibold">
        <button onClick={() => processUrl('encode')} className="w-full py-1.5 rounded-md text-gray-700 hover:text-black hover:bg-white/40">Convert Percent Encode</button>
        <button onClick={() => processUrl('decode')} className="w-full py-1.5 rounded-md text-gray-700 hover:text-black hover:bg-white/40">Convert Percent Decode</button>
      </div>

      <input 
        type="text" 
        className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
        value={val}
        onChange={(e) => setVal(e.target.value)}
      />

      <div className="relative p-4 bg-gray-900 border border-gray-900 rounded-xl text-emerald-450 text-xs font-mono select-all overflow-x-auto shadow-inner text-emerald-400">
        <button onClick={() => onCopy(result, 'url')} className="absolute top-2 right-2 text-gray-400">
          {copied === 'url' ? <span className="text-emerald-500 text-[10px]">Copied!</span> : <Copy className="w-3.5 h-3.5" />}
        </button>
        <pre className="whitespace-pre-wrap">{result || 'Empty'}</pre>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 15. ROBOTS.TXT GENERATOR & SITEMAP XML
// -------------------------------------------------------------
function RobotsTxtGenerator({ onCopy, copied }: { onCopy: (t: string, l: string) => void; copied: string | null }) {
  const [sitemap, setSitemap] = useState('https://tools.vntera.com/sitemap.xml');
  const [disallowAdmin, setDisallowAdmin] = useState(true);
  const [disallowCarts, setDisallowCarts] = useState(true);
  const [crawlDelay, setCrawlDelay] = useState<string>('none');

  const getRobotsTxt = () => {
    let text = `# Robots.txt file generated dynamically by Vntera Tools\nUser-agent: *\n`;
    if (disallowAdmin) text += `Disallow: /admin/\nDisallow: /dashboard/\n`;
    if (disallowCarts) text += `Disallow: /checkout/\nDisallow: /cart/\nDisallow: /api/\n`;
    if (crawlDelay !== 'none') text += `Crawl-delay: ${crawlDelay}\n`;
    text += `Sitemap: ${sitemap || `${window.location.origin}/sitemap.xml`}`;
    return text;
  };

  const handleDownload = () => {
    const text = getRobotsTxt();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'robots.txt';
    link.href = url;
    link.click();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
      <div className="bg-gray-50 border border-gray-100 p-5 rounded-xl space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Robots Optimization Settings</h3>
        
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Target Sitemap URL Address</label>
          <input 
            type="text" 
            className="w-full text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none"
            value={sitemap}
            onChange={(e) => setSitemap(e.target.value)}
          />
        </div>

        <div className="space-y-2 pt-1 font-sans">
          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
            <input type="checkbox" checked={disallowAdmin} onChange={(e) => setDisallowAdmin(e.target.checked)} className="rounded text-blue-500" />
            Disallow dashboard search pathways <span className="text-gray-400">(/admin/, /dashboard/)</span>
          </label>

          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
            <input type="checkbox" checked={disallowCarts} onChange={(e) => setDisallowCarts(e.target.checked)} className="rounded text-blue-500" />
            Disallow transactional layouts <span className="text-gray-400">(/cart/, /checkout/, /api/)</span>
          </label>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Crawl Delay Selector</label>
          <select value={crawlDelay} onChange={(e) => setCrawlDelay(e.target.value)} className="border border-gray-200 bg-white text-xs px-2 py-1.5 rounded-lg focus:outline-none">
            <option value="none">No Delay (Highly Fast Indexes)</option>
            <option value="1">1 Second Limit</option>
            <option value="2">2 Second Limit</option>
            <option value="5">5 Second Limit (Protects DB loads)</option>
          </select>
        </div>
      </div>

      <div className="space-y-3 relative">
        <div className="flex justify-between items-center bg-gray-100 p-2 font-mono text-[10px] rounded-lg">
          <span>LIVE OUT: robots.txt file code</span>
          <button 
            onClick={() => onCopy(getRobotsTxt(), 'robots')}
            className="text-blue-600 font-bold hover:underline"
          >
            {copied === 'robots' ? 'Copied' : 'Copy'}
          </button>
        </div>

        <textarea 
          readOnly
          rows={6}
          className="w-full font-mono text-xs p-4 bg-gray-950 text-emerald-400 border border-gray-900 rounded-xl focus:outline-none resize-none shadow-md shadow-emerald-500/5 leading-relaxed"
          value={getRobotsTxt()}
        />

        <button 
          onClick={handleDownload}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition"
        >
          Download robots.txt file
        </button>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 16. AI SEO ON-PAGE CONTENT ANALYZER
// -------------------------------------------------------------
function AISEOAnalyzer({ onRunAIService, onCopy, copied }: { onRunAIService?: (s: string, p: any) => Promise<string>; onCopy: (t: string, l: string) => void; copied: string | null }) {
  const [focusKeyword, setFocusKeyword] = useState('ranking techniques');
  const [content, setContent] = useState('By utilizing high prestige SEO ranking techniques, digital authors can align their blogs with Google intent indexes. Structured headings serve to guide organic users and increase reading sessions.');
  const [aiReport, setAiReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Local Keyword Density Calculation
  const calculateDensity = () => {
    if (!content.trim() || !focusKeyword.trim()) return 0;
    const bodyWords = content.toLowerCase().split(/\s+/).filter(Boolean);
    const key = focusKeyword.toLowerCase().trim();
    
    let occurrences = 0;
    bodyWords.forEach(w => {
      if (w.includes(key)) occurrences++;
    });

    return bodyWords.length > 0 ? +((occurrences / bodyWords.length) * 100).toFixed(2) : 0;
  };

  const density = calculateDensity();

  const handleRunAudit = async () => {
    if (!onRunAIService) {
      setErrorText('Gemini API Integration service is currently unavailable or initializing in this preview sandbox.');
      return;
    }
    if (!content.trim()) {
      setErrorText('Please load some content elements first to analyze.');
      return;
    }

    setLoading(true);
    setAiReport('');
    setErrorText('');

    try {
      const prompt = `Act as an Elite Page Auditor and Web SEO Specialist. Analyze this draft content for focus SEO metrics:
Focus targeted keyword to index: ${focusKeyword}
Draft Text: ${content}

Please provide:
1. Heading visual optimizations suggestion (specific replacements for headings).
2. Word index weights, and semantically adjacent LSI synonyms matching user intent.
3. Suggest an eye-catching meta description based on this text.
4. Output structured recommendation card in clean markdown.`;

      const res = await onRunAIService('generate', { prompt });
      setAiReport(res);
    } catch (e: any) {
      setErrorText(e.message || 'Error occurred querying Gemini server API proxy.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Target Index Keyword Tag</label>
          <input 
            type="text" 
            className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-250 rounded-lg focus:outline-none"
            value={focusKeyword}
            onChange={(e) => setFocusKeyword(e.target.value)}
          />
        </div>
        
        <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl flex justify-between items-center text-xs">
          <div>
            <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-widest">Calculated Keyword Density</span>
            <span className={`text-base font-bold font-mono ${density > 0.5 && density < 3.0 ? 'text-emerald-600' : 'text-amber-500'}`}>
              {density}% 
            </span>
          </div>
          <span className="text-[10px] text-gray-400 max-w-xs text-right leading-tight">
            * Recommended density stands at 1% to 2.5% to trigger positive organic web crawl weights.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-2">
        {/* On page copy inputs */}
        <div className="space-y-3 flex flex-col h-full">
          <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Draft Web Article Content</span>
          <textarea 
            rows={10}
            className="w-full font-sans text-xs p-4 bg-white border border-gray-200 rounded-xl focus:outline-none resize-none flex-1 leading-relaxed"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button 
            onClick={handleRunAudit}
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 font-bold hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl text-xs flex justify-center items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {loading ? 'Sourcing Gemini Audit Models...' : 'Run Generative AI SEO Audit'}
          </button>
        </div>

        {/* Gemini Audit Results output */}
        <div className="bg-gray-900 text-gray-100 p-5 rounded-2xl relative min-h-[250px] overflow-auto flex flex-col shadow-lg">
          <div className="flex justify-between items-center shrink-0 border-b border-gray-850 pb-2 mb-3">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Strategic AI SEO Audit Insights</span>
            {aiReport && (
              <button onClick={() => onCopy(aiReport, 'report')} className="p-1 px-2.5 bg-gray-800 rounded text-xs text-white">
                {copied === 'report' ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>

          <div className="flex-1 overflow-auto text-left text-xs text-gray-300 leading-relaxed font-sans scrollbar-thin">
            {loading && (
              <div className="h-full flex flex-col justify-center items-center text-gray-500 space-y-1">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                <p className="text-xs text-gray-400">Assembling comprehensive content semantic mapping metrics...</p>
              </div>
            )}

            {errorText && (
              <div className="text-rose-400 text-xs">
                <strong>Gemini Audit Refusal:</strong>
                <p className="mt-1">{errorText}</p>
              </div>
            )}

            {!aiReport && !loading && !errorText && (
              <p className="text-gray-500 text-center h-full flex flex-col justify-center items-center">
                Tap the "Run Generative AI SEO Audit" button to trigger the server-side audit via Gemini.
              </p>
            )}

            {aiReport && (
              <div className="prose prose-sm prose-invert whitespace-pre-wrap select-all">
                {aiReport}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
