'use client';

import React from 'react';
import {Copy, Check, FileText} from 'lucide-react';
import {motion} from 'motion/react';
import {exportToDocx} from '@/lib/docx-export';

interface ResultDisplayProps {
  text: string;
  isLoading: boolean;
}

export function ResultDisplay({text, isLoading}: ResultDisplayProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = async () => {
    if (!text) return;
    await exportToDocx(text, 'vision2doc-export.docx');
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 p-8 rounded-2xl border border-zinc-200 bg-white shadow-sm animate-pulse">
        <div className="h-4 bg-zinc-100 rounded w-3/4 mb-4" />
        <div className="h-4 bg-zinc-100 rounded w-1/2 mb-4" />
        <div className="h-4 bg-zinc-100 rounded w-5/6 mb-4" />
        <div className="h-4 bg-zinc-100 rounded w-2/3" />
      </div>
    );
  }

  if (!text) return null;

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      className="w-full max-w-2xl mx-auto mt-8 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Extracted Text</h3>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4" />
            Export to Word
          </button>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-sm min-h-[200px] whitespace-pre-wrap font-sans text-zinc-800 leading-relaxed">
        {text}
      </div>
    </motion.div>
  );
}
