import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth.route';
import connectToMongoDB from './db/connectToMongoDB';
import cookieParser from 'cookie-parser';
import messageRoutes from './routes/message.route';
import { app, server } from './lib/socket';

dotenv.config();

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.use(
    cors({
      origin: 'http://localhost:5010',
      credentials: true,
    })
  );
}

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  app.get(/.*/, (_, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
}

server.listen(PORT, async () => {
  const connected = await connectToMongoDB();
  if (!connected?.success) process.exit(1);
  console.log(`Server is running on: http://localhost:${PORT}`);
});
