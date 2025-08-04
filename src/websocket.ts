import { Server as HttpServer } from 'http'
import { WebSocket, WebSocketServer } from 'ws'
import { DatabaseService } from './database-service'
import { ClientInfo, WebSocketMessage } from './types'

export class WebSocketHandler {
  private wss: WebSocketServer
  private clients: Map<WebSocket, ClientInfo> = new Map()
  private db: DatabaseService

  constructor(server: HttpServer) {
    this.wss = new WebSocketServer({ server })
    this.db = new DatabaseService()
    this.setupWebSocketServer()
  }

  private setupWebSocketServer(): void {
    this.wss.on('connection', (ws: WebSocket, request) => {
      const clientId = this.generateClientId()
      const clientInfo: ClientInfo = {
        id: clientId,
        connectedAt: new Date(),
        lastActivity: new Date(),
      }

      this.clients.set(ws, clientInfo)
      console.log(
        `🔗 Client ${clientId} connected. Total clients: ${this.clients.size}`
      )

      // Отправляем приветственное сообщение
      this.sendMessage(ws, {
        type: 'welcome',
        data: { clientId, message: 'Connected to WebSocket server' },
        timestamp: Date.now(),
      })

      // Уведомляем всех о новом подключении
      this.broadcastMessage(
        {
          type: 'client_connected',
          data: { clientId, totalClients: this.clients.size },
          timestamp: Date.now(),
        },
        ws
      )

      ws.on('message', async (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString()) as WebSocketMessage
          await this.handleMessage(ws, message)

          // Обновляем время последней активности
          const client = this.clients.get(ws)
          if (client) {
            client.lastActivity = new Date()
          }
        } catch (error) {
          console.error('❌ Error parsing message:', error)
          this.sendError(ws, 'Invalid message format')
        }
      })

      ws.on('close', () => {
        const client = this.clients.get(ws)
        if (client) {
          console.log(
            `🔌 Client ${client.id} disconnected. Total clients: ${
              this.clients.size - 1
            }`
          )

          // Уведомляем всех об отключении
          this.broadcastMessage(
            {
              type: 'client_disconnected',
              data: {
                clientId: client.id,
                totalClients: this.clients.size - 1,
              },
              timestamp: Date.now(),
            },
            ws
          )

          this.clients.delete(ws)
        }
      })

      ws.on('error', (error) => {
        console.error('❌ WebSocket error:', error)
        const client = this.clients.get(ws)
        if (client) {
          this.clients.delete(ws)
        }
      })
    })
  }

  private async handleMessage(
    ws: WebSocket,
    message: WebSocketMessage
  ): Promise<void> {
    const client = this.clients.get(ws)
    console.log(`📩 Message from ${client?.id}: ${message.type}`)

    // Сохраняем сообщение в базу данных (кроме служебных)
    if (client && !['ping', 'get_clients'].includes(message.type)) {
      try {
        await this.db.saveMessage({
          clientId: client.id,
          messageType: message.type,
          content: JSON.stringify(message.data),
          timestamp: message.timestamp,
        })
      } catch (error) {
        console.error('❌ Failed to save message to database:', error)
      }
    }

    switch (message.type) {
      case 'ping':
        this.sendMessage(ws, {
          type: 'pong',
          data: { timestamp: Date.now() },
          timestamp: Date.now(),
        })
        break

      case 'echo':
        this.sendMessage(ws, {
          type: 'echo_response',
          data: message.data,
          timestamp: Date.now(),
        })
        break

      case 'broadcast':
        this.broadcastMessage({
          type: 'broadcast_message',
          data: {
            from: client?.id,
            message: message.data,
          },
          timestamp: Date.now(),
        })
        break

      case 'get_clients':
        this.sendMessage(ws, {
          type: 'clients_list',
          data: {
            totalClients: this.clients.size,
            clients: Array.from(this.clients.values()).map((c) => ({
              id: c.id,
              connectedAt: c.connectedAt,
              lastActivity: c.lastActivity,
            })),
          },
          timestamp: Date.now(),
        })
        break

      case 'get_messages':
        this.handleGetMessages(ws, message.data)
        break

      case 'get_messages_by_client':
        this.handleGetMessagesByClient(ws, message.data)
        break

      default:
        this.sendError(ws, `Unknown message type: ${message.type}`)
    }
  }

  private sendMessage(ws: WebSocket, message: WebSocketMessage): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message))
    }
  }

  private sendError(ws: WebSocket, error: string): void {
    this.sendMessage(ws, {
      type: 'error',
      data: { error },
      timestamp: Date.now(),
    })
  }

  private broadcastMessage(
    message: WebSocketMessage,
    excludeWs?: WebSocket
  ): void {
    this.clients.forEach((_, ws) => {
      if (ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
        this.sendMessage(ws, message)
      }
    })
  }

  private async handleGetMessages(ws: WebSocket, data: any): Promise<void> {
    try {
      const limit = data?.limit || 100
      const offset = data?.offset || 0
      const messages = await this.db.getMessages(limit, offset)

      this.sendMessage(ws, {
        type: 'messages_history',
        data: {
          messages,
          total: await this.db.getMessagesCount(),
        },
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('❌ Failed to get messages:', error)
      this.sendError(ws, 'Failed to retrieve messages')
    }
  }

  private async handleGetMessagesByClient(
    ws: WebSocket,
    data: any
  ): Promise<void> {
    try {
      const clientId = data?.clientId
      const limit = data?.limit || 50

      if (!clientId) {
        this.sendError(ws, 'Client ID is required')
        return
      }

      const messages = await this.db.getMessagesByClient(clientId, limit)

      this.sendMessage(ws, {
        type: 'client_messages_history',
        data: {
          clientId,
          messages,
        },
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('❌ Failed to get messages by client:', error)
      this.sendError(ws, 'Failed to retrieve client messages')
    }
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  public getConnectedClientsCount(): number {
    return this.clients.size
  }

  public getClientsList(): ClientInfo[] {
    return Array.from(this.clients.values())
  }

  public getDatabase(): DatabaseService {
    return this.db
  }

  public async close(): Promise<void> {
    await this.db.close()
  }
}
