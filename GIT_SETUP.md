# Настройка Git для проекта

## ✅ Что уже сделано:

1. **Инициализирован Git репозиторий**: `git init`
2. **Добавлены все файлы**: `git add .`
3. **Создан первый коммит**: "Initial commit: Express WebSocket server with Prisma and Neon PostgreSQL"
4. **Настроен .gitignore**: файл `.env` исключен из репозитория

## 🔧 Текущий статус:

```bash
git status
# On branch main
# nothing to commit, working tree clean
```

## 📝 Следующие шаги (опционально):

### 1. Создание удаленного репозитория на GitHub:

1. Зайдите на [GitHub](https://github.com/)
2. Создайте новый репозиторий (например, `express-websocket-server`)
3. Скопируйте URL репозитория

### 2. Подключение к удаленному репозиторию:

```bash
# Добавить удаленный репозиторий
git remote add origin https://github.com/your-username/express-websocket-server.git

# Отправить код на GitHub
git push -u origin main
```

### 3. Проверка подключения:

```bash
# Проверить удаленные репозитории
git remote -v

# Проверить статус
git status
```

## 🚀 Полезные команды Git:

```bash
# Проверить статус
git status

# Посмотреть историю коммитов
git log --oneline

# Создать новую ветку
git checkout -b feature/new-feature

# Переключиться на ветку
git checkout main

# Добавить изменения
git add .

# Создать коммит
git commit -m "Описание изменений"

# Отправить изменения
git push

# Получить изменения
git pull
```

## 📁 Структура репозитория:

```
server/
├── .git/                    # Git репозиторий
├── .gitignore              # Исключения из Git
├── .env                    # Переменные окружения (исключен)
├── src/                    # Исходный код
├── prisma/                 # Схема базы данных
├── public/                 # Статические файлы
├── package.json            # Зависимости
└── README.md              # Документация
```

## 🔒 Безопасность:

- Файл `.env` с секретными данными исключен из репозитория
- Создайте файл `.env.example` для примера переменных окружения
- Никогда не коммитьте секретные ключи и пароли

## 📋 Следующие коммиты:

При внесении изменений используйте:

```bash
git add .
git commit -m "Описание изменений"
git push
```
