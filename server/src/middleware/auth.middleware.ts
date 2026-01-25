import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { JwtPayload, AuthRequest } from '../types';
import { NextFunction, Response } from 'express';
import { isError } from '../types/guard';

export const protectRoute = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;
    const { JWT_SECRET } = process.env;

    if (!token || !JWT_SECRET) {
      return res.status(401).json({ error: 'Unauthorize - No Token Provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorize - Invalid Token' });
    }

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = user;

    next();
  } catch (error) {
    isError({ error, functionName: protectRoute.name, handler: 'middleware' });
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
