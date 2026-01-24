import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.route';
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.use(cors());
}

app.use(express.json());
app.use('/api/auth', authRoutes);

app.listen(5010, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});
