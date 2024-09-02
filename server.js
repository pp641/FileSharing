const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Create an Express app
const app = express();

// Set up middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
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

  socket.on('696969', (data, callback) => {
    console.log('Server responded withss:', data);
    callback('REceibed data')
  });

  socket.on('answer', (answer) => {
  });

  socket.on('sendMessage', (message) => {
    console.log('Broadcasting message:', message, socket.id);
    message.senderId = socket.id
    io.emit('receiveMessage', message);
  });

  socket.on('ice-candidate', (candidate) => {
    socket.broadcast.emit('ice-candidate', candidate);
  });

  socket.on('test-connect', () => {
    console.log('test connect here');
    socket.emit('test-connect', { message: 'Connection establisheddd' });
    socket.emit('share-event-response', { data: 'Response data for all clients' });

  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
server.listen(5000, () => {
  console.log('Signaling server is running on port 5000');
});



