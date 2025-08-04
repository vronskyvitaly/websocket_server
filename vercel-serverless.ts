import cors from 'cors'
import express from 'express'
import { createServer } from 'http'
import { database } from './src/database'
import { SocketIOHandler } from './src/socketio'

const app = express()
const server = createServer(app)

// CORS middleware
app.use(
  cors({
    origin: [
      'https://websocket-client-eight.vercel.app',
      'http://localhost:3000',
      'https://localhost:3000',
      'http://localhost:3001',
      'https://localhost:3001',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
)

app.use(express.json())

// Initialize Socket.IO
const socketHandler = new SocketIOHandler(server)

// API Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Express Socket.IO Chat Server',
    version: '2.0.0',
    status: 'running',
  })
})

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    connectedUsers: socketHandler.getConnectedUsersCount(),
  })
})

app.get('/socket-health', (req, res) => {
  res.json({
    status: 'socket-healthy',
    timestamp: new Date().toISOString(),
    socketIO: {
      connected: true,
      transports: ['polling'],
      path: '/socket.io/',
    },
  })
})

app.get('/api/users', (req, res) => {
  try {
    res.json({
      totalUsers: socketHandler.getConnectedUsersCount(),
      onlineUsers: [],
    })
  } catch (error) {
    console.error('❌ Error getting users:', error)
    res.status(500).json({ error: 'Failed to retrieve users' })
  }
})

app.get('/api/messages', async (req, res) => {
  try {
    const messages = await database.getMessages()
    res.json({
      messages,
      total: messages.length,
    })
  } catch (error) {
    console.error('❌ Error getting messages:', error)
    res.status(500).json({ error: 'Failed to retrieve messages' })
  }
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  })
})

// Export for Vercel
export default app

// For local development
if (process.env.NODE_ENV !== 'production') {
  server.listen(3002, () => {
    console.log('🚀 Server started on port 3002')
  })
}
