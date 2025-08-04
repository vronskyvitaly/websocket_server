# Настройка Prisma с Neon PostgreSQL

## Шаги для настройки:

### 1. Установка зависимостей

```bash
cd server
pnpm install
```

### 2. Создание файла .env

Создайте файл `.env` в папке `server` со следующим содержимым:

```env
# Database Configuration
# Замените на ваши реальные данные от Neon
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
DIRECT_URL="postgresql://username:password@host:port/database?sslmode=require"

# Server Configuration
PORT=3002
NODE_ENV=development
CORS_ORIGIN=*
```

### 3. Получение данных подключения от Neon

1. Зайдите в [Neon Console](https://console.neon.tech/)
2. Создайте новый проект или используйте существующий
3. Скопируйте строку подключения из раздела "Connection Details"
4. Замените `username`, `password`, `host`, `port`, `database` в файле `.env`

### 4. Генерация Prisma клиента

```bash
pnpm run db:generate
```

### 5. Создание таблиц в базе данных

```bash
pnpm run db:push
```

### 6. Запуск сервера

```bash
pnpm run dev
```

## Доступные команды:

- `pnpm run db:generate` - Генерация Prisma клиента
- `pnpm run db:push` - Синхронизация схемы с базой данных
- `pnpm run db:migrate` - Создание и применение миграций
- `pnpm run db:studio` - Запуск Prisma Studio для просмотра данных

## Структура базы данных:

Таблица `messages`:

- `id` (Int, Primary Key, Auto Increment)
- `content` (String, NOT NULL)
- `userId` (String, Optional)
- `timestamp` (DateTime, Default: now())

## Устранение проблем:

1. **Ошибка подключения к базе данных**: Проверьте правильность DATABASE_URL и DIRECT_URL
2. **Ошибка SSL**: Убедитесь, что в URL есть `?sslmode=require`
3. **Ошибка аутентификации**: Проверьте username и password в строке подключения
