const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const app = express();

const roomUsers = {}

app.use(cors({
  origin: 'http://192.168.1.7:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

const server = http.createServer(app);

const io = socketIo(server);

io.on('connection', (socket) => {


  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
    if (!roomUsers[roomId]) {
      roomUsers[roomId] = new Set();
    }
    roomUsers[roomId].add(socket.id);
    console.log("room okoko", roomUsers)
    io.to(roomId).emit('userCountUpdate',  roomUsers[roomId].size , roomUsers );
  });

  socket.on('share-event', (data, callback) => {
    console.log('Received share-event with data:', data);

    io.emit('ok');
    if (callback) {
      callback('Received your datass');
    }
  });
  socket.on('answer', (answer) => {
  });

  socket.on('sendMessage', (message) => {
    console.log('Broadcasting message:', message, socket.id);
    message.senderId = socket.id
    io.emit('receiveMessage', message);
  });

  socket.on('sendTextMessage', (message) => {
    console.log('Received message:', message);
    socket.broadcast.emit('receiveTextMessage', message); // Broadcast to all clients except the sender
  });

  socket.on('ice-candidate', (candidate) => {
    socket.broadcast.emit('ice-candidate', candidate);
  });

  socket.on('test-connect', () => {
    console.log('test connect here');
    socket.emit('test-connect', { message: 'Connection establisheddd' });
    socket.emit('share-event-response', { data: 'Response data for all clients' });

  });

  socket.on('signal', (data) => {
    socket.broadcast.emit('signal', data);
  });

  socket.on('draw', (data) => {
    socket.broadcast.emit('draw', data);
  });


  socket.on('sendVoiceMessage', (message) => {
    console.log('Broadcasting message:', message);
    socket.broadcast.emit('receiveVoiceMessage', message);
  });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);

    for (const [roomId, users] of Object.entries(roomUsers)) {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        console.log("oktelll" , roomUsers)
        io.to(roomId).emit('userCountUpdate', users.size , roomUsers);
        if (users.size === 0) {
          delete roomUsers[roomId];
        }
      }
    }
  });
});

// Start the server
server.listen(5000, () => {
  console.log('Signaling server is running on port 5000');
});



