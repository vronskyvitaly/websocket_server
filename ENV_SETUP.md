# Настройка PostgreSQL для Vercel

## Варианты базы данных

### 1. Neon (Рекомендуется)

Neon предоставляет бесплатный PostgreSQL для Vercel проектов.

#### Настройка Neon:

1. Перейдите на [neon.tech](https://neon.tech)
2. Создайте аккаунт и новый проект
3. Скопируйте строки подключения

#### Переменные окружения для Neon:

```
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
DIRECT_URL="postgresql://username:password@host:port/database?sslmode=require"
```

### 2. Supabase

Supabase также предоставляет бесплатный PostgreSQL.

#### Настройка Supabase:

1. Перейдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. В Settings → Database найдите строки подключения

#### Переменные окружения для Supabase:

```
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
DIRECT_URL="postgresql://postgres:[password]@[host]:5432/postgres"
```

### 3. Railway

Railway предоставляет простую настройку PostgreSQL.

#### Настройка Railway:

1. Перейдите на [railway.app](https://railway.app)
2. Создайте новый проект
3. Добавьте PostgreSQL сервис
4. Скопируйте переменные окружения

## Настройка в Vercel Dashboard

### Основные переменные окружения:

```
NODE_ENV=production
PORT=3002
CORS_ORIGIN=https://websocket-client-eight.vercel.app
```

### База данных (PostgreSQL):

```
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
DIRECT_URL=postgresql://username:password@host:port/database?sslmode=require
```

### Prisma:

```
PRISMA_GENERATE_DATAPROXY=true
```

## Пошаговая настройка Neon

### 1. Создание проекта в Neon:

1. Зайдите на [console.neon.tech](https://console.neon.tech)
2. Создайте новый проект
3. Выберите регион (ближайший к вашему Vercel deployment)
4. Запишите имя проекта

### 2. Получение строк подключения:

1. В Neon Console перейдите в ваш проект
2. Нажмите "Connection Details"
3. Скопируйте строки подключения

### 3. Настройка в Vercel:

1. Перейдите в Vercel Dashboard
2. Выберите ваш проект
3. Settings → Environment Variables
4. Добавьте переменные:

#### NODE_ENV

- **Name**: `NODE_ENV`
- **Value**: `production`
- **Environment**: Production, Preview, Development

#### PORT

- **Name**: `PORT`
- **Value**: `3002`
- **Environment**: Production, Preview, Development

#### CORS_ORIGIN

- **Name**: `CORS_ORIGIN`
- **Value**: `https://websocket-client-eight.vercel.app`
- **Environment**: Production, Preview, Development

#### DATABASE_URL

- **Name**: `DATABASE_URL`
- **Value**: `postgresql://username:password@host:port/database?sslmode=require`
- **Environment**: Production, Preview, Development

#### DIRECT_URL

- **Name**: `DIRECT_URL`
- **Value**: `postgresql://username:password@host:port/database?sslmode=require`
- **Environment**: Production, Preview, Development

#### PRISMA_GENERATE_DATAPROXY

- **Name**: `PRISMA_GENERATE_DATAPROXY`
- **Value**: `true`
- **Environment**: Production, Preview, Development

## Инициализация базы данных

После настройки переменных окружения:

### 1. Локально:

```bash
cd server
npm install
npx prisma generate
npx prisma db push
```

### 2. На Vercel:

База данных будет инициализирована автоматически при первом деплое.

## Проверка подключения

### 1. Проверьте health endpoint:

```bash
curl https://your-app.vercel.app/health
```

### 2. Проверьте базу данных:

```bash
curl https://your-app.vercel.app/api/messages
```

## Локальная разработка

Создайте файл `.env.local`:

```bash
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
DIRECT_URL="postgresql://username:password@host:port/database?sslmode=require"
NODE_ENV=development
PORT=3002
CORS_ORIGIN=http://localhost:3000
```

## Примечания

- Neon предоставляет бесплатный план с 3 проектами
- Supabase предоставляет бесплатный план с 500MB
- Railway предоставляет бесплатный план с $5 кредитами
- Все эти сервисы интегрируются с Vercel
