import { NextRequest, NextResponse } from 'next/server';

// Кэш для модели
let workingModel: string | null = null;

async function findWorkingModel(apiKey: string): Promise<string> {
  if (workingModel) return workingModel;

  const candidates = [
    'models/gemini-1.5-pro',
    'gemini-1.5-pro',
    'models/gemini-pro-vision',
    'gemini-pro-vision',
    'models/gemini-1.5-flash',
    'gemini-1.5-flash',
  ];

  for (const model of candidates) {
    try {
      const testResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}?key=${apiKey}`
      );
      if (testResponse.ok) {
        workingModel = model;
        console.log(`✅ Using model: ${model}`);
        return model;
      }
    } catch (e) {
      continue;
    }
  }

  throw new Error('No working model found');
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key missing' }, { status: 500 });
    }

    const { image, prompt } = await request.json();
    if (!image) {
      return NextResponse.json({ error: 'No image' }, { status: 400 });
    }

    const model = await findWorkingModel(apiKey);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt || "Extract text from this image." },
              { inline_data: { mime_type: "image/jpeg", data: image } }
            ]
          }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: `Gemini API error: ${data.error?.message}` },
        { status: response.status }
      );
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return NextResponse.json({ text });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}