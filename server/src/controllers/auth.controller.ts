import { Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import { isError } from '../types/guard';
import { generateToken } from '../lib/utils';
import { AuthRequest, User as UserType } from '../types';
import cloudinary from '../lib/cloudinary';

export const signup = async (req: Request, res: Response) => {
  try {
    console.log(signup.name);
    const { email, fullName, password }: UserType = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({
        error: 'Please provide email, full name and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters',
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ error: 'Email already exists' });
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
      return res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    isError({ error, functionName: signup.name, handler: 'controller' });
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password }: UserType = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: 'Invalid credentials',
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        error: 'Invalid credentials',
      });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    isError({ error, functionName: login.name, handler: 'controller' });
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const logout = async (_: Request, res: Response) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    isError({ error, functionName: logout.name, handler: 'controller' });
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { profilePic }: UserType = req.body;

    const userId = req?.user?._id;

    if (!userId) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!profilePic) {
      return res.status(400).json({ error: 'Profile picture are required' });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    isError({ error, functionName: updateProfile.name, handler: 'controller' });
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const checkAuth = async (req: AuthRequest, res: Response) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    isError({ error, functionName: checkAuth.name, handler: 'controller' });
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
