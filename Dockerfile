# backend/Dockerfile
FROM python:3.10-bullseye

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

# остальная часть Dockerfile без изменений
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY ./app ./app
RUN mkdir -p /tmp/uploads
RUN python -c "from easyocr import Reader; Reader(['ru', 'en'], gpu=False)"
RUN python -c "from transformers import AutoTokenizer, AutoModelForSeq2SeqLM; \
    model_name = 'IlyaGusev/mbart_ru_sum_gazeta'; \
    AutoTokenizer.from_pretrained(model_name); \
    AutoModelForSeq2SeqLM.from_pretrained(model_name)"
ENV PORT=8080
CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT
