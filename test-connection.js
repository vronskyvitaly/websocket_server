const { io } = require('socket.io-client')

const socket = io('https://websocket-server-khaki.vercel.app', {
  transports: ['polling'],
  timeout: 20000,
  forceNew: true,
  path: '/socket.io/',
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  withCredentials: false,
  upgrade: false,
  rememberUpgrade: false,
})

console.log('🔗 Attempting to connect to Socket.IO server...')

socket.on('connect', () => {
  console.log('✅ Connected to Socket.IO server!')
  console.log('Socket ID:', socket.id)

  // Test setting username
  socket.emit('setUsername', 'TestUser')
})

socket.on('connected', (data) => {
  console.log('👤 User connected:', data)
})

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error)
  console.error('Error details:', {
    message: error.message,
    description: error.description,
    context: error.context,
    type: error.type,
  })
})

socket.on('error', (error) => {
  console.error('❌ Socket error:', error)
})

socket.on('disconnect', (reason) => {
  console.log('🔌 Disconnected:', reason)
})

// Test after 2 seconds
setTimeout(() => {
  if (socket.connected) {
    console.log('💬 Testing message sending...')
    socket.emit('sendMessage', {
      content: 'Hello from test script!',
      type: 'text',
      roomId: 'general',
    })
  } else {
    console.log('❌ Socket not connected, cannot send message')
  }
}, 2000)

// Cleanup after 10 seconds
setTimeout(() => {
  console.log('🧹 Cleaning up...')
  socket.disconnect()
  process.exit(0)
}, 10000)
