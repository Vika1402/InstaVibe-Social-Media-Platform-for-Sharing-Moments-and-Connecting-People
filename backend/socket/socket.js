import express from "express";
import http from "http";
const app = express();
import { Server } from "socket.io";
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User Connected: UserId=${userId}, SocketId=${socket.id}`);

    // Emit the updated list of online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  } else {
    console.warn("Connection attempt without a valid userId.");
  }

  socket.on("disconnect", () => {
    if (userId && userSocketMap[userId] === socket.id) {
      console.log(`User Disconnected: UserId=${userId}, SocketId=${socket.id}`);
      delete userSocketMap[userId];

      // Emit the updated list of online users
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { app, server, io };
