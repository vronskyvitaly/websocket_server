# Настройка переменных окружения для Neon

## Создание файла .env

Создайте файл `.env` в папке `server` со следующим содержимым:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
DIRECT_URL="postgresql://username:password@host:port/database?sslmode=require"

# Server Configuration
PORT=3002
NODE_ENV=development
CORS_ORIGIN=*
```

## Получение данных подключения от Neon

1. Зайдите в [Neon Console](https://console.neon.tech/)
2. Создайте новый проект или используйте существующий
3. В разделе "Connection Details" найдите строку подключения
4. Скопируйте строку подключения и замените в файле `.env`

### Пример строки подключения от Neon:

```
postgresql://alex:password@ep-cool-forest-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Разбор строки подключения:

- `alex` - username
- `password` - password
- `ep-cool-forest-123456.us-east-2.aws.neon.tech` - host
- `neondb` - database name
- `?sslmode=require` - SSL параметры

## После настройки .env

1. Сгенерируйте Prisma клиент:

```bash
pnpm run db:generate
```

2. Создайте таблицы в базе данных:

```bash
pnpm run db:push
```

3. Запустите сервер:

```bash
pnpm run dev
```

## Проверка подключения

После настройки вы можете проверить подключение к базе данных:

```bash
pnpm run db:studio
```

Это откроет Prisma Studio в браузере, где вы сможете просматривать данные в базе данных.
