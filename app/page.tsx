const handleProcessImage = async () => {
  if (!selectedFile) return;

<<<<<<< HEAD
import React, {useState} from 'react';
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
      // Конвертируем файл в base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(selectedFile);
      });

      const base64Data = await base64Promise;

      // ВЫЗЫВАЕМ СВОЙ API
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Data,
          prompt: "Extract and summarize the text from this image into a structured summary (conspectus). Follow these formatting rules:\n1. Use hierarchical headers for main sections (e.g., # for main title, ## for sections).\n2. Use bulleted (*) or numbered (1.) lists for key points and details.\n3. Highlight important keywords and terms by wrapping them in double asterisks (e.g., **keyword**).\n4. Ensure the output is logical, scannable, and well-organized.\nOnly return the formatted text, no conversational filler."
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process image');
      }

      setExtractedText(data.text);
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setIsProcessing(false);
=======
  setIsProcessing(true);
  setError(null);
  setExtractedText('');

  try {
    // ✅ ИСПРАВЛЕНО: убрал NEXT_PUBLIC_
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key is missing. Please configure it in the Secrets panel.');
>>>>>>> 314357daa830a30aca5d1b1b35939791871be5f5
    }

    const ai = new GoogleGenAI({apiKey});
    // ✅ ИСПРАВЛЕНО: правильная модель
    const model = 'gemini-1.5-flash';

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
      contents: [{
        role: "user",
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
      }],
    });

<<<<<<< HEAD
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
=======
    // ✅ ИСПРАВЛЕНО: правильный доступ к ответу
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
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
>>>>>>> 314357daa830a30aca5d1b1b35939791871be5f5
