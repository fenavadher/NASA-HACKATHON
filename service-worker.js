// AstroSOS - Simple server for astronaut + ground station comms

const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// serve public folder
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'astronaut.html'));
});

app.get('/ground', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ground.html'));
});

// socket connection
io.on('connection', socket => {
  console.log('Client connected ->', socket.id);

  socket.on('sendSOS', data => {
    console.log('SOS signal received:', data);

    // alert ground control
    io.emit('sosAlert', data);

    // confirmation back to astronaut
    socket.emit('sosReceived', { astronautId: data.astronautId });
  });

  socket.on('disconnect', () => {
    console.log('Client left:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(Server is live at http://localhost:${PORT});
});
 
