import { prisma } from './prisma'
import { ChatMessage, ChatUser, StoredMessage } from './types'

export class DatabaseService {
  // Создание пользователя чата
  createChatUser(userData: { id: string; username: string }): ChatUser {
    const user: ChatUser = {
      id: userData.id,
      username: userData.username,
      isOnline: true,
      lastSeen: new Date(),
      joinedAt: new Date(),
    }
    return user
  }

  // Сохранение сообщения чата
  async saveChatMessage(message: ChatMessage): Promise<ChatMessage> {
    try {
      // Сохраняем в Prisma
      const savedMessage = await prisma.message.create({
        data: {
          content: message.content,
          userId: message.userId,
        },
      })

      // Возвращаем сообщение в нужном формате
      return {
        ...message,
        id: savedMessage.id.toString(),
        timestamp: savedMessage.timestamp,
      }
    } catch (error) {
      console.error('Error saving chat message:', error)
      throw error
    }
  }

  // Получение сообщений чата
  async getChatMessages(
    roomId: string,
    limit: number = 50
  ): Promise<ChatMessage[]> {
    try {
      const messages = await prisma.message.findMany({
        orderBy: {
          timestamp: 'desc',
        },
        take: limit,
      })

      // Преобразуем в формат ChatMessage
      return messages.map((msg) => ({
        id: msg.id.toString(),
        userId: msg.userId || 'unknown',
        username: `User-${msg.userId?.slice(0, 6) || 'unknown'}`,
        content: msg.content,
        timestamp: msg.timestamp,
        type: 'text' as const,
        roomId: roomId,
      }))
    } catch (error) {
      console.error('Error getting chat messages:', error)
      return []
    }
  }

  // Обновление статуса пользователя
  async updateUserOnlineStatus(
    userId: string,
    isOnline: boolean
  ): Promise<void> {
    // В этой простой версии мы не сохраняем статус пользователей в БД
    // Можно добавить отдельную таблицу для пользователей если нужно
    console.log(`User ${userId} online status: ${isOnline}`)
  }

  // Сохранение сообщения (для WebSocket)
  async saveMessage(messageData: {
    clientId: string
    messageType: string
    content: string
    timestamp: number
  }): Promise<void> {
    try {
      await prisma.message.create({
        data: {
          content: messageData.content,
          userId: messageData.clientId,
        },
      })
    } catch (error) {
      console.error('Error saving message:', error)
      throw error
    }
  }

  // Получение сообщений (для WebSocket)
  async getMessages(
    limit: number = 100,
    offset: number = 0
  ): Promise<StoredMessage[]> {
    try {
      const messages = await prisma.message.findMany({
        orderBy: {
          timestamp: 'desc',
        },
        take: limit,
        skip: offset,
      })

      return messages.map((msg) => ({
        id: msg.id,
        clientId: msg.userId || 'unknown',
        messageType: 'text',
        content: msg.content,
        timestamp: msg.timestamp.getTime(),
        createdAt: msg.timestamp,
      }))
    } catch (error) {
      console.error('Error getting messages:', error)
      return []
    }
  }

  // Получение количества сообщений
  async getMessagesCount(): Promise<number> {
    try {
      return await prisma.message.count()
    } catch (error) {
      console.error('Error getting messages count:', error)
      return 0
    }
  }

  // Получение сообщений по клиенту
  async getMessagesByClient(
    clientId: string,
    limit: number = 50
  ): Promise<StoredMessage[]> {
    try {
      const messages = await prisma.message.findMany({
        where: {
          userId: clientId,
        },
        orderBy: {
          timestamp: 'desc',
        },
        take: limit,
      })

      return messages.map((msg) => ({
        id: msg.id,
        clientId: msg.userId || 'unknown',
        messageType: 'text',
        content: msg.content,
        timestamp: msg.timestamp.getTime(),
        createdAt: msg.timestamp,
      }))
    } catch (error) {
      console.error('Error getting messages by client:', error)
      return []
    }
  }

  // Закрытие соединения с БД
  async close(): Promise<void> {
    await prisma.$disconnect()
  }
}
