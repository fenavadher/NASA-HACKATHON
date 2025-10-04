const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "astronaut.html"));
});

app.get("/ground", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "ground.html"));
});

io.on("connection", (socket) => {
  console.log("🛰️ Client connected:", socket.id);

  // Receive SOS from astronaut
  socket.on("sendSOS", (data) => {
    console.log("🚨 SOS Received:", data);

    // Broadcast to all ground station clients
    io.emit("sosAlert", data);

    // Send confirmation to astronaut
    socket.emit("sosReceived", { astronautId: data.astronautId });
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
