# Express WebSocket Chat Server

Express сервер с поддержкой WebSocket и Socket.IO для чата с PostgreSQL базой данных (Neon).

## 🚀 Быстрый старт

### Локальная разработка

1. **Установите зависимости:**

   ```bash
   pnpm install
   cd client && npm install
   ```

2. **Настройте базу данных:**

   Создайте файл `.env` в папке `server` (см. `ENV_SETUP.md`):

   ```env
   DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
   DIRECT_URL="postgresql://username:password@host:port/database?sslmode=require"
   ```

3. **Создайте таблицы в базе данных:**

   ```bash
   pnpm run db:generate
   pnpm run db:push
   ```

4. **Запустите сервер:**

   ```bash
   pnpm run dev
   ```

5. **Запустите клиент:**

   ```bash
   cd client
   npm run dev
   ```

6. **Откройте браузер:**
   - Клиент: http://localhost:3000
   - Сервер: http://localhost:3002

## 🔧 Исправленные проблемы

### 1. WebSocket конфликт

**Проблема:** Конфликт между Socket.IO и нативным WebSocket сервером вызывал ошибку `Invalid WebSocket frame: invalid status code 59469`.

**Решение:** Удален нативный WebSocket сервер, оставлен только Socket.IO.

### 2. FOREIGN KEY constraint failed

**Проблема:** При создании пользователей возникала ошибка из-за отсутствия системного пользователя и комнаты по умолчанию.

**Решение:**

- Добавлен автоматический вызов `createDefaultRoom()` в `createChatUser()`
- Улучшен метод `createDefaultRoom()` для создания системного пользователя и комнаты
- Добавлена обработка ошибок без блокировки создания пользователей

### 3. CORS проблемы

**Проблема:** Проблемы с CORS при развертывании на Vercel.

**Решение:** Улучшена конфигурация CORS в Socket.IO сервере.

## 🌐 Развертывание на Vercel

### Сервер (Backend)

1. **Создайте новый проект на Vercel**
2. **Настройте переменные окружения:**

   ```
   PORT=3002
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   NODE_ENV=production
   ```

3. **Добавьте build команду:**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "installCommand": "npm install"
   }
   ```

### Клиент (Frontend)

1. **Создайте отдельный проект на Vercel**
2. **Настройте переменные окружения:**

   ```
   NEXT_PUBLIC_SOCKETIO_URL=https://your-backend-domain.vercel.app
   ```

3. **Обновите vercel.json:**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "framework": "nextjs",
     "installCommand": "npm install",
     "devCommand": "npm run dev"
   }
   ```

## 📊 API Endpoints

### Health Check

- `GET /health` - Статус сервера

### Пользователи

- `GET /api/users` - Список пользователей

### Сообщения

- `GET /api/messages` - История сообщений
- `GET /api/chat/messages` - Сообщения чата
- `GET /api/chat/users/:userId/messages` - Сообщения пользователя

## 🔌 Socket.IO Events

### Клиент → Сервер

- `setUsername` - Установить имя пользователя
- `sendMessage` - Отправить сообщение
- `joinRoom` - Присоединиться к комнате
- `leaveRoom` - Покинуть комнату
- `typing` - Индикатор печати
- `requestHistory` - Запросить историю сообщений

### Сервер → Клиент

- `connected` - Подключение установлено
- `message` - Новое сообщение
- `messageHistory` - История сообщений
- `userJoined` - Пользователь присоединился
- `userLeft` - Пользователь покинул чат
- `roomUsers` - Список пользователей в комнате
- `userTyping` - Индикатор печати пользователя
- `error` - Ошибка

## 🗄️ База данных

PostgreSQL база данных (Neon) с таблицами:

- `messages` - Сообщения чата

### Структура таблицы messages:

- `id` (Int, Primary Key, Auto Increment)
- `content` (String, NOT NULL)
- `userId` (String, Optional)
- `timestamp` (DateTime, Default: now())

### Команды для работы с базой данных:

```bash
# Генерация Prisma клиента
pnpm run db:generate

# Синхронизация схемы с базой данных
pnpm run db:push

# Создание и применение миграций
pnpm run db:migrate

# Просмотр данных в браузере
pnpm run db:studio
```

## 🛠️ Разработка

### Структура проекта

```
├── src/
│   ├── index.ts              # Основной сервер
│   ├── socketio.ts           # Socket.IO обработчик
│   ├── database.ts           # REST API работа с базой данных
│   ├── database-service.ts   # Socket.IO работа с базой данных
│   ├── prisma.ts             # Prisma клиент
│   └── types.ts              # TypeScript типы
├── prisma/
│   └── schema.prisma         # Схема базы данных
├── client/
│   ├── src/
│   │   ├── app/              # Next.js приложение
│   │   ├── hooks/            # React хуки
│   │   └── types/            # Типы клиента
│   └── package.json
└── .env                      # Переменные окружения
```

### Команды

```bash
# Сборка
pnpm run build

# Разработка
pnpm run dev

# Очистка
pnpm run clean

# База данных
pnpm run db:generate    # Генерация Prisma клиента
pnpm run db:push        # Синхронизация схемы
pnpm run db:migrate     # Миграции
pnpm run db:studio      # Просмотр данных
```

## 🔍 Отладка

### Проверка сервера

```bash
curl http://localhost:3002/health
```

### Проверка базы данных

```bash
# Открыть Prisma Studio
pnpm run db:studio

# Или проверить подключение
pnpm run db:push
```

### Логи

Сервер выводит подробные логи с эмодзи для легкого отслеживания:

- 🔗 Подключения
- 👤 Пользователи
- 💬 Сообщения
- ❌ Ошибки

## 📝 Лицензия

MIT
