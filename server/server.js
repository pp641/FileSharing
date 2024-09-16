const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
let connectedUsers = {}; // Store connected users with their socket IDs

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  connectedUsers[socket.id] = { id: socket.id }; // Store user details if needed
  
  // Emit the updated user list to all clients
  io.emit('userListUpdate', Object.values(connectedUsers));

  socket.on('sendMessage', (message) => {
    console.log('Broadcasting message:', message, socket.id);
    message.senderId = socket.id; // Assign sender's socket ID
    io.emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
    
    delete connectedUsers[socket.id];
    
    // Emit the updated user list to all clients
    io.emit('userListUpdate', Object.values(connectedUsers));
  });
});

// Start the server
server.listen(5000, () => {
  console.log('Signaling server is running on port 5000');
});
