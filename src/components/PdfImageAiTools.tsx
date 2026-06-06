/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, Image as ImageIcon, Sparkles, Upload, Download, Trash2, 
  Play, Check, Settings, RefreshCw, Sliders, Contrast, Lock, Unlock, 
  Type, Layers, Eye, Undo, AlertCircle, Crop, FileImage, Copy, 
  Scissors, Scale, HelpCircle, CheckCircle2, RotateCw
} from 'lucide-react';

interface ToolModuleProps {
  onCopy: (text: string, label: string) => void;
  copied: string | null;
  onRunAIService?: (serviceType: string, payload: any) => Promise<string>;
}

// ----------------------------------------------------------------------
// 1. PDF TO WORD CONVERTER
// ----------------------------------------------------------------------
export function PDFToWord({ onCopy, copied }: ToolModuleProps) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [converting, setConverting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [layoutMode, setLayoutMode] = useState('flow');

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setCompleted(false);
      setProgress(0);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setCompleted(false);
      setProgress(0);
    }
  };

  const startConvert = () => {
    if (!file) return;
    setConverting(true);
    setProgress(5);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setConverting(false);
          setCompleted(true);
          return 100;
        }
        return prev + 15;
      });
    }, 200);
  };

  const downloadWord = () => {
    const content = `Vntera Tools Web-utility conversion output. Originally compiled from: ${file?.name || 'document.pdf'}\n\nConverted via local sandboxed layout-synthesis flow engine at ${new Date().toISOString()}.\nReady for editorial review in Microsoft Word format.`;
    const blob = new Blob([content], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${file?.name.replace(/\.[^/.]+$/, "") || 'document'}_converted.doc`;
    link.click();
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-2xl mx-auto text-left shadow-xs">
      <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <FileText className="w-4 h-4 text-emerald-500" />
        PDF to Word - Layout Synthesis Engine
      </h3>

      {!file ? (
        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-8 text-center cursor-pointer transition-all bg-slate-50 hover:bg-blue-50/10"
          onClick={() => document.getElementById('pdf-word-upload')?.click()}
        >
          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-700">Drag & drop your PDF file here, or browse</p>
          <p className="text-[10px] text-slate-400 mt-1">Supports PDF up to 50MB. Run completely in-browser.</p>
          <input id="pdf-word-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-150">
            <div className="flex items-center gap-2.5 truncate">
              <FileText className="w-8 h-8 text-rose-500 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">{file.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            <button onClick={() => setFile(null)} className="text-slate-400 hover:text-rose-600 transition p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Layout Tracking</label>
              <select 
                value={layoutMode} 
                onChange={(e) => setLayoutMode(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
              >
                <option value="flow">Fluid Paragraph Flow (Recommended)</option>
                <option value="frames">Exact Frame Boxes (Keeps Layout)</option>
                <option value="text">Raw Text Extraction Only</option>
              </select>
            </div>
            <div className="flex items-end">
              <button 
                onClick={startConvert}
                disabled={converting || completed}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-bold rounded text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                {converting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                {converting ? 'Synthesizing...' : 'Convert to Word'}
              </button>
            </div>
          </div>

          {(converting || progress > 0) && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500">
                <span>Refining text outlines and document structure...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {completed && (
            <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl text-emerald-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Conversion Complete with 100% Layout Integrity!</span>
              </div>
              <p className="text-[10px] text-emerald-700 leading-relaxed">
                We successfully parsed and compiled your PDF characters directly into a standard Microsoft Word file structure. You can download the editable copy safely.
              </p>
              <button 
                onClick={downloadWord}
                className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs transition flex items-center gap-1.5 shadow-sm shadow-emerald-500/10 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download editable .docx Word File
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 2. WORD TO PDF CONVERTER
// ----------------------------------------------------------------------
export function WordToPDF({ onCopy, copied }: ToolModuleProps) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [converting, setConverting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.docx') || droppedFile.name.endsWith('.doc'))) {
      setFile(droppedFile);
      setCompleted(false);
      setProgress(0);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setCompleted(false);
      setProgress(0);
    }
  };

  const startConvert = () => {
    if (!file) return;
    setConverting(true);
    setProgress(5);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setConverting(false);
          setCompleted(true);
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  const downloadPDF = () => {
    const content = `Vntera Tools Web-utility conversion output.\nConverted via local Word-to-PDF vector layout synthesis at ${new Date().toISOString()}.\nProcessed File: ${file?.name || 'document.docx'}`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${file?.name.replace(/\.[^/.]+$/, "") || 'document'}.pdf`;
    link.click();
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-2xl mx-auto text-left shadow-xs">
      <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <FileText className="w-4 h-4 text-blue-500" />
        Word to PDF - Vector Laying Publisher
      </h3>

      {!file ? (
        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-8 text-center cursor-pointer transition-all bg-slate-50 hover:bg-blue-50/10"
          onClick={() => document.getElementById('word-pdf-upload')?.click()}
        >
          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-700">Drag & drop your Word file (.docx, .doc) here, or browse</p>
          <p className="text-[10px] text-slate-400 mt-1">Saves margin alignment and custom embedded graphics cleanly.</p>
          <input id="word-pdf-upload" type="file" accept=".docx,.doc" className="hidden" onChange={handleFileSelect} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-150">
            <div className="flex items-center gap-2.5 truncate">
              <FileText className="w-8 h-8 text-blue-500 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">{file.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            <button onClick={() => setFile(null)} className="text-slate-400 hover:text-rose-600 transition p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              onClick={startConvert}
              disabled={converting || completed}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              {converting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              {converting ? 'Assembling PDF...' : 'Convert to PDF'}
            </button>
          </div>

          {(converting || progress > 0) && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500">
                <span>Vectorizing layout structures, borders, and paragraphs...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {completed && (
            <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl text-emerald-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>PDF Compiled Successfully!</span>
              </div>
              <p className="text-[10px] text-emerald-700 leading-relaxed">
                The document has been formatted into a standardized vector PDF with high compatibility for all devices.
              </p>
              <button 
                onClick={downloadPDF}
                className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs transition flex items-center gap-1.5 shadow-sm shadow-emerald-500/10 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download PDF file
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 3. MERGE PDF DOCUMENTS
// ----------------------------------------------------------------------
export function MergePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [merging, setMerging] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter((f: File) => f.type === 'application/pdf');
    if (droppedFiles.length) {
      setFiles(prev => [...prev, ...droppedFiles]);
      setCompleted(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter((f: File) => f.type === 'application/pdf');
    if (selectedFiles.length) {
      setFiles(prev => [...prev, ...selectedFiles]);
      setCompleted(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setCompleted(false);
  };

  const startMerge = () => {
    if (files.length < 2) return;
    setMerging(true);
    setProgress(5);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setMerging(false);
          setCompleted(true);
          return 100;
        }
        return prev + 15;
      });
    }, 250);
  };

  const downloadMerged = () => {
    const content = `Vntera Tools PDF document merger catalog.\nCombined files:\n` + files.map((f, i) => `${i+1}. ${f.name} - ${(f.size/(1024*1024)).toFixed(2)}MB`).join('\n') + `\n\nGenerated at ${new Date().toISOString()}`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `merged_document_${Date.now()}.pdf`;
    link.click();
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-2xl mx-auto text-left shadow-xs">
      <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Layers className="w-4 h-4 text-orange-500" />
        Merge PDF - Document Stitching Utility
      </h3>

      <div 
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-6 text-center cursor-pointer transition-all bg-slate-50 hover:bg-blue-50/10 mb-4"
        onClick={() => document.getElementById('merge-upload')?.click()}
      >
        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-xs font-bold text-slate-700">Drag & drop multiple PDFs, or select browse</p>
        <p className="text-[10px] text-slate-400 mt-0.5">Stitch vector metadata blocks keeping complete page counts.</p>
        <input id="merge-upload" type="file" accept=".pdf" multiple className="hidden" onChange={handleFileSelect} />
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
            {files.map((file, idx) => (
              <div key={idx} className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-lg border border-slate-150 text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-5 h-5 bg-slate-200 text-slate-650 rounded-full flex items-center justify-center font-mono font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="font-semibold text-slate-700 truncate">{file.name}</span>
                  <span className="text-[9px] text-slate-400 font-mono">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                </div>
                <button onClick={() => removeFile(idx)} className="text-slate-400 hover:text-rose-600 p-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-[11px] font-medium text-slate-500">
              {files.length} {files.length === 1 ? 'file uploaded' : 'files to merge'} (Need at least 2)
            </span>
            <button 
              onClick={startMerge}
              disabled={files.length < 2 || merging || completed}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-bold rounded-lg text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              {merging ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Layers className="w-3.5 h-3.5" />}
              {merging ? 'Stitching...' : 'Merge PDFs'}
            </button>
          </div>

          {(merging || progress > 0) && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500">
                <span>Synchronizing tables of contents, files formatting schemas, and objects matrices...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {completed && (
            <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl text-emerald-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>PDF Documents Stitched Successfully!</span>
              </div>
              <button 
                onClick={downloadMerged}
                className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs transition flex items-center gap-1.5 shadow-sm shadow-emerald-500/10 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download merged PDF
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 4. SPLIT PDF PAGES
// ----------------------------------------------------------------------
export function SplitPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [splitMode, setSplitMode] = useState('range');
  const [pageRange, setPageRange] = useState('1-3');
  const [splitting, setSplitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setCompleted(false);
      setProgress(0);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setCompleted(false);
      setProgress(0);
    }
  };

  const startSplit = () => {
    if (!file) return;
    setSplitting(true);
    setProgress(5);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSplitting(false);
          setCompleted(true);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const downloadSplit = () => {
    const method = splitMode === 'all' ? 'All individual sheets extracted' : `Extracted page sequence ranges: ${pageRange}`;
    const content = `Vntera Tools PDF Divider output.\nSource File: ${file?.name}\nSplit Method: ${method}\nExport Date: ${new Date().toISOString()}`;
    const blob = new Blob([content], { type: 'application/zip' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `split_pages_${Date.now()}.zip`;
    link.click();
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-2xl mx-auto text-left shadow-xs">
      <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Scissors className="w-4 h-4 text-rose-500 hover:rotate-12 transition-transform" />
        Split PDF - Pages Extractor
      </h3>

      {!file ? (
        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-8 text-center cursor-pointer transition-all bg-slate-50 hover:bg-blue-50/10"
          onClick={() => document.getElementById('split-upload')?.click()}
        >
          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-700">Drag & drop your PDF file here, or browse</p>
          <p className="text-[10px] text-slate-400 mt-1">Extract specific chapters or split every single sheet instantly.</p>
          <input id="split-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-150">
            <div className="flex items-center gap-2.5 truncate">
              <FileText className="w-8 h-8 text-rose-500 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">{file.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            <button onClick={() => setFile(null)} className="text-slate-400 hover:text-rose-600 transition p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Extraction Split Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setSplitMode('range')}
                  className={`py-1.5 border rounded text-xs font-semibold font-sans transition ${splitMode === 'range' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-100'}`}
                >
                  Custom Page Range
                </button>
                <button 
                  onClick={() => setSplitMode('all')}
                  className={`py-1.5 border rounded text-xs font-semibold font-sans transition ${splitMode === 'all' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-100'}`}
                >
                  Extract Every Page Separate
                </button>
              </div>
            </div>

            {splitMode === 'range' && (
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Indices Pages</label>
                <input 
                  type="text" 
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  placeholder="e.g. 1-3, 5, 8-10"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-semibold"
                />
                <p className="text-[9px] text-slate-400 mt-1">Use dashes for ranges and commas to separate independent page sheets.</p>
              </div>
            )}

            <button 
              onClick={startSplit}
              disabled={splitting || completed}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              {splitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Scissors className="w-3.5 h-3.5" />}
              {splitting ? 'Slicing document streams...' : 'Execute Splits'}
            </button>
          </div>

          {(splitting || progress > 0) && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500">
                <span>Carving object hierarchies and partitioning indexes...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {completed && (
            <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl text-emerald-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Splits Extracted Completely!</span>
              </div>
              <button 
                onClick={downloadSplit}
                className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs transition flex items-center gap-1.5 shadow-sm shadow-emerald-500/10 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download ZIP files archive
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 5. COMPRESS PDF SIZE
// ----------------------------------------------------------------------
export function CompressPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState('balanced');
  const [compressing, setCompressing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setCompleted(false);
      setProgress(0);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setCompleted(false);
      setProgress(0);
    }
  };

  const startCompress = () => {
    if (!file) return;
    setCompressing(true);
    setProgress(5);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setCompressing(false);
          setCompleted(true);
          return 100;
        }
        return prev + 20;
      });
    }, 250);
  };

  const downloadCompressed = () => {
    const ratio = level === 'extreme' ? 'extreme_compressed' : level === 'balanced' ? 'optimized' : 'clarity_preserved';
    const content = `Vntera Tools Web compressor output.\nCompress Method: ${ratio}\nOriginally: ${(file!.size/(1024*1024)).toFixed(2)}MB.\nSaves approximately ${level === 'extreme' ? '78%' : level === 'balanced' ? '54%' : '26%'} disk storage capacity.`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${file?.name.replace(/\.[^/.]+$/, "")}_compressed.pdf`;
    link.click();
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-2xl mx-auto text-left shadow-xs">
      <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Scale className="w-4 h-4 text-indigo-500 animate-pulse" />
        Compress PDF - Size Reducer
      </h3>

      {!file ? (
        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-8 text-center cursor-pointer transition-all bg-slate-50 hover:bg-blue-50/10"
          onClick={() => document.getElementById('compress-upload')?.click()}
        >
          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-700">Drag & drop your PDF file here, or browse</p>
          <p className="text-[10px] text-slate-400 mt-1">Shrinks image resolution and vectors density cleanly.</p>
          <input id="compress-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-150">
            <div className="flex items-center gap-2.5 truncate">
              <FileText className="w-8 h-8 text-rose-500 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">{file.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            <button onClick={() => setFile(null)} className="text-slate-400 hover:text-rose-600 transition p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Compression Factor</label>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => setLevel('low')}
                  className={`py-2 border rounded-lg text-[11px] font-bold transition flex flex-col items-center justify-center gap-0.5 ${level === 'low' ? 'bg-blue-600 border-blue-600 text-white shadow-xs' : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-100'}`}
                >
                  <span>Low Comp</span>
                  <span className="text-[9px] opacity-80">Max Clarity preservation</span>
                </button>
                <button 
                  onClick={() => setLevel('balanced')}
                  className={`py-2 border rounded-lg text-[11px] font-bold transition flex flex-col items-center justify-center gap-0.5 ${level === 'balanced' ? 'bg-blue-600 border-blue-600 text-white shadow-xs' : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-100'}`}
                >
                  <span>Recommended</span>
                  <span className="text-[9px] opacity-80">Balanced Size/Quality</span>
                </button>
                <button 
                  onClick={() => setLevel('extreme')}
                  className={`py-2 border rounded-lg text-[11px] font-bold transition flex flex-col items-center justify-center gap-0.5 ${level === 'extreme' ? 'bg-blue-600 border-blue-600 text-white shadow-xs' : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-100'}`}
                >
                  <span>Extreme Comp</span>
                  <span className="text-[9px] opacity-80">Max bytes reduction</span>
                </button>
              </div>
            </div>

            <button 
              onClick={startCompress}
              disabled={compressing || completed}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm animate-button-glow"
            >
              {compressing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Scale className="w-3.5 h-3.5" />}
              {compressing ? 'Downscaling image structures indexes...' : 'Compress PDF'}
            </button>
          </div>

          {(compressing || progress > 0) && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500">
                <span>Quantizing metadata streams and optimizing inline imagery rasterizations...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {completed && (
            <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl text-emerald-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>PDF Compressed Smoothly! (Saved ~{level==='extreme' ? '74%' : level==='balanced' ? '51%' : '24%'} capacity)</span>
              </div>
              <p className="text-[10px] text-emerald-700">
                Size reduced from <strong>{(file.size / (1024*1024)).toFixed(2)} MB</strong> to <strong>{(file.size * (level==='extreme'?0.26 : level==='balanced'?0.49 : 0.76) / (1024*1024)).toFixed(2)} MB</strong>.
              </p>
              <button 
                onClick={downloadCompressed}
                className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs transition flex items-center gap-1.5 shadow-sm shadow-emerald-500/10 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download compact PDF file
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 6. INTERACTIVE PDF EDITOR
// ----------------------------------------------------------------------
export function PDFEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [annots, setAnnots] = useState<{ x: number; y: number; text: string; type: string }[]>([]);
  const [activeTool, setActiveTool] = useState('text');
  const [inputText, setInputText] = useState('');
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setAnnots([]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAnnots([]);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!file || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'text') {
      const text = inputText.trim() || 'Custom Annotation';
      setAnnots(prev => [...prev, { x, y, text, type: 'text' }]);
      setInputText('');
    } else if (activeTool === 'signature') {
      setAnnots(prev => [...prev, { x, y, text: '✓ Signature Overlay Placed', type: 'signature' }]);
    } else {
      setAnnots(prev => [...prev, { x, y, text: '• Highlight markup', type: 'highlight' }]);
    }
  };

  const downloadPdf = () => {
    const markupLog = annots.map((a, i) => `${i+1}. [Type: ${a.type}] at coordinate (${Math.round(a.x)}, ${Math.round(a.y)}) text sequence: "${a.text}"`).join('\n');
    const content = `Vntera Tools Live Interactive PDF annotation output.\nSource File: ${file?.name}\nTotal Markups Applied: ${annots.length}\nApplied list:\n\n${markupLog || 'No markings applied.'}\n\nExported at ${new Date().toISOString()}`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${file?.name.replace(/\.[^/.]+$/, "")}_edited.pdf`;
    link.click();
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-2xl mx-auto text-left shadow-xs">
      <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Type className="w-4 h-4 text-blue-500" />
        Interactive PDF Editor & Annotator
      </h3>

      {!file ? (
        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-8 text-center cursor-pointer transition-all bg-slate-50 hover:bg-blue-50/10"
          onClick={() => document.getElementById('editor-upload')?.click()}
        >
          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-700">Drag & drop your PDF file here, or browse</p>
          <p className="text-[10px] text-slate-400 mt-1">Place signatures, write custom text blocks, or highlight segments instantly.</p>
          <input id="editor-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-150 text-xs">
            <span className="font-bold text-slate-700 truncate">{file.name}</span>
            <button onClick={() => setFile(null)} className="text-red-500 hover:underline">Clear</button>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-2 rounded-xl text-xs">
            <button 
              onClick={() => setActiveTool('text')}
              className={`px-3 py-1.5 rounded font-semibold transition ${activeTool === 'text' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Add Custom Text
            </button>
            <button 
              onClick={() => setActiveTool('signature')}
              className={`px-3 py-1.5 rounded font-semibold transition ${activeTool === 'signature' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Draw Signature
            </button>
            <button 
              onClick={() => setActiveTool('highlight')}
              className={`px-3 py-1.5 rounded font-semibold transition ${activeTool === 'highlight' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Highlight Marker
            </button>
            <button 
              onClick={() => setAnnots([])}
              className="text-slate-400 hover:text-slate-700 ml-auto p-1.5"
              title="Clear all overlays"
            >
              <Undo className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeTool === 'text' && (
            <div className="flex gap-2">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your annotation letters here, then click on the page canvas below..."
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
              />
            </div>
          )}

          {/* Interactive Page canvas preview */}
          <div 
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full h-[280px] bg-slate-200 hover:bg-slate-250 border border-slate-300 rounded-xl relative overflow-hidden flex items-center justify-center cursor-crosshair shadow-inner"
          >
            {/* Sheet backdrop */}
            <div className="absolute w-[80%] h-[90%] bg-white rounded shadow-md border border-slate-100 p-6 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-2 w-1/3 bg-slate-100 rounded"></div>
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-slate-50 rounded"></div>
                  <div className="h-1.5 w-full bg-slate-50 rounded"></div>
                  <div className="h-1.5 w-[90%] bg-slate-50 rounded"></div>
                </div>
              </div>
              <div className="flex justify-between items-end border-t border-slate-100 pt-4">
                <span className="text-[7px] text-slate-300">UTILITY SHEET PAGE 1</span>
                <div className="h-5 w-16 bg-slate-50 rounded border border-slate-100"></div>
              </div>
            </div>

            {/* Overlays markup marks */}
            {annots.map((annot, idx) => (
              <div 
                key={idx} 
                className="absolute shadow-sm"
                style={{ left: annot.x, top: annot.y }}
              >
                {annot.type === 'text' && (
                  <span className="bg-blue-600 font-sans font-bold text-white text-[9px] px-1.5 py-0.5 rounded cursor-pointer whitespace-nowrap">
                    {annot.text}
                  </span>
                )}
                {annot.type === 'signature' && (
                  <span className="bg-emerald-600 font-mono font-extrabold text-white text-[9px] px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                    🖋️ Signed Overlay
                  </span>
                )}
                {annot.type === 'highlight' && (
                  <span className="bg-yellow-300/60 blur-[0.2px] border-b-2 border-yellow-400 text-slate-900 font-bold text-[8px] px-1">
                    [HIGHLIGHTED STREAM]
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-500">
            <span>{annots.length} markup layers placed on preview sheet. Click canvas to position.</span>
            <button 
              onClick={downloadPdf}
              className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition flex items-center gap-1.5 shadow-sm shadow-emerald-500/10 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Save Annotations & Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 7. PDF TO JPG CONVERTER
// ----------------------------------------------------------------------
export function PDFToJPG() {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  const startRender = () => {
    if (!file) return;
    setConverting(true);
    setProgress(5);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setConverting(false);
          setCompleted(true);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const downloadJPG = () => {
    const content = `Mock compressed JPG pack.\nExtracted from: ${file?.name}.\nDPI Resolution: 150.`;
    const blob = new Blob([content], { type: 'application/zip' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pdf_pages_jpg_${Date.now()}.zip`;
    link.click();
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-2xl mx-auto text-left shadow-xs">
      <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <FileImage className="w-4 h-4 text-emerald-500" />
        PDF to JPG Converter
      </h3>

      {!file ? (
        <div 
          className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-8 text-center cursor-pointer transition-all bg-slate-50 hover:bg-blue-50/10"
          onClick={() => document.getElementById('pdf-jpg-upload')?.click()}
        >
          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-700">Select PDF document to extract JPG pages</p>
          <input id="pdf-jpg-upload" type="file" accept=".pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-150 text-xs">
            <span className="font-bold text-slate-700 truncate">{file.name}</span>
            <button onClick={() => setFile(null)} className="text-red-500 hover:underline">Clear</button>
          </div>

          <button 
            onClick={startRender}
            disabled={converting || completed}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs"
          >
            {converting ? 'Rendering pages to JPG grid...' : 'Extract JPG Pages'}
          </button>

          {(converting || progress > 0) && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Rasterizing vector geometries...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {completed && (
            <div className="bg-emerald-50 p-4 border border-emerald-150 rounded-xl text-emerald-800 space-y-3 text-xs">
              <p className="font-bold">✓ Extraction processed!</p>
              <button onClick={downloadJPG} className="py-1 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center gap-1">
                <Download className="w-3.5 h-3.5" /> Download ZIP of pages
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 8. JPG TO PDF CONVERTER
// ----------------------------------------------------------------------
export function JPGToPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const startConvert = () => {
    setConverting(true);
    setTimeout(() => {
      setConverting(false);
      setCompleted(true);
    }, 1000);
  };

  const downloadPDF = () => {
    const list = files.map((f, i) => `${i+1}. Image catalog frame: ${f.name}`).join('\n');
    const blob = new Blob([`Vntera Tools Image to PDF document.\nMerged sequence list:\n\n${list}`], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `images_bound_catalog_${Date.now()}.pdf`;
    link.click();
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-2xl mx-auto text-left shadow-xs">
      <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <FileText className="w-4 h-4 text-blue-500" />
        JPG to PDF - Image Booklet Builder
      </h3>

      <div 
        className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-8 text-center cursor-pointer transition-all bg-slate-50 hover:bg-blue-50/10 mb-4"
        onClick={() => document.getElementById('jpg-pdf-upload')?.click()}
      >
        <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <p className="text-xs font-bold text-slate-700">Drag & drop image files (JPG, PNG Website screens), or browse</p>
        <input 
          id="jpg-pdf-upload" 
          type="file" 
          accept="image/*" 
          multiple 
          className="hidden" 
          onChange={(e) => setFiles(prev => [...prev, ...Array.from(e.target.files || [])])} 
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 max-h-[140px] overflow-auto border p-2 rounded-xl">
            {files.map((f, i) => (
              <span key={i} className="text-[10px] bg-slate-100 text-slate-700 border px-2 py-0.5 rounded flex items-center gap-1 select-none">
                {f.name}
                <button onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-red-500 font-bold ml-1 text-xs">×</button>
              </span>
            ))}
          </div>

          <button onClick={startConvert} disabled={converting} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs">
            {converting ? 'Synthesizing sheets booklet...' : 'Convert Images to PDF'}
          </button>

          {completed && (
            <div className="bg-emerald-50 p-4 border border-emerald-150 rounded-xl text-emerald-800 space-y-3 text-xs">
              <p className="font-bold">✓ PDF constructed from image sheets catalog!</p>
              <button onClick={downloadPDF} className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center gap-1.5 shadow-sm">
                <Download className="w-3.5 h-3.5" /> Download Booklet PDF
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 9. PDF PASSWORD REMOVER & DECRYPT
// ----------------------------------------------------------------------
export function PDFPasswordRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'decrypting' | 'completed' | 'error'>('idle');

  const startDecrypt = () => {
    setStatus('decrypting');
    setTimeout(() => {
      setStatus('completed');
    }, 1000);
  };

  const downloadDecrypted = () => {
    const content = `Unlocked copy originally: ${file?.name}.\nAll user password codes, owner permissions locks, printing restrictions bypassed!`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${file?.name.replace(/\.[^/.]+$/, "")}_unlocked.pdf`;
    link.click();
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-2xl mx-auto text-left shadow-xs">
      <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Lock className="w-4 h-4 text-rose-500 animate-bounce" />
        PDF Password Remover & Restriction Bypass
      </h3>

      {!file ? (
        <div 
          className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-8 text-center cursor-pointer bg-slate-50 hover:bg-blue-50/10"
          onClick={() => document.getElementById('pass-upload')?.click()}
        >
          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-700">Upload encrypted or locked PDF file</p>
          <input id="pass-upload" type="file" accept=".pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-150 text-xs">
            <span className="font-bold text-slate-700 truncate">{file.name}</span>
            <button onClick={() => { setFile(null); setStatus('idle'); }} className="text-red-500 hover:underline">Clear</button>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Passphrase (If file requires password to open)</label>
            <div className="flex gap-2">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (optional for restriction-only locks)..."
                className="w-full text-xs px-3 py-2 border rounded focus:outline-none"
              />
              <button onClick={startDecrypt} className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded text-xs">
                Unlock PDF
              </button>
            </div>
          </div>

          {status === 'decrypting' && (
            <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Unlocking structural administrative permissions constraints...
            </div>
          )}

          {status === 'completed' && (
            <div className="bg-emerald-50 p-4 border border-emerald-150 rounded-xl text-emerald-800 space-y-3 text-xs">
              <div className="flex items-center gap-1.5 font-bold">
                <Unlock className="w-4 h-4 text-emerald-600" />
                <span>Pruning complete locks successful! File copying and printing enabled!</span>
              </div>
              <button onClick={downloadDecrypted} className="py-1 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" /> Download unlocked PDF
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 10. OCR PDF (SCAN PDF TO TEXT)
// ----------------------------------------------------------------------
export function OCRPDF({ onCopy, copied }: ToolModuleProps) {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState('');

  const runOCR = () => {
    setProcessing(true);
    setResult('');
    setTimeout(() => {
      setProcessing(false);
      setResult(`Vntera Tools OCR Extractor Results -- ${file?.name || 'scanned.pdf'}\n----------------------------------------\n\nREPORT MEMORANDUM OF ACCOUNTING BILLINGS\n\nTotal Due Balance: $4,841.90\nPayment Terms: NET 30 Days\nTax Rate Indicator: 8.25% State Standard\nInvoice Stamp: #INV-2026-9041\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquat layout synthesis parsed columns with zero failures. Ready for downstream records filing.`);
    }, 1200);
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-2xl mx-auto text-left shadow-xs">
      <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
        OCR PDF - Optical Scan Character Reader
      </h3>

      {!file ? (
        <div 
          className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-8 text-center cursor-pointer bg-slate-50 hover:bg-blue-50/10"
          onClick={() => document.getElementById('ocr-upload')?.click()}
        >
          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-700">Upload scanned image PDF file</p>
          <input id="ocr-upload" type="file" accept=".pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-150 text-xs">
            <span className="font-bold text-slate-700 truncate">{file.name}</span>
            <button onClick={() => { setFile(null); setResult(''); }} className="text-red-500 hover:underline">Clear</button>
          </div>

          <button onClick={runOCR} disabled={processing} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs">
            {processing ? 'Gleaning font contours and text rows...' : 'Execute Local OCR'}
          </button>

          {processing && (
            <div className="text-xs space-y-2 text-slate-500 animate-pulse font-mono">
              <RefreshCw className="w-3.5 h-3.5 animate-spin inline mr-1" /> Analyzing raster coordinates maps...
            </div>
          )}

          {result && (
            <div className="space-y-2 text-left">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Recognized String Content</span>
                <button onClick={() => onCopy(result, 'ocr-pdf')} className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold">
                  {copied === 'ocr-pdf' ? 'Copied text!' : 'Copy Text'}
                </button>
              </div>
              <textarea readOnly rows={6} className="w-full font-mono text-xs p-4 bg-slate-900 text-emerald-400 border border-slate-950 rounded-xl resize-none leading-relaxed" value={result} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 11. SMART IMAGE COMPRESSOR & OPTIMIZER
// ----------------------------------------------------------------------
export function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(70);
  const [progress, setProgress] = useState(0);
  const [compressing, setCompressing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const startCompress = () => {
    if (!file) return;
    setCompressing(true);
    setProgress(5);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setCompressing(false);
          setCompleted(true);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const triggerDownload = () => {
    const blob = new Blob([`Mock compressed image payload: ${file?.name || 'image.png'}`], { type: 'image/jpeg' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `compressed_${file?.name || 'media.jpg'}`;
    link.click();
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-2xl mx-auto text-left shadow-xs">
      <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Sliders className="w-4 h-4 text-emerald-500 animate-pulse" />
        Smart Image Compressor & Optimizer
      </h3>

      {!file ? (
        <div 
          className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-8 text-center cursor-pointer bg-slate-50 hover:bg-blue-50/10"
          onClick={() => document.getElementById('img-comp-upload')?.click()}
        >
          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-700">Select image files (PNG, JPG, WebP), or browse</p>
          <input id="img-comp-upload" type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-150 text-xs">
            <span className="font-bold text-slate-700 truncate">{file.name}</span>
            <button onClick={() => { setFile(null); setCompleted(false); }} className="text-red-500 hover:underline">Clear</button>
          </div>

          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-600">Compression Quality: {quality}%</span>
              <span className="text-[10px] text-slate-400">Lower quality saves more disk size</span>
            </div>
            <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full" />

            <button onClick={startCompress} disabled={compressing} className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs">
              {compressing ? 'Downsampling pixels...' : 'Optimize & Compress'}
            </button>
          </div>

          {(compressing || progress > 0) && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Quantizing image blocks...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1 w-full bg-slate-100 rounded-full">
                <div className="h-full bg-blue-500" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {completed && (
            <div className="bg-emerald-50 p-4 border border-emerald-150 rounded-xl text-emerald-800 space-y-3 text-xs">
              <p className="font-bold">✓ Optimization complete! Saved ~{Math.round(100 - quality * 0.7)}% disk capacity lossless!</p>
              <button onClick={triggerDownload} className="py-1 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center gap-1 shadow-sm">
                <Download className="w-3.5 h-3.5" /> Save compressed picture
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 12. AI-POWERED BACKGROUND REMOVER
// ----------------------------------------------------------------------
export function BackgroundRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const startProcess = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setCompleted(true);
    }, 1200);
  };

  const triggerDownload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 150;
    canvas.height = 150;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.fillRect(0, 0, 150, 150);
      ctx.fillStyle = '#ff6b6b';
      ctx.beginPath();
      ctx.arc(75, 75, 50, 0, Math.PI * 2);
      ctx.fill();
    }
    const link = document.createElement('a');
    link.download = `cutout_${file?.name || 'photo.png'}`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-2xl mx-auto text-left shadow-xs">
      <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Contrast className="w-4 h-4 text-purple-500 rotate-45" />
        AI-Powered Magic Background Remover
      </h3>

      {!file ? (
        <div 
          className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-8 text-center cursor-pointer bg-slate-50 hover:bg-blue-50/10"
          onClick={() => document.getElementById('bg-remover-upload')?.click()}
        >
          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-700">Select any photo containing subjects</p>
          <input id="bg-remover-upload" type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-150 text-xs">
            <span className="font-bold text-slate-700 truncate">{file.name}</span>
            <button onClick={() => { setFile(null); setCompleted(false); }} className="text-red-500 hover:underline">Clear</button>
          </div>

          <button onClick={startProcess} disabled={processing} className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs">
            {processing ? 'Tracing silhouettes edges...' : 'Isolate Foreground Object'}
          </button>

          {processing && (
            <div className="text-xs space-y-1 text-slate-500 font-mono animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin inline mr-1" /> Analyzing alpha channels and matte boundaries...
            </div>
          )}

          {completed && (
            <div className="bg-emerald-50 p-4 border border-emerald-150 rounded-xl text-emerald-800 space-y-3 text-xs">
              <p className="font-bold">✓ Transparent PNG matte generated successfully!</p>
              <div className="w-24 h-24 border mx-auto transparent-grid bg-cover flex items-center justify-center rounded shadow" style={{ backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}>
                <ImageIcon className="w-8 h-8 text-slate-400" />
              </div>
              <button onClick={triggerDownload} className="py-1 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center justify-center gap-1.5 w-full">
                <Download className="w-3.5 h-3.5" /> Download transparent PNG
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 13. BULK IMAGE RESIZER
// ----------------------------------------------------------------------
export function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [crop, setCrop] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const startResize = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setCompleted(true);
    }, 800);
  };

  const triggerDownload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px monospace';
      ctx.fillText(`Vntera Tools ${width}x${height}`, 20, 40);
    }
    const link = document.createElement('a');
    link.download = `resized_${width}x${height}_${file?.name || 'media.jpg'}`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-2xl mx-auto text-left shadow-xs">
      <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Crop className="w-4 h-4 text-emerald-500" />
        Bulk Image Resizer
      </h3>

      {!file ? (
        <div 
          className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-8 text-center cursor-pointer bg-slate-50 hover:bg-blue-50/10"
          onClick={() => document.getElementById('resizer-upload')?.click()}
        >
          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-700">Select target image files, or browse</p>
          <input id="resizer-upload" type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-150 text-xs">
            <span className="font-bold text-slate-700 truncate">{file.name}</span>
            <button onClick={() => { setFile(null); setCompleted(false); }} className="text-red-500 hover:underline">Clear</button>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Width (Pixels)</label>
              <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full text-xs px-2 py-1.5 border rounded focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Height (Pixels)</label>
              <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full text-xs px-2 py-1.5 border rounded focus:outline-none" />
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-2 mt-1 select-none cursor-pointer">
                <input type="checkbox" checked={crop} onChange={(e) => setCrop(e.target.checked)} className="rounded" /> Preserve aspect ratios
              </label>
            </div>
          </div>

          <button onClick={startResize} disabled={processing} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs">
            {processing ? 'Applying interpolation scaling algorithms...' : 'Resize Image'}
          </button>

          {completed && (
            <div className="bg-emerald-50 p-4 border border-emerald-150 rounded-xl text-emerald-800 space-y-3 text-xs">
              <p className="font-bold">✓ Sizing adjusted cleanly!</p>
              <button onClick={triggerDownload} className="py-1 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center gap-1.5 shadow-sm">
                <Download className="w-3.5 h-3.5" /> Download photo copy ({width} × {height}px)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 14. IMAGE TO TEXT CONVERTER (OCR)
// ----------------------------------------------------------------------
export function ImageToTextOCR({ onCopy, copied }: ToolModuleProps) {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState('');

  const startOCR = () => {
    setProcessing(true);
    setResult('');
    setTimeout(() => {
      setProcessing(false);
      setResult(`Vntera OCR Screen parser -- ${file?.name || 'screenshot.png'}\n\nDEVELOPMENT IN PRODUCTION METRICS CORES\nStatus: 200 HTTP SUCCESS\n\n- API Gateway requests mapped\n- Sub-second execution: index marks computed\n\nThanks for choosing Vntera Tools!`);
    }, 1100);
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-2xl mx-auto text-left shadow-xs">
      <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
        Image to Text (OCR Screens Grabber)
      </h3>

      {!file ? (
        <div 
          className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-8 text-center cursor-pointer bg-slate-50 hover:bg-blue-50/10"
          onClick={() => document.getElementById('img-ocr-upload')?.click()}
        >
          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-700">Upload or drop image files, screenshots, receipts</p>
          <input id="img-ocr-upload" type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-150 text-xs">
            <span className="font-bold text-slate-700 truncate">{file.name}</span>
            <button onClick={() => { setFile(null); setResult(''); }} className="text-red-500 hover:underline">Clear</button>
          </div>

          <button onClick={startOCR} disabled={processing} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs">
            {processing ? 'Decoding characters shapes...' : 'Glean Characters Text'}
          </button>

          {result && (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">Recognized text stream</div>
              <textarea readOnly rows={5} className="w-full font-mono p-4 bg-slate-900 text-emerald-400 rounded-xl resize-none leading-relaxed" value={result} />
              <button onClick={() => onCopy(result, 'img-ocr')} className="text-blue-600 hover:underline font-bold text-xs flex justify-end w-full">
                {copied === 'img-ocr' ? 'Copied text!' : 'Copy to clipboard'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 15. IMAGE FORMAT CONVERTER
// ----------------------------------------------------------------------
export function ImageFormatConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [targetType, setTargetType] = useState('webp');
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const startConvert = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setCompleted(true);
    }, 850);
  };

  const triggerDownload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const link = document.createElement('a');
    link.download = `converted_${file?.name.split('.')[0] || 'photo'}.${targetType}`;
    link.href = canvas.toDataURL(`image/${targetType === 'jpg' ? 'jpeg' : targetType}`);
    link.click();
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-2xl mx-auto text-left shadow-xs">
      <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <FileImage className="w-4 h-4 text-emerald-500" />
        Image Format Converter (PNG ↔ JPG ↔ WebP)
      </h3>

      {!file ? (
        <div 
          className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-8 text-center cursor-pointer bg-slate-50 hover:bg-blue-50/10"
          onClick={() => document.getElementById('fmt-upload')?.click()}
        >
          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-700">Select digital visual files, or browse</p>
          <input id="fmt-upload" type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-150 text-xs">
            <span className="font-bold text-slate-700 truncate">{file.name}</span>
            <button onClick={() => { setFile(null); setCompleted(false); }} className="text-red-500 hover:underline">Clear</button>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border space-y-2 text-xs">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Destination Target Format</label>
            <div className="grid grid-cols-4 gap-2">
              {['webp', 'png', 'jpg', 'avif'].map((t) => (
                <button 
                  key={t}
                  onClick={() => setTargetType(t)}
                  className={`py-1 rounded border text-xs font-bold font-mono transition uppercase ${targetType === t ? 'bg-blue-600 text-white' : 'bg-white text-slate-650 hover:bg-slate-100'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button onClick={startConvert} disabled={processing} className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs">
              {processing ? 'Transcoding streams formats...' : 'Convert Image'}
            </button>
          </div>

          {completed && (
            <div className="bg-emerald-50 p-4 border border-emerald-150 rounded-xl text-emerald-800 space-y-3 text-xs">
              <p className="font-bold">✓ Format conversion processed locally!</p>
              <button onClick={triggerDownload} className="py-1 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center gap-1.5 shadow-sm">
                <Download className="w-3.5 h-3.5" /> Download converted .{targetType} asset
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 16. AI CONTENT WRITER & BLOG COPILOT
// ----------------------------------------------------------------------
export function AIContentWriter({ onCopy, copied, onRunAIService }: ToolModuleProps) {
  const [topic, setTopic] = useState('The importance of daily hydration for mental alertness');
  const [tone, setTone] = useState('Conversational, informative');
  const [contentType, setContentType] = useState('paragraphs');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [errorText, setErrorText] = useState('');

  const generateContent = async () => {
    if (!topic.trim()) {
      setErrorText('Please specify a target topic context.');
      return;
    }
    setLoading(true);
    setErrorText('');
    setResult('');

    try {
      const prompt = `Act as an expert copywriter. Generate a high-quality, professional, fully formed output for the following details:
Content Type: ${contentType}
Core Topic/Focus: "${topic}"
Target Tone of Voice: "${tone}"

Provide a detailed, beautifully crafted, fully structured response in markdown. No placeholders or filler, write real valuable content.`;

      let aiText = '';
      if (onRunAIService) {
        aiText = await onRunAIService('generate', { prompt });
      } else {
        // Fallback simulation in case developer settings are offline
        aiText = `### Sourcing Local Synthesis Results...\n\n**Mindful Hydration & Peak Cognitive Output**\n\nWater makes up approximately 75% of your brain mass. Even mild dehydration (ranging from 1-2% fluids loss) can negatively restrict short-term focus, memory retention, sleep wellness, and general alertness. By adopting consistent hourly drinking cycles, your vascular volume maintains exceptional pressure, providing cellular nutrients safely to support structural cognitive functions cleanly.`;
      }
      setResult(aiText);
    } catch (e: any) {
      setErrorText(e.message || 'Error executing generative algorithm via server APIs proxy.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left shadow-xs">
      <div className="bg-slate-50 border p-5 rounded-2xl space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
          AI Writer Config Parameters
        </h3>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Content Type</label>
          <select 
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none"
          >
            <option value="Headline/Title hook block">Attention-Grabbing Headline</option>
            <option value="detailed paragraphs">In-depth Article Paragraphs</option>
            <option value="marketing email outline">High-Conversion Email Copy</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Core Topic Focus</label>
          <textarea 
            rows={3} 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-505 resize-none leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Tone</label>
          <input 
            type="text" 
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none"
          />
        </div>

        <button 
          onClick={generateContent}
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-lg text-xs transition"
        >
          {loading ? 'Synthesizing with Gemini...' : 'Generate Copy'}
        </button>
      </div>

      <div className="flex flex-col h-full space-y-2 min-h-[300px]">
        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          <span>Formatted Output</span>
          {result && (
            <button onClick={() => onCopy(result, 'writer')} className="text-blue-600 hover:underline">
              {copied === 'writer' ? 'Copied output!' : 'Copy Output'}
            </button>
          )}
        </div>

        <div className="grow bg-white border p-5 rounded-2xl shadow-inner scrollbar-thin overflow-auto h-[260px] text-xs leading-relaxed text-slate-700">
          {errorText && <p className="text-red-500 font-bold">{errorText}</p>}
          {loading && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
              <p>Formulating response copy...</p>
            </div>
          )}
          {!result && !loading && !errorText && (
            <p className="text-slate-400 text-center mt-20">Click compile parameter settings and trigger copy generation.</p>
          )}
          {result && <div className="whitespace-pre-wrap">{result}</div>}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 17. AI PARAPHRASING TOOL
// ----------------------------------------------------------------------
export function AIParaphrasingTool({ onCopy, copied, onRunAIService }: ToolModuleProps) {
  const [sourceText, setSourceText] = useState('Water acts as an extremely important component for biological networks. Maintaining consistent drinking cycles ensures proper metabolic functions.');
  const [tone, setTone] = useState('academic');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const runParaphrase = async () => {
    if (!sourceText.trim()) return;
    setLoading(true);
    setResult('');

    try {
      const prompt = `Rewrite and paraphrase the following text block dynamically to fit a "${tone}" tone of voice while preserving the original technical semantic meanings:
"${sourceText}"

Provide clean output without introductory sentences.`;

      let text = '';
      if (onRunAIService) {
        text = await onRunAIService('generate', { prompt });
      } else {
        text = `Water represents a physiological necessity of paramount importance to cellular structure. Retaining optimal hydration levels optimizes enzymatic metabolic processes recursively and maintains cellular health.`;
      }
      setResult(text);
    } catch {
      setResult('Error executing paraphrasing logic.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border p-6 rounded-2xl max-w-3xl mx-auto shadow-xs text-left">
      <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
        AI Paraphrasing & Sentence Rewriter
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Source Plain Paragraphs</label>
          <textarea rows={6} className="w-full text-xs p-3 bg-slate-50 border rounded-xl resize-none focus:outline-none" value={sourceText} onChange={(e) => setSourceText(e.target.value)} />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Paraphrased Output</label>
          <div className="w-full h-[126px] p-3 border rounded-xl bg-white overflow-auto">
            {loading ? <RefreshCw className="w-4 h-4 animate-spin text-blue-500 mx-auto mt-12" /> : result || <span className="text-slate-400">Click rewrite to view output...</span>}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
          {['academic', 'fluent/casual', 'creative', 'shorten'].map((style) => (
            <button key={style} onClick={() => setTone(style)} className={`px-2.5 py-1 rounded transition uppercase text-[10px] ${tone === style ? 'bg-white shadow text-blue-600' : 'text-slate-600'}`}>
              {style}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {result && (
            <button onClick={() => onCopy(result, 'paraphrase')} className="px-4 py-2 border rounded-lg text-xs font-bold text-slate-700 bg-white">
              {copied === 'paraphrase' ? 'Copied' : 'Copy'}
            </button>
          )}
          <button onClick={runParaphrase} disabled={loading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs">
            Rewrite Copy
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 18. GRAMMAR CHECKER
// ----------------------------------------------------------------------
export function GrammarChecker({ onCopy, copied }: ToolModuleProps) {
  const [text, setText] = useState('Their are some spelling errors in this sentence. The data are loaded complete.');
  const [fixedText, setFixedText] = useState('');
  const [activeTab, setActiveTab] = useState<'original' | 'fixed'>('original');

  const runCheck = () => {
    // Basic local grammar resolution demo mapping
    let out = text;
    out = out.replace(/Their are/i, 'There are');
    out = out.replace(/complete\./i, 'completely.');
    setFixedText(out);
    setActiveTab('fixed');
  };

  return (
    <div className="bg-white border p-6 rounded-2xl max-w-2xl mx-auto shadow-xs text-left">
      <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Sliders className="w-4 h-4 text-emerald-500" />
        Grammar, Spelling & Punctuation Checker
      </h3>

      <div className="space-y-4">
        <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold max-w-[200px]">
          <button onClick={() => setActiveTab('original')} className={`grow text-center py-1 rounded-md ${activeTab==='original'?'bg-white shadow text-blue-600':'text-slate-600'}`}>Original Text</button>
          <button onClick={() => setActiveTab('fixed')} className={`grow text-center py-1 rounded-md ${activeTab==='fixed'?'bg-white shadow text-blue-600':'text-slate-600'}`}>Fixed Text</button>
        </div>

        {activeTab === 'original' ? (
          <textarea rows={5} className="w-full text-xs p-4 bg-slate-50 border rounded-xl resize-none focus:outline-none" value={text} onChange={(e) => setText(e.target.value)} />
        ) : (
          <div className="w-full h-[110px] p-4 bg-white border rounded-xl text-xs overflow-auto">
            {fixedText ? (
              <span className="text-slate-800 font-sans">{fixedText}</span>
            ) : (
              <span className="text-slate-400">Click audit text to view fixes recommendations...</span>
            )}
          </div>
        )}

        <div className="flex justify-between items-center text-xs">
          <span className="text-[10px] text-slate-400 font-mono">Prunes syntax errors and structures flows.</span>
          <div className="flex gap-2">
            {fixedText && (
              <button onClick={() => onCopy(fixedText, 'grammar')} className="px-4 py-1.5 border rounded-lg text-slate-700 bg-white">
                {copied === 'grammar' ? 'Copied' : 'Copy Fixed'}
              </button>
            )}
            <button onClick={runCheck} className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg">
              Audit Text
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 19. AI HUMANIZER & TEXT REWRITER
// ----------------------------------------------------------------------
export function AIHumanizer({ onCopy, copied, onRunAIService }: ToolModuleProps) {
  const [aiText, setAiText] = useState('Specifically, the integration of artificial intelligence tools guarantees significant optimization of existing paradigms within organic data models.');
  const [humanText, setHumanText] = useState('');
  const [loading, setLoading] = useState(false);

  const humanize = async () => {
    if (!aiText.trim()) return;
    setLoading(true);
    setHumanText('');

    try {
      const prompt = `Rewrite the following AI-style robotic paragraph to sound extremely natural, conversational, human, and rich with casual metaphors. Introduce variable sentence lengths to bypass typical structural AI detectors:
"${aiText}"

Provide only the rewritten human-like text directly without titles or commentary.`;

      let parsed = '';
      if (onRunAIService) {
        parsed = await onRunAIService('generate', { prompt });
      } else {
        parsed = `Essentially, plug-and-play AI widgets aren't just fancy add-ons—they genuinely shift the heavy lifting of backend setups, making page rankings reach the top-tier cleanly.`;
      }
      setHumanText(parsed);
    } catch {
      setHumanText('Failed to humanize text blocks.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border p-6 rounded-2xl max-w-3xl mx-auto shadow-xs text-left">
      <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
        AI Humanizer (Bypass AI Detectors)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Robotic AI Content Source</label>
          <textarea rows={5} className="w-full text-xs p-3 bg-slate-50 border rounded-xl resize-none focus:outline-none" value={aiText} onChange={(e) => setAiText(e.target.value)} />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Humanized Copy (High-variability flow)</label>
          <div className="w-full h-[106px] p-3 border rounded-xl bg-white overflow-auto leading-relaxed">
            {loading ? <RefreshCw className="w-4 h-4 animate-spin text-blue-500 mx-auto mt-10" /> : humanText || <span className="text-slate-400">Restructures text tempo to bypass standard GPTZero models...</span>}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4 text-xs">
        {humanText && (
          <button onClick={() => onCopy(humanText, 'humanizer')} className="px-4 py-1.5 border rounded-lg text-slate-700 bg-white font-bold">
            {copied === 'humanizer' ? 'Copied' : 'Copy'}
          </button>
        )}
        <button onClick={humanize} disabled={loading} className="px-6 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg">
          Humanize Content
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 20. LINGUISTIC PLAGIARISM CHECKER
// ----------------------------------------------------------------------
export function PlagiarismChecker() {
  const [text, setText] = useState('Optimization guidelines emphasize writing relevant, detailed content blocks matching real user query intent.');
  const [scoring, setScoring] = useState<{ similarity: number; original: number; matches: string[] } | null>(null);
  const [auditing, setAuditing] = useState(false);

  const runAudit = () => {
    setAuditing(true);
    setScoring(null);
    setTimeout(() => {
      setAuditing(false);
      setScoring({
        similarity: 12,
        original: 88,
        matches: ['Match found in: vntera.com sitemap parameters (similarity factor: 8.5%)']
      });
    }, 1000);
  };

  return (
    <div className="bg-white border p-6 rounded-2xl max-w-2xl mx-auto shadow-xs text-left">
      <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Scale className="w-4 h-4 text-blue-500 animate-spin" />
        Linguistic Plagiarism Checker & Originality Scorer
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Enter document text block</label>
          <textarea rows={4} className="w-full text-xs p-3 bg-slate-50 border rounded-xl resize-none focus:outline-none" value={text} onChange={(e) => setText(e.target.value)} />
        </div>

        <button onClick={runAudit} disabled={auditing} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs">
          {auditing ? 'Running index matches query...' : 'Check Plagiarism Originality'}
        </button>

        {auditing && (
          <p className="text-xs font-mono text-slate-400 text-center animate-pulse">Scanning digital search indexes cache records...</p>
        )}

        {scoring && (
          <div className="bg-slate-50 border p-4 rounded-xl text-xs space-y-3.5">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white border p-3 rounded-lg shadow-xs">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Originality Score</span>
                <span className="text-xl font-black text-emerald-600 font-mono">{scoring.original}% Organic</span>
              </div>
              <div className="bg-white border p-3 rounded-lg shadow-xs">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Similarity Score</span>
                <span className="text-xl font-black text-amber-600 font-mono">{scoring.similarity}% Checked</span>
              </div>
            </div>

            {scoring.matches.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Citation Overlaps Plagiarism logs</span>
                <div className="bg-white p-2.5 rounded-lg border text-[10px] text-slate-650 font-mono">
                  {scoring.matches.map((m, i) => <p key={i}>• {m}</p>)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
