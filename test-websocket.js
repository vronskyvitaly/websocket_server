const { io } = require('socket.io-client')

const socketUrl = process.env.SOCKET_URL || 'http://localhost:3002'

console.log('🔗 Testing WebSocket connection to:', socketUrl)

const socket = io(socketUrl, {
  transports: ['websocket', 'polling'],
  timeout: 10000,
  forceNew: true,
  upgrade: true,
  rememberUpgrade: true,
  path: '/socket.io/',
})

socket.on('connect', () => {
  console.log('✅ Successfully connected to WebSocket server')
  console.log('Socket ID:', socket.id)

  // Test setting username
  socket.emit('setUsername', 'TestUser')
})

socket.on('connected', (data) => {
  console.log('👤 User connected:', data)
})

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error.message)
  console.error('Error details:', error)
  process.exit(1)
})

socket.on('disconnect', (reason) => {
  console.log('🔌 Disconnected:', reason)
  process.exit(0)
})

// Timeout after 10 seconds
setTimeout(() => {
  console.log('⏰ Test timeout')
  socket.disconnect()
  process.exit(0)
}, 10000)
