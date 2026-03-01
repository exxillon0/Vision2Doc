FROM python:3.10-bullseye

RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем только код и зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app
RUN mkdir -p /tmp/uploads

# 🔥 ВАЖНО: УДАЛИТЕ строки с предзагрузкой моделей!
# Они только увеличивают размер образа

ENV PORT=8080
CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT
