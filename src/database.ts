import { prisma } from './prisma'

export interface Message {
  id: number
  content: string
  timestamp: Date
  userId?: string
}

export const database = {
  // Добавить сообщение
  addMessage: async (content: string, userId?: string): Promise<Message> => {
    const message = await prisma.message.create({
      data: {
        content,
        userId,
      },
    })
    return {
      id: message.id,
      content: message.content,
      timestamp: message.timestamp,
      userId: message.userId || undefined,
    }
  },

  // Получить все сообщения
  getMessages: async (): Promise<Message[]> => {
    const messages = await prisma.message.findMany({
      orderBy: {
        timestamp: 'desc',
      },
      take: 100,
    })
    return messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      timestamp: msg.timestamp,
      userId: msg.userId || undefined,
    }))
  },

  // Получить сообщения пользователя
  getMessagesByUser: async (userId: string): Promise<Message[]> => {
    const messages = await prisma.message.findMany({
      where: {
        userId,
      },
      orderBy: {
        timestamp: 'desc',
      },
    })
    return messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      timestamp: msg.timestamp,
      userId: msg.userId || undefined,
    }))
  },

  // Удалить сообщение
  deleteMessage: async (id: number): Promise<boolean> => {
    try {
      await prisma.message.delete({
        where: {
          id,
        },
      })
      return true
    } catch (error) {
      return false
    }
  },
}

export default database
