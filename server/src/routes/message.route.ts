import express from 'express';
import { protectRoute } from '../middleware/auth.middleware';
import {
  getMessages,
  getUserById,
  getUsersForSidebar,
  sendMessage,
} from '../controllers/message.controller';

const router = express.Router();

router.get('/users', protectRoute, getUsersForSidebar);
router.get('/users/:userId', protectRoute, getUserById);
router.get('/:receiverId', protectRoute, getMessages);
router.post('/send/:receiverId', protectRoute, sendMessage);

export default router;
