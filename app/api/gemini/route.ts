import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 👇 Читаем ТУ ЖЕ переменную, что в .env.local
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    console.log('🔍 Checking NEXT_PUBLIC_GEMINI_API_KEY:', apiKey ? '✅ Present' : '❌ Missing');
    
    if (!apiKey) {
      console.error('❌ API key is missing in /api/gemini');
      return NextResponse.json(
        { error: 'Gemini API key is not configured on server' },
        { status: 500 }
      );
    }

    const { image, prompt } = await request.json();
    
    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    console.log('🔄 Sending request to Gemini API...');
    
    // Используем стабильную модель
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt || "Extract all text from this image. Return only the extracted text." },
              { 
                inline_data: { 
                  mime_type: "image/jpeg", 
                  data: image 
                } 
              }
            ]
          }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Gemini API error:', data);
      return NextResponse.json(
        { error: `Gemini API error: ${data.error?.message || 'Unknown error'}` },
        { status: response.status }
      );
    }

    // Извлекаем текст из ответа
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!text) {
      return NextResponse.json(
        { error: 'No text extracted from image' },
        { status: 500 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error('❌ Server error:', error);
    return NextResponse.json(
      { error: 'Failed to process image: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  return NextResponse.json({
    status: 'Gemini API endpoint',
    hasKey: !!apiKey,
    keyLength: apiKey?.length || 0,
    nodeEnv: process.env.NODE_ENV,
    message: apiKey ? '✅ Key is configured' : '❌ Key is missing',
    tip: 'Make sure NEXT_PUBLIC_GEMINI_API_KEY is set in .env.local and Fly.io secrets'
  });
}
