const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public"))); // serve 'public' folder

// Default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "astronaut.html"));
});

// Ground page route
app.get("/ground", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "ground.html"));
});

io.on("connection", (socket) => {
  console.log("🛰 New client connected");

  socket.on("sos", (data) => {
    console.log("🚨 SOS Received:", data);
    io.emit("sosAlert", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected");
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running → http://localhost:${PORT}`);
});
