# Деплой с PostgreSQL на Vercel

## Исправленные проблемы

✅ **Конфликт функций и сборок**: Удалена секция `builds` из `vercel.json`
✅ **PostgreSQL конфигурация**: Настроена Prisma схема для PostgreSQL
✅ **Переменные окружения**: Добавлены все необходимые переменные
✅ **Timeout увеличен**: Увеличен maxDuration до 60 секунд
✅ **Экспорт приложения**: Добавлен `export default app` для serverless функций

## Шаги для деплоя

### 1. Настройка Neon PostgreSQL

1. Создайте проект на [neon.tech](https://neon.tech)
2. Скопируйте строки подключения
3. Следуйте инструкциям в `NEON_SETUP.md`

### 2. Настройка переменных окружения в Vercel

Добавьте следующие переменные в Vercel Dashboard:

```
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
DIRECT_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
NODE_ENV=production
PORT=3002
CORS_ORIGIN=https://websocket-client-eight.vercel.app
PRISMA_GENERATE_DATAPROXY=true
```

### 3. Деплой

1. Убедитесь, что все изменения закоммичены
2. Запушьте в GitHub
3. Vercel автоматически запустит новый деплой

### 4. Проверка

После деплоя проверьте:

```bash
# Health endpoint
curl https://your-app.vercel.app/health

# API endpoint
curl https://your-app.vercel.app/api/messages

# Socket.IO endpoint
curl https://your-app.vercel.app/socket.io/
```

## Структура файлов

```
server/
├── vercel.json              # Конфигурация Vercel (исправлена)
├── package.json             # Зависимости и скрипты (обновлена)
├── tsconfig.json            # TypeScript конфигурация (обновлена)
├── prisma/
│   ├── schema.prisma        # PostgreSQL схема
│   └── migrations/          # Миграции базы данных
├── src/
│   ├── index.ts             # Основной файл (обновлен)
│   ├── socketio.ts          # Socket.IO обработчик
│   ├── database.ts          # База данных
│   └── prisma.ts            # Prisma клиент
├── ENV_SETUP.md             # Инструкции по переменным окружения
├── NEON_SETUP.md            # Настройка Neon PostgreSQL
└── DEPLOYMENT_POSTGRESQL.md # Этот файл
```

## Возможные проблемы и решения

### 1. Ошибка "Conflicting functions and builds configuration"

**Решение**: Удалена секция `builds` из `vercel.json`

### 2. Ошибка подключения к базе данных

**Решение**:

- Проверьте строки подключения
- Убедитесь, что SSL включен
- Проверьте переменные окружения

### 3. Ошибка Prisma

**Решение**:

- Убедитесь, что `PRISMA_GENERATE_DATAPROXY=true`
- Проверьте, что Prisma клиент сгенерирован

### 4. Ошибка CORS

**Решение**:

- Проверьте `CORS_ORIGIN`
- Убедитесь, что клиент использует правильный URL

### 5. Timeout ошибки

**Решение**: Увеличен `maxDuration` до 60 секунд в `vercel.json`

## Мониторинг

### Vercel Dashboard:

- Functions → Логи функций
- Analytics → Производительность
- Settings → Environment Variables

### Neon Console:

- Usage → Использование ресурсов
- Logs → Логи подключений

## Следующие шаги

1. ✅ Настройте Neon PostgreSQL
2. ✅ Добавьте переменные окружения в Vercel
3. ✅ Задеплойте проект
4. ✅ Проверьте работу API
5. ✅ Обновите URL сервера в клиенте
6. ✅ Протестируйте WebSocket соединение

## Контакты

Если возникнут проблемы:

1. Проверьте логи в Vercel Dashboard
2. Проверьте логи в Neon Console
3. Убедитесь, что все переменные окружения настроены правильно
