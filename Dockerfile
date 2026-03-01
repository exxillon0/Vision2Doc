FROM node:20-slim AS base

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем остальной код
COPY . .

# Собираем Next.js приложение
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Открываем порт
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Запускаем приложение
CMD ["npm", "start"]
