# Деплой сервера на Vercel

## Подготовка

### 1. Убедитесь, что у вас есть все необходимые файлы:

- ✅ `vercel.json` - конфигурация Vercel
- ✅ `package.json` - зависимости и скрипты
- ✅ `tsconfig.json` - конфигурация TypeScript
- ✅ `src/index.ts` - точка входа

### 2. Переменные окружения для Vercel:

В Vercel Dashboard добавьте следующие переменные окружения:

```
NODE_ENV=production
CORS_ORIGIN=https://websocket-client-eight.vercel.app
PORT=3002
```

## Деплой

### Вариант 1: Через Vercel Dashboard

1. Перейдите на [vercel.com](https://vercel.com)
2. Нажмите "New Project"
3. Подключите ваш GitHub репозиторий
4. Выберите папку `server` как корневую директорию
5. Настройте переменные окружения (см. выше)
6. Нажмите "Deploy"

### Вариант 2: Через Vercel CLI

```bash
cd server
npm install -g vercel
vercel
```

## Проверка деплоя

### 1. Проверьте health endpoint:

```bash
curl https://your-vercel-app.vercel.app/health
```

Ожидаемый ответ:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "connectedUsers": 0,
  "connectedClients": 0
}
```

### 2. Проверьте основной endpoint:

```bash
curl https://your-vercel-app.vercel.app/
```

### 3. Проверьте Socket.IO endpoint:

```bash
curl https://your-vercel-app.vercel.app/socket.io/
```

## Обновление клиента

После успешного деплоя сервера обновите URL в клиенте:

### Локально:

```bash
# В папке client/.env.local
NEXT_PUBLIC_SOCKETIO_URL=https://your-vercel-app.vercel.app
```

### На Vercel:

1. Перейдите в Vercel Dashboard для клиента
2. Settings → Environment Variables
3. Обновите `NEXT_PUBLIC_SOCKETIO_URL`

## Возможные проблемы

### 1. Ошибка сборки

Убедитесь, что все зависимости установлены:

```bash
cd server
npm install
npm run build
```

### 2. Ошибка CORS

Проверьте переменную `CORS_ORIGIN` в Vercel Dashboard.

### 3. WebSocket не работает

Vercel может не поддерживать WebSocket в serverless функциях. В этом случае используйте только polling transport в клиенте.

## Альтернативы

Если WebSocket не работает на Vercel, рассмотрите:

- **Railway**: https://railway.app
- **Render**: https://render.com
- **Heroku**: https://heroku.com

Эти платформы лучше поддерживают WebSocket соединения.
