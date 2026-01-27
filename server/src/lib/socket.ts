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

io.on('connection', (socket: Socket) => {
  console.log(`A user connected: ${socket}`);
  socket.on('disconnection', () => {
    console.log(`A user disconnect ${socket}`);
  });
});

export { io, app, server };
