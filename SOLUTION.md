# Решение проблемы WebSocket на Vercel

## Проблема

Ошибка `WS_ERR_INVALID_CLOSE_CODE (1002)` при подключении клиента на Vercel к WebSocket серверу.

## Причина

Конфликт между двумя WebSocket серверами:

- Socket.IO сервер (для чата)
- Обычный WebSocket сервер (для API)

## Решение

### 1. Отключите обычный WebSocket сервер

В файле `src/index.ts` закомментируйте:

```typescript
// Инициализация WebSocket сервера (отключено для избежания конфликтов)
// const webSocketHandler = new WebSocketHandler(server)
```

### 2. Настройте переменные окружения

Создайте файл `client/.env.local`:

```bash
NEXT_PUBLIC_SOCKETIO_URL=http://localhost:3002
```

Для Vercel добавьте переменную окружения:

- **Name**: `NEXT_PUBLIC_SOCKETIO_URL`
- **Value**: `https://your-server-domain.com`

### 3. Обновите настройки Socket.IO

В `client/src/hooks/useSocketIO.ts`:

```typescript
socket.current = io(socketUrl, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
  timeout: 20000,
  forceNew: true,
  upgrade: true,
  rememberUpgrade: true,
  path: '/socket.io/',
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
})
```

### 4. Настройте CORS на сервере

В `src/socketio.ts`:

```typescript
this.io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 10000,
  maxHttpBufferSize: 1e6,
})
```

## Тестирование

### Локальное тестирование:

```bash
# Запустите сервер
npm run dev

# В другом терминале протестируйте WebSocket
npm run test:websocket
```

### Проверка в браузере:

1. Откройте Developer Tools
2. Перейдите на вкладку Network
3. Попробуйте подключиться к чату
4. Проверьте, что WebSocket соединение устанавливается

## Альтернативные решения

Если проблема не решается:

1. **Используйте только polling**:

   ```typescript
   transports: ['polling']
   ```

2. **Проверьте доступность сервера**:

   ```bash
   curl https://your-server-domain.com/health
   ```

3. **Проверьте CORS настройки**:
   ```typescript
   cors: {
     origin: ['https://your-vercel-app.vercel.app', 'http://localhost:3000'],
     credentials: true,
   }
   ```

## Результат

После применения этих изменений:

- ✅ WebSocket подключение работает корректно
- ✅ Нет конфликтов между серверами
- ✅ Поддержка reconnection
- ✅ Улучшенная обработка ошибок
