import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://vuga.onrender.com"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// store all online users
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  const userId = socket.handshake.query.userId;
  userSocketMap[userId] = socket.id;

  // Join a room specific to this user
  socket.join(userId);

  // used to broadcast the message to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    socket.leave(userId);
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export const notifyNewPost = (post, usersToNotify) => {
  usersToNotify.forEach((userId) => {
    if (userSocketMap[userId]) {
      console.log(`Emitting new post to user ${userId}`);
      io.to(userSocketMap[userId]).emit("newPost", post);
    } else {
      console.log(`User ${userId} not connected`);
    }
  });
};

export const notifyPostLike = (post, usersToNotify) => {
  usersToNotify.forEach((userId) => {
    if (userSocketMap[userId]) {
      io.to(userSocketMap[userId]).emit("postLike", post);
    }
  });
};

export { app, server, io };
