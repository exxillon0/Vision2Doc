const handleProcessImage = async () => {
  if (!selectedFile) return;

  setIsProcessing(true);
  setError(null);
  setExtractedText('');

  try {
    // ✅ ИСПРАВЛЕНО: убрал NEXT_PUBLIC_
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key is missing. Please configure it in the Secrets panel.');
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
