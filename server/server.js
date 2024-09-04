const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const endpoint = process.env.NODE_ENV === "production" ? "/" : "http://192.168.1.7/3000"

app.use(cors({
  origin: '/',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// Create an HTTP server and integrate it with the Express app
const server = http.createServer(app);

// Attach Socket.io to the HTTP server
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('New client connected', socket.id  );
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
    console.log('Client disconnected');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
server.listen(process.env.PORT || 5000, () => {
  console.log('Signaling server is running on port 5000');
});



