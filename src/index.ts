import cors from 'cors'
import express from 'express'
import { createServer } from 'http'
import path from 'path'
import { database } from './database'
import { SocketIOHandler } from './socketio'
import { ServerConfig } from './types'

const config: ServerConfig = {
  port: parseInt(process.env.PORT || '3002', 10),
  corsOrigin: process.env.CORS_ORIGIN || '*',
}

const app = express()
const server = createServer(app)

// Middleware
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
)
app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

// Инициализация Socket.IO
const socketHandler = new SocketIOHandler(server)

// Инициализация WebSocket сервера (отключено для избежания конфликтов)
// const webSocketHandler = new WebSocketHandler(server)

// REST API Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Express Socket.IO Chat Server with SQLite',
    version: '2.0.0',
    endpoints: {
      health: '/health',
      socket: 'http://localhost:' + config.port,
      api: {
        users: '/api/users',
        messages: '/api/messages',
        chatMessages: '/api/chat/messages',
        userMessages: '/api/chat/users/:userId/messages',
      },
    },
    socketEvents: {
      setUsername: 'Set your username',
      sendMessage: 'Send a chat message',
      joinRoom: 'Join a chat room',
      leaveRoom: 'Leave a chat room',
      typing: 'Send typing indicator',
      requestHistory: 'Request message history',
    },
  })
})

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    connectedUsers: socketHandler.getConnectedUsersCount(),
    connectedClients: 0, // webSocketHandler.getConnectedClientsCount(),
  })
})

app.get('/api/users', (req, res) => {
  try {
    res.json({
      totalUsers: socketHandler.getConnectedUsersCount(),
      onlineUsers: [], // Упрощенная версия без сложной системы пользователей
    })
  } catch (error) {
    console.error('❌ Error getting users:', error)
    res.status(500).json({ error: 'Failed to retrieve users' })
  }
})

app.get('/api/clients', (req, res) => {
  try {
    // const clients = webSocketHandler.getClientsList()
    res.json({
      totalClients: 0, // webSocketHandler.getConnectedClientsCount(),
      clients: [], // clients.map((client) => ({
      // id: client.id,
      // connectedAt: client.connectedAt,
      // lastActivity: client.lastActivity,
      // })),
    })
  } catch (error) {
    console.error('❌ Error getting WebSocket clients:', error)
    res.status(500).json({ error: 'Failed to retrieve WebSocket clients' })
  }
})

// Старые WebSocket сообщения
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await database.getMessages()

    res.json({
      messages,
      total: messages.length,
      limit: 100,
      offset: 0,
    })
  } catch (error) {
    console.error('❌ Error getting messages:', error)
    res.status(500).json({ error: 'Failed to retrieve messages' })
  }
})

// Чат сообщения
app.get('/api/chat/messages', async (req, res) => {
  try {
    const messages = await database.getMessages()

    res.json({
      roomId: 'general',
      messages,
      count: messages.length,
    })
  } catch (error) {
    console.error('❌ Error getting chat messages:', error)
    res.status(500).json({ error: 'Failed to retrieve chat messages' })
  }
})

app.get('/api/messages/client/:clientId', async (req, res) => {
  try {
    const clientId = req.params.clientId
    const messages = await database.getMessagesByUser(clientId)

    res.json({
      clientId,
      messages,
      count: messages.length,
    })
  } catch (error) {
    console.error('❌ Error getting client messages:', error)
    res.status(500).json({ error: 'Failed to retrieve client messages' })
  }
})

// Сообщения пользователя в чате
app.get('/api/chat/users/:userId/messages', async (req, res) => {
  try {
    const userId = req.params.userId
    const messages = await database.getMessagesByUser(userId)

    res.json({
      userId,
      messages,
      count: messages.length,
    })
  } catch (error) {
    console.error('❌ Error getting user chat messages:', error)
    res.status(500).json({ error: 'Failed to retrieve user chat messages' })
  }
})

app.get('/api/messages/type/:messageType', async (req, res) => {
  try {
    const messageType = req.params.messageType
    // Упрощенная версия - возвращаем все сообщения
    const messages = await database.getMessages()

    res.json({
      messageType,
      messages,
      count: messages.length,
    })
  } catch (error) {
    console.error('❌ Error getting messages by type:', error)
    res.status(500).json({ error: 'Failed to retrieve messages by type' })
  }
})

// Обработка ошибок
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error('❌ Express error:', err)
    res.status(500).json({
      error: 'Internal Server Error',
      message:
        process.env.NODE_ENV === 'development'
          ? err.message
          : 'Something went wrong',
    })
  }
)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  })
})

// Запуск сервера
server.listen(config.port, () => {
  console.log('🚀 Server started successfully!')
  console.log(`📍 HTTP server running on: http://localhost:${config.port}`)
  console.log(`🔌 Socket.IO server running on: http://localhost:${config.port}`)
  console.log(`💬 Chat available at: http://localhost:${config.port}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('📴 SIGTERM received, shutting down gracefully')
  server.close(async () => {
    await socketHandler.close()
    // webSocketHandler.close()
    console.log('✅ Process terminated')
    process.exit(0)
  })
})

process.on('SIGINT', async () => {
  console.log('📴 SIGINT received, shutting down gracefully')
  server.close(async () => {
    await socketHandler.close()
    // webSocketHandler.close()
    console.log('✅ Process terminated')
    process.exit(0)
  })
})

//
