# backend/Dockerfile
FROM python:3.10-slim

# Устанавливаем системные зависимости для EasyOCR и OpenCV
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Создаем рабочую директорию
WORKDIR /app

# Копируем зависимости
COPY requirements.txt .

# Устанавливаем Python зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем весь код приложения
COPY ./app ./app

# Создаем папку для временных файлов
RUN mkdir -p /tmp/uploads

# Предварительно загружаем модели OCR (чтобы не скачивать при каждом запуске)
RUN python -c "from easyocr import Reader; Reader(['ru', 'en'], gpu=False)"

# Предварительно загружаем модель суммаризации
RUN python -c "from transformers import AutoTokenizer, AutoModelForSeq2SeqLM; \
    model_name = 'IlyaGusev/mbart_ru_sum_gazeta'; \
    AutoTokenizer.from_pretrained(model_name); \
    AutoModelForSeq2SeqLM.from_pretrained(model_name)"

# Указываем порт, который будет использовать Railway
ENV PORT=8080

# Запускаем приложение
CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT
