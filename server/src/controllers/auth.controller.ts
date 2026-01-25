import { Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import { isError } from '../types/guard';
import { generateToken } from '../lib/utils';
import { AuthRequestBody } from '../types';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, fullName, password }: AuthRequestBody = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email, full name and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ success: false, error: 'Email already exists' });
    }

    const salt: string = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      fullName,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid user data' });
    }
  } catch (error) {
    isError({ error, message: 'signup controller' });
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const login = async (req: Request, res: Response) => {
  res.status(200).json({ success: true });
};

export const logout = async (req: Request, res: Response) => {
  res.status(200).json({ success: true });
};
