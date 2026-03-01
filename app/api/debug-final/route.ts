import { NextResponse } from 'next/server';

export async function GET() {
  // Максимально простой вывод
  const envCheck = {
    // Проверяем ВСЕ возможные варианты
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ? '✅ YES' : '❌ NO',
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY ? '✅ YES' : '❌ NO',
    // Добавим тестовую переменную
    NODE_ENV: process.env.NODE_ENV,
    // Посмотрим ВСЕ переменные окружения (только имена!)
    allEnvKeys: Object.keys(process.env).sort(),
  };

  // Если ключа нет, попробуем найти похожие
  const geminiKeys = Object.keys(process.env).filter(key => 
    key.toLowerCase().includes('gemini')
  );

  return NextResponse.json({
    ...envCheck,
    geminiRelatedKeys: geminiKeys,
    message: geminiKeys.length > 0 
      ? `Found keys: ${geminiKeys.join(', ')}` 
      : 'No Gemini keys found in environment'
  });
}
