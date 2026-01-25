import { Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const generateToken = (
  userId: mongoose.Types.ObjectId,
  res: Response
) => {
  const { JWT_SECRET, NODE_ENV } = process.env;

  if (!JWT_SECRET) {
    return { success: false, error: 'JWT_SECRET was not provided.' };
  }

  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('jwt', token, {
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    httpOnly: true,
    sameSite: 'strict',
    secure: NODE_ENV === 'production',
  });

  return token;
};
