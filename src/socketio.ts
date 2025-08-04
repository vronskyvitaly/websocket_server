import { randomUUID } from 'crypto'
import { Server as HttpServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { DatabaseService } from './database-service'
import {
  ChatMessage,
  ChatUser,
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from './types'

export class SocketIOHandler {
  private io: SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
  private db: DatabaseService
  private connectedUsers: Map<string, ChatUser> = new Map()

  constructor(server: HttpServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: [
          'https://websocket-client-eight.vercel.app',
          'http://localhost:3000',
          process.env.CORS_ORIGIN || '*',
        ],
        methods: ['GET', 'POST', 'OPTIONS'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      },
      transports: ['polling', 'websocket'],
      allowEIO3: true,
      pingTimeout: 60000,
      pingInterval: 25000,
      upgradeTimeout: 10000,
      maxHttpBufferSize: 1e6,
    })

    this.db = new DatabaseService()
    this.setupSocketIOServer()
  }

  private setupSocketIOServer(): void {
    this.io.on('connection', (socket) => {
      console.log(`🔗 Socket connected: ${socket.id}`)

      // Отправляем приветственное сообщение с временным ID
      socket.emit('connected', {
        userId: socket.id,
        username: `User-${socket.id.slice(0, 6)}`,
      })

      // Обработка установки имени пользователя
      socket.on('setUsername', async (username) => {
        try {
          const userId = randomUUID()

          // Создаем пользователя в базе данных
          const user = this.db.createChatUser({
            id: userId,
            username: username.trim(),
          })

          // Сохраняем данные пользователя в сокете
          socket.data.userId = userId
          socket.data.username = username.trim()
          socket.data.rooms = ['general']

          // Добавляем в список подключенных пользователей
          this.connectedUsers.set(socket.id, user)

          // Присоединяем к общей комнате
          socket.join('general')

          // Отправляем обновленную информацию о пользователе
          socket.emit('connected', {
            userId: userId,
            username: username.trim(),
          })

          // Уведомляем всех о новом пользователе
          socket.to('general').emit('userJoined', user)

          // Отправляем историю сообщений
          const messages = await this.db.getChatMessages('general', 50)
          socket.emit('messageHistory', messages)

          // Отправляем список пользователей онлайн
          const onlineUsers = this.getOnlineUsers()
          this.io.to('general').emit('roomUsers', onlineUsers)

          console.log(`👤 User ${username} (${userId}) joined the chat`)
        } catch (error) {
          console.error('❌ Error setting username:', error)
          socket.emit('error', 'Failed to set username. Please try again.')
        }
      })

      // Обработка отправки сообщений
      socket.on('sendMessage', async (data) => {
        try {
          if (!socket.data.userId || !socket.data.username) {
            socket.emit('error', 'Please set your username first')
            return
          }

          const messageId = randomUUID()
          const message: ChatMessage = {
            id: messageId,
            userId: socket.data.userId,
            username: socket.data.username,
            content: data.content.trim(),
            timestamp: new Date(),
            type: data.type || 'text',
            roomId: data.roomId || 'general',
          }

          // Сохраняем сообщение в базе данных
          const savedMessage = await this.db.saveChatMessage(message)

          // Отправляем сообщение всем в комнате
          this.io.to(savedMessage.roomId!).emit('message', savedMessage)

          console.log(
            `💬 Message from ${socket.data.username}: ${data.content}`
          )
        } catch (error) {
          console.error('❌ Error sending message:', error)
          socket.emit('error', 'Failed to send message')
        }
      })

      // Обработка индикатора печати
      socket.on('typing', (isTyping) => {
        if (socket.data.userId && socket.data.username) {
          socket.to('general').emit('userTyping', {
            userId: socket.data.userId,
            username: socket.data.username,
            isTyping,
          })
        }
      })

      // Обработка присоединения к комнате
      socket.on('joinRoom', (roomId) => {
        socket.join(roomId)
        if (socket.data.rooms && !socket.data.rooms.includes(roomId)) {
          socket.data.rooms.push(roomId)
        }
        console.log(`🚪 User ${socket.data.username} joined room ${roomId}`)
      })

      // Обработка покидания комнаты
      socket.on('leaveRoom', (roomId) => {
        socket.leave(roomId)
        if (socket.data.rooms) {
          socket.data.rooms = socket.data.rooms.filter(
            (room) => room !== roomId
          )
        }
        console.log(`🚪 User ${socket.data.username} left room ${roomId}`)
      })

      // Обработка запроса истории сообщений
      socket.on('requestHistory', async (roomId) => {
        try {
          const messages = await this.db.getChatMessages(
            roomId || 'general',
            50
          )
          socket.emit('messageHistory', messages)
        } catch (error) {
          console.error('❌ Error getting message history:', error)
          socket.emit('error', 'Failed to load message history')
        }
      })

      // Обработка отключения
      socket.on('disconnect', async () => {
        if (socket.data.userId && socket.data.username) {
          // Обновляем статус пользователя в базе данных
          await this.db.updateUserOnlineStatus(socket.data.userId, false)

          // Удаляем из списка подключенных пользователей
          this.connectedUsers.delete(socket.id)

          // Уведомляем всех об отключении пользователя
          socket.to('general').emit('userLeft', socket.data.userId)

          // Отправляем обновленный список пользователей
          const onlineUsers = this.getOnlineUsers()
          this.io.to('general').emit('roomUsers', onlineUsers)

          console.log(
            `👋 User ${socket.data.username} (${socket.data.userId}) disconnected`
          )
        } else {
          console.log(`🔌 Anonymous socket ${socket.id} disconnected`)
        }
      })
    })

    console.log('🔌 Socket.IO server initialized')
  }

  private getOnlineUsers(): ChatUser[] {
    return Array.from(this.connectedUsers.values())
  }

  public getConnectedUsersCount(): number {
    return this.connectedUsers.size
  }

  public getDatabase(): DatabaseService {
    return this.db
  }

  public async close(): Promise<void> {
    this.io.close()
    await this.db.close()
    console.log('🔌 Socket.IO server closed')
  }
}
