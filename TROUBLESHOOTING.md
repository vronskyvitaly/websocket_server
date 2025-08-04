# Решение проблем с WebSocket

## Ошибка WS_ERR_INVALID_CLOSE_CODE (1002)

Эта ошибка возникает при проблемах с протоколом WebSocket. Вот несколько решений:

### 1. Проверьте URL сервера

Убедитесь, что в переменной окружения `NEXT_PUBLIC_SOCKETIO_URL` указан правильный URL вашего сервера:

```bash
# Для локальной разработки
NEXT_PUBLIC_SOCKETIO_URL=http://localhost:3002

# Для production (замените на ваш реальный URL)
NEXT_PUBLIC_SOCKETIO_URL=https://your-server-domain.com
```

### 2. Настройка CORS на сервере

Убедитесь, что ваш сервер правильно настроен для CORS:

```typescript
// В src/index.ts
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
)
```

### 3. Настройка Socket.IO на сервере

Проверьте настройки Socket.IO:

```typescript
// В src/socketio.ts
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

### 4. Настройка клиента

Убедитесь, что клиент правильно настроен:

```typescript
// В client/src/hooks/useSocketIO.ts
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

### 5. Тестирование подключения

Запустите тест подключения:

```bash
# Установите зависимости
npm install

# Запустите сервер
npm run dev

# В другом терминале запустите тест
npm run test:websocket
```

### 6. Проверка в браузере

Откройте Developer Tools в браузере и проверьте:

1. **Network tab** - убедитесь, что WebSocket соединение устанавливается
2. **Console** - проверьте ошибки подключения
3. **Application tab** - проверьте переменные окружения

### 7. Проблемы с Vercel

Если проблема возникает на Vercel:

1. Убедитесь, что переменная окружения `NEXT_PUBLIC_SOCKETIO_URL` настроена в Vercel
2. Проверьте, что ваш сервер доступен из интернета
3. Убедитесь, что сервер работает по HTTPS
4. Проверьте настройки прокси на вашем сервере

### 8. Альтернативные решения

Если проблема не решается:

1. Попробуйте использовать только polling transport:

   ```typescript
   transports: ['polling']
   ```

2. Отключите WebSocket и используйте только HTTP long polling:

   ```typescript
   transports: ['polling'],
   upgrade: false
   ```

3. Проверьте, что ваш сервер не блокирует WebSocket соединения

### 9. Логирование

Добавьте дополнительное логирование для отладки:

```typescript
socket.current.on('connect', () => {
  console.log('🔗 Socket.IO connected')
  console.log('Transport:', socket.current?.io.engine.transport.name)
  console.log('URL:', socketUrl)
})
```

### 10. Проверка сервера

Убедитесь, что ваш сервер работает:

```bash
# Проверьте, что сервер запущен
curl http://localhost:3002/health

# Проверьте WebSocket endpoint
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" -H "Sec-WebSocket-Version: 13" -H "Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==" http://localhost:3002/socket.io/
```
