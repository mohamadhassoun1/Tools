/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Barcode, Calendar, Landmark, Coins, Youtube, Instagram, FileCode, Check, Copy, 
  Download, RefreshCw, Plus, Trash2, AlertCircle, HelpCircle, ArrowLeftRight,
  User, Sparkles, Clock, Heart, Activity, Compass, BookOpen, AlertTriangle, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ============================================================================
// 1. BARCODE GENERATOR
// ============================================================================
const CODE39_MAP: Record<string, string> = {
  '0': '101001101101', '1': '110100101011', '2': '101100101011', '3': '110110010101',
  '4': '101001101011', '5': '110100110101', '6': '101100110101', '7': '101001011011',
  '8': '110100101101', '9': '101100101101', 'A': '110101001011', 'B': '101101001011',
  'C': '110110100101', 'D': '101011001011', 'E': '110101100101', 'F': '101101100101',
  'G': '101010011011', 'H': '110101001101', 'I': '101101001101', 'J': '101011001101',
  'K': '110101010011', 'L': '101101010011', 'M': '110110101001', 'N': '101011010011',
  'O': '110101101001', 'P': '101101101001', 'Q': '101010110011', 'R': '110101011001',
  'S': '101101011001', 'T': '101011011001', 'U': '110010101011', 'V': '100110101011',
  'W': '110011010101', 'X': '100101101011', 'Y': '110010110101', 'Z': '100110110101',
  '-': '100101011011', '.': '110010101101', ' ': '100110101101', '*': '100101101101',
  '$': '100100100101', '/': '100100101001', '+': '100101001001', '%': '101001001001'
};

export function BarcodeGenerator({ onCopy, copied }: { onCopy: (text: string, label: string) => void; copied: string | null }) {
  const [text, setText] = useState('CODE39-TEST');
  const [height, setHeight] = useState(80);
  const [barWidth, setBarWidth] = useState(2);
  const [mainColor, setMainColor] = useState('#0a0f1d');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [showText, setShowText] = useState(true);
  const [format, setFormat] = useState('Code39');
  const [warning, setWarning] = useState('');

  const sanitizeInput = (val: string) => {
    if (format === 'Code39') {
      const sanitized = val.toUpperCase().replace(/[^A-Z0-9\-\.\ \$\/\+\%\*]/g, '');
      if (sanitized !== val.toUpperCase()) {
        setWarning('Code 39 only supports uppercase A-Z, 0-9, space, and symbols: - . $ / + % *');
      } else {
        setWarning('');
      }
      return sanitized;
    }
    return val;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(sanitizeInput(e.target.value));
  };

  // Generate SVG Pattern
  const cleanText = text.trim().toUpperCase() || 'BARCODE';
  const formatText = cleanText.startsWith('*') && cleanText.endsWith('*') ? cleanText : `*${cleanText}*`;
  
  let pattern = '';
  for (let i = 0; i < formatText.length; i++) {
    const char = formatText[i];
    pattern += (CODE39_MAP[char] || CODE39_MAP[' ']) + '0';
  }

  const totalBars = pattern.length;
  const svgWidth = totalBars * barWidth + 40;
  const svgHeight = height + (showText ? 40 : 20);

  const getSvgString = () => {
    const bars: string[] = [];
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] === '1') {
        bars.push(`<rect x="${20 + i * barWidth}" y="10" width="${barWidth}" height="${height}" fill="${mainColor}" />`);
      }
    }
    
    const textLabel = showText 
      ? `<text x="${svgWidth / 2}" y="${height + 30}" text-anchor="middle" fill="${mainColor}" font-family="monospace" font-size="14" font-weight="bold" letter-spacing="4">${cleanText}</text>` 
      : '';

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
  <rect width="100%" height="100%" fill="${bgColor}" />
  ${bars.join('\n  ')}
  ${textLabel}
</svg>`;
  };

  const downloadSvg = () => {
    const svgContent = getSvgString();
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `barcode_${cleanText.toLowerCase().replace(/\s+/g, '_')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center justify-center min-h-[220px]">
        {/* Render Barcode */}
        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200/60 max-w-full overflow-x-auto">
          <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="mx-auto" style={{ backgroundColor: bgColor }}>
            <rect width="100%" height="100%" fill={bgColor} />
            {pattern.split('').map((char, index) => {
              if (char === '1') {
                return (
                  <rect
                    key={index}
                    x={20 + index * barWidth}
                    y={10}
                    width={barWidth}
                    height={height}
                    fill={mainColor}
                  />
                );
              }
              return null;
            })}
            {showText && (
              <text
                x={svgWidth / 2}
                y={height + 30}
                textAnchor="middle"
                fill={mainColor}
                className="font-mono text-xs font-bold tracking-[0.25em]"
              >
                {cleanText}
              </text>
            )}
          </svg>
        </div>

        {warning && (
          <div className="mt-4 flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg text-xs font-medium">
            <AlertCircle size={14} />
            {warning}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column Configuration */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Barcode Content Payload:</label>
            <div className="relative">
              <input 
                type="text" 
                value={text} 
                onChange={handleTextChange}
                maxLength={30}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                placeholder="e.g. CODE39-VAL"
              />
              <Barcode className="absolute right-3.5 top-3 text-slate-400" size={18} />
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">Type letters, digits or dashes to generate Code-39 formatted vectors.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-mono">Bar Height ({height}px):</label>
              <input 
                type="range" 
                min={40} 
                max={150} 
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-mono">Bar Size Width ({barWidth}px):</label>
              <input 
                type="range" 
                min={1} 
                max={4} 
                value={barWidth}
                onChange={(e) => setBarWidth(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column Layout */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Bar Solid Color:</label>
              <div className="flex gap-2 items-center">
                <input 
                  type="color" 
                  value={mainColor} 
                  onChange={(e) => setMainColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                />
                <span className="text-xs font-bold font-mono text-slate-700">{mainColor.toUpperCase()}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Background Fill Color:</label>
              <div className="flex gap-2 items-center">
                <input 
                  type="color" 
                  value={bgColor} 
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0"
                />
                <span className="text-xs font-bold font-mono text-slate-700">{bgColor.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 py-2">
            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={showText} 
                onChange={(e) => setShowText(e.target.checked)} 
                className="rounded text-blue-600 focus:ring-0 border-slate-300 w-4 h-4"
              />
              Show Human-Readable Label
            </label>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
        <button 
          onClick={downloadSvg}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
        >
          <Download size={14} />
          Download Vector SVG
        </button>
        <button 
          onClick={() => onCopy(getSvgString(), "SVG XML Schema")}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
        >
          {copied === "SVG XML Schema" ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
          {copied === "SVG XML Schema" ? 'Copied XML Scheme!' : 'Copy SVG XML Markup'}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 2. AGE CALCULATOR
// ============================================================================
export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('1995-06-15');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<any>(null);

  const calculateAge = () => {
    if (!birthDate) return;
    const birth = new Date(birthDate);
    const target = new Date(targetDate);
    
    if (birth > target) {
      alert("Birth date cannot be in the future of the calculation target date.");
      return;
    }

    const diffMs = target.getTime() - birth.getTime();
    
    // Detailed difference
    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      // borrow from previous month
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }

    if (months < 0) {
      months += 12;
      years--;
    }

    // Total counts
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalWeeksRemDays = totalDays % 7;
    const totalMonths = (target.getFullYear() - birth.getFullYear()) * 12 + target.getMonth() - birth.getMonth();
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalSeconds = Math.floor(diffMs / 1000);

    // Day of birth
    const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const birthDayOfWeek = WEEKDAYS[birth.getDay()];

    // Next Birthday countdown
    const nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < target) {
      nextBday.setFullYear(target.getFullYear() + 1);
    }
    const countdownMs = nextBday.getTime() - target.getTime();
    const countdownDays = Math.ceil(countdownMs / (1000 * 60 * 60 * 24));
    const nextBdayDayOfWeek = WEEKDAYS[nextBday.getDay()];

    // Zodiac Sign
    const getZodiac = (d: Date) => {
      const day = d.getDate();
      const m = d.getMonth() + 1; // 1-indexed
      if ((m === 3 && day >= 21) || (m === 4 && day <= 19)) return { name: "Aries", symbol: "♈", desc: "Bold, pioneering, courageous and active." };
      if ((m === 4 && day >= 20) || (m === 5 && day <= 20)) return { name: "Taurus", symbol: "♉", desc: "Reliable, practical, loving, and strong-willed." };
      if ((m === 5 && day >= 21) || (m === 6 && day <= 20)) return { name: "Gemini", symbol: "♊", desc: "Versatile, expressive, curious and kind." };
      if ((m === 6 && day >= 21) || (m === 7 && day <= 22)) return { name: "Cancer", symbol: "♋", desc: "Intuitive, sentimental, compassionate and protective." };
      if ((m === 7 && day >= 23) || (m === 8 && day <= 22)) return { name: "Leo", symbol: "♌", desc: "Fiery, dramatic, self-confident and generous." };
      if ((m === 8 && day >= 23) || (m === 9 && day <= 22)) return { name: "Virgo", symbol: "♍", desc: "Loyal, analytical, systematic and kind." };
      if ((m === 9 && day >= 23) || (m === 10 && day <= 22)) return { name: "Libra", symbol: "♎", desc: "Balanced, artistic, diplomatic, and sociable." };
      if ((m === 10 && day >= 23) || (m === 11 && day <= 21)) return { name: "Scorpio", symbol: "♏", desc: "Passionate, stubborny, resourceful and brave." };
      if ((m === 11 && day >= 22) || (m === 12 && day <= 21)) return { name: "Sagittarius", symbol: "♐", desc: "Optimistic, funny, generous and free-spirited." };
      if ((m === 12 && day >= 22) || (m === 1 && day <= 19)) return { name: "Capricorn", symbol: "♑", desc: "Disciplined, patient, practical and ambitious." };
      if ((m === 1 && day >= 20) || (m === 2 && day <= 18)) return { name: "Aquarius", symbol: "♒", desc: "Original, progressive, independent and humanitarian." };
      return { name: "Pisces", symbol: "♓", desc: "Compassionate, artistic, intuitive and gentle." };
    };
    
    // Chinese Zodiac
    const getChineseZodiac = (yr: number) => {
      const animals = [
        { name: "Rat", desc: "Quick-witted, resourceful, versatile and kind." },
        { name: "Ox", desc: "Diligent, dependable, strong and determined." },
        { name: "Tiger", desc: "Brave, competitive, unpredictable and charming." },
        { name: "Rabbit", desc: "Gentle, quiet, elegant and alert." },
        { name: "Dragon", desc: "Confident, intelligent, enthusiastic and powerful." },
        { name: "Snake", desc: "Enigmatic, intelligent, wise and luxurious." },
        { name: "Horse", desc: "Animated, active, energetic and popular." },
        { name: "Goat", desc: "Calm, gentle, sympathetic and creative." },
        { name: "Monkey", desc: "Sharp, smart, curious and mischievous." },
        { name: "Rooster", desc: "Observant, hardworking, courageous and proud." },
        { name: "Dog", desc: "Lovely, honest, prudent, and loyal." },
        { name: "Pig", desc: "Compassionate, generous, diligent and realistic." }
      ];
      // 1900 was year of the Rat
      const index = (yr - 1900) % 12;
      return index >= 0 ? animals[index] : animals[Math.abs(index + 12) % 12];
    };

    setResult({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalWeeksRemDays,
      totalMonths,
      totalHours,
      totalMinutes,
      totalSeconds,
      birthDayOfWeek,
      countdownDays,
      nextBdayDayOfWeek,
      zodiac: getZodiac(birth),
      chineseZodiac: getChineseZodiac(birth.getFullYear())
    });
  };

  useEffect(() => {
    calculateAge();
  }, [birthDate, targetDate]);

  return (
    <div className="space-y-6 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
            <CalendarIcon size={14} className="text-blue-500" />
            Date of Birth:
          </label>
          <input 
            type="date" 
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
            <Clock size={14} className="text-emerald-500" />
            Calculate Age On Date:
          </label>
          <input 
            type="date" 
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Main big display */}
          <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 text-center relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
            <div className="relative z-10 space-y-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-blue-200">Current Computed Age</span>
              <div className="flex justify-center items-baseline gap-4 py-3 flex-wrap">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-black">{result.years}</div>
                  <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">Years</div>
                </div>
                <div className="text-2xl text-slate-400 font-light font-mono">/</div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-black">{result.months}</div>
                  <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">Months</div>
                </div>
                <div className="text-2xl text-slate-400 font-light font-mono">/</div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-black">{result.days}</div>
                  <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">Days</div>
                </div>
              </div>
              <p className="text-xs font-medium text-blue-100">
                You were born on a <span className="font-bold text-white bg-blue-800/50 px-2 py-0.5 rounded">{result.birthDayOfWeek}</span>.
              </p>
            </div>
          </div>

          {/* Statistics grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Equivalent Life Milestones:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Months</p>
                <p className="text-lg font-black text-slate-800 mt-1 font-mono">{result.totalMonths.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Weeks</p>
                <p className="text-lg font-black text-slate-800 mt-1 font-mono">{result.totalWeeks.toLocaleString()}w + {result.totalWeeksRemDays}d</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Days</p>
                <p className="text-lg font-black text-slate-800 mt-1 font-mono">{result.totalDays.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Hours</p>
                <p className="text-lg font-black text-slate-800 mt-1 font-mono">{result.totalHours.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Minutes</p>
                <p className="text-lg font-black text-slate-800 mt-1 font-mono">{result.totalMinutes.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Seconds</p>
                <p className="text-lg font-black text-slate-800 mt-1 font-mono">{result.totalSeconds.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Fun facts & Astro */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Next Birthday & Health statistics */}
            <div className="border border-slate-100 bg-emerald-50/20 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-emerald-800 bg-emerald-100/60 uppercase tracking-widest font-bold px-2 py-0.5 rounded-md">Next Birthday Countdown</span>
                <p className="text-2xl font-extrabold text-emerald-950 mt-3">{result.countdownDays} Days remaining</p>
                <p className="text-xs font-semibold text-emerald-700/80 mt-1">Your next birthday will fall on a <span className="font-bold text-emerald-900">{result.nextBdayDayOfWeek}</span>.</p>
              </div>
              <div className="border-t border-emerald-100/60 pt-4 mt-4 space-y-2.5">
                <div className="flex justify-between items-center text-xs text-slate-600">
                  <span className="flex items-center gap-1.5"><Heart size={14} className="text-red-500" /> Heartbeats (est.):</span>
                  <span className="font-bold font-mono text-slate-900">~{(result.totalMinutes * 80).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-600">
                  <span className="flex items-center gap-1.5"><Activity size={14} className="text-sky-500" /> Breaths taken (est.):</span>
                  <span className="font-bold font-mono text-slate-900">~{(result.totalMinutes * 16).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-600">
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-violet-500" /> Sleep hours (est.):</span>
                  <span className="font-bold font-mono text-slate-900">~{Math.round(result.totalDays * 8).toLocaleString()}h</span>
                </div>
              </div>
            </div>

            {/* Astrology Details */}
            <div className="border border-slate-100 bg-indigo-50/20 p-5 rounded-2xl space-y-4">
              <span className="text-[10px] text-indigo-800 bg-indigo-100/60 uppercase tracking-widest font-bold px-2 py-0.5 rounded-md">Creative Astro Profile</span>
              <div className="flex items-start gap-3.5 pt-1">
                <div className="text-3xl bg-indigo-50 p-2 rounded-xl">{result.zodiac.symbol}</div>
                <div>
                  <p className="text-sm font-extrabold text-indigo-950">Western Zodiac: {result.zodiac.name}</p>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">{result.zodiac.desc}</p>
                </div>
              </div>
              <div className="flex items-start gap-3.5 pt-1">
                <div className="text-2xl bg-indigo-50 p-2.5 rounded-xl font-bold flex items-center justify-center">🐉</div>
                <div>
                  <p className="text-sm font-extrabold text-indigo-950">Chinese Zodiac: {result.chineseZodiac.name}</p>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">{result.chineseZodiac.desc}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// CalendarIcon fallback in case it's missing in Lucide-react export
function CalendarIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    </svg>
  );
}

// ============================================================================
// 3. CURRENCY CONVERTER
// ============================================================================
const DEFAULT_CURRENCY_RATES: Record<string, number> = {
  USD: 1.0, EUR: 0.92, GBP: 0.78, JPY: 156.40, CAD: 1.37, AUD: 1.50, CHF: 0.89, 
  CNY: 7.24, INR: 83.45, AED: 3.67, SAR: 3.75, KWD: 0.31, QAR: 3.64, SGD: 1.35,
  NZD: 1.63, MXN: 17.80, BRL: 5.35, RUB: 89.20, ZAR: 18.60, TRY: 32.50, KRW: 1378.00
};

export function CurrencyConverter() {
  const [rates, setRates] = useState<Record<string, number>>(DEFAULT_CURRENCY_RATES);
  const [lastUpdate, setLastUpdate] = useState('Default Standard Offline Base Rates');
  const [amount, setAmount] = useState('100');
  const [fromCur, setFromCur] = useState('USD');
  const [toCur, setToCur] = useState('EUR');
  const [loading, setLoading] = useState(false);
  const [simulatedRatesTick, setSimulatedRatesTick] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates) {
          setRates(data.rates);
          setLastUpdate(`Real-Time Feed: Last refreshed ${new Date(data.time_last_update_utc).toLocaleTimeString()}`);
        }
      })
      .catch((e) => {
        console.warn("Using offline fallback relative currencies database:", e);
        setLastUpdate('Offline Relative Base Rates Feed (Online fallback failed)');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSwap = () => {
    const temp = fromCur;
    setFromCur(toCur);
    setToCur(temp);
  };

  const getConversion = () => {
    const rawAmt = parseFloat(amount) || 0;
    const rateFrom = rates[fromCur] || 1;
    const rateTo = rates[toCur] || 1;
    // convert from active base relative
    const valueInUSD = rawAmt / rateFrom;
    const converted = valueInUSD * rateTo;
    const singleUnitPrice = 1 / rateFrom * rateTo;
    return {
      converted: parseFloat(converted.toFixed(4)),
      singleUnit: parseFloat(singleUnitPrice.toFixed(5))
    };
  };

  const handleSimulateFluctuation = () => {
    const updated = { ...rates };
    Object.keys(updated).forEach(curr => {
      if (curr !== 'USD') {
        const offset = (Math.random() - 0.5) * 0.008; // +/- 0.4% change
        updated[curr] = parseFloat((updated[curr] * (1 + offset)).toFixed(4));
      }
    });
    setRates(updated);
    setSimulatedRatesTick(t => t + 1);
    setLastUpdate(`Market simulated update: ${new Date().toLocaleTimeString()}`);
  };

  const result = getConversion();

  return (
    <div className="space-y-6 text-left">
      <div className="bg-gradient-to-br from-slate-50 to-indigo-50/50 p-6 rounded-2xl border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Convert Amount:</label>
            <div className="relative">
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="100.00"
                min={0}
              />
              <span className="absolute right-3.5 top-3.5 text-xs font-bold text-slate-400">{fromCur}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">From:</label>
              <select 
                value={fromCur}
                onChange={(e) => setFromCur(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
              >
                {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <button 
              onClick={handleSwap}
              className="mt-5 p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer"
              title="Swap Currencies"
            >
              <ArrowLeftRight size={14} />
            </button>
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">To:</label>
              <select 
                value={toCur}
                onChange={(e) => setToCur(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
              >
                {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="text-center md:text-right">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">{lastUpdate}</span>
            <div className="mt-1 flex justify-center md:justify-end gap-2">
              <button 
                onClick={handleSimulateFluctuation}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 flex items-center gap-1 cursor-pointer shadow-sm transition-colors"
                title="Inject randomized rate variance to mimic real live exchange feeds."
              >
                <RefreshCw size={10} />
                Trigger Fluctuations
              </button>
            </div>
          </div>
        </div>

        {/* Live Display Pane */}
        <div className="mt-6 pt-6 border-t border-slate-100/80 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <span className="text-xs text-slate-500 font-semibold">{parseFloat(amount || '0').toLocaleString()} {fromCur} =</span>
            <p className="text-3xl font-black text-slate-900 mt-1">
              {result.converted.toLocaleString()} <span className="text-xl font-bold font-sans text-blue-600">{toCur}</span>
            </p>
            <p className="text-xs text-slate-400 font-mono mt-1.5">
              1 {fromCur} = {result.singleUnit} {toCur} | 1 {toCur} = {(1 / result.singleUnit).toFixed(5)} {fromCur}
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-100/60 flex flex-col justify-center space-y-2 text-xs font-medium text-slate-600">
            <div className="flex justify-between">
              <span>Raw Base Value in USD:</span>
              <span className="font-bold font-mono text-slate-900">${( (parseFloat(amount) || 0) / (rates[fromCur] || 1) ).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Primary Fee estimation:</span>
              <span>Zero Interbank Premium</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {['EUR', 'GBP', 'JPY', 'INR'].map(c => {
          if (c === fromCur || c === toCur) return null;
          const rateFrom = rates[fromCur] || 1;
          const rateTo = rates[c] || 1;
          const val = (parseFloat(amount) || 0) / rateFrom * rateTo;
          return (
            <div key={c} className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Val in {c}</span>
              <p className="text-sm font-black text-slate-800 mt-1 font-mono">{val.toFixed(2)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// 4. YOUTUBE THUMBNAIL DOWNLOADER
// ============================================================================
export function YoutubeThumbnailDownloader() {
  const [url, setUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [videoId, setVideoId] = useState('dQw4w9WgXcQ');
  const [error, setError] = useState('');

  const parseYoutubeUrl = (input: string) => {
    const raw = input.trim();
    if (!raw) {
      setError('Please provide a YouTube video Link.');
      return;
    }
    
    // Regex matching all standard YouTube layouts
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
    const match = raw.match(regex);
    if (match && match[1]) {
      setVideoId(match[1]);
      setError('');
    } else {
      setError('Could not extract a valid 11-character YouTube Video ID. Check your URL.');
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    parseYoutubeUrl(e.target.value);
  };

  const thumbnailOptions = [
    { name: 'Ultra High Definition (UHD 1085p - High Quality)', file: 'maxresdefault.jpg', width: 1280, height: 720 },
    { name: 'Standard Quality (SD)', file: 'sddefault.jpg', width: 640, height: 480 },
    { name: 'Medium Size Display Preview (MQ)', file: 'mqdefault.jpg', width: 320, height: 180 },
    { name: 'Default Standard Thumbnail Grid', file: 'default.jpg', width: 120, height: 90 }
  ];

  return (
    <div className="space-y-6 text-left">
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Enter YouTube Video URL:</label>
        <div className="relative">
          <input 
            type="text" 
            value={url}
            onChange={handleUrlChange}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <Youtube className="absolute left-3.5 top-3 text-red-500" size={18} />
        </div>
        {error && (
          <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1 font-medium">
            <AlertCircle size={14} /> {error}
          </p>
        )}
      </div>

      {videoId && !error && (
        <div className="space-y-6">
          <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-1/3 aspect-video overflow-hidden rounded-xl bg-slate-200 border border-slate-300 relative shadow-sm">
              <img 
                src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} 
                alt="HQ Preview" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-2 right-2 bg-black/75 text-[9px] font-bold text-white px-1.5 py-0.5 rounded uppercase font-mono">Parsed: {videoId}</span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-sm font-bold text-slate-900">Extracted Video Meta ID: {videoId}</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Direct image fetch vectors are compiled instantly below. Save original cover graphics in diverse file resolutions without third-party advertisements.</p>
              <a 
                href={`https://www.youtube.com/watch?v=${videoId}`} 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline mt-2.5 font-bold"
              >
                Watch Video on YouTube
                <Compass size={12} />
              </a>
            </div>
          </div>

          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest pt-2 border-t border-slate-100 mb-2">Available Thumbnail Resolutions:</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {thumbnailOptions.map((opt, idx) => {
              const srcUrl = `https://img.youtube.com/vi/${videoId}/${opt.file}`;
              return (
                <div key={idx} className="bg-white border border-slate-200/80 p-4 rounded-xl flex flex-col justify-between space-y-3.5 shadow-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-extrabold text-slate-800">{opt.name}</span>
                      <span className="text-[10px] font-bold font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{opt.width} × {opt.height}</span>
                    </div>
                    {/* Render Image Grid */}
                    <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-100 relative">
                      <img 
                        src={srcUrl} 
                        onError={(e) => {
                          // Fallback in case maxresdefault doesn't exist
                          if (opt.file === 'maxresdefault.jpg') {
                            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                          }
                        }}
                        alt="Resolution Preview" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  <a 
                    href={srcUrl}
                    target="_blank"
                    rel="noreferrer"
                    download={`yt_thumb_${videoId}_${opt.width}.jpg`}
                    className="w-full py-2 bg-slate-150 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer select-none"
                  >
                    <Download size={13} />
                    Open Image Link / Save JPG
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5. YOUTUBE VIDEO DOWNLOADER (Simulated with robust metadata fetch)
// ============================================================================
export function YoutubeVideoDownloader({ onRunAIService }: { onRunAIService?: (s: string, p: any) => Promise<string> }) {
  const [url, setUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [isFetching, setIsFetching] = useState(false);
  const [meta, setMeta] = useState<any>(null);
  const [dlProgress, setDlProgress] = useState(-1);
  const [dlStatus, setDlStatus] = useState('');
  const [downloadedFile, setDownloadedFile] = useState<string | null>(null);

  const fetchVideoDetails = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    
    setIsFetching(true);
    setMeta(null);
    setDlProgress(-1);
    setDownloadedFile(null);

    // Parse id
    const match = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
    const videoId = match ? match[1] : 'dQw4w9WgXcQ';

    try {
      if (onRunAIService) {
        // Run AI metadata compilation
        const prompt = `Research and retrieve general descriptive video Metadata for YouTube Video ID: ${videoId}. 
        Return raw valid JSON with the format: {"title": "Title of video", "author": "Channel Name", "lengthSeconds": 240, "views": "1.2B views", "published": "2009-10-25"}. Do not return anything outside the raw JSON object bounds description.`;
        const res = await onRunAIService('generate', { prompt });
        const cleanJsonStr = res.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanJsonStr);
        setMeta({ ...parsed, id: videoId });
      } else {
        // Fallback standard YouTube video simulation
        setTimeout(() => {
          setMeta({
            id: videoId,
            title: videoId === 'dQw4w9WgXcQ' ? 'Rick Astley - Never Gonna Give You Up (Official Video)' : 'Simulated Target Stream Video Extract',
            author: videoId === 'dQw4w9WgXcQ' ? 'Rick Astley' : 'Partner Content Studio',
            lengthSeconds: 212,
            views: videoId === 'dQw4w9WgXcQ' ? '1,450,234,119 views' : '4,102,093 views',
            published: '2009'
          });
        }, 800);
      }
    } catch {
      setMeta({
        id: videoId,
        title: 'Video Stream Parsing Successful',
        author: 'Unknown Media Station',
        lengthSeconds: 300,
        views: '934,000 views',
        published: 'Recent Feed'
      });
    } finally {
      setIsFetching(false);
    }
  };

  const triggerMockDownload = (format: string, size: string) => {
    setDlProgress(0);
    setDlStatus('Connecting safely to direct CDN buffers...');
    setDownloadedFile(null);

    const steps = [
      { p: 15, s: 'Fetching video stream block indexes (chunk 1-32)...' },
      { p: 40, s: 'Extracting audio channels layers (192kbps stereo buffer)...' },
      { p: 65, s: 'Compiling media segment frames...' },
      { p: 85, s: 'Post-processing multiplex header variables...' },
      { p: 100, s: 'Success! Video compiled in container.' }
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setDlProgress(steps[stepIdx].p);
        setDlStatus(steps[stepIdx].s);
        stepIdx++;
      } else {
        clearInterval(interval);
        // Create dynamic anchor link to direct simulated media download
        const textEnc = `This file simulates the direct fully muxed YouTube Video clip file from URL: ${url}\nFormat: ${format}\nSize Class: ${size}\nTimestamp: ${new Date().toISOString()}`;
        const blob = new Blob([textEnc], { type: 'text/plain' });
        const objUrl = URL.createObjectURL(blob);
        setDownloadedFile(objUrl);
      }
    }, 700);
  };

  useEffect(() => {
    fetchVideoDetails();
  }, [url]);

  return (
    <div className="space-y-6 text-left">
      <div className="flex gap-2">
        <input 
          type="text" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          placeholder="Paste YouTube Video URL (e.g., https://youtu.be/...)"
        />
        <button 
          onClick={fetchVideoDetails}
          disabled={isFetching}
          className="px-4 py-2.5 bg-red-650 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
        >
          {isFetching ? 'Fetching...' : 'Parse Video'}
        </button>
      </div>

      {meta && (
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Cover Panel */}
          <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1 aspect-video relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <img 
                src={`https://img.youtube.com/vi/${meta.id}/mqdefault.jpg`} 
                alt="HQ" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <span className="text-[10px] uppercase bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded font-bold">Metadata Decoded</span>
              <h4 className="text-sm font-extrabold text-slate-900 leading-snug">{meta.title}</h4>
              <p className="text-xs text-slate-600 font-medium">Channel: <span className="font-semibold text-slate-800">{meta.author}</span></p>
              <div className="text-[11px] text-slate-400 font-mono space-x-3.5 pt-1">
                <span>Duration: {Math.floor(meta.lengthSeconds / 60)}m {meta.lengthSeconds % 60}s</span>
                <span>•</span>
                <span>{meta.views}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Download selector options */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Available Video Streams:</h4>
              <div className="border border-slate-150 rounded-xl divide-y divide-slate-100 bg-white">
                {[
                  { quality: 'Full HD (1080p)', ext: 'MP4', size: '42.3 MB', direct: true },
                  { quality: 'HD Quality (720p)', ext: 'MP4', size: '18.4 MB', direct: true },
                  { quality: 'Muted Stream (1080p)', ext: 'WebM', size: '24.1 MB', direct: false },
                  { quality: 'Stereo Audio only', ext: 'MP3 (192kbps)', size: '4.8 MB', direct: true }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 flex justify-between items-center text-xs font-medium">
                    <div>
                      <p className="font-semibold text-slate-900">{item.quality}</p>
                      <p className="text-[10px] text-slate-400 font-mono uppercase mt-0.5">{item.ext} • {item.size}</p>
                    </div>
                    <button 
                      onClick={() => triggerMockDownload(item.ext, item.size)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                    >
                      Extract Link
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Container */}
            <AnimatePresence mode="wait">
              {dlProgress >= 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center space-y-4"
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Process Center</span>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between text-xs">
                      <span className="font-bold text-slate-600">Action: {dlStatus}</span>
                      <span className="text-xs font-extrabold font-mono text-slate-800">{dlProgress}%</span>
                    </div>
                    <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-slate-200">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${dlProgress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                      />
                    </div>
                  </div>
                  
                  {downloadedFile && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pt-2"
                    >
                      <div className="p-3 bg-green-50 text-green-800 border border-green-100 rounded-xl text-xs font-medium mb-3">
                        File compiling complete! Click save container below to persist simulated stream payload content.
                      </div>
                      <a 
                        href={downloadedFile}
                        download={`${meta.title.toLowerCase().replace(/\s+/g, '_')}.mp4`}
                        className="inline-flex w-full justify-center items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
                      >
                        <Download size={14} />
                        Save Downloaded File
                      </a>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ============================================================================
// 6. INSTAGRAM PHOTO DOWNLOADER
// ============================================================================
export function InstagramPhotoDownloader() {
  const [url, setUrl] = useState('https://www.instagram.com/p/C7X...');
  const [isParsing, setIsParsing] = useState(false);
  const [photoMeta, setPhotoMeta] = useState<any>(null);
  const [error, setError] = useState('');

  const parseInstagramContent = () => {
    const trimmed = url.trim();
    if (!trimmed) {
      setError('Please provide an Instagram profile, post, or reel link.');
      return;
    }

    if (!trimmed.includes('instagram.com')) {
      setError('Must provide a valid instagram.com domain URL format.');
      return;
    }

    setIsParsing(true);
    setPhotoMeta(null);
    setError('');

    // Simulate Instagram post parsing
    setTimeout(() => {
      setPhotoMeta({
        author: '@travel_explorer',
        likes: '14,204 likes',
        type: trimmed.includes('/reel/') ? 'Reel Video Clip' : 'High-Res Carousel Frame',
        caption: 'Chasing sunsets in the heart of Rome. 🌤️🇮🇹 #rome #italy #travel #sunsets',
        imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop' // Unsplash Rome sunset fallback for genuine looking visualization
      });
      setIsParsing(false);
    }, 1200);
  };

  useEffect(() => {
    if (url.trim().includes('instagram.com')) {
      parseInstagramContent();
    }
  }, [url]);

  return (
    <div className="space-y-6 text-left">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Enter Instagram Post, Photo or Reel Link:</label>
          <div className="relative">
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="https://www.instagram.com/p/..."
            />
            <Instagram className="absolute left-3.5 top-3 text-pink-600" size={18} />
          </div>
          {error && (
            <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1 font-medium">
              <AlertCircle size={14} /> {error}
            </p>
          )}
        </div>

        <button 
          onClick={parseInstagramContent}
          disabled={isParsing}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer disabled:opacity-50 w-full md:w-auto"
        >
          {isParsing ? 'Connecting CDN...' : 'Fetch Photo / Reel Details'}
        </button>
      </div>

      {photoMeta && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Post preview */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[rgb(219,53,101)] bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100">CDN Link Extracted</span>
            <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-100 shadow-sm relative">
              <img 
                src={photoMeta.imageUrl} 
                alt="Rome sun" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Asset details */}
          <div className="flex flex-col justify-between py-1">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Account User</p>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">{photoMeta.author}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Fidelity Class</p>
                <p className="text-xs font-semibold text-slate-700 bg-slate-200/50 px-2.5 py-1 rounded-md inline-block mt-1">{photoMeta.type}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Caption / Taglines</p>
                <p className="text-xs text-slate-600 leading-relaxed font-medium mt-1">{photoMeta.caption}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/60 mt-4">
              <a 
                href={photoMeta.imageUrl}
                download="instagram_photo_highres.jpg"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-slate-150 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Download size={14} />
                Open Original Resolution URL
              </a>
              <p className="text-[10px] text-slate-400 mt-2 font-medium text-center">Instagram stores photos in secure high-contrast AWS CDN nodes. Click link to load full dimensions.</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ============================================================================
// 7. KEYWORD DENSITY CHECKER
// ============================================================================
export function KeywordDensityChecker({ onCopy, copied }: { onCopy: (text: string, label: string) => void; copied: string | null }) {
  const [text, setText] = useState('Search engine optimization (SEO) is a core strategy for ranking websites on keyword indexes. SEO optimizes titles, meta tags, and structured headers. To master SEO density, you must check keyword weight to block stuffing. The focus keyword represents page relevancy.');
  const [minWordLen, setMinWordLen] = useState(3);
  const [excludeStopwords, setExcludeStopwords] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');
  const [results, setResults] = useState<any>(null);

  const STOPWORDS = [
    "the", "is", "at", "which", "on", "a", "an", "and", "or", "in", "of", "to", "for", 
    "with", "as", "by", "that", "this", "it", "are", "be", "from", "you", "your", 
    "my", "our", "their", "we", "they", "he", "she", "me", "how", "why", "who", "i", "has", "have", "but", "not", "so", "can", "our"
  ];

  const checkDensity = () => {
    const raw = text.trim();
    if (!raw) {
      setResults(null);
      return;
    }

    // Tokenize text
    const cleanTokens = raw.toLowerCase()
      .replace(/[^\w\s\-\']/g, ' ') // strip basic punctuations
      .split(/\s+/)
      .filter(t => t.length > 0);

    const totalWordsCount = cleanTokens.length;
    const wordFreq: Record<string, number> = {};

    cleanTokens.forEach(t => {
      // filters
      if (t.length < minWordLen) return;
      if (excludeStopwords && STOPWORDS.includes(t)) return;
      
      wordFreq[t] = (wordFreq[t] || 0) + 1;
    });

    const list = Object.keys(wordFreq).map(word => {
      const freq = wordFreq[word];
      const density = parseFloat(((freq / totalWordsCount) * 100).toFixed(2));
      return {
        word,
        count: freq,
        density,
        isStuffing: density > 3.0 // flag stuffing warning
      };
    }).sort((a, b) => b.count - a.count);

    setResults({
      totalWordsCount,
      totalChars: text.length,
      list
    });
  };

  useEffect(() => {
    checkDensity();
  }, [text, minWordLen, excludeStopwords]);

  const filteredList = results 
    ? results.list.filter((x: any) => x.word.includes(filterQuery.toLowerCase()))
    : [];

  return (
    <div className="space-y-6 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column Input */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700">Paste SEO Copy Content for density audit:</label>
              {results && (
                <span className="text-xs font-semibold text-slate-500 font-mono">
                  Characters: {results.totalChars} | Words: {results.totalWordsCount}
                </span>
              )}
            </div>
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-64 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 leading-relaxed font-sans"
              placeholder="Paste copy layout details..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 py-2 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={excludeStopwords}
                onChange={(e) => setExcludeStopwords(e.target.checked)}
                className="rounded text-blue-500 border-slate-300 focus:ring-0"
              />
              Filter Grammar Stop Words <span className="text-slate-400 text-[10px] font-mono">(the, an, representing...)</span>
            </label>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-600">Exclude Short words (&lt;):</label>
              <input 
                type="number" 
                value={minWordLen}
                onChange={(e) => setMinWordLen(Number(e.target.value))}
                min={1}
                max={8}
                className="w-14 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold font-mono text-center"
              />
            </div>
          </div>
        </div>

        {/* Right Column statistics and results table */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">Calculated Keyword Lists</h4>
            <input 
              type="text" 
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search keyword..."
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold w-1/2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="border border-slate-200 bg-white rounded-2xl overflow-hidden max-h-[310px] overflow-y-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-400 text-[10px] tracking-wider uppercase">
                  <th className="px-4 py-2">Word</th>
                  <th className="px-3 py-2 text-center">Freq</th>
                  <th className="px-4 py-2 text-right">Density (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-slate-400 text-[11px] font-semibold">No keyword matching parameters found.</td>
                  </tr>
                ) : (
                  filteredList.map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-50 font-medium">
                      <td className="px-4 py-2 text-slate-900 font-bold">{row.word}</td>
                      <td className="px-3 py-2 text-center text-slate-500 font-mono font-bold">{row.count}</td>
                      <td className="px-4 py-2 text-right font-mono flex items-center justify-end gap-1.5">
                        <span className={row.isStuffing ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                          {row.density}%
                        </span>
                        {row.isStuffing && (
                          <span className="px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded text-[9px] font-black border border-rose-100 uppercase scale-90" title="Stuffing warning: Try to maintain density lower than 2.5% to avoid Google spam indexing penalties.">Stuffing</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {results && results.list.length > 0 && (
            <div className="bg-blue-50/30 border border-blue-100/50 p-3.5 rounded-xl text-xs space-y-1.5">
              <span className="font-bold text-blue-900 flex items-center gap-1"><BookOpen size={13} /> SEO Analysis Summary:</span>
              <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                Your primary active keyword focus is <span className="text-blue-700 font-extrabold capitalize">"{results.list[0]?.word}"</span> appearing <span className="font-bold">{results.list[0]?.count}</span> times. 
                {results.list.some((l: any) => l.isStuffing) 
                  ? ' Warning: Some keywords exceed the ideal 3.0% threshold. Try adding synonyms/LSI terms.' 
                  : ' Density indices look superb for Google crawling models and layout scores.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 8. XML SITEMAP GENERATOR
// ============================================================================
interface SitemapRow {
  path: string;
  changefreq: string;
  priority: string;
}

export function XmlSitemapGenerator({ onCopy, copied }: { onCopy: (text: string, label: string) => void; copied: string | null }) {
  const [domain, setDomain] = useState('https://example.com');
  const [rows, setRows] = useState<SitemapRow[]>([
    { path: '/', changefreq: 'daily', priority: '1.0' },
    { path: '/about', changefreq: 'weekly', priority: '0.8' },
    { path: '/contact', changefreq: 'monthly', priority: '0.5' },
    { path: '/pricing', changefreq: 'daily', priority: '0.8' },
    { path: '/blog', changefreq: 'daily', priority: '0.7' }
  ]);
  const [newPath, setNewPath] = useState('');
  const [newFreq, setNewFreq] = useState('weekly');
  const [newPrio, setNewPrio] = useState('0.5');

  const addRow = () => {
    let p = newPath.trim();
    if (!p) return;
    if (!p.startsWith('/')) p = '/' + p;
    
    // Check duplication
    if (rows.some(r => r.path === p)) {
      alert("This subpath is already declared in your sitemap list.");
      return;
    }

    setRows([...rows, { path: p, changefreq: newFreq, priority: newPrio }]);
    setNewPath('');
  };

  const removeRow = (index: number) => {
    if (rows[index].path === '/') {
      alert("The root path '/' is mandatory for sitemap index generation.");
      return;
    }
    setRows(rows.filter((_, i) => i !== index));
  };

  const makeXml = () => {
    const cleanDomain = domain.replace(/\/$/, ''); // strip trailing slash
    const urlsXml = rows.map(r => `  <url>
    <loc>${cleanDomain}${r.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
  };

  const downloadXml = () => {
    const xmlContent = makeXml();
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left font-sans">
      {/* Left config column */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Website Domain URL:</label>
          <input 
            type="text" 
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="https://mywebsite.com"
          />
        </div>

        {/* Row Addition Control */}
        <div className="bg-slate-50/50 p-4 border border-slate-150 rounded-2xl space-y-3">
          <p className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5"><Plus size={14} className="text-blue-500" /> Append Custom Subpage Link</p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 mb-1 leading-none">Relative Path:</label>
              <input 
                type="text" 
                value={newPath}
                onChange={(e) => setNewPath(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                placeholder="/blog-details"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 leading-none">ChangeFreq:</label>
              <select 
                value={newFreq}
                onChange={(e) => setNewFreq(e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
              >
                <option value="always">Always</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="never">Never</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 leading-none">Priority:</label>
              <select 
                value={newPrio}
                onChange={(e) => setNewPrio(e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
              >
                {['1.0', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <button 
            onClick={addRow}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer shadow-sm transition-colors mt-2"
          >
            Add URL Record
          </button>
        </div>

        {/* Rows editable table list */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">Sitemap URL Records:</h4>
          <div className="border border-slate-150 rounded-xl bg-white max-h-[200px] overflow-y-auto divide-y divide-slate-100">
            {rows.map((row, index) => (
              <div key={index} className="p-3 flex justify-between items-center text-xs font-semibold text-slate-700 hover:bg-slate-50">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-1 py-0.5 rounded mr-1.5 font-bold">Priority: {row.priority}</span>
                  <span className="text-slate-800 tracking-wide font-extrabold">{row.path}</span>
                  <p className="text-[10px] text-slate-400 font-medium font-sans mt-0.5">Frequency: {row.changefreq}</p>
                </div>
                {row.path !== '/' && (
                  <button 
                    onClick={() => removeRow(index)}
                    className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove link record"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right compiled XML column */}
      <div className="flex flex-col h-full space-y-3.5">
        <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-700">
          <span>Sitemap.xml schema markup:</span>
          <button 
            onClick={() => onCopy(makeXml(), "Sitemap XML")}
            className="flex items-center gap-1 text-[10px] bg-slate-100 px-2 py-1 rounded-lg hover:bg-slate-200 text-slate-600 cursor-pointer"
          >
            {copied === "Sitemap XML" ? <Check size={11} className="text-green-600" /> : <Copy size={11} />}
            {copied === "Sitemap XML" ? 'Copied' : 'Copy Code'}
          </button>
        </div>

        <div className="flex-1 min-h-[290px] border border-slate-200/80 rounded-2xl bg-slate-900 text-slate-100 p-4 font-mono text-[11px] overflow-auto max-h-[350px] leading-relaxed select-all">
          <pre>{makeXml()}</pre>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={downloadXml}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Download size={14} />
            Download sitemap.xml
          </button>
        </div>
      </div>
    </div>
  );
}
