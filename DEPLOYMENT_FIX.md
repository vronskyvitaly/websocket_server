# Исправление проблемы WebSocket на Vercel

## Проблема

Vercel не поддерживает WebSocket соединения в serverless функциях. Это означает, что Socket.IO сервер не может работать на Vercel.

## Решения

### Решение 1: Использовать только polling (временное решение)

Клиент уже обновлен для использования только polling transport. Это должно работать, но не оптимально.

### Решение 2: Деплой сервера на Railway (рекомендуется)

1. **Создайте аккаунт на Railway**: https://railway.app
2. **Подключите GitHub репозиторий**
3. **Выберите папку `server`**
4. **Настройте переменные окружения**:
   ```
   NODE_ENV=production
   CORS_ORIGIN=https://websocket-client-eight.vercel.app
   ```
5. **Деплойте**

После деплоя обновите URL сервера в клиенте:

```
NEXT_PUBLIC_SOCKETIO_URL=https://your-railway-app.railway.app
```

### Решение 3: Деплой сервера на Render

1. **Создайте аккаунт на Render**: https://render.com
2. **Создайте новый Web Service**
3. **Подключите GitHub репозиторий**
4. **Настройте**:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. **Добавьте переменные окружения**:
   ```
   NODE_ENV=production
   CORS_ORIGIN=https://websocket-client-eight.vercel.app
   ```

### Решение 4: Деплой сервера на Heroku

1. **Создайте аккаунт на Heroku**: https://heroku.com
2. **Установите Heroku CLI**
3. **Выполните команды**:
   ```bash
   cd server
   heroku create your-app-name
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```
4. **Настройте переменные окружения**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set CORS_ORIGIN=https://websocket-client-eight.vercel.app
   ```

## Обновление клиента

После деплоя сервера на новую платформу, обновите переменную окружения в клиенте:

### Локально:

```bash
# В папке client/.env.local
NEXT_PUBLIC_SOCKETIO_URL=https://your-new-server-url.com
```

### На Vercel:

1. Перейдите в Vercel Dashboard
2. Выберите ваш клиентский проект
3. Перейдите в Settings → Environment Variables
4. Обновите `NEXT_PUBLIC_SOCKETIO_URL` на новый URL сервера

## Проверка работы

1. **Проверьте сервер**: `curl https://your-server-url.com/health`
2. **Проверьте клиент**: Откройте клиент и попробуйте подключиться к чату
3. **Проверьте логи**: Убедитесь, что нет ошибок WebSocket

## Альтернативные платформы

- **DigitalOcean App Platform**
- **Google Cloud Run**
- **AWS Elastic Beanstalk**
- **Azure App Service**

Все эти платформы поддерживают WebSocket соединения.
