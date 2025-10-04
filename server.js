// ✅ AstroSOS - Corrected server.js (files inside /public)
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

const PORT = process.env.PORT || 3000;

// ✅ Serve everything from /public folder
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Auto-detect device type for root URL
app.get('/', (req, res) => {
  const userAgent = req.headers['user-agent'] || '';
  if (/mobile/i.test(userAgent)) {
    res.sendFile(path.join(__dirname, 'public', 'astronaut.html'));
  } else {
    res.sendFile(path.join(__dirname, 'public', 'ground.html'));
  }
});

// ✅ Specific routes
app.get('/astronaut', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'astronaut.html'));
});

app.get('/ground', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ground.html'));
});

io.on('connection', (socket) => {
  console.log('🛰️ New client connected');

  socket.on('sos', (data) => {
    console.log('🚨 SOS received:', data);
    io.emit('sos', data);
  });

  socket.on('ack', (data) => {
    console.log('📡 ACK sent:', data);
    io.emit('ack', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
