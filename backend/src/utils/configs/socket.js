import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://vuga.onrender.com/"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Cookie", "Set-Cookie"],
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
  pingTimeout: 60000,
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

// Add this helper function to emit new posts
export const notifyNewPost = (post, usersToNotify) => {
  console.log("Attempting to notify users:", usersToNotify);
  console.log("Current socket map:", userSocketMap);

  usersToNotify.forEach((userId) => {
    if (userSocketMap[userId]) {
      console.log(`Emitting new post to user ${userId}`);
      io.to(userSocketMap[userId]).emit("newPost", post);
    } else {
      console.log(`User ${userId} not connected`);
    }
  });
};

export { io, app, server, userSocketMap };
