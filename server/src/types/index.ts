import { Request } from 'express';
import mongoose from 'mongoose';

export interface User {
  _id: mongoose.Types.ObjectId;
  email: string;
  fullName: string;
  password: string;
  profilePic?: string;
}
export interface AuthRequest extends Request {
  user?: User;
}

export interface JwtPayload {
  userId: string;
}
