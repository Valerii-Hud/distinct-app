import { Request } from 'express';
import mongoose from 'mongoose';

export type UserId = mongoose.Types.ObjectId | undefined;

export interface User {
  _id: UserId;
  email: string;
  fullName: string;
  password: string;
  profilePic?: string;
}

export interface Message {
  receiverId: UserId;
  senderId: UserId;
  text: string;
  image: string;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface JwtPayload {
  userId: string;
}
