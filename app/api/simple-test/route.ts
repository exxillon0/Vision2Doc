import { NextResponse } from 'next/server';

export async function GET() {
  // Самый простой способ проверить переменные
  const envVars = {
    // Проверяем ВСЕ возможные имена переменных
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ? '✅ exists' : '❌ missing',
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY ? '✅ exists' : '❌ missing',
    // Добавим для теста другие переменные
    NODE_ENV: process.env.NODE_ENV,
    PATH: process.env.PATH ? '✅ exists' : '❌ missing',
  };

  // Попробуем прочитать ВСЕ переменные окружения
  const allKeys = Object.keys(process.env).sort();

  return NextResponse.json({
    message: 'Environment variables test',
    envVars,
    totalEnvVars: allKeys.length,
    sampleOfKeys: allKeys.slice(0, 20), // первые 20 ключей
    hasGeminiInAnyForm: allKeys.some(key => key.includes('GEMINI')),
  });
}
