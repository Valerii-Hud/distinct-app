import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.route';
import connectToMongoDB from './db/connectToMongoDB';
import cookieParser from 'cookie-parser';
import messageRoutes from './routes/message.route';
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );
}

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

app.listen(5010, async () => {
  const connected = await connectToMongoDB();
  if (!connected?.success) process.exit(1);
  console.log(`Server is running on: http://localhost:${PORT}`);
});
