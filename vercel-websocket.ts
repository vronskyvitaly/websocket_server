import cors from 'cors'
import express from 'express'
import { database } from './src/database'

const app = express()

// CORS middleware
app.use(
  cors({
    origin: [
      'https://websocket-client-eight.vercel.app',
      'http://localhost:3000',
      'https://localhost:3000',
      'http://localhost:3001',
      'https://localhost:3001',
      'https://websocket-client-eight.vercel.app',
      'https://websocket-client.vercel.app',
      'https://websocket-client-git-main-vitalyvronsky.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
)

app.use(express.json())

// API Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Express WebSocket Chat Server',
    version: '2.0.0',
    status: 'running',
    note: 'This is a REST API server. WebSocket connections are not supported in serverless environment.',
  })
})

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: 'serverless',
  })
})

app.get('/socket-health', (req, res) => {
  res.json({
    status: 'socket-healthy',
    timestamp: new Date().toISOString(),
    note: 'WebSocket not available in serverless environment',
    alternatives: [
      'Use REST API endpoints for messaging',
      'Consider using a dedicated WebSocket service',
    ],
  })
})

app.get('/api/users', (req, res) => {
  try {
    res.json({
      totalUsers: 0,
      onlineUsers: [],
      note: 'User tracking not available in serverless environment',
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

// REST API for sending messages
app.post('/api/messages', async (req, res) => {
  try {
    const { content, username, type = 'text' } = req.body

    if (!content || !username) {
      return res
        .status(400)
        .json({ error: 'Content and username are required' })
    }

    const message = {
      id: Date.now().toString(),
      userId: username,
      username: username,
      content: content.trim(),
      timestamp: new Date(),
      type: type,
      roomId: 'general',
    }

    const savedMessage = await database.saveMessage(message)
    res.json(savedMessage)
  } catch (error) {
    console.error('❌ Error sending message:', error)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

// Get messages by user
app.get('/api/messages/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId
    const messages = await database.getMessagesByUser(userId)
    res.json({
      userId,
      messages,
      count: messages.length,
    })
  } catch (error) {
    console.error('❌ Error getting user messages:', error)
    res.status(500).json({ error: 'Failed to retrieve user messages' })
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
  const port = 3002
  app.listen(port, () => {
    console.log(`🚀 REST API server started on port ${port}`)
    console.log(`📝 Note: WebSocket not available in serverless environment`)
    console.log(`🔗 API available at: http://localhost:${port}`)
  })
}
