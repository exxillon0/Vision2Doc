'use client';

import React, {useState} from 'react';
import {GoogleGenAI} from '@google/genai';
import {ImageUploader} from '@/components/ImageUploader';
import {ResultDisplay} from '@/components/ResultDisplay';
import {Scan, Sparkles, Loader2} from 'lucide-react';
import {motion} from 'motion/react';

export default function Vision2DocPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcessImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);
    setExtractedText('');

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key is missing. Please configure it in the Secrets panel.');
      }

      const ai = new GoogleGenAI({apiKey});
      const model = 'gemini-2.5-flash-image';

      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(selectedFile);
      });

      const base64Data = await base64Promise;

      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: selectedFile.type,
              },
            },
            {
              text: "Extract and summarize the text from this image into a structured summary (conspectus). Follow these formatting rules:\n1. Use hierarchical headers for main sections (e.g., # for main title, ## for sections).\n2. Use bulleted (*) or numbered (1.) lists for key points and details.\n3. Highlight important keywords and terms by wrapping them in double asterisks (e.g., **keyword**).\n4. Ensure the output is logical, scannable, and well-organized.\nOnly return the formatted text, no conversational filler.",
            },
          ],
        },
      });

      const text = response.text;
      if (text) {
        setExtractedText(text);
      } else {
        throw new Error('No text could be extracted from this image.');
      }
    } catch (err: any) {
      console.error('Processing error:', err);
      setError(err.message || 'An error occurred while processing the image.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{opacity: 0, y: -20}}
            animate={{opacity: 1, y: 0}}
            className="inline-flex items-center justify-center p-2 bg-emerald-100 rounded-full mb-4"
          >
            <Sparkles className="w-6 h-6 text-emerald-600" />
          </motion.div>
          <motion.h1
            initial={{opacity: 0, y: -10}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.1}}
            className="text-4xl font-bold text-zinc-900 tracking-tight sm:text-5xl"
          >
            Vision2Doc
          </motion.h1>
          <motion.p
            initial={{opacity: 0, y: -10}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.2}}
            className="mt-4 text-lg text-zinc-600 max-w-2xl mx-auto"
          >
            Upload an image to extract and format text using AI. Export your results directly to a Word document.
          </motion.p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <ImageUploader
            onImageSelect={(file) => setSelectedFile(file)}
            onClear={() => {
              setSelectedFile(null);
              setExtractedText('');
              setError(null);
            }}
          />

          {selectedFile && !extractedText && !isProcessing && (
            <motion.div
              initial={{opacity: 0, scale: 0.9}}
              animate={{opacity: 1, scale: 1}}
              className="flex justify-center"
            >
              <button
                onClick={handleProcessImage}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300 active:scale-95"
              >
                <Scan className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Extract Text
              </button>
            </motion.div>
          )}

          {isProcessing && (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
              <p className="text-zinc-500 font-medium animate-pulse">AI is reading your image...</p>
            </div>
          )}

          {error && (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-center text-sm font-medium"
            >
              {error}
            </motion.div>
          )}

          <ResultDisplay text={extractedText} isLoading={isProcessing} />
        </div>

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-zinc-200 text-center text-zinc-400 text-sm">
          <p>© {new Date().getFullYear()} Vision2Doc AI. Powered by Gemini.</p>
        </footer>
      </div>
    </main>
  );
}
