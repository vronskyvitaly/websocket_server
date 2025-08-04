export interface WebSocketMessage {
  type: string
  data: any
  timestamp: number
}

export interface ClientInfo {
  id: string
  connectedAt: Date
  lastActivity: Date
}

export interface ServerConfig {
  port: number
  corsOrigin: string | string[]
}

export interface StoredMessage {
  id?: number
  clientId: string
  messageType: string
  content: string
  timestamp: number
  createdAt?: Date
}

// Socket.IO Chat Types
export interface ChatUser {
  id: string
  username: string
  avatar?: string
  isOnline: boolean
  lastSeen: Date
  joinedAt: Date
}

export interface ChatMessage {
  id: string
  userId: string
  username: string
  content: string
  timestamp: Date
  type: 'text' | 'system' | 'image' | 'file'
  roomId?: string
  replyTo?: string
  edited?: boolean
  editedAt?: Date
}

export interface ChatRoom {
  id: string
  name: string
  description?: string
  createdBy: string
  createdAt: Date
  isPrivate: boolean
  users: string[]
  lastMessage?: ChatMessage
}

// Socket.IO Events
export interface ServerToClientEvents {
  message: (message: ChatMessage) => void
  userJoined: (user: ChatUser) => void
  userLeft: (userId: string) => void
  userTyping: (data: { userId: string; username: string; isTyping: boolean }) => void
  roomUsers: (users: ChatUser[]) => void
  messageHistory: (messages: ChatMessage[]) => void
  error: (error: string) => void
  connected: (data: { userId: string; username: string }) => void
}

export interface ClientToServerEvents {
  sendMessage: (data: { content: string; type?: 'text' | 'image' | 'file'; roomId?: string }) => void
  joinRoom: (roomId: string) => void
  leaveRoom: (roomId: string) => void
  typing: (isTyping: boolean) => void
  requestHistory: (roomId?: string) => void
  setUsername: (username: string) => void
}

export interface InterServerEvents {
  ping: () => void
}

export interface SocketData {
  userId: string
  username: string
  rooms: string[]
}
