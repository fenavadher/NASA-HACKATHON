const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (HTML, MP4, MP3)
app.use(express.static(path.join(__dirname)));

// Serve astronaut page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "astronaut.html"));
});

// Serve ground page
app.get("/ground", (req, res) => {
  res.sendFile(path.join(__dirname, "ground.html"));
});

// Listen for SOS event from astronaut
io.on("connection", (socket) => {
  console.log("🚀 User connected");

  socket.on("sos", (data) => {
    console.log("📡 SOS signal received:", data);
    io.emit("sosAlert", data); // send to ground
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected");
  });
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running → http://localhost:${PORT}/astronaut`);
});
