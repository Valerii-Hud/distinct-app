import { Response } from 'express';
import { isError } from '../types/guard';
import { AuthRequest, UserId } from '../types';
import User from '../models/user.model';
import Message from '../models/message.model';
import cloudinary from '../lib/cloudinary';

export const getUsersForSidebar = async (req: AuthRequest, res: Response) => {
  try {
    const loggedInUserId = req.user?._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select('-password');
    res.status(200).json(filteredUsers);
  } catch (error) {
    isError({
      error,
      functionName: getUsersForSidebar.name,
      handler: 'controller',
    });
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { receiverId } = req.params;
    const senderId: UserId = req.user?._id;

    const messages = await Message.find({
      $or: [
        {
          senderId,
          receiverId,
        },
        {
          senderId: receiverId,
          receiverId: senderId,
        },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    isError({
      error,
      functionName: getMessages.name,
      handler: 'controller',
    });
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { text, image } = req.body;
    const { receiverId } = req.params;
    const senderId: UserId = req.user?._id;

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    // TODO: <- implement socket.io

    res.status(201).json(newMessage);
  } catch (error) {
    isError({
      error,
      functionName: sendMessage.name,
      handler: 'controller',
    });
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
