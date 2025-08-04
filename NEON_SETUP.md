# Быстрая настройка Neon PostgreSQL для Vercel

## Шаг 1: Создание проекта в Neon

1. Перейдите на [neon.tech](https://neon.tech)
2. Нажмите "Start for Free"
3. Войдите через GitHub или создайте аккаунт
4. Создайте новый проект:
   - **Project Name**: `websocket-chat-db`
   - **Region**: Выберите ближайший к вашему Vercel deployment
   - **Compute**: Free tier
   - **Database**: PostgreSQL 15

## Шаг 2: Получение строк подключения

1. В Neon Console перейдите в ваш проект
2. Нажмите "Connection Details"
3. Скопируйте строки подключения:

### Основная строка подключения:

```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

### Прямая строка подключения:

```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

## Шаг 3: Настройка в Vercel

1. Перейдите в [Vercel Dashboard](https://vercel.com/dashboard)
2. Выберите ваш проект
3. Перейдите в Settings → Environment Variables
4. Добавьте следующие переменные:

### DATABASE_URL

- **Name**: `DATABASE_URL`
- **Value**: `postgresql://[user]:[password]@[host]/[database]?sslmode=require`
- **Environment**: Production, Preview, Development

### DIRECT_URL

- **Name**: `DIRECT_URL`
- **Value**: `postgresql://[user]:[password]@[host]/[database]?sslmode=require`
- **Environment**: Production, Preview, Development

### NODE_ENV

- **Name**: `NODE_ENV`
- **Value**: `production`
- **Environment**: Production, Preview, Development

### PORT

- **Name**: `PORT`
- **Value**: `3002`
- **Environment**: Production, Preview, Development

### CORS_ORIGIN

- **Name**: `CORS_ORIGIN`
- **Value**: `https://websocket-client-eight.vercel.app`
- **Environment**: Production, Preview, Development

### PRISMA_GENERATE_DATAPROXY

- **Name**: `PRISMA_GENERATE_DATAPROXY`
- **Value**: `true`
- **Environment**: Production, Preview, Development

## Шаг 4: Инициализация базы данных

### Локально:

```bash
cd server
npm install
npx prisma generate
npx prisma db push
```

### На Vercel:

База данных будет инициализирована автоматически при первом деплое.

## Шаг 5: Проверка

1. Перезапустите деплой в Vercel
2. Проверьте health endpoint:
   ```bash
   curl https://your-app.vercel.app/health
   ```
3. Проверьте API:
   ```bash
   curl https://your-app.vercel.app/api/messages
   ```

## Возможные проблемы

### 1. Ошибка подключения к базе данных

- Убедитесь, что строки подключения скопированы правильно
- Проверьте, что SSL режим включен (`?sslmode=require`)
- Убедитесь, что IP адреса Vercel разрешены в Neon

### 2. Ошибка инициализации Prisma

- Убедитесь, что `PRISMA_GENERATE_DATAPROXY=true`
- Проверьте, что Prisma клиент сгенерирован

### 3. Ошибка CORS

- Убедитесь, что `CORS_ORIGIN` настроен правильно
- Проверьте, что клиент использует правильный URL

## Мониторинг

### Neon Console:

- Перейдите в ваш проект в Neon Console
- В разделе "Usage" отслеживайте использование ресурсов
- В разделе "Logs" просматривайте логи подключений

### Vercel Dashboard:

- Перейдите в ваш проект в Vercel Dashboard
- В разделе "Functions" просматривайте логи функций
- В разделе "Analytics" отслеживайте производительность

## Стоимость

- **Neon Free Tier**: 3 проекта, 0.5GB storage, 10GB transfer
- **Vercel Hobby**: Бесплатно для личных проектов
- **Общая стоимость**: $0/месяц для небольших проектов
