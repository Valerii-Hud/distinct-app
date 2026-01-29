import { Server, Socket } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000'],
  },
});

export const getReceiverSocketId = (userId: string | string[]) => {
  if (typeof userId === 'string') {
    return userSocketMap[userId];
  }
};

const userSocketMap: Record<string, string> = {};

io.on('connection', (socket: Socket) => {
  console.log(`A user connected: ${socket.id}`);
  const userId = socket.handshake.query.userId;

  if (userId && typeof userId === 'string') {
    userSocketMap[userId] = socket.id;
    console.log(Object.keys(userSocketMap));
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
    socket.on('disconnect', () => {
      console.log(`A user disconnect ${socket.id}`);
      delete userSocketMap[userId];
      io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
  }
});

export { io, app, server };
