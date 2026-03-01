import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('❌ GEMINI_API_KEY is missing');
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
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

    console.log('🔄 Processing image with Gemini...');
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt || "Extract all text from this image accurately. Return only the extracted text." },
              { inline_data: { mime_type: "image/jpeg", data: image } }
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

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    return NextResponse.json({ text });
  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Gemini API endpoint is ready',
    hasKey: !!process.env.GEMINI_API_KEY,
    endpoints: {
      post: '/api/gemini - send image to extract text',
      get: '/api/gemini - this info'
    }
  });
}
