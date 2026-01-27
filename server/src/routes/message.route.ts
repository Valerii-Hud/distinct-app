import express from 'express';
import { protectRoute } from '../middleware/auth.middleware';
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from '../controllers/message.controller';

const router = express.Router();

router.get('/users', protectRoute, getUsersForSidebar);
router.get('/:receiverId', protectRoute, getMessages);
router.post('/:receiverId', protectRoute, sendMessage);

export default router;
