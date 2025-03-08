import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

// Get the receiver's socket ID by user ID
export const getReciverSocketId = (reciverId) => userSocketMap[reciverId];

// Handle socket connections
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User Connected: UserId=${userId}, SocketId=${socket.id}`);

    // Emit the updated list of online users only when a new user connects
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  } else {
    console.warn("Connection attempt without a valid userId.");
    socket.disconnect(); // Disconnect socket if no valid userId
    return;
  }

  // Handle socket disconnection
  socket.on("disconnect", () => {
    if (userSocketMap[userId] === socket.id) {
      console.log(`User Disconnected: UserId=${userId}, SocketId=${socket.id}`);
      delete userSocketMap[userId];

      // Emit the updated list of online users only when a user disconnects
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { app, server, io };
